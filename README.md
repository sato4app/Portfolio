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

`template/` に雛形を置いてあります。フォルダごとコピーして、
リポジトリ名と同じ名前に変えるのが一番早い手順です。

```bash
# Windows (PowerShell)
Copy-Item -Recurse template projects/<リポジトリ名>

# Git Bash / macOS / Linux
cp -r template projects/<リポジトリ名>
```

コピーしたら次の3つを行います。

1. `index.md` の空欄を埋める
2. `thumbnail.png` を実際の画像に差し替える（ダミー画像が入っています）
3. 元リポジトリの `README.md` をコピーしてくる

`notes.md` は空のままで構いません（中身が無ければ表示されません）。

### フォルダの中身

`projects/` の下にリポジトリ名と同じ名前のフォルダを作り、次のファイルを置きます。

```
projects/
└── minoh-hiking/
    ├── index.md        # 一覧カード用の情報（Frontmatterのみ）
    ├── README.md       # 詳細ページの本文（元リポジトリからコピー）
    ├── notes.md        # 今後の予定メモ（空でよい）
    └── thumbnail.png   # 画像
```

| ファイル | 役割 | 用意の仕方 |
| --- | --- | --- |
| `index.md` | 一覧カードに出す情報 | 手書き（Frontmatterだけ。本文は不要） |
| `README.md` | 詳細ページの本文 | 元リポジトリの `README.md` を**手動でコピー** |
| `notes.md` | 今後の予定・改善メモ | 手書き（省略可。空ファイルでもよい） |
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

#### date の書き方

完全な日付である必要はありません。`（未作成）` のような日付以外の文字列も書けます。

| 書き方 | 並び順 | 一覧カードのバッジ |
| --- | --- | --- |
| `date: 2026-01-15` | 日付の新しい順 | なし |
| `date: 2026-01` | 同上（`2026-01-15` より後ろ） | なし |
| `date: '2026'` | 同上（**引用符が必要**） | なし |
| `date: （未作成）` | **末尾** | **（未作成）** |
| `date: （作成中）` | **末尾** | **（作成中）** |
| `date: 2026` | 末尾（YAMLが数値と解釈し空になる） | なし |
| 省略 | 末尾 | なし |

日付として扱われるのは `2026` / `2026-01` / `2026-01-15` の形式だけです。
それ以外の文字列は、同じカテゴリ内の**末尾**にまとめられ、
書いた文字列がそのまま**一覧カードのサムネイル左上にバッジ**として表示されます。

#### 未作成のアプリを載せる

まだ作っていないアプリも、`index.md` だけ置けばエントリとして並べられます。
`README.md`・サムネイル・`repo`・`demo` はすべて省略できます。
本文が無い場合、詳細ページには「詳細はまだありません。」と表示されます。

```markdown
---
title: 未着手のアプリ
date: （未作成）
category: アプリ
summary: 一覧カードに表示する短い説明
---
```

### README.md（詳細ページの本文）

元リポジトリの `README.md` をそのままコピーするだけです。
コピーしても表示が崩れないよう、ビルド時に以下の調整が自動で行われます。

| 調整内容 | 理由 |
| --- | --- |
| 冒頭の見出し1（`# タイトル` / `タイトル\n===`）を削除 | 詳細ページのタイトルは `index.md` の `title` を使うため、重複を防ぐ |
| 相対指定の画像を `public/projects/<slug>/` へ解決 | `basePath`（`/Portfolio`）を自動で付与する |
| 相対指定のリンク（`docs/spec.md` など）を GitHub のURLへ変換 | コピーした README のリンク切れを防ぐ。`repo` の指定が必要 |

### notes.md（今後の予定）

機能追加や改善点のメモを書くファイルです。詳細ページの本文の下に
「今後の予定」という枠で表示されます。

**`README.md` ではなく `notes.md` に書いてください。** `README.md` は元リポジトリから
コピーし直したときに上書きされるため、書いたメモが消えます。`notes.md` は
コピー対象ではないので残ります。

```markdown
- オフライン地図のキャッシュ対応
- 標高グラフの追加
- ルート編集のアンドゥ機能
```

- **空ファイルのまま置いても構いません。** 中身が無ければセクションごと表示されません
- ファイル自体が無くても構いません
- 画像やリンクの解決は `README.md` と同じ扱いです（相対指定の画像は `projects/<slug>/` から、相対リンクは `repo` のURLへ変換）

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
├── template/                   # 新規プロジェクトの雛形（コピー元）
│   ├── index.md                # 空欄のFrontmatter
│   ├── notes.md                # 空ファイル
│   └── thumbnail.png           # 差し替え用のダミー画像
├── projects/                   # 各プロジェクトの原稿
│   ├── minoh-hiking/
│   │   ├── index.md            # Frontmatter（一覧カード用）
│   │   ├── README.md           # 詳細ページの本文
│   │   ├── notes.md            # 今後の予定メモ（空でよい）
│   │   └── thumbnail.png
│   └── gnss-scope/
│       ├── index.md
│       ├── README.md
│       ├── notes.md
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
