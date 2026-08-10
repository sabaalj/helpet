"use client";

import SectionTitle from "@/components/ui/SectionTitle";
import { FadeIn, StaggerGrid, StaggerItem } from "@/components/ui/motion";
import NewsCard from "@/components/cards/NewsCard";
import { NEWS } from "@/data/content";

/** Pet News — Figma Blog "Recommended articles you may like" pattern. */
export default function PetNews() {
  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-[24px] py-[80px] xl:px-[120px]">
        <FadeIn>
          <SectionTitle>Pet News</SectionTitle>
          <p className="mt-[10px] max-w-[700px] text-content-18 text-neutral-700">
            Guides, stories and seasonal advice from the Helpet community —
            written for people who love their pets.
          </p>
        </FadeIn>

        <StaggerGrid className="mt-[30px] grid grid-cols-1 gap-[24px] md:grid-cols-3">
          {NEWS.map((a) => (
            <StaggerItem key={a.id}>
              <NewsCard article={a} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
