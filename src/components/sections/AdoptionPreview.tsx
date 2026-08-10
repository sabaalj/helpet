"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import { FadeIn, StaggerGrid, StaggerItem } from "@/components/ui/motion";
import AdoptionCard from "@/components/cards/AdoptionCard";
import { ADOPTION_PETS, PET_TYPES } from "@/data/content";
import { cn } from "@/lib/utils";

/**
 * Adoption preview — Figma "Discovery" section: title + pill tabs
 * (Dogs / Cats / Hamsters / Birds) and a 4-card grid.
 */
export default function AdoptionPreview() {
  const [tab, setTab] = useState<string>("All");
  const tabs = ["All", ...PET_TYPES.map((t) => `${t}s`)];

  const pets =
    tab === "All"
      ? ADOPTION_PETS.slice(0, 4)
      : ADOPTION_PETS.filter((p) => `${p.type}s` === tab).slice(0, 4);

  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-[24px] py-[80px] xl:px-[120px]">
        <FadeIn>
          <SectionTitle>Adoption</SectionTitle>
          <p className="mt-[10px] max-w-[700px] text-content-18 text-neutral-700">
            Discover pets on our site! Learn about their care and find your
            perfect companion — every listing includes health and vaccination
            details.
          </p>
        </FadeIn>

        {/* Pill tabs (Figma field-tab component) */}
        <FadeIn delay={0.1} className="mt-[30px] flex flex-wrap gap-[15px]">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-btn border px-[25px] py-[8px] text-small-14 font-semibold transition-all duration-300",
                tab === t
                  ? "border-purple-3 bg-purple-3 text-white"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-purple-3 hover:text-purple-3"
              )}
            >
              {t}
            </button>
          ))}
        </FadeIn>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            {pets.length > 0 ? (
              <StaggerGrid className="mt-[30px] grid grid-cols-1 gap-[24px] sm:grid-cols-2 xl:grid-cols-4">
                {pets.map((pet) => (
                  <StaggerItem key={pet.id}>
                    <AdoptionCard pet={pet} />
                  </StaggerItem>
                ))}
              </StaggerGrid>
            ) : (
              <p className="mt-[40px] rounded-card bg-purple-5/50 p-[30px] text-center text-content-18 text-neutral-700">
                No {tab.toLowerCase()} available for adoption right now — check
                back soon!
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        <FadeIn className="mt-[40px] flex justify-center">
          <Link href="/adoption" className="btn-outline">
            View all pets for adoption
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
