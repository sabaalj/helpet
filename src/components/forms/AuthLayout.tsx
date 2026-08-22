"use client";

import { motion } from "framer-motion";
import { GoogleLogo, PawPrint } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * Auth split layout — Figma Login / Register frames:
 * left lavender form panel with paw ornament, right photo panel
 * (teal or green) with a translucent overlay card at the bottom.
 */

export function AuthPanel({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-1 flex-col justify-center rounded-[20px] bg-[#FBF5FF] px-[30px] py-[50px] sm:px-[60px]"
    >
      <div className="flex items-start justify-between">
        <h1 className="text-display-36 font-bold uppercase leading-[48px]">
          <span className="text-purple-3">{eyebrow}</span>
          <br />
          <span className="text-green-5">{title}</span>
        </h1>
        <PawPrint
          size={48}
          weight="fill"
          className="rotate-[30deg] text-purple-4"
          aria-hidden
        />
      </div>
      <p className="mt-[20px] text-content-18 leading-[24px] text-neutral-700">
        {intro}
      </p>
      <div className="mt-[35px] flex flex-col gap-[28px]">{children}</div>
    </motion.div>
  );
}

export function SocialButtons({
  verb = "Sign Up",
  onGoogle,
  loading = false,
}: {
  verb?: string;
  /** Omit to render the button disabled (no provider wired up). */
  onGoogle?: () => void;
  loading?: boolean;
}) {
  return (
    <>
      <div className="flex items-center gap-[15px]">
        <span className="h-px flex-1 bg-neutral-300" />
        <span className="text-small-14 text-neutral-600">Or</span>
        <span className="h-px flex-1 bg-neutral-300" />
      </div>
      <button
        type="button"
        onClick={onGoogle}
        disabled={loading || !onGoogle}
        aria-busy={loading}
        className="flex h-[52px] w-full items-center justify-center gap-[10px] rounded-btn border border-neutral-200 bg-white text-content-18 font-bold text-neutral-800 transition-colors hover:border-purple-3 disabled:opacity-60"
      >
        <GoogleLogo size={22} weight="bold" />
        {loading ? "Connecting..." : `${verb} With Google`}
      </button>
    </>
  );
}

export function AuthAside({
  variant,
  headline,
  photo,
  photoAlt,
  card,
}: {
  variant: "teal" | "green";
  headline: string;
  photo: string;
  photoAlt: string;
  card: { title: string; body: string; footer?: React.ReactNode };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative hidden flex-1 flex-col overflow-hidden rounded-[20px] p-[40px] lg:flex",
        variant === "teal"
          ? "bg-[radial-gradient(ellipse_at_center,#9ED0DC_0%,#6BA9B9_70%)]"
          : "bg-[radial-gradient(ellipse_at_center,#C3D9B8_0%,#A1BE97_70%)]"
      )}
    >
      <h2 className="max-w-[420px] text-header-28 font-bold uppercase leading-[36px] text-white">
        {headline}
      </h2>
      <div className="flex flex-1 items-end justify-center pb-[120px] pt-[20px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt={photoAlt}
          className="max-h-[440px] w-auto object-contain drop-shadow-2xl"
        />
      </div>
      <div className="absolute inset-x-[40px] bottom-[30px] rounded-[10px] bg-neutral-800/45 p-[20px] backdrop-blur-sm">
        <p className="text-title-20 font-bold text-white">{card.title}</p>
        <p className="mt-[8px] text-small-14 leading-[18px] text-white/90">
          {card.body}
        </p>
        {card.footer && <div className="mt-[15px]">{card.footer}</div>}
      </div>
    </motion.div>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] gap-[24px] px-[24px] py-[50px] xl:px-[120px]">
      {children}
    </div>
  );
}
