"use client";

import Link from "next/link";
import { MapPin } from "@phosphor-icons/react";
import SectionTitle from "@/components/ui/SectionTitle";
import { FadeIn } from "@/components/ui/motion";
import { LOST_PETS } from "@/data/content";

/**
 * Lost & Found preview — layout of Figma frame PetShop04 ("Our Company"):
 * left copy + two tinted mini cards, right photo on a lilac circle
 * with concentric outline rings.
 */

const TINTS = ["bg-green-6", "bg-purple-5"];

export default function LostFoundPreview() {
  const featured = LOST_PETS.slice(0, 2);

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col items-center gap-[50px] px-[24px] py-[80px] lg:h-[736px] lg:flex-row lg:gap-0 lg:py-0 xl:px-[120px]">
        {/* Copy + mini cards */}
        <FadeIn className="relative z-10 flex w-full max-w-[590px] flex-col gap-[15px]">
          <SectionTitle>Lost &amp; Found</SectionTitle>
          <p className="text-content-18 leading-[24px] text-neutral-700">
            Losing a pet is terrifying — finding one shouldn&apos;t be. Helpet
            broadcasts your report to thousands of pet lovers in your city
            within minutes. Browse active reports below or publish your own
            with photos, last-seen location and direct contact numbers.
          </p>

          <div className="mt-[10px] grid grid-cols-1 gap-[20px] sm:grid-cols-2">
            {featured.map((pet, i) => (
              <div
                key={pet.id}
                className={`relative flex flex-col gap-[8px] overflow-hidden rounded-card p-[15px] ${TINTS[i]}`}
              >
                <p className="text-content-18 font-bold text-neutral-800">
                  {pet.name} — {pet.breed}
                </p>
                <p className="flex items-start gap-[5px] text-small-14 text-neutral-700">
                  <MapPin size={14} className="mt-[2px] shrink-0 text-purple-3" />
                  {pet.lastSeen}
                </p>
                <Link
                  href="/lost-found"
                  className="mt-[6px] inline-flex w-fit items-center rounded-btn bg-purple-3 px-[15px] py-[6px] text-small-14 font-semibold text-white transition-colors hover:bg-purple-2"
                >
                  View report
                </Link>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pet.photo}
                  alt={pet.name}
                  className="absolute -bottom-[8px] -right-[8px] h-[92px] w-auto object-contain"
                />
              </div>
            ))}
          </div>

          <div className="mt-[15px] flex flex-wrap gap-[15px]">
            <Link href="/lost-found" className="btn-primary">
              Browse lost pets
            </Link>
            <Link href="/lost-found/report" className="btn-outline">
              Report a lost pet
            </Link>
          </div>
        </FadeIn>

        {/* Circle composition (nodes 28:168–28:172) */}
        <FadeIn
          delay={0.15}
          className="relative hidden h-[736px] flex-1 lg:block"
        >
          <div
            aria-hidden
            className="absolute right-[-240px] top-[11px] size-[697px] rounded-full border-[11px] border-neutral-200"
          />
          <div
            aria-hidden
            className="absolute right-[-130px] top-[47px] size-[626px] rounded-full border-[11px] border-neutral-200"
          />
          <div
            aria-hidden
            className="absolute right-[-166px] top-[83px] size-[554px] rounded-full border-[11px] border-neutral-200"
          />
          <div
            aria-hidden
            className="absolute right-[-120px] top-[128px] size-[697px] rounded-full bg-purple-4"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/company-dog.png"
            alt="Dog reunited with its family"
            className="absolute bottom-0 right-[-40px] h-[700px] w-auto object-contain object-bottom"
          />
        </FadeIn>
      </div>
    </section>
  );
}
