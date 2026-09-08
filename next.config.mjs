// GitHub Pages のサブディレクトリ名（https://<ユーザー名>.github.io/Portfolio/）
const basePath = '/Portfolio';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静的HTMLとして書き出す(GitHub Pages等での配信用)
  output: 'export',
  // 画像最適化サーバーを使わない(静的エクスポートでは必須)
  images: { unoptimized: true },
  // サブディレクトリで動作させるための設定
  basePath,
  // Markdown から生成した <img> などに basePath を手動で付けるため、
  // アプリ側からも同じ値を参照できるようにする
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
