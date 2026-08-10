"use client";

import SectionTitle from "@/components/ui/SectionTitle";
import { FadeIn, StaggerGrid, StaggerItem } from "@/components/ui/motion";
import TestimonialCard from "@/components/cards/TestimonialCard";
import { TESTIMONIALS } from "@/data/content";

/** Testimonials — white cards with stars/avatars in the design's card language. */
export default function Testimonials() {
  return (
    <section className="bg-purple-5/40">
      <div className="mx-auto w-full max-w-[1440px] px-[24px] py-[80px] xl:px-[120px]">
        <FadeIn className="flex flex-col items-center text-center">
          <SectionTitle center>Testimonials</SectionTitle>
          <p className="mt-[10px] max-w-[700px] text-content-18 text-neutral-700">
            Thousands of happy reunions, adoptions and matches. Here is what
            the Helpet community says.
          </p>
        </FadeIn>

        <StaggerGrid className="mt-[30px] grid grid-cols-1 gap-[24px] md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <StaggerItem key={t.id}>
              <TestimonialCard t={t} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
