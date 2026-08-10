"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";
import Pagination from "@/components/ui/Pagination";
import AdoptionCard from "@/components/cards/AdoptionCard";
import { StaggerGrid, StaggerItem } from "@/components/ui/motion";
import { ADOPTION_PETS, CITIES, PET_TYPES } from "@/data/content";

const PER_PAGE = 6;
const AGE_GROUPS = ["Baby", "Young", "Adult", "Senior"] as const;
const VACCINATION = ["Vaccinated", "Not vaccinated"] as const;

export default function AdoptionPage() {
  const [type, setType] = useState("All");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  const pets = useMemo(() => {
    return ADOPTION_PETS.filter(
      (p) =>
        (type === "All" || p.type === type) &&
        (!filters.city || p.city === filters.city) &&
        (!filters.age || p.ageGroup === filters.age) &&
        (!filters.vaccination ||
          (filters.vaccination === "Vaccinated") === p.vaccinated)
    );
  }, [type, filters]);

  const totalPages = Math.ceil(pets.length / PER_PAGE);
  const visible = pets.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <PageHeader
        title="Adoption"
        description="Pet-friendly homes start here. Browse pets waiting for a family — with health, vaccination and temperament details on every card — or publish your own adoption listing."
      >
        <Link href="/adoption/publish" className="btn-primary mt-[10px]">
          Publish an Adoption Listing
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
          selects={[
            { key: "age", label: "Age", options: AGE_GROUPS },
            { key: "vaccination", label: "Vaccination Status", options: VACCINATION },
            { key: "city", label: "City", options: CITIES },
          ]}
          values={filters}
          onSelect={(k, v) => {
            setFilters((f) => ({ ...f, [k]: v }));
            setPage(1);
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={`${type}-${JSON.stringify(filters)}-${page}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {visible.length > 0 ? (
              <StaggerGrid className="mt-[30px] grid grid-cols-1 gap-[24px] sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((pet) => (
                  <StaggerItem key={pet.id}>
                    <AdoptionCard pet={pet} />
                  </StaggerItem>
                ))}
              </StaggerGrid>
            ) : (
              <div className="mt-[30px] flex flex-col items-center gap-[15px] rounded-card bg-purple-5/50 p-[60px] text-center">
                <p className="text-title-20 font-bold text-purple-3">
                  No pets match your filters
                </p>
                <p className="text-content-18 text-neutral-700">
                  Try widening your search — new pets are listed every day.
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
