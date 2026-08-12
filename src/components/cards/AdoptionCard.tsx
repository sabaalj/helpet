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

import Link from "next/link";
import { useState } from "react"; 

export default function AdoptionCard({ pet }: { pet: AdoptionPet }) {

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

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
          type="button"
          aria-label={liked ? "Remove from favorites" : "Save to favorites"}
          onClick={() => {
            setLiked((prev) => !prev);
            setLikes((prev) => (liked ? prev - 1 : prev + 1));
          }}
          className="absolute right-[10px] top-[10px] flex h-[32px] items-center gap-[5px] rounded-full bg-white px-[9px] text-red-2 shadow-chip transition-all hover:scale-105"
        >
          <Heart
            size={18}
            weight={liked ? "fill" : "regular"}
          />

          <span className="text-desc-12 font-bold">
            {likes}
          </span>
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

      <div className="mt-auto grid grid-cols-2 gap-[10px]">
        <Link
          href={`/adoption/${pet.id}`}
          className="btn-outline w-full px-[12px] text-small-14"
        >
          View Details
        </Link>

        <a
          href={`tel:${pet.phone.replace(/\s/g, "")}`}
          className="btn-primary w-full px-[12px] text-small-14"
        >
          Contact Publisher
        </a>
      </div>
    </article>
  );
}
