# Portfolio - 作成したアプリ等のポートフォリオ

これまでに作成したアプリ・ツール・電子工作の一覧を GitHub Pages で公開するサイトです。

- ハイキングアプリ
- アプリ
- ツール
- 電子工作

公開URL: `https://sato4app.github.io/Portfolio/`

## 技術構成

| 項目 | 内容 |
| --- | --- |
| フレームワーク | Next.js 16（App Router / 静的エクスポート） |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS v4 |
| Markdown | gray-matter + remark |
| ホスティング | GitHub Pages（GitHub Actions で自動デプロイ） |

## プロジェクトの追加方法

1. `projects/` の下に、リポジトリ名と同じ名前のフォルダを作る
2. その中に `index.md` と画像ファイルを置く

```
projects/
└── minoh-hiking/
    ├── index.md
    └── thumbnail.png
```

`index.md` の先頭には以下の Frontmatter を書きます。

```markdown
---
title: 箕面ハイキングマップ          # 必須
date: 2026-01-15                     # 一覧の並び順に使用（新しい順）
category: ハイキングアプリ            # 一覧のグループ見出し
summary: 一覧カードに表示する短い説明
tags:
  - Leaflet.js
  - Firebase
thumbnail: thumbnail.png             # 一覧カードのサムネイル（省略可）
repo: https://github.com/sato4app/minoh-hiking   # 省略可
demo: https://sato4app.github.io/minoh-hiking/   # 省略可
---

## 概要

本文をMarkdownで書く。画像はファイル名だけで参照できる。

![スクリーンショット](thumbnail.png)
```

### 画像の扱い

- `projects/<slug>/` に置いた画像は、ビルド時に `public/projects/<slug>/` へ自動コピーされます（`src/lib/markdown.ts`）
- `public/projects/` は生成物のため Git 管理対象外です
- 本文中の画像はファイル名だけで参照できます。`basePath`（`/Portfolio`）は自動で付与されます

## 開発

```bash
# 依存パッケージのインストール
npm install

# 開発サーバー（basePath があるため /Portfolio 付きのURLで開く）
npm run dev
# → http://localhost:3000/Portfolio

# 静的ビルド（out/ に出力）
npm run build

# ビルド結果の確認（next start は output: 'export' では使えない）
npx serve out
```

## デプロイ

`main` ブランチへ push すると `.github/workflows/deploy.yml` が動作し、
GitHub Pages へ自動デプロイされます。

初回のみ、GitHub リポジトリの **Settings → Pages → Build and deployment → Source** を
**GitHub Actions** に設定してください。

## ディレクトリ構成

```
Portfolio/
├── projects/                   # 各プロジェクトの原稿（index.md + 画像）
│   ├── minoh-hiking/
│   └── gnss-scope/
├── public/
│   ├── .nojekyll               # GitHub Pages が _next/ を無視しないようにする
│   └── projects/               # ビルド時に自動生成（Git管理対象外）
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # 一覧ページ
│   │   ├── globals.css
│   │   └── projects/[slug]/
│   │       └── page.tsx        # 詳細ページ
│   └── lib/
│       └── markdown.ts         # Markdown読み込み・画像コピー
├── next.config.mjs             # basePath: '/Portfolio'
└── .github/workflows/deploy.yml
```
