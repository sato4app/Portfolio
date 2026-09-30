/**
 * カテゴリの定義。index.md の category と name が一致するものをここで扱う。
 * 並び順はトップページの表示順で、ヘッダーのジャンプボタンもこの定義から作る。
 */
export type Category = {
  /** index.md の category に書く名前 */
  name: string;
  /** ページ内リンク用のid（URLに日本語を出さないため英字にする） */
  id: string;
};

export const CATEGORIES: Category[] = [
  { name: "ハイキングアプリ", id: "hiking" },
  { name: "アプリ(PWA対応)", id: "pwa" },
  { name: "電子工作", id: "electronics" },
  { name: "ツール(PC用)", id: "tools" },
  { name: "その他", id: "others" },
];

/**
 * ヘッダーに並べる順。横一列ではこの順に左から並ぶ。
 * 2段のときは縦に詰めるので、上段: ハイキングアプリ・電子工作、下段: アプリ・ツール になる。
 */
export const HEADER_CATEGORY_IDS = ["hiking", "pwa", "electronics", "tools"];

export function findCategory(name: string): Category | undefined {
  return CATEGORIES.find((category) => category.name === name);
}
