import type { MetadataRoute } from 'next';

// manifest の中のパスには basePath が自動で付かないため、ここで自分で付ける
// （public/ 配下のファイルは https://<user>.github.io/Portfolio/icons/... で配信される）
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

// manifest は Route Handler として扱われるため、output: 'export' では静的化の指定が要る
export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Portfolio - sato4app',
    // ホーム画面のアイコン下に出る名前。長いと省略されるため短くする
    short_name: 'Portfolio',
    description: 'これまでに作成したアプリ・ツール・電子工作のポートフォリオ',
    lang: 'ja',
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: 'standalone',
    background_color: '#f6f7f9',
    theme_color: '#f6f7f9',
    icons: [
      {
        src: `${basePath}/icons/icon-192.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: `${basePath}/icons/icon-512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      // Android のアダプティブアイコン用（OS が円や角丸に切り抜く）
      {
        src: `${basePath}/icons/icon-maskable-512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
