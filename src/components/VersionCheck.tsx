"use client";

import { useEffect, useState } from "react";

/** 今読み込まれている画面のバージョン（ビルド時に埋め込まれる） */
const CURRENT_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "dev";
const VERSION_URL = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/version.json`;

/** 結果を出しておく時間 */
const SHOW_MS = 4000;

type State =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "done"; text: string; outdated: boolean };

/**
 * ヘッダーのタイトル。見た目は文字だけだが、タップすると配信中のバージョンと見比べる。
 *
 * 結果はタイトルの右に数秒だけ出す。古かったときは「旧 → 新」を見せたあとで読み込み直す。
 */
export default function VersionCheck({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function check() {
    if (state.kind === "checking") return; // 確認中の二度押しは無視する
    setState({ kind: "checking" });

    try {
      // ブラウザのキャッシュを挟まず、毎回サーバーに聞く
      const response = await fetch(VERSION_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const latest: unknown = (await response.json()).version;
      if (typeof latest !== "string") throw new Error("version がありません");

      setState(
        latest === CURRENT_VERSION
          ? { kind: "done", text: `最新です（${CURRENT_VERSION}）`, outdated: false }
          : { kind: "done", text: `${CURRENT_VERSION} → ${latest}`, outdated: true },
      );
    } catch {
      // オフラインなどでサーバーに聞けないとき
      setState({ kind: "done", text: "確認できません", outdated: false });
    }
  }

  // 結果は数秒で消す。古かったときは、消す代わりに読み込み直して新しい版にする
  useEffect(() => {
    if (state.kind !== "done") return;
    const id = setTimeout(() => {
      if (state.outdated) window.location.reload();
      else setState({ kind: "idle" });
    }, SHOW_MS);
    return () => clearTimeout(id);
  }, [state]);

  const message = state.kind === "checking" ? "確認中…" : state.kind === "done" ? state.text : "";

  return (
    <>
      <button type="button" onClick={check} className={`shrink-0 ${className}`}>
        {children}
      </button>
      <span
        role="status"
        className={`min-w-0 truncate text-xs text-muted ${message ? "ml-2" : ""}`}
      >
        {message}
      </span>
    </>
  );
}
