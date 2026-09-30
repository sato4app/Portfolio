// 配信中のバージョンを返す。ヘッダーのタイトルをタップしたときの確認（VersionCheck）が読む。
// ビルド時に version.json として書き出される

// Route Handler は output: 'export' では静的化の指定が要る
export const dynamic = 'force-static';

export function GET() {
  return Response.json({ version: process.env.NEXT_PUBLIC_APP_VERSION ?? 'dev' });
}
