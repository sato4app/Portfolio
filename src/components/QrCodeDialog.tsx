"use client";

import { useRef } from "react";

type Props = {
  /** QRコードが指す URL。ダイアログにも文字で添える */
  url: string;
  /** 余白込みの一辺のモジュール数（SVG の viewBox に使う） */
  total: number;
  /** 黒モジュールを描く <path d>。ビルド時に lib/qrcode.js で作ったもの */
  path: string;
};

export default function QrCodeDialog({ url, total, path }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      {/* 「お問い合わせ」より控えめにするため、塗りではなく枠線で描く */}
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-accent bg-card px-4 py-2 text-sm font-bold text-accent hover:bg-accent hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-5"
      >
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <path d="M14 14h3v3h-3zM20 14v.01M14 20v.01M17 20h4v-3" />
        </svg>
        QRコード
      </button>

      {/* showModal() で開くと Esc で閉じ、フォーカスもダイアログ内に閉じ込められる */}
      <dialog ref={dialogRef} className="contact-dialog" aria-label="QRコード">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 className="font-bold">QRコード</h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="text-sm text-muted hover:text-accent"
            aria-label="閉じる"
          >
            閉じる
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 px-5 py-6">
          {/* 読み取り機は白地に黒を前提にするため、ダークモードでも色を反転させない */}
          <svg
            viewBox={`0 0 ${total} ${total}`}
            shapeRendering="crispEdges"
            role="img"
            aria-label={`${url} の QRコード`}
            className="w-56 max-w-full rounded-lg"
          >
            <rect width={total} height={total} fill="#fff" />
            <path d={path} fill="#000" />
          </svg>
          <p className="text-sm text-muted">スマホのカメラで読み取ると、このページを開けます。</p>
          <p className="break-all text-center text-sm">{url}</p>
        </div>
      </dialog>
    </>
  );
}
