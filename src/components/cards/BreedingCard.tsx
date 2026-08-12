"use client";

import {
  GenderFemale,
  GenderMale,
  Heart,
  MapPin,
  PawPrint,
} from "@phosphor-icons/react";
import type { BreedingRequest } from "@/data/content";
import PetPhoto from "./PetPhoto";
import AnimalTypeBadge from "@/components/decor/AnimalTypeBadge";

export default function BreedingCard({
  req,
  animalIcon = false,
}: {
  req: BreedingRequest;
  /** Opt-in: renders the circular line-art animal-category badge instead
   * of the original generic paw-icon badge. Kept off by default so the
   * homepage's Breeding preview section (which reuses this same card)
   * is unaffected. */
  animalIcon?: boolean;
}) {
  const GenderIcon = req.gender === "Male" ? GenderMale : GenderFemale;
  return (
    <article className="flex h-full flex-col gap-[15px] rounded-card border border-purple-4/60 bg-white p-[15px] shadow-card transition-shadow hover:shadow-panel">
      <div className="relative">
        <PetPhoto src={req.photo} alt={`${req.breed} breeding request`} />
        <span className="absolute left-[10px] top-[10px] rounded-btn bg-purple-3 px-[10px] py-[4px] text-desc-12 font-bold uppercase tracking-[1px] text-white">
          Breeding
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
          {req.breed}
        </h3>
        {animalIcon ? (
          <AnimalTypeBadge type={req.type} />
        ) : (
          <span className="flex items-center gap-[5px] rounded-full bg-purple-5 px-[10px] py-[4px] text-desc-12 font-semibold text-purple-3">
            <PawPrint size={12} weight="fill" />
            {req.type}
          </span>
        )}
      </div>

      <div className="flex items-center gap-[15px] text-small-14 text-neutral-700">
        <span className="flex items-center gap-[5px]">
          <GenderIcon size={16} className="text-purple-3" weight="bold" />
          {req.gender}
        </span>
        <span>{req.age}</span>
        <span className="flex items-center gap-[5px]">
          <MapPin size={16} className="text-purple-3" />
          {req.city}
        </span>
      </div>

      <div>
        <p className="text-content-18 font-bold text-neutral-800">Description</p>
        <p className="mt-[5px] line-clamp-3 text-small-14 leading-[18px] text-neutral-700">
          {req.description}
        </p>
      </div>

      <a
        href={`tel:${req.phone.replace(/\s/g, "")}`}
        className="btn-primary mt-auto w-full"
      >
        Contact Owner
      </a>
    </article>
  );
}
