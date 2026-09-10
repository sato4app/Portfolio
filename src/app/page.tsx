import Link from "next/link";
import {
  assetUrl,
  compareByDateDesc,
  getAllProjects,
  isCalendarDate,
  type Project,
} from "@/lib/markdown";

// README.md の並びに合わせたカテゴリの表示順。ここに無いカテゴリは末尾へ回す
const CATEGORY_ORDER = ["ハイキングアプリ", "アプリ(PWA対応)", "電子工作", "ツール(PC用)", "その他"];

function groupByCategory(projects: Project[]): [string, Project[]][] {
  const groups = new Map<string, Project[]>();
  for (const project of projects) {
    const category = project.frontmatter.category;
    const list = groups.get(category);
    if (list) list.push(project);
    else groups.set(category, [project]);
  }

  // カテゴリ内も日付の新しい順（日付以外は後ろ）に揃える
  for (const list of groups.values()) list.sort(compareByDateDesc);

  return [...groups.entries()].sort(([a], [b]) => {
    const indexA = CATEGORY_ORDER.indexOf(a);
    const indexB = CATEGORY_ORDER.indexOf(b);
    return (
      (indexA === -1 ? CATEGORY_ORDER.length : indexA) -
      (indexB === -1 ? CATEGORY_ORDER.length : indexB)
    );
  });
}

function ProjectCard({ project }: { project: Project }) {
  const { slug, frontmatter } = project;
  // date が「（未作成）」のような日付以外のときだけ、その文字列をバッジとして出す
  const dateBadge = isCalendarDate(frontmatter.date) ? null : frontmatter.date;

  return (
    <li>
      <Link
        href={`/projects/${slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-card transition hover:border-accent"
      >
        <div className="relative aspect-video overflow-hidden border-b border-line bg-background">
          {dateBadge && (
            <span className="absolute left-2 top-2 z-10 rounded-full bg-foreground/85 px-2 py-0.5 text-xs font-bold text-background">
              {dateBadge}
            </span>
          )}
          {frontmatter.thumbnail ? (
            /* 静的エクスポートのため next/image ではなく <img> を使い、basePath は assetUrl で付与する */
            <img
              src={assetUrl(slug, frontmatter.thumbnail)}
              alt={frontmatter.title}
              width={1200}
              height={630}
              loading="lazy"
              className="h-full w-full object-contain transition group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted">
              No Image
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="font-bold leading-snug group-hover:text-accent">
            {frontmatter.title}
          </h3>
          {frontmatter.summary && (
            <p className="text-sm leading-relaxed text-muted">{frontmatter.summary}</p>
          )}

          <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
            {frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line px-2 py-0.5 text-xs text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </li>
  );
}

export default function Home() {
  const projects = getAllProjects();
  const groups = groupByCategory(projects);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
      <p className="mt-3 text-muted">
        これまでに作成したアプリ・ツール・電子工作の一覧<br />
        オープンソースを基本として、興味のあるものを作成していく予定
      </p>

      {groups.length === 0 ? (
        <p className="mt-12 rounded-xl border border-line bg-card p-6 text-muted">
          <code>projects/</code> フォルダにサブフォルダを作り、<code>index.md</code>{" "}
          を置くとここに表示されます。
        </p>
      ) : (
        groups.map(([category, items]) => (
          <section key={category} className="mt-12">
            <h2 className="text-sm font-bold tracking-widest text-muted uppercase">
              {category}
            </h2>
            <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
