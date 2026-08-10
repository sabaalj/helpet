"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";
import Pagination from "@/components/ui/Pagination";
import BreedingCard from "@/components/cards/BreedingCard";
import { StaggerGrid, StaggerItem } from "@/components/ui/motion";
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
                {visible.map((req) => (
                  <StaggerItem key={req.id}>
                    <BreedingCard req={req} />
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

        <div className="mt-[40px]">
          <Pagination page={page} total={totalPages} onChange={setPage} />
        </div>
      </section>
    </>
  );
}
