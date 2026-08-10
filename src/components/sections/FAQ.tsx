"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CaretDown } from "@phosphor-icons/react";
import SectionTitle from "@/components/ui/SectionTitle";
import { FadeIn } from "@/components/ui/motion";
import { FAQS } from "@/data/content";
import { cn } from "@/lib/utils";

/**
 * FAQ — accordion rows in the Figma dropdown/course-list pattern:
 * white rows, bold 18px question, caret rotation, animated reveal.
 */
export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-[24px] py-[80px] xl:px-[120px]">
        <FadeIn className="flex flex-col items-center text-center">
          <SectionTitle center>FAQ</SectionTitle>
          <p className="mt-[10px] max-w-[700px] text-content-18 text-neutral-700">
            Everything you need to know before reporting, adopting or
            publishing on Helpet.
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="mx-auto mt-[30px] flex w-full max-w-[860px] flex-col gap-[15px]">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className={cn(
                  "overflow-hidden rounded-card border bg-white transition-colors",
                  isOpen
                    ? "border-purple-3 shadow-card"
                    : "border-purple-4/60 hover:border-purple-3/60"
                )}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-[15px] px-[25px] py-[20px] text-left"
                >
                  <span className="text-content-18 font-bold text-neutral-800">
                    {f.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 text-purple-3"
                  >
                    <CaretDown size={20} weight="bold" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="border-t border-purple-5 px-[25px] py-[18px] text-small-14 leading-[20px] text-neutral-700">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </FadeIn>
      </div>
    </section>
  );
}
