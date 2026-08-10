"use client";

import { motion, type Variants } from "framer-motion";
import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

/** Scroll-reveal wrapper — subtle rise + fade, consistent across the site. */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = 24,
}: PropsWithChildren<{ className?: string; delay?: number; y?: number }>) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export function StaggerGrid({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  hover = true,
}: PropsWithChildren<{ className?: string; hover?: boolean }>) {
  return (
    <motion.div
      className={cn("h-full", className)}
      variants={staggerChild}
      whileHover={hover ? { y: -6, transition: { duration: 0.25 } } : undefined}
    >
      {children}
    </motion.div>
  );
}
