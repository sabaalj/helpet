"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Cat, Dog, PawPrint, Star } from "@phosphor-icons/react";

/**
 * Hero — replica of Figma frame PetShop05 (node 646:3174):
 * left copy block (24px intro / two-line 36px display / 370px CTA),
 * right arch-masked dog photo with offset ring, lilac cat card,
 * two floating rating mini-cards and rotated dog/cat chips.
 */

function MiniCard({
  name,
  photo,
  className,
  delay,
}: {
  name: string;
  photo: string;
  className?: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute flex items-center justify-center gap-[10px] rounded-[15px] bg-white p-[10px] drop-shadow-[0px_4px_20px_rgba(0,0,0,0.1)] ${className}`}
    >
      <div className="flex flex-col items-end gap-[5px]">
        <p className="text-content-18 text-purple-3">{name}</p>
        <span className="h-[5px] w-[111px] rounded-full bg-purple-3" />
        <span className="h-[5px] w-[50px] rounded-full bg-purple-3" />
        <span className="flex items-center gap-[5px]">
          <span className="text-desc-12 text-purple-2">1k+</span>
          <Star size={10} weight="fill" className="text-yellow" />
        </span>
      </div>
      <div className="size-[80px] overflow-hidden rounded-[10px] bg-purple-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt={name} className="size-full object-cover" />
      </div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Soft lavender backdrop vector from the design */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/hero-backdrop.svg"
        alt=""
        aria-hidden
        className="absolute left-0 top-0 h-[808px] w-full object-cover"
      />
      <div
        aria-hidden
        className="absolute -right-[10%] -top-[30%] size-[900px] rounded-full bg-purple-5/60 blur-[2px]"
      />

      <div className="relative mx-auto flex min-h-[904px] w-full max-w-[1440px] flex-col justify-center gap-[60px] px-[24px] py-[60px] lg:flex-row lg:items-center lg:gap-0 xl:px-[120px]">
        {/* ── Copy block ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex max-w-[470px] flex-col gap-[20px]"
        >
          <PawPrint
            size={54}
            weight="fill"
            className="rotate-90 text-purple-4"
            aria-hidden
          />
          <p className="max-w-[386px] text-display-24 leading-[30px] text-neutral-700">
            Welcome to Helpet — the home for lost &amp; found reports, adoption
            and breeding requests
          </p>
          <div>
            <h1 className="text-[64px] font-bold uppercase leading-[64px] text-purple-3">
              Helpet
            </h1>
            <p className="mt-[5px] text-display-36 font-bold uppercase text-green-5">
              Everything your pet needs.
            </p>
          </div>
          <Link
            href="/lost-found/report"
            className="btn-primary w-full max-w-[370px] font-semibold"
          >
            Report or find a pet in minutes
          </Link>
        </motion.div>

        {/* ── Visual composition ───────────────────── */}
        <div className="relative mx-auto h-[640px] w-full max-w-[620px] shrink-0 lg:mx-0">
          {/* Arch ring outline (Stroke node 646:3190) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            aria-hidden
            className="absolute left-[30px] top-[26px] hidden h-[596px] w-[440px] rounded-t-[999px] border-[2px] border-purple-3/50 sm:block"
          />
          {/* Arch-masked dog photo (Mask group 646:3192) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-[46px] flex h-[594px] w-[460px] items-end justify-center overflow-hidden rounded-t-[999px] bg-purple-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/hero-dog.png"
              alt="Happy dog waiting to be found"
              className="h-[105%] w-full object-cover object-top"
            />
          </motion.div>

          {/* Lilac square + cat photo (nodes 646:3196 / image 2) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-[10px] right-[10px] hidden md:block"
          >
            <div className="absolute -bottom-[16px] -right-[16px] size-[254px] rounded-[15px] bg-purple-4" />
            <div className="relative size-[254px] overflow-hidden rounded-[15px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/hero-card-pet.png"
                alt="Ginger cat looking for a home"
                className="size-full object-cover"
              />
            </div>
          </motion.div>

          {/* Floating rating mini cards (nodes 646:3200 / 646:3201) */}
          <MiniCard
            name="Mark"
            photo="/assets/hero-avatar-1.png"
            className="left-[calc(50%-40px)] top-[64px]"
            delay={0.6}
          />
          <MiniCard
            name="Tiny"
            photo="/assets/hero-avatar-2.png"
            className="bottom-[64px] left-[8px]"
            delay={0.75}
          />

          {/* Rotated icon chips (nodes 855:7875 / 855:7877) */}
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: 31 }}
            transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
            className="absolute right-[40px] top-[90px] flex size-[40px] items-center justify-center rounded-full bg-green-4 text-white"
          >
            <Dog size={18} weight="bold" />
          </motion.span>
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: -27 }}
            transition={{ delay: 1.05, type: "spring", stiffness: 200 }}
            className="absolute left-[calc(50%-25px)] top-[calc(50%+31px)] flex size-[50px] items-center justify-center rounded-full bg-red-2 text-white"
          >
            <Cat size={22} weight="bold" />
          </motion.span>
        </div>
      </div>
    </section>
  );
}
