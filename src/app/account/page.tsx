"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowsClockwise,
  ClipboardText,
  Envelope,
  IdentificationCard,
  MapPin,
  PawPrint,
  Pencil,
  Phone,
  Plus,
  SignOut,
  Trash,
  User,
  UserCircle,
} from "@phosphor-icons/react";
import {
  MY_LISTINGS,
  MY_PETS,
  PROFILE,
  type ListingStatus,
  type MyListing,
} from "@/data/content";
import { cn } from "@/lib/utils";

/**
 * My Account — Figma "Profile - My Account & Pet" frame: left sidebar
 * with avatar + menu, top tab bar (active tab white with purple rule),
 * white content cards with purple headings and Edit actions.
 */

type Tab = "profile" | "pets" | "listings";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "Profile", icon: <UserCircle size={20} /> },
  { id: "pets", label: "My Pets", icon: <PawPrint size={20} /> },
  { id: "listings", label: "My Listings", icon: <ClipboardText size={20} /> },
];

const STATUS_STYLE: Record<ListingStatus, string> = {
  Active: "bg-green-6 text-green-3",
  Pending: "bg-yellow/20 text-[#8a6d00]",
  Closed: "bg-red-2/10 text-red-2",
};

function StatusChip({ status }: { status: ListingStatus }) {
  return (
    <span
      className={cn(
        "rounded-full px-[12px] py-[4px] text-desc-12 font-bold",
        STATUS_STYLE[status]
      )}
    >
      {status}
    </span>
  );
}

