// GitHub Pages のサブディレクトリ名（https://<ユーザー名>.github.io/Portfolio/）
const basePath = '/Portfolio';

// アプリのバージョン。GitHub Actions の実行番号を使うので、デプロイのたびに自動で1つ進む。
// 手元のビルドや開発サーバーでは番号が無いため 'dev' になる
const appVersion = process.env.GITHUB_RUN_NUMBER ? `v${process.env.GITHUB_RUN_NUMBER}` : 'dev';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静的HTMLとして書き出す(GitHub Pages等での配信用)
  output: 'export',
  // 画像最適化サーバーを使わない(静的エクスポートでは必須)
  images: { unoptimized: true },
  // サブディレクトリで動作させるための設定
  basePath,
  // Markdown から生成した <img> などに basePath を手動で付けるため、
  // アプリ側からも同じ値を参照できるようにする。
  // バージョンは、読み込み済みの画面と配信中の version.json を見比べるのに使う
  env: { NEXT_PUBLIC_BASE_PATH: basePath, NEXT_PUBLIC_APP_VERSION: appVersion },
};

export default nextConfig;
