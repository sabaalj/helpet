"use client";

import { PawPrint } from "@phosphor-icons/react";
import { motion } from "framer-motion";

/**
 * Page header band — Figma page-title pattern (Blog / Shop headers):
 * lavender band, centered uppercase purple title with paw ornament,
 * supporting text, decorative paw prints in the corners.
 */
export default function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-purple-5/60">
      <PawPrint
        size={150}
        weight="fill"
        aria-hidden
        className="absolute -left-[30px] top-[20px] rotate-[25deg] text-purple-4/60"
      />
      <PawPrint
        size={110}
        weight="fill"
        aria-hidden
        className="absolute bottom-[10px] right-[6%] -rotate-[20deg] text-purple-4/50"
      />
      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col items-center gap-[15px] px-[24px] py-[60px] text-center xl:px-[120px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-[10px]"
        >
          <h1 className="text-display-36 font-bold uppercase text-purple-3">
            {title}
          </h1>
          <PawPrint
            size={44}
            weight="fill"
            className="rotate-90 text-purple-4"
            aria-hidden
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[720px] text-content-18 leading-[24px] text-neutral-700"
        >
          {description}
        </motion.p>
        {children}
      </div>
    </section>
  );
}
