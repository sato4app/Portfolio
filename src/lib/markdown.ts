import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

// ルート直下の projects フォルダのパス
const projectsDirectory = path.join(process.cwd(), 'projects');
// public/projects フォルダのパス（コピー先）
const publicProjectsDirectory = path.join(process.cwd(), 'public', 'projects');

// 画像として扱う拡張子
const IMAGE_PATTERN = /\.(png|jpe?g|gif|svg|webp|avif)$/i;

// next.config.mjs の basePath。ビルド時に埋め込まれる
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export type ProjectFrontmatter = {
  title: string;
  date: string;
  category: string;
  summary: string;
  tags: string[];
  thumbnail: string | null;
  repo: string | null;
  demo: string | null;
};

export type Project = {
  slug: string;
  frontmatter: ProjectFrontmatter;
  content: string;
};

/**
 * public/ 配下に配置された画像のURLを組み立てる。
 * 静的エクスポートでは <img> の src に basePath が自動付与されないため、ここで付ける。
 */
export function assetUrl(slug: string, file: string): string {
  return `${basePath}/projects/${slug}/${file}`;
}

/**
 * YAML の date は Date オブジェクトに変換されるため YYYY-MM-DD の文字列へ正規化する。
 * ローカルタイムゾーンによる日付ずれを避けるためUTC基準で切り出す。
 */
function normalizeDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return typeof value === 'string' ? value : '';
}

function normalizeFrontmatter(data: Record<string, unknown>, slug: string): ProjectFrontmatter {
  const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
  return {
    title: typeof data.title === 'string' ? data.title : slug,
    date: normalizeDate(data.date),
    category: typeof data.category === 'string' ? data.category : 'その他',
    summary: typeof data.summary === 'string' ? data.summary : '',
    tags,
    thumbnail: typeof data.thumbnail === 'string' ? data.thumbnail : null,
    repo: typeof data.repo === 'string' ? data.repo : null,
    demo: typeof data.demo === 'string' ? data.demo : null,
  };
}

/**
 * プロジェクト（フォルダ）の名前一覧を取得する関数
 */
export function getProjectSlugs(): string[] {
  // projects フォルダ自体が無い場合は空配列を返す（初期状態でのビルド失敗を防ぐ）
  if (!fs.existsSync(projectsDirectory)) return [];

  // projectsフォルダ内のディレクトリ名だけを抽出して返す
  return fs
    .readdirSync(projectsDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) => fs.existsSync(path.join(projectsDirectory, dirent.name, 'index.md')))
    .map((dirent) => dirent.name);
}

/**
 * 指定したプロジェクト（フォルダ名）のMarkdownと画像を処理する関数
 */
export function getProjectBySlug(slug: string): Project {
  // 1. Markdownの読み込み
  const projectDir = path.join(projectsDirectory, slug);
  const fullPath = path.join(projectDir, 'index.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // gray-matterで Frontmatter(data) と 本文(content) に分割
  const { data, content } = matter(fileContents);

  // ----------------------------------------------------
  // 2. 画像の自動コピー処理
  // ----------------------------------------------------
  const publicTargetDir = path.join(publicProjectsDirectory, slug);

  // コピー先の public/projects/[slug] フォルダがなければ作成
  if (!fs.existsSync(publicTargetDir)) {
    fs.mkdirSync(publicTargetDir, { recursive: true });
  }

  // プロジェクトフォルダ内のファイル一覧を取得
  const files = fs.readdirSync(projectDir);

  files.forEach((file) => {
    // index.md 以外の画像ファイルを対象とする（.png, .jpg, .gif など）
    if (file !== 'index.md' && IMAGE_PATTERN.test(file)) {
      const srcPath = path.join(projectDir, file);
      const destPath = path.join(publicTargetDir, file);

      // 画像ファイルを public/ 側へ上書きコピー
      fs.copyFileSync(srcPath, destPath);
    }
  });
  // ----------------------------------------------------

  return {
    slug,
    frontmatter: normalizeFrontmatter(data, slug), // title, date, tags などの情報
    content, // Markdownの本文
  };
}

/**
 * 全てのプロジェクトデータを取得する関数（トップページの一覧表示などに使う）
 */
export function getAllProjects(): Project[] {
  const slugs = getProjectSlugs();
  const projects = slugs.map((slug) => getProjectBySlug(slug));

  // 日付の新しい順に並び替え
  return projects.sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}

/**
 * Markdown本文をHTMLへ変換する。
 * index.md 内で `![](thumbnail.png)` のように相対指定された画像は
 * public/projects/[slug]/ を指すURLへ書き換える。
 */
export async function renderMarkdown(content: string, slug: string): Promise<string> {
  const processed = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(content);
  return resolveImageSources(String(processed), slug);
}

function resolveImageSources(html: string, slug: string): string {
  return html.replace(/(<img[^>]*\ssrc=")([^"]*)(")/g, (match, prefix, src: string, suffix) => {
    // 外部URL・データURIはそのまま
    if (/^(https?:)?\/\//i.test(src) || src.startsWith('data:')) return match;
    // ルート相対指定は basePath だけ補う
    if (src.startsWith('/')) return `${prefix}${basePath}${src}${suffix}`;
    // それ以外は projects/[slug]/ からの相対指定とみなす
    return `${prefix}${assetUrl(slug, src.replace(/^\.\//, ''))}${suffix}`;
  });
}
