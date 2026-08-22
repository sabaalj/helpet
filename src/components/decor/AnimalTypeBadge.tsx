import type { PetType } from "@/data/content";
import AnimalTypeIcon from "./AnimalTypeIcon";

export default function AnimalTypeBadge({ type }: { type: PetType }) {
  return (
    <span className="flex items-center gap-[6px] rounded-full bg-purple-5 py-[3px] pl-[3px] pr-[10px] text-desc-12 font-semibold text-purple-3">
      <AnimalTypeIcon type={type} size={20} className="shrink-0" />
      {type}
    </span>
  );
}
