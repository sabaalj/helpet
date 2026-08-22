"use client";

import Link from "next/link";
import { PawPrint } from "@phosphor-icons/react";
import { motion } from "framer-motion";

/**
 * No-results panel — a bobbing paw mark over trailing prints, plus a way out.
 * A filtered-to-nothing grid is still a dead end, so it always offers an action.
 */
export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="relative mt-[30px] flex flex-col items-center gap-[15px] overflow-hidden rounded-card bg-purple-5/50 px-[24px] py-[60px] text-center">
      {/* trailing prints wandering off behind the panel */}
      <PawPrint
        size={90}
        weight="fill"
        aria-hidden
        className="pointer-events-none absolute -left-[20px] bottom-[10px] rotate-[25deg] text-purple-4/40"
      />
      <PawPrint
        size={64}
        weight="fill"
        aria-hidden
        className="pointer-events-none absolute right-[6%] top-[16px] -rotate-[20deg] text-purple-4/40"
      />

      <motion.span
        aria-hidden
        className="relative flex size-[84px] items-center justify-center rounded-full bg-white shadow-chip"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <PawPrint size={40} weight="fill" className="text-purple-3" />
      </motion.span>

      <p className="relative text-title-20 font-bold text-purple-3">{title}</p>
      <p className="relative max-w-[520px] text-content-18 text-neutral-700">
        {description}
      </p>

      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary relative mt-[5px]">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
