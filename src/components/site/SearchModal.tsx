"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export type SearchItem = { title: string; href: string; kind: string };

export function SearchModal({
  items,
  onClose,
}: {
  items: SearchItem[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const pool = needle
      ? items.filter((item) => `${item.title} ${item.kind}`.toLowerCase().includes(needle))
      : items;
    return pool.slice(0, 8);
  }, [items, query]);

  useEffect(() => setCursor(0), [query]);

  function open(item?: SearchItem) {
    if (!item) return;
    router.push(item.href);
    onClose();
  }

  return (
    <div className="search-modal" role="presentation" onMouseDown={onClose}>
      <form
        role="dialog"
        aria-label="Search"
        onMouseDown={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault();
          open(results[cursor]);
        }}
      >
        <input
          autoFocus
          aria-label="Search pages and projects"
          placeholder="Search portfolio"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") onClose();
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setCursor((value) => Math.min(value + 1, Math.max(results.length - 1, 0)));
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setCursor((value) => Math.max(value - 1, 0));
            }
          }}
        />
        {results.length === 0 ? <p className="muted">No matches</p> : null}
        {results.map((item, index) => (
          <a
            key={`${item.href}-${item.title}`}
            href={item.href}
            data-active={index === cursor}
            onClick={(event) => {
              event.preventDefault();
              open(item);
            }}
          >
            <strong>{item.title}</strong> <span className="muted">{item.kind}</span>
          </a>
        ))}
      </form>
    </div>
  );
}
