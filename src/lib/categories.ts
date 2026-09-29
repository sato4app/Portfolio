/**
 * カテゴリの定義。index.md の category と name が一致するものをここで扱う。
 * 並び順はトップページの表示順で、ヘッダーのジャンプボタンもこの定義から作る。
 */
export type Category = {
  /** index.md の category に書く名前 */
  name: string;
  /** ページ内リンク用のid（URLに日本語を出さないため英字にする） */
  id: string;
  /** 狭い画面のヘッダーで使う短い表示名 */
  short: string;
};

export const CATEGORIES: Category[] = [
  { name: "ハイキングアプリ", id: "hiking", short: "ハイキング" },
  { name: "アプリ(PWA対応)", id: "pwa", short: "PWAアプリ" },
  { name: "電子工作", id: "electronics", short: "電子工作" },
  { name: "ツール(PC用)", id: "tools", short: "PCツール" },
  { name: "その他", id: "others", short: "その他" },
];

/** ヘッダーに2段で並べる順（上段: ハイキングアプリ・電子工作、下段: アプリ・ツール） */
export const HEADER_CATEGORY_IDS = ["hiking", "electronics", "pwa", "tools"];

export function findCategory(name: string): Category | undefined {
  return CATEGORIES.find((category) => category.name === name);
}
