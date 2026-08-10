"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** Pagination — Figma pattern: « 1 2 3 … » with the active page filled purple. */
export default function Pagination({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (p: number) => void;
}) {
  if (total <= 1) return null;
  return (
    <nav className="flex items-center justify-center gap-[8px]" aria-label="Pagination">
      <button
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="flex size-[34px] items-center justify-center rounded-btn text-purple-3 transition-colors hover:bg-purple-5 disabled:opacity-30"
      >
        <CaretLeft size={16} weight="bold" />
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            "flex size-[34px] items-center justify-center rounded-btn text-small-14 font-semibold transition-colors",
            p === page
              ? "bg-purple-3 text-white"
              : "text-neutral-700 hover:bg-purple-5"
          )}
        >
          {p}
        </button>
      ))}
      <button
        aria-label="Next page"
        disabled={page === total}
        onClick={() => onChange(page + 1)}
        className="flex size-[34px] items-center justify-center rounded-btn text-purple-3 transition-colors hover:bg-purple-5 disabled:opacity-30"
      >
        <CaretRight size={16} weight="bold" />
      </button>
    </nav>
  );
}
