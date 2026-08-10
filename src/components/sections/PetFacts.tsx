"use client";

import SectionTitle from "@/components/ui/SectionTitle";
import { FadeIn } from "@/components/ui/motion";
import { PET_FACTS } from "@/data/content";
import { cn } from "@/lib/utils";

/**
 * Pet Facts — Figma "What we offer" layout: centered group photo of dogs
 * with numbered items on both sides (purple circles left, red right).
 */

function Fact({
  n,
  title,
  text,
  side,
}: {
  n: number;
  title: string;
  text: string;
  side: "left" | "right";
}) {
  const purple = side === "left";
  return (
    <FadeIn
      delay={n * 0.06}
      className={cn(
        "flex max-w-[320px] items-start gap-[15px]",
        side === "left" ? "lg:flex-row-reverse lg:text-right" : ""
      )}
    >
      <span
        className={cn(
          "flex size-[44px] shrink-0 items-center justify-center rounded-full text-content-18 font-bold text-white",
          purple ? "bg-purple-3" : "bg-red-2"
        )}
      >
        {n}
      </span>
      <div>
        <p className="text-title-20 font-bold uppercase text-neutral-800">
          {title}
        </p>
        <p className="mt-[5px] text-small-14 leading-[18px] text-neutral-700">
          {text}
        </p>
      </div>
    </FadeIn>
  );
}

export default function PetFacts() {
  const left = PET_FACTS.slice(0, 3);
  const right = PET_FACTS.slice(3);

  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-[24px] py-[80px] xl:px-[120px]">
        <FadeIn className="flex flex-col items-center text-center">
          <SectionTitle center>Pet Facts</SectionTitle>
          <p className="mt-[10px] max-w-[760px] text-content-18 text-neutral-700">
            The more you understand your companion, the better you can care for
            them. Six little facts our community loves to share about the pets
            of Helpet.
          </p>
        </FadeIn>

        <div className="mt-[50px] flex flex-col items-center gap-[40px] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-[40px] lg:items-end">
            {left.map((f) => (
              <Fact key={f.n} {...f} side="left" />
            ))}
          </div>

          <FadeIn delay={0.2} className="relative order-first shrink-0 lg:order-none">
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-5"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/offer-dogs.png"
              alt="Group of happy dogs"
              className="relative h-[400px] w-auto max-w-full object-contain"
            />
          </FadeIn>

          <div className="flex flex-col gap-[40px]">
            {right.map((f) => (
              <Fact key={f.n} {...f} side="right" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
