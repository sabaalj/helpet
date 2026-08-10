"use client";

import {
  Heart,
  PawPrint,
  Smiley,
  UsersFour,
  type Icon,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { STATS } from "@/data/content";

/**
 * Statistics — Figma dark-purple stats band (bottom of Homepage / Shop):
 * four columns with outline icons, big green values, white labels
 * and dotted separators.
 */

const ICONS: Record<string, Icon> = {
  paw: PawPrint,
  heart: Heart,
  users: UsersFour,
  smiley: Smiley,
};

function AnimatedValue({ value }: { value: string }) {
  const num = parseInt(value.replace(/\D/g, ""), 10);
  const suffix = value.replace(/[0-9]/g, "");
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setDisplay(Math.round(num * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, num]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsBand() {
  return (
    <section className="relative overflow-hidden bg-purple-3">
      {/* Paw badge ornaments */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/logo-circle.svg"
        alt=""
        aria-hidden
        className="absolute -left-[40px] -top-[40px] size-[180px] opacity-10 invert"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/logo-circle.svg"
        alt=""
        aria-hidden
        className="absolute -bottom-[50px] right-[8%] size-[160px] opacity-10 invert"
      />

      <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-2 gap-y-[40px] px-[24px] py-[70px] lg:grid-cols-4 xl:px-[120px]">
        {STATS.map((s, i) => {
          const IconCmp = ICONS[s.icon];
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center gap-[12px] border-dashed border-white/20 text-center lg:border-r lg:last:border-r-0"
            >
              <IconCmp size={44} className="text-purple-4" />
              <p className="text-display-36 font-bold text-green-5">
                <AnimatedValue value={s.value} />
              </p>
              <p className="text-content-18 text-white">{s.label}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
