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

`projects/` の下にリポジトリ名と同じ名前のフォルダを作り、次の2ファイルを置きます。

```
projects/
└── minoh-hiking/
    ├── index.md        # 一覧カード用の情報（Frontmatterのみ）
    ├── README.md       # 詳細ページの本文（元リポジトリからコピー）
    └── thumbnail.png   # 画像
```

| ファイル | 役割 | 用意の仕方 |
| --- | --- | --- |
| `index.md` | 一覧カードに出す情報 | 手書き（Frontmatterだけ。本文は不要） |
| `README.md` | 詳細ページの本文 | 元リポジトリの `README.md` を**手動でコピー** |
| 画像 | サムネイル・本文中の画像 | 元リポジトリからコピー |

### index.md（Frontmatterのみ）

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
branch: main                         # 省略可（既定値: main）
---
```

`index.md` に本文を書くこともできます。その場合、`README.md` が無いときだけ本文として表示されます。

### README.md（詳細ページの本文）

元リポジトリの `README.md` をそのままコピーするだけです。
コピーしても表示が崩れないよう、ビルド時に以下の調整が自動で行われます。

| 調整内容 | 理由 |
| --- | --- |
| 冒頭の見出し1（`# タイトル` / `タイトル\n===`）を削除 | 詳細ページのタイトルは `index.md` の `title` を使うため、重複を防ぐ |
| 相対指定の画像を `public/projects/<slug>/` へ解決 | `basePath`（`/Portfolio`）を自動で付与する |
| 相対指定のリンク（`docs/spec.md` など）を GitHub のURLへ変換 | コピーした README のリンク切れを防ぐ。`repo` の指定が必要 |

### 画像の扱い

- `projects/<slug>/` に置いた画像は、ビルド時に `public/projects/<slug>/` へ**再帰的に**自動コピーされます
- `images/wiring.png` のようなサブフォルダの画像もそのまま参照できます
- `public/projects/` は生成物のため Git 管理対象外です

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
├── projects/                   # 各プロジェクトの原稿
│   ├── minoh-hiking/
│   │   ├── index.md            # Frontmatter（一覧カード用）
│   │   ├── README.md           # 詳細ページの本文
│   │   └── thumbnail.png
│   └── gnss-scope/
│       ├── index.md
│       ├── README.md
│       ├── circuit.png
│       └── images/wiring.png   # サブフォルダの画像もコピーされる
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