function ListingRow({ item }: { item: MyListing }) {
  return (
    <div className="flex flex-wrap items-center gap-[15px] border-b border-purple-5 py-[15px] last:border-0">
      <div className="flex size-[54px] items-center justify-center overflow-hidden rounded-card bg-purple-5/60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.photo} alt="" className="size-full object-contain" />
      </div>
      <div className="min-w-[180px] flex-1">
        <p className="text-content-18 font-bold text-neutral-800">{item.title}</p>
        <p className="text-small-14 text-neutral-600">{item.meta}</p>
      </div>
      <StatusChip status={item.status} />
      <div className="flex gap-[10px]">
        <button className="flex items-center gap-[6px] rounded-btn border border-purple-3 px-[15px] py-[6px] text-small-14 font-semibold text-purple-3 transition-colors hover:bg-purple-5">
          <Pencil size={15} /> Edit
        </button>
        <button className="flex items-center gap-[6px] rounded-btn border border-red-2 px-[15px] py-[6px] text-small-14 font-semibold text-red-2 transition-colors hover:bg-red-2/10">
          <Trash size={15} /> Delete
        </button>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const [tab, setTab] = useState<Tab>("profile");

  return (
    <div className="bg-purple-5/40">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[30px] px-[24px] py-[40px] lg:flex-row xl:px-[120px]">
        {/* ── Sidebar ─────────────────────────────── */}
        <aside className="w-full shrink-0 lg:w-[285px]">
          <div className="flex items-center gap-[12px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PROFILE.avatar}
              alt={PROFILE.name}
              className="size-[54px] rounded-full border-2 border-purple-4 object-cover"
            />
            <div className="flex-1">
              <p className="text-title-20 font-bold text-neutral-800">
                {PROFILE.name}
              </p>
              <p className="text-small-14 text-neutral-600">
                Dashboard <span className="font-semibold text-purple-1">User</span>
              </p>
            </div>
            <ArrowsClockwise size={20} className="text-purple-1" />
          </div>

          <nav className="mt-[25px] flex flex-col">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-[12px] border-b border-purple-4/40 px-[10px] py-[16px] text-content-18 font-bold transition-colors",
                  tab === t.id
                    ? "text-purple-3"
                    : "text-neutral-700 hover:text-purple-3"
                )}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
            <Link
              href="/login"
              className="flex items-center gap-[12px] px-[10px] py-[16px] text-content-18 font-bold text-neutral-700 transition-colors hover:text-red-2"
            >
              <SignOut size={20} />
              Log out
            </Link>
          </nav>
        </aside>

        {/* ── Content ─────────────────────────────── */}
        <div className="flex-1">
          {/* Tab bar (Figma: active tab white + purple rule) */}
          <div className="flex overflow-hidden rounded-t-card bg-neutral-800/[0.04]">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative flex flex-1 items-center justify-center gap-[8px] py-[18px] text-content-18 font-bold transition-colors",
                  tab === t.id
                    ? "bg-white text-purple-3"
                    : "text-neutral-300 hover:text-neutral-700"
                )}
              >
                {t.icon}
                <span className="hidden sm:inline">{t.label}</span>
                {tab === t.id && (
                  <motion.span
                    layoutId="account-tab-rule"
                    className="absolute inset-x-0 bottom-0 h-[3px] bg-purple-3"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="rounded-b-card bg-white p-[25px] shadow-card">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {/* Profile */}
                {tab === "profile" && (
                  <div className="flex flex-col gap-[20px]">
                    <div className="rounded-card border border-purple-4/50 p-[25px]">
                      <div className="flex items-center justify-between">
                        <h2 className="text-title-20 font-bold text-purple-2">
                          Information
                        </h2>
                        <button className="flex items-center gap-[6px] rounded-btn border border-purple-4 px-[15px] py-[6px] text-small-14 font-semibold text-purple-1 transition-colors hover:bg-purple-5">
                          Edit <Pencil size={15} />
                        </button>
                      </div>
                      <div className="mt-[20px] grid grid-cols-1 gap-y-[20px] sm:grid-cols-2">
                        <div>
                          <p className="flex items-center gap-[8px] text-small-14 text-neutral-600">
                            <IdentificationCard size={18} /> Full name
                          </p>
                          <p className="mt-[5px] text-content-18 text-neutral-800">
                            {PROFILE.name}
                          </p>
                        </div>
                        <div>
                          <p className="flex items-center gap-[8px] text-small-14 text-neutral-600">
                            <Envelope size={18} /> Email
                          </p>
                          <p className="mt-[5px] text-content-18 text-neutral-800">
                            {PROFILE.email}
                          </p>
                        </div>
                        <div>
                          <p className="flex items-center gap-[8px] text-small-14 text-neutral-600">
                            <Phone size={18} /> Phone number
                          </p>
                          <p className="mt-[5px] text-content-18 text-neutral-800">
                            {PROFILE.phone}
                          </p>
                        </div>
                        <div>
                          <p className="flex items-center gap-[8px] text-small-14 text-neutral-600">
                            <MapPin size={18} /> City
                          </p>
                          <p className="mt-[5px] text-content-18 text-neutral-800">
                            Riyadh
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-card border border-purple-4/50 p-[25px]">
                      <h2 className="text-title-20 font-bold text-purple-2">
                        Activity
                      </h2>
                      <div className="mt-[15px] grid grid-cols-3 gap-[15px] text-center">
                        {[
                          { v: MY_LISTINGS.lost.length, l: "Lost reports" },
                          { v: MY_LISTINGS.adoption.length, l: "Adoption listings" },
                          { v: MY_LISTINGS.breeding.length, l: "Breeding requests" },
                        ].map((s) => (
                          <div
                            key={s.l}
                            className="rounded-card bg-purple-5/60 py-[18px]"
                          >
                            <p className="text-header-28 font-bold text-purple-3">
                              {s.v}
                            </p>
                            <p className="text-small-14 text-neutral-700">{s.l}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* My Pets */}
                {tab === "pets" && (
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-[15px]">
                      <h2 className="text-title-20 font-bold text-purple-2">
                        My Pets
                      </h2>
                      <div className="flex gap-[10px]">
                        <button className="flex items-center gap-[6px] rounded-btn border border-purple-4 px-[15px] py-[8px] text-small-14 font-semibold text-purple-1 transition-colors hover:bg-purple-5">
                          Add Another Pet <Plus size={15} weight="bold" />
                        </button>
                        <button className="flex items-center gap-[6px] rounded-btn border border-purple-4 px-[15px] py-[8px] text-small-14 font-semibold text-purple-1 transition-colors hover:bg-purple-5">
                          Update Pet <Pencil size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-[20px] grid grid-cols-1 gap-[20px] sm:grid-cols-2 xl:grid-cols-3">
                      {MY_PETS.map((pet) => (
                        <div
                          key={pet.id}
                          className="flex flex-col gap-[12px] rounded-card border border-purple-4/50 p-[15px] transition-shadow hover:shadow-card"
                        >
                          <div className="flex h-[140px] items-center justify-center overflow-hidden rounded-card bg-purple-5/60">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={pet.photo}
                              alt={pet.name}
                              className="h-[90%] w-auto object-contain"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-content-18 font-bold text-neutral-800">
                              {pet.name}
                            </p>
                            <span className="flex items-center gap-[5px] rounded-full bg-purple-5 px-[10px] py-[3px] text-desc-12 font-semibold text-purple-3">
                              <PawPrint size={12} weight="fill" />
                              {pet.type}
                            </span>
                          </div>
                          <p className="text-small-14 text-neutral-700">
                            {pet.breed} · {pet.age}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* My Listings */}
                {tab === "listings" && (
                  <div className="flex flex-col gap-[30px]">
                    {(
                      [
                        ["Lost Pets", MY_LISTINGS.lost],
                        ["Adoption Listings", MY_LISTINGS.adoption],
                        ["Breeding Requests", MY_LISTINGS.breeding],
                      ] as const
                    ).map(([title, items]) => (
                      <div key={title}>
                        <h2 className="flex items-center gap-[8px] text-title-20 font-bold text-purple-2">
                          <User size={20} className="hidden" />
                          {title}
                          <span className="rounded-full bg-purple-5 px-[10px] py-[2px] text-desc-12 font-bold text-purple-3">
                            {items.length}
                          </span>
                        </h2>
                        <div className="mt-[5px]">
                          {items.length > 0 ? (
                            items.map((item) => (
                              <ListingRow key={item.id} item={item} />
                            ))
                          ) : (
                            <p className="py-[15px] text-small-14 text-neutral-600">
                              Nothing here yet.
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
