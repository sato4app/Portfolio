import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Portfolio",
    template: "%s | Portfolio",
  },
  description: "これまでに作成したアプリ・ツール・電子工作のポートフォリオ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <header className="border-b border-line">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-bold tracking-tight">
              Portfolio
            </Link>
            <a
              href="https://github.com/sato4app"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted hover:text-accent"
            >
              GitHub
            </a>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-line">
          <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-muted">
            © {new Date().getFullYear()} sato4app
          </div>
        </footer>
      </body>
    </html>
  );
}
