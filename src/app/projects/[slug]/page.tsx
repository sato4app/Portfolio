import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  getProjectSlugs,
  renderProjectBody,
} from "@/lib/markdown";

// generateStaticParams で列挙したページ以外は 404 にする
export const dynamicParams = false;

// 静的エクスポートのため、生成するページを projects/ のフォルダ名から列挙する
export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!getProjectSlugs().includes(slug)) return {};

  const { frontmatter } = getProjectBySlug(slug);
  return {
    title: frontmatter.title,
    description: frontmatter.summary,
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  if (!getProjectSlugs().includes(slug)) notFound();

  const project = getProjectBySlug(slug);
  const { frontmatter } = project;
  const html = await renderProjectBody(project);

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/" className="text-sm text-muted hover:text-accent">
        ← 一覧へ戻る
      </Link>

      <header className="mt-6 border-b border-line pb-8">
        <p className="text-sm text-muted">{frontmatter.category}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{frontmatter.title}</h1>

        {frontmatter.summary && (
          <p className="mt-3 leading-relaxed text-muted">{frontmatter.summary}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-line px-2 py-0.5 text-xs text-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
          {frontmatter.date && <span className="text-muted">{frontmatter.date}</span>}
          {frontmatter.repo && (
            <a
              href={frontmatter.repo}
              target="_blank"
              rel="noreferrer"
              className="text-accent underline underline-offset-4"
            >
              リポジトリ
            </a>
          )}
          {frontmatter.demo && (
            <a
              href={frontmatter.demo}
              target="_blank"
              rel="noreferrer"
              className="text-accent underline underline-offset-4"
            >
              デモを開く
            </a>
          )}
        </div>
      </header>

      {/* 本文は自分で書いた index.md のみを読み込むため、HTMLをそのまま描画する */}
      <div
        className="markdown-body mt-8"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
