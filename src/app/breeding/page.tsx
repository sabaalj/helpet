"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";
import Pagination from "@/components/ui/Pagination";
import BreedingCard from "@/components/cards/BreedingCard";
import { FadeIn, StaggerGrid, StaggerItem } from "@/components/ui/motion";
import PawTrail from "@/components/decor/PawTrail";
import { BREEDING_REQUESTS, CITIES, PET_TYPES } from "@/data/content";

const PER_PAGE = 6;

export default function BreedingPage() {
  const [type, setType] = useState("All");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  const reqs = useMemo(() => {
    return BREEDING_REQUESTS.filter(
      (r) =>
        (type === "All" || r.type === type) &&
        (!filters.city || r.city === filters.city)
    );
  }, [type, filters]);

  const totalPages = Math.ceil(reqs.length / PER_PAGE);
  const visible = reqs.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <PageHeader
        title="Breeding Requests"
        description="Connect with responsible owners looking for healthy, verified breeding matches. Browse open requests or create one for your pet with full health details."
      >
        <Link href="/breeding/create" className="btn-primary mt-[10px]">
          Create a Breeding Request
        </Link>
      </PageHeader>

      <section className="mx-auto w-full max-w-[1440px] px-[24px] py-[50px] xl:px-[120px]">
        <FilterBar
          typeTabs={PET_TYPES}
          activeType={type}
          onType={(t) => {
            setType(t);
            setPage(1);
          }}
          selects={[{ key: "city", label: "City", options: CITIES }]}
          values={filters}
          onSelect={(k, v) => {
            setFilters((f) => ({ ...f, [k]: v }));
            setPage(1);
          }}
        />

        <div className="relative">
          <PawTrail variant="trail" />

          <AnimatePresence mode="wait">
            <motion.div
              key={`${type}-${filters.city}-${page}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {visible.length > 0 ? (
                <StaggerGrid className="mt-[30px] grid grid-cols-1 gap-[24px] sm:grid-cols-2 xl:grid-cols-3">
                  {visible.map((req) => (
                    <StaggerItem key={req.id}>
                      <BreedingCard req={req} animalIcon />
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              ) : (
                <div className="mt-[30px] flex flex-col items-center gap-[15px] rounded-card bg-purple-5/50 p-[60px] text-center">
                  <p className="text-title-20 font-bold text-purple-3">
                    No requests match your filters
                  </p>
                  <p className="text-content-18 text-neutral-700">
                    Try another pet type or city — or create the first request.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="relative mt-[40px]">
            <Pagination page={page} total={totalPages} onChange={setPage} />
          </div>
        </div>
      </section>

      {/* Care & wellness band — cat portrait sitting directly on the green banner, no frame */}
      <section className="relative bg-green-6">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col-reverse items-center gap-[24px] px-[24px] pt-[60px] pb-[60px] text-center lg:flex-row lg:items-end lg:justify-between lg:gap-[40px] lg:pb-0 lg:text-left xl:px-[120px]">
          <FadeIn className="flex max-w-[620px] flex-col items-center gap-[15px] lg:items-start lg:pb-[60px]">
            <h2 className="text-header-28 font-bold uppercase text-green-3">
              Health First, Always
            </h2>
            <p className="text-content-18 leading-[24px] text-neutral-700">
              Every breeding request on Helpet is encouraged to include health
              tests, vaccination records and pedigree details — so matches are
              safe for both pets and give their future litters the best start.
            </p>
          </FadeIn>

          <FadeIn
            delay={0.15}
            className="w-[210px] shrink-0 sm:w-[250px] lg:w-[300px] lg:-mb-[24px] xl:w-[340px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/breeding/cat-peek.png"
              alt="A cat peeking curiously"
              className="h-auto w-full object-contain"
            />
          </FadeIn>
        </div>
      </section>
    </>
  );
}
