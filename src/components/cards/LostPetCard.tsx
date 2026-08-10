"use client";

import { Heart, MapPin, Phone, PawPrint } from "@phosphor-icons/react";
import type { LostPet } from "@/data/content";
import PetPhoto from "./PetPhoto";

export default function LostPetCard({ pet }: { pet: LostPet }) {
  return (
    <article className="flex h-full flex-col gap-[15px] rounded-card border border-purple-4/60 bg-white p-[15px] shadow-card transition-shadow hover:shadow-panel">
      <div className="relative">
        <PetPhoto src={pet.photo} alt={`${pet.name} — lost ${pet.breed}`} />
        <span className="absolute left-[10px] top-[10px] rounded-btn bg-red-2 px-[10px] py-[4px] text-desc-12 font-bold uppercase tracking-[1px] text-white">
          Lost
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
        {pet.breed} · {pet.age} · {pet.gender}
      </p>

      <p className="flex items-start gap-[6px] text-small-14 text-neutral-700">
        <MapPin size={16} className="mt-[1px] shrink-0 text-purple-3" />
        <span>
          <span className="font-semibold text-neutral-800">Last seen: </span>
          {pet.lastSeen}, {pet.city}
        </span>
      </p>

      <div>
        <p className="text-content-18 font-bold text-neutral-800">Description</p>
        <p className="mt-[5px] line-clamp-3 text-small-14 leading-[18px] text-neutral-700">
          {pet.description}
        </p>
      </div>

      <div className="mt-auto flex flex-col gap-[6px] border-t border-purple-5 pt-[10px]">
        <a
          href={`tel:${pet.phonePrimary.replace(/\s/g, "")}`}
          className="flex items-center gap-[8px] text-small-14 font-semibold text-neutral-800"
        >
          <Phone size={16} className="text-purple-3" />
          {pet.phonePrimary}
        </a>
        <a
          href={`tel:${pet.phoneSecondary.replace(/\s/g, "")}`}
          className="flex items-center gap-[8px] text-small-14 text-neutral-700"
        >
          <Phone size={16} className="text-purple-4" />
          {pet.phoneSecondary}
        </a>
      </div>

      <a
        href={`tel:${pet.phonePrimary.replace(/\s/g, "")}`}
        className="btn-primary w-full"
      >
        Contact Owner
      </a>
    </article>
  );
}
