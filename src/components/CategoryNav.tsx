"use client";

import Link from "next/link";
import type { Category } from "@/lib/categories";

/**
 * ヘッダーのカテゴリジャンプ。2列×2段で、狭い画面では短い表示名に切り替える。
 *
 * トップページ上では自前でスクロールする。GitHub Pages は /Portfolio を /Portfolio/ へ
 * 転送するため、Link 任せだと /Portfolio/ → /Portfolio#id がページ遷移扱いになり、
 * 見出しまでスクロールしないことがある。他のページからは通常どおり Link で遷移する。
 */
export default function CategoryNav({ categories }: { categories: Category[] }) {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    history.replaceState(history.state, "", `#${id}`);
  }

  return (
    <nav aria-label="カテゴリ" className="grid grid-cols-2 gap-1 sm:gap-1.5">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/#${category.id}`}
          onClick={(event) => handleClick(event, category.id)}
          className="rounded-md border border-line bg-card/85 px-2 py-0.5 text-center text-[11px] leading-4 font-bold whitespace-nowrap backdrop-blur-sm transition hover:border-accent hover:text-accent sm:px-3 sm:text-xs"
        >
          <span className="sm:hidden">{category.short}</span>
          <span className="hidden sm:inline">{category.name}</span>
        </Link>
      ))}
    </nav>
  );
}
