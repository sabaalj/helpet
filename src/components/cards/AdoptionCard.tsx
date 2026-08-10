"use client";

import {
  Heart,
  MapPin,
  PawPrint,
  ShieldCheck,
  FirstAid,
} from "@phosphor-icons/react";
import type { AdoptionPet } from "@/data/content";
import PetPhoto from "./PetPhoto";
import { cn } from "@/lib/utils";

export default function AdoptionCard({ pet }: { pet: AdoptionPet }) {
  return (
    <article className="flex h-full flex-col gap-[15px] rounded-card border border-purple-4/60 bg-white p-[15px] shadow-card transition-shadow hover:shadow-panel">
      <div className="relative">
        <PetPhoto src={pet.photo} alt={`${pet.name} — ${pet.breed} for adoption`} />
        <span
          className={cn(
            "absolute left-[10px] top-[10px] flex items-center gap-[4px] rounded-btn px-[10px] py-[4px] text-desc-12 font-bold",
            pet.vaccinated
              ? "bg-green-6 text-green-3"
              : "bg-yellow/20 text-[#8a6d00]"
          )}
        >
          <ShieldCheck size={13} weight="fill" />
          {pet.vaccinated ? "Vaccinated" : "Needs vaccines"}
        </span>
        <button
          aria-label="Save to favorites"
          className="absolute right-[10px] top-[10px] flex size-[32px] items-center justify-center rounded-full bg-white text-red-2 shadow-chip transition-transform hover:scale-110"
        >
          <Heart size={18} />
        </button>
      </div>

      <div className="flex items-center justify-between gap-[10px]">
        <h3 className="text-title-20 font-bold uppercase text-neutral-800">
          {pet.name}
        </h3>
        <span className="flex items-center gap-[5px] rounded-full bg-purple-5 px-[10px] py-[4px] text-desc-12 font-semibold text-purple-3">
          <PawPrint size={12} weight="fill" />
          {pet.type}
        </span>
      </div>

      <p className="text-small-14 text-neutral-700">
        {pet.breed} · {pet.age}
      </p>

      <p className="flex items-start gap-[6px] text-small-14 text-neutral-700">
        <FirstAid size={16} className="mt-[1px] shrink-0 text-purple-3" />
        <span>
          <span className="font-semibold text-neutral-800">Health: </span>
          {pet.health}
        </span>
      </p>

      <p className="flex items-center gap-[6px] text-small-14 text-neutral-700">
        <MapPin size={16} className="shrink-0 text-purple-3" />
        {pet.city}
      </p>

      <div>
        <p className="text-content-18 font-bold text-neutral-800">Description</p>
        <p className="mt-[5px] line-clamp-3 text-small-14 leading-[18px] text-neutral-700">
          {pet.description}
        </p>
      </div>

      <a
        href={`tel:${pet.phone.replace(/\s/g, "")}`}
        className="btn-primary mt-auto w-full"
      >
        Contact Publisher
      </a>
    </article>
  );
}
