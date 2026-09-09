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
// 詳細ページの本文として読み込むファイル名の候補（先に見つかったものを使う）
const BODY_CANDIDATES = ['README.md', 'readme.md', 'README.markdown'];
// 「今後の予定」として読み込むファイル名の候補
const NOTES_CANDIDATES = ['notes.md', 'NOTES.md'];
// 画像コピー時に無視するフォルダ（リポジトリごとコピーされた場合の保険）
const IGNORED_DIRS = new Set(['node_modules', '.git', '.next', 'out', 'dist', 'build']);

// next.config.mjs の basePath。ビルド時に埋め込まれる
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/**
 * date が暦の日付（2026 / 2026-01 / 2026-01-15）かどうかを判定する。
 * 「（未作成）」のような日付以外の文字列は、一覧でバッジとして表示し、並び順を末尾にする。
 */
export function isCalendarDate(value: string): boolean {
  return /^\d{4}(-\d{2}(-\d{2})?)?$/.test(value);
}

export type ProjectFrontmatter = {
  title: string;
  date: string;
  category: string;
  summary: string;
  tags: string[];
  thumbnail: string | null;
  repo: string | null;
  demo: string | null;
  /** README.md 内の相対リンクを GitHub 上のURLへ変換するときに使うブランチ名 */
  branch: string;
};

export type Project = {
  slug: string;
  frontmatter: ProjectFrontmatter;
  /** 詳細ページに表示する本文（Markdown） */
  content: string;
  /** 本文の取得元。README.md が無ければ index.md の本文にフォールバックする */
  bodySource: 'readme' | 'index';
  /** 「今後の予定」のメモ（Markdown）。notes.md が無い・空なら空文字 */
  notes: string;
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
  return {
    title: typeof data.title === 'string' ? data.title : slug,
    date: normalizeDate(data.date),
    category: typeof data.category === 'string' ? data.category : 'その他',
    summary: typeof data.summary === 'string' ? data.summary : '',
    // テンプレートの「- だけ残った行」が "null" というタグにならないよう空要素を除く
    tags: Array.isArray(data.tags)
      ? data.tags
          .filter((tag) => tag !== null && tag !== undefined)
          .map(String)
          .filter((tag) => tag.trim() !== '')
      : [],
    thumbnail: typeof data.thumbnail === 'string' ? data.thumbnail : null,
    repo: typeof data.repo === 'string' ? data.repo : null,
    demo: typeof data.demo === 'string' ? data.demo : null,
    branch: typeof data.branch === 'string' ? data.branch : 'main',
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
 * プロジェクトフォルダ内の画像を public/projects/[slug]/ へコピーする。
 * README.md が images/ などのサブフォルダを参照していても動くよう再帰的にコピーする。
 */
function copyProjectImages(projectDir: string, publicTargetDir: string, relative = ''): void {
  const entries = fs.readdirSync(path.join(projectDir, relative), { withFileTypes: true });

  for (const entry of entries) {
    const relativePath = relative ? path.join(relative, entry.name) : entry.name;

    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        copyProjectImages(projectDir, publicTargetDir, relativePath);
      }
      continue;
    }

    // 画像ファイルのみを対象とする（index.md や README.md はコピーしない）
    if (!IMAGE_PATTERN.test(entry.name)) continue;

    const destPath = path.join(publicTargetDir, relativePath);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    // 画像ファイルを public/ 側へ上書きコピー
    fs.copyFileSync(path.join(projectDir, relativePath), destPath);
  }
}

/**
 * 詳細ページの見出しは Frontmatter の title を使うため、
 * README.md 冒頭の見出し1（タイトル行）があれば取り除いて重複を防ぐ。
 */
function stripLeadingHeading(markdown: string): string {
  const lines = markdown.split(/\r?\n/);

  let index = 0;
  while (index < lines.length && lines[index].trim() === '') index++;
  if (index >= lines.length) return markdown;

  // ATX形式（# タイトル）
  if (/^#\s+\S/.test(lines[index])) {
    lines.splice(index, 1);
    return lines.join('\n');
  }

  // Setext形式（タイトルの次行が === ）
  if (index + 1 < lines.length && /^=+\s*$/.test(lines[index + 1])) {
    lines.splice(index, 2);
    return lines.join('\n');
  }

  return markdown;
}

/**
 * 詳細ページの本文を読み込む。
 * リポジトリからコピーした README.md を優先し、無ければ index.md の本文を使う。
 */
function readBody(projectDir: string, indexContent: string): Pick<Project, 'content' | 'bodySource'> {
  for (const name of BODY_CANDIDATES) {
    const bodyPath = path.join(projectDir, name);
    if (!fs.existsSync(bodyPath)) continue;

    // 念のため README.md 側に Frontmatter があっても取り除いておく
    const { content } = matter(fs.readFileSync(bodyPath, 'utf8'));
    return { content: stripLeadingHeading(content), bodySource: 'readme' };
  }

  return { content: indexContent, bodySource: 'index' };
}

