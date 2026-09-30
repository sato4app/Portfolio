import type { Metadata, Viewport } from "next";
import CategoryNav from "@/components/CategoryNav";
import VersionCheck from "@/components/VersionCheck";
import { CATEGORIES, HEADER_CATEGORY_IDS } from "@/lib/categories";
import "./globals.css";

const headerCategories = HEADER_CATEGORY_IDS.map(
  (id) => CATEGORIES.find((category) => category.id === id)!,
);

export const metadata: Metadata = {
  title: {
    default: "Portfolio",
    template: "%s | Portfolio",
  },
  description: "作成したアプリ・ツール・電子工作のポートフォリオ",
};

// ブラウザの上部バーの色を globals.css の --background に合わせる
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f9" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <header className="border-b border-line">
          {/* 背景と、その上に重ねるタイトル・カテゴリ */}
          <div className="hero-frame">
            {/* 背景の装飾。等高線=地図、配線=電子工作、ルートと到達点=GPS を表す */}
            <div className="hero" aria-hidden="true">
              <svg
                className="hero-bg"
                viewBox="0 0 1200 120"
                preserveAspectRatio="xMidYMid slice"
                focusable="false"
              >
                <defs>
                  {/* 地色を濃くした分、格子は --line だと沈むので muted を薄く乗せる */}
                  <pattern id="hero-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path
                      d="M30 0 H0 V30"
                      fill="none"
                      stroke="var(--muted)"
                      strokeWidth="1"
                      strokeOpacity="0.18"
                    />
                  </pattern>

                  {/* 120 より下へ塗り足しても帯の中の色味が変わらないよう、viewBox 基準で定義する */}
                  <linearGradient
                    id="hero-tint"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="scale(1200 120)"
                    x1="0"
                    y1="1"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0" stopColor="var(--accent)" stopOpacity="0" />
                    <stop offset="1" stopColor="var(--accent)" stopOpacity="0.07" />
                  </linearGradient>

                  <radialGradient id="hero-glow">
                    <stop offset="0" stopColor="var(--accent)" stopOpacity="0.22" />
                    <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
                  </radialGradient>

                  {/* 左右の端だけ溶かして、帯が唐突に切れないようにする */}
                  <linearGradient id="hero-fade" x1="0" x2="1">
                    <stop offset="0" stopColor="#fff" stopOpacity="0" />
                    <stop offset="0.07" stopColor="#fff" stopOpacity="1" />
                    <stop offset="0.93" stopColor="#fff" stopOpacity="1" />
                    <stop offset="1" stopColor="#fff" stopOpacity="0" />
                  </linearGradient>
                  <mask id="hero-mask">
                    <rect width="1200" height="120" fill="url(#hero-fade)" />
                  </mask>

                  {/* 等高線の基準になる尾根。ずらして重ねる */}
                  <path
                    id="hero-ridge"
                    d="M-60 96 C 160 88, 300 72, 470 74 C 640 76, 740 90, 900 74 C 1040 60, 1150 72, 1260 66"
                  />

                  <path
                    id="hero-route"
                    pathLength="1000"
                    d="M140 90 L260 80 L340 84 L455 64 L560 70 L670 56 L760 62 L830 50"
                  />
                </defs>

                {/* 格子と色味は viewBox の下まで塗り、lg 未満でカテゴリの段の背景にする */}
                <rect width="1200" height="360" fill="url(#hero-grid)" />
                <rect width="1200" height="360" fill="url(#hero-tint)" />

                <g mask="url(#hero-mask)">
                  {/* 上ほど間隔を詰めて、斜面が急に見えるようにする */}
                  <g fill="none" stroke="var(--muted)" strokeLinecap="round">
                    <use href="#hero-ridge" y="0" strokeWidth="1.2" opacity="0.26" />
                    <use href="#hero-ridge" y="-12" strokeWidth="1" opacity="0.2" />
                    <use href="#hero-ridge" y="-22" strokeWidth="1" opacity="0.14" />
                    <use href="#hero-ridge" y="-29" strokeWidth="1" opacity="0.09" />
                  </g>

                  {/* 基板の配線。曲げは45度だけ */}
                  <g
                    fill="none"
                    stroke="var(--muted)"
                    strokeWidth="1.4"
                    opacity="0.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M0 112 H70 L100 82 H170 L192 60" />
                    <path d="M1200 16 H1110 L1082 44 H1010 L988 66" />
                  </g>
                  <g fill="var(--muted)" opacity="0.35">
                    <circle cx="100" cy="82" r="2.5" />
                    <circle cx="170" cy="82" r="2.5" />
                    <circle cx="1082" cy="44" r="2.5" />
                    <circle cx="1010" cy="44" r="2.5" />
                  </g>

                  <circle cx="830" cy="50" r="50" fill="url(#hero-glow)" />

                  {/* ルートと、その上を流れる光 */}
                  <g fill="none" stroke="var(--accent)" strokeLinecap="round" strokeLinejoin="round">
                    <use href="#hero-route" strokeWidth="2" opacity="0.5" />
                    <use
                      className="march"
                      href="#hero-route"
                      strokeWidth="2.5"
                      strokeDasharray="30 1000"
                      strokeDashoffset="30"
                    />
                  </g>

                  <g fill="var(--accent)" opacity="0.55">
                    <circle cx="260" cy="80" r="2.5" />
                    <circle cx="455" cy="64" r="2.5" />
                    <circle cx="670" cy="56" r="2.5" />
                  </g>

                  {/* 到達点 */}
                  <circle
                    className="ping"
                    cx="830"
                    cy="50"
                    r="12"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="830"
                    cy="50"
                    r="8"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="1.2"
                    opacity="0.45"
                  />
                  <circle cx="830" cy="50" r="4" fill="var(--accent)" />
                </g>
              </svg>
              {/* 文字の下地。線と重なっても読めるようにする */}
              <div className="hero-scrim" />
            </div>

            <div className="relative mx-auto flex max-w-5xl flex-col px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-6">
              {/* タイトルは枠のないボタン。タップでバージョンを確認し、結果をすぐ右に出す */}
              <div className="flex h-(--hero-h) max-w-full shrink-0 items-center self-start">
                <VersionCheck className="text-base font-bold tracking-tight sm:text-lg">
                  myポートフォリオ
                </VersionCheck>
              </div>

              {/* どの幅でも左寄せにして、右側のルートの到達点を隠さない。
                  lg 以上はタイトルのすぐ右に2段、それより狭いとタイトルの下に横一列で並べる。
                  入りきらない幅では横スクロールにする */}
              <CategoryNav
                categories={headerCategories}
                className="-mt-1 flex max-w-full self-start overflow-x-auto pt-1 pb-2.5 scrollbar-none lg:mt-0 lg:grid lg:auto-cols-fr lg:grid-flow-col lg:grid-rows-2 lg:self-auto lg:overflow-visible lg:pt-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
              />
            </div>
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
