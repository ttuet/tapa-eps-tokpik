"use client";

import { useState } from "react";

import { libraryItems } from "../lib/content";

const filters = [["all", "Tất cả"], ["guide", "Hướng dẫn"], ["reference", "Tham khảo"], ["practice", "Luyện tập"]] as const;
type LibraryFilter = (typeof filters)[number][0];

export function LibraryPage({ title, description }: { title: string; description: string }) {
  const [filter, setFilter] = useState<LibraryFilter>("all");
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const shownItems = libraryItems.filter((item) => (filter === "all" || item.category === filter) && (!normalizedQuery || `${item.title} ${item.description}`.toLocaleLowerCase().includes(normalizedQuery)));

  return <section className="page-wrap"><header className="page-title"><p className="eyebrow">THƯ VIỆN TAPA</p><h1>{title}</h1><p>{description}</p></header><div className="search"><span aria-hidden="true">⌕</span><label htmlFor="library-search" className="sr-only">Tìm trong thư viện</label><input id="library-search" name="library-search" autoComplete="off" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tài liệu hoặc chủ đề" /><button type="button" onClick={() => setQuery("")}>Xóa</button></div><div className="book-tabs" aria-label="Lọc thư viện">{filters.map(([value, label]) => <button key={value} className={filter === value ? "active" : ""} aria-pressed={filter === value} onClick={() => setFilter(value)}><b>{label}</b><span>{value === "all" ? "Toàn bộ tài liệu" : `Nhóm ${label.toLocaleLowerCase()}`}</span></button>)}</div><section className="library-grid" aria-live="polite">{shownItems.map((item, index) => <article key={item.id}><span className="tag">{item.category}</span><div className={`folder folder-${(index % 6) + 1}`}>{item.image ? "▰" : "♪"}</div><h2>{item.title}</h2><p>{item.description}</p><div><button type="button" disabled aria-label={`Mở ${item.title} (sắp có)`}>Mở sắp có</button><button className="round" type="button" disabled aria-label={`Lưu ${item.title} (sắp có)`}>♡</button></div></article>)}</section>{shownItems.length === 0 && <p role="status">Không tìm thấy tài liệu phù hợp.</p>}</section>;
}