/**
 * 「今後の予定」のメモを読み込む。
 * README.md と違い元リポジトリからのコピーで上書きされないため、
 * 機能追加や改善点はこちらに書く。空ファイルのまま置いても表示は増えない。
 */
function readNotes(projectDir: string): string {
  for (const name of NOTES_CANDIDATES) {
    const notesPath = path.join(projectDir, name);
    if (!fs.existsSync(notesPath)) continue;

    // 先頭の --- を Frontmatter と誤認しないよう、gray-matter を通さずそのまま読む
    return fs.readFileSync(notesPath, 'utf8').trim();
  }

  return '';
}

/**
 * 指定したプロジェクト（フォルダ名）のMarkdownと画像を処理する関数
 */
export function getProjectBySlug(slug: string): Project {
  const projectDir = path.join(projectsDirectory, slug);

  // 1. index.md から Frontmatter を読み込む
  const { data, content: indexContent } = matter(
    fs.readFileSync(path.join(projectDir, 'index.md'), 'utf8')
  );

  // 2. 詳細ページの本文（README.md）を読み込む
  const body = readBody(projectDir, indexContent);

  // 3. 画像を public/projects/[slug]/ へ上書きコピーする
  const publicTargetDir = path.join(publicProjectsDirectory, slug);
  fs.mkdirSync(publicTargetDir, { recursive: true });
  copyProjectImages(projectDir, publicTargetDir);

  return {
    slug,
    frontmatter: normalizeFrontmatter(data, slug),
    ...body,
    notes: readNotes(projectDir),
  };
}

/**
 * 全てのプロジェクトデータを取得する関数（トップページの一覧表示などに使う）
 */
export function getAllProjects(): Project[] {
  const projects = getProjectSlugs().map((slug) => getProjectBySlug(slug));

  // 日付の新しい順に並び替える。
  // 「（未作成）」のような日付以外と未記入は、日付を持つものより後ろへまとめる。
  return projects.sort((a, b) => {
    const dateA = a.frontmatter.date;
    const dateB = b.frontmatter.date;
    const isDateA = isCalendarDate(dateA);
    const isDateB = isCalendarDate(dateB);

    if (isDateA !== isDateB) return isDateA ? -1 : 1;
    // 双方とも日付でない場合は、フォルダ名順（読み込み順）を保つ
    if (!isDateA) return 0;

    return dateA < dateB ? 1 : -1;
  });
}

/**
 * 本文のMarkdownをHTMLへ変換する。
 * README.md をそのままコピーしても表示が崩れないよう、
 * 相対指定の画像とリンクを解決してから返す。
 */
export async function renderProjectBody(project: Project): Promise<string> {
  return toHtml(project.content, project);
}

/**
 * 「今後の予定」のメモをHTMLへ変換する。
 * notes.md が無い、または空ファイルの場合は空文字を返す（セクションごと表示しない）。
 */
export async function renderProjectNotes(project: Project): Promise<string> {
  return toHtml(project.notes, project);
}

async function toHtml(markdown: string, project: Project): Promise<string> {
  if (!markdown.trim()) return '';

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);

  const html = resolveImageSources(String(processed), project.slug);
  return resolveRelativeLinks(html, project.frontmatter);
}

/** 相対指定の画像を public/projects/[slug]/ を指すURLへ書き換える */
function resolveImageSources(html: string, slug: string): string {
  return html.replace(/(<img[^>]*\ssrc=")([^"]*)(")/g, (match, prefix, src: string, suffix) => {
    // 外部URL・データURIはそのまま
    if (isExternal(src)) return match;
    // ルート相対指定は basePath だけ補う
    if (src.startsWith('/')) return `${prefix}${basePath}${src}${suffix}`;
    // それ以外は projects/[slug]/ からの相対指定とみなす
    return `${prefix}${assetUrl(slug, src.replace(/^\.\//, ''))}${suffix}`;
  });
}

/**
 * README.md 内の相対リンク（docs/spec.md など）はコピーすると壊れるため、
 * repo が指定されていれば GitHub 上のファイルURLへ変換する。
 */
function resolveRelativeLinks(html: string, frontmatter: ProjectFrontmatter): string {
  const { repo, branch } = frontmatter;
  if (!repo) return html;

  const repoBase = repo.replace(/\/+$/, '');

  return html.replace(/(<a[^>]*\shref=")([^"]*)(")/g, (match, prefix, href: string, suffix) => {
    // 外部URL・ページ内アンカー・ルート相対はそのまま
    if (isExternal(href) || href.startsWith('/') || href.startsWith('#')) return match;
    return `${prefix}${repoBase}/blob/${branch}/${href.replace(/^\.\//, '')}${suffix}`;
  });
}

function isExternal(url: string): boolean {
  return /^(https?:)?\/\//i.test(url) || /^(data|mailto|tel):/i.test(url);
}
