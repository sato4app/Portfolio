"use client";

import { useRef, useState } from "react";

/**
 * Web3Forms のアクセスキー。
 * HTML に埋め込んで使う前提のもので、公式にも「public でよい」と明記されている。
 * 送信先アドレスは Web3Forms 側に登録されており、この値から逆引きはできない。
 */
const ACCESS_KEY = "f7a81d19-c2e6-4669-a13d-be2517768e09";
const ENDPOINT = "https://api.web3forms.com/submit";

type Status = "idle" | "sending" | "done" | "error";

export default function ContactDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  function open() {
    setStatus("idle");
    setMessage("");
    dialogRef.current?.showModal();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = await response.json();

      if (result.success) {
        form.reset();
        setStatus("done");
      } else {
        setStatus("error");
        setMessage(result.message ?? "送信できませんでした。");
      }
    } catch {
      setStatus("error");
      setMessage("ネットワークに接続できませんでした。");
    }
  }

  return (
    <>
      <button type="button" onClick={open} className="text-sm text-muted hover:text-accent">
        問い合わせ
      </button>

      {/* showModal() で開くと Esc で閉じ、フォーカスもダイアログ内に閉じ込められる */}
      <dialog ref={dialogRef} className="contact-dialog" aria-label="問い合わせフォーム">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 className="font-bold">問い合わせ</h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="text-sm text-muted hover:text-accent"
            aria-label="閉じる"
          >
            閉じる
          </button>
        </div>

        {status === "done" ? (
          <div className="px-5 py-8 text-center">
            <p className="font-bold">送信しました</p>
            <p className="mt-2 text-sm text-muted">
              お返事は、ご記入いただいたメールアドレス宛にお送りします。
            </p>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="mt-6 rounded-lg border border-line px-4 py-2 text-sm hover:border-accent hover:text-accent"
            >
              閉じる
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-5">
            <input type="hidden" name="access_key" value={ACCESS_KEY} />
            <input type="hidden" name="subject" value="ポートフォリオへの問い合わせ" />
            <input type="hidden" name="from_name" value="myポートフォリオ" />
            {/* ボットだけが埋める隠し項目。人には見えない */}
            <input
              type="checkbox"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
            />

            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-muted">お名前</span>
              <input
                type="text"
                name="name"
                required
                maxLength={100}
                autoComplete="name"
                className="contact-field"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-muted">メールアドレス（返信先）</span>
              <input
                type="email"
                name="email"
                required
                maxLength={200}
                autoComplete="email"
                className="contact-field"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-muted">お問い合わせ内容</span>
              <textarea
                name="message"
                required
                rows={6}
                maxLength={2000}
                className="contact-field resize-y"
              />
            </label>

            {status === "error" && (
              <p role="alert" className="text-sm text-accent">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-1 rounded-lg border border-accent px-4 py-2 text-sm font-bold text-accent hover:bg-accent hover:text-background disabled:opacity-50"
            >
              {status === "sending" ? "送信中…" : "送信する"}
            </button>

            <p className="text-xs text-muted">
              送信内容は Web3Forms を経由して届きます。
            </p>
          </form>
        )}
      </dialog>
    </>
  );
}
