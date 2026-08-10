"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";
import Pagination from "@/components/ui/Pagination";
import LostPetCard from "@/components/cards/LostPetCard";
import { StaggerGrid, StaggerItem } from "@/components/ui/motion";
import { CITIES, LOST_PETS, PET_TYPES } from "@/data/content";

const PER_PAGE = 6;

export default function LostFoundPage() {
  const [type, setType] = useState("All");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  const pets = useMemo(() => {
    return LOST_PETS.filter(
      (p) =>
        (type === "All" || p.type === type) &&
        (!filters.city || p.city === filters.city)
    );
  }, [type, filters]);

  const totalPages = Math.ceil(pets.length / PER_PAGE);
  const visible = pets.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <PageHeader
        title="Lost & Found"
        description="Browse active lost-pet reports in your city, or publish your own in minutes. Every report includes photos, a last-seen location and direct phone numbers."
      >
        <Link href="/lost-found/report" className="btn-primary mt-[10px]">
          Report a Lost Pet
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

        <AnimatePresence mode="wait">
          <motion.div
            key={`${type}-${filters.city}-${page}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {visible.length > 0 ? (
              <StaggerGrid className="mt-[30px] grid grid-cols-1 gap-[24px] sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((pet) => (
                  <StaggerItem key={pet.id}>
                    <LostPetCard pet={pet} />
                  </StaggerItem>
                ))}
              </StaggerGrid>
            ) : (
              <div className="mt-[30px] flex flex-col items-center gap-[15px] rounded-card bg-purple-5/50 p-[60px] text-center">
                <p className="text-title-20 font-bold text-purple-3">
                  No reports match your filters
                </p>
                <p className="text-content-18 text-neutral-700">
                  Try a different pet type or city — or be the hero who posts a
                  found pet.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-[40px]">
          <Pagination page={page} total={totalPages} onChange={setPage} />
        </div>
      </section>
    </>
  );
}
