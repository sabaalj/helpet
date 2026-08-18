"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Info } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * Form page shell — Figma Checkout pattern: numbered stepper,
 * purple page title, beige info banner with paw ornaments, form
 * sections on the left and a summary/tips card on the right.
 */

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-[20px]">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-[10px]">
          <span
            className={cn(
              "flex size-[32px] items-center justify-center rounded-full text-small-14 font-bold",
              i <= current
                ? "bg-purple-3 text-white"
                : "bg-neutral-200 text-white"
            )}
          >
            {i + 1}
          </span>
          <span
            className={cn(
              "text-content-18 font-bold",
              i <= current ? "text-purple-3" : "text-neutral-300"
            )}
          >
            {s}
          </span>
        </div>
      ))}
    </div>
  );
}

export function InfoBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex items-start gap-[15px] overflow-hidden rounded-card bg-[#F7EFE3] p-[20px]">
      <span className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-yellow text-white">
        <Info size={20} weight="bold" />
      </span>
      <div className="text-small-14 leading-[20px] text-neutral-800">{children}</div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/paw-decor-small.svg"
        alt=""
        aria-hidden
        className="absolute -right-[10px] -top-[10px] w-[90px] rotate-[20deg] opacity-40"
      />
    </div>
  );
}

export function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-[25px]">
      <h2 className="text-title-20 font-bold text-neutral-800">{title}</h2>
      {children}
    </section>
  );
}

export function SideCard({
  title,
  tips,
  submitLabel,
  onSubmit,
}: {
  title: string;
  tips: string[];
  submitLabel: string;
  onSubmit?: () => void;
}) {
  return (
    <aside className="flex h-fit flex-col gap-[20px] rounded-card bg-white p-[25px] shadow-panel lg:sticky lg:top-[140px]">
      <h3 className="text-title-20 font-bold text-neutral-800">{title}</h3>
      <ul className="flex flex-col gap-[12px] border-b border-dashed border-neutral-200 pb-[20px]">
        {tips.map((t) => (
          <li key={t} className="flex items-start gap-[8px] text-small-14 leading-[18px] text-neutral-700">
            <CheckCircle size={18} weight="fill" className="mt-[1px] shrink-0 text-green-4" />
            {t}
          </li>
        ))}
      </ul>
      <button type="submit" onClick={onSubmit} className="btn-primary w-full">
        {submitLabel}
      </button>
      <p className="text-center text-desc-12 text-neutral-600">
        By publishing you agree to Helpet&apos;s community guidelines.
      </p>
    </aside>
  );
}

export function SuccessState({
  message,
  backHref,
  backLabel,
}: {
  message: string;
  backHref: string;
  backLabel: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto flex max-w-[560px] flex-col items-center gap-[20px] rounded-card bg-white p-[50px] text-center shadow-panel"
    >
      <CheckCircle size={80} weight="fill" className="text-green-4" />
      <h2 className="text-header-28 font-bold text-purple-3">Published!</h2>
      <p className="text-content-18 text-neutral-700">{message}</p>
      <Link href={backHref} className="btn-primary">
        {backLabel}
      </Link>
    </motion.div>
  );
}

/** Wires the pieces together with local submitted-state handling. */
export default function FormShell({
  steps,
  title,
  banner,
  side,
  success,
  children,
}: {
  steps: string[];
  title: string;
  banner: React.ReactNode;
  side: Omit<Parameters<typeof SideCard>[0], "onSubmit">;
  success: Parameters<typeof SuccessState>[0];
  children: React.ReactNode;
}) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-purple-5/40">
      <div className="mx-auto w-full max-w-[1440px] px-[24px] py-[50px] xl:px-[120px]">
        <Stepper steps={steps} current={submitted ? steps.length - 1 : 1} />

        {submitted ? (
          <div className="py-[60px]">
            <SuccessState {...success} />
          </div>
        ) : (
          <>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-[35px] text-display-36 font-bold text-purple-3"
            >
              {title}
            </motion.h1>

            <form
              className="mt-[25px] grid grid-cols-1 gap-[40px] lg:grid-cols-[1fr_380px]"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <div className="flex flex-col gap-[35px]">
                <InfoBanner>{banner}</InfoBanner>
                {children}
              </div>
              <SideCard {...side} />
            </form>
          </>
        )}
      </div>
    </div>
  );
}
