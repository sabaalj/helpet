"use client";

import Link from "next/link";
import SectionTitle from "@/components/ui/SectionTitle";
import { FadeIn, StaggerGrid, StaggerItem } from "@/components/ui/motion";
import BreedingCard from "@/components/cards/BreedingCard";
import { BREEDING_REQUESTS } from "@/data/content";

/**
 * Breeding requests preview — Figma "Pet Food / Pet Toy" product-row
 * pattern: section title, 4-card row, tinted section background.
 */
export default function BreedingPreview() {
  return (
    <section className="bg-purple-5/40">
      <div className="mx-auto w-full max-w-[1440px] px-[24px] py-[80px] xl:px-[120px]">
        <FadeIn className="flex flex-wrap items-end justify-between gap-[20px]">
          <div>
            <SectionTitle>Breeding Requests</SectionTitle>
            <p className="mt-[10px] max-w-[700px] text-content-18 text-neutral-700">
              Find a healthy, verified match for your pet. Every request lists
              age, gender and health details so you can connect with
              responsible owners.
            </p>
          </div>
          <Link href="/breeding" className="btn-outline shrink-0">
            View all requests
          </Link>
        </FadeIn>

        <StaggerGrid className="mt-[30px] grid grid-cols-1 gap-[24px] sm:grid-cols-2 xl:grid-cols-4">
          {BREEDING_REQUESTS.map((req) => (
            <StaggerItem key={req.id}>
              <BreedingCard req={req} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
