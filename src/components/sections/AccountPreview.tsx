"use client";

import Link from "next/link";
import { PawPrint } from "@phosphor-icons/react";
import { FadeIn } from "@/components/ui/motion";

/**
 * My Account preview — Figma "Species" band: full-width lavender strip,
 * cutout pet photo on the left, copy + CTA on the right, paw ornaments.
 */
export default function AccountPreview() {
  return (
    <section className="relative overflow-hidden bg-purple-5">
      <PawPrint
        size={220}
        weight="fill"
        aria-hidden
        className="absolute -right-[40px] top-[20px] rotate-[25deg] text-purple-4/70"
      />
      <PawPrint
        size={140}
        weight="fill"
        aria-hidden
        className="absolute bottom-[30px] right-[240px] -rotate-[15deg] text-purple-4/50"
      />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col items-center gap-[40px] px-[24px] py-[60px] lg:flex-row lg:gap-[80px] xl:px-[120px]">
        <FadeIn className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/species-pet.png"
            alt="Chihuahua in a cozy hoodie"
            className="h-[380px] w-auto object-contain drop-shadow-xl"
          />
        </FadeIn>

        <FadeIn delay={0.15} className="flex max-w-[620px] flex-col gap-[15px]">
          <h2 className="text-header-28 font-bold uppercase text-purple-3">
            My Account
          </h2>
          <p className="text-content-18 leading-[24px] text-neutral-700">
            Your pets, your reports, your listings — all in one dashboard.
            Manage your profile, keep your pets&apos; details up to date and
            track the status of every lost report, adoption listing and
            breeding request you publish.
          </p>
          <Link href="/account" className="btn-primary w-fit">
            Go to My Account now
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
