import type { PetType } from "@/data/content";

/**
 * Per-category tint for the badge circle — uses only existing palette
 * tokens (purple/red/yellow/green), never a new color.
 */
const TINTS: Record<PetType, string> = {
  Dog: "#F2E2FF", // purple-5
  Cat: "#C80006", // red-2 (used at low opacity below)
  Hamster: "#E0B415", // yellow
  Bird: "#6AB052", // green-4
};

const TINT_OPACITY: Record<PetType, number> = {
  Dog: 1, // purple-5 is already a pale tint, use at full strength
  Cat: 0.12,
  Hamster: 0.16,
  Bird: 0.16,
};

function DogFace() {
  return (
    <>
      <path d="M9 11c-4 1-5 6-2 10c2-1 3-5 3-8c0-1 0-1-1-2Z" />
      <path d="M23 11c4 1 5 6 2 10c-2-1-3-5-3-8c0-1 0-1 1-2Z" />
      <path d="M11 14C10 9 13 7 16 7C19 7 22 9 21 14C22 19 19 23 16 23C13 23 10 19 11 14Z" />
      <circle cx="13" cy="14" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="19" cy="14" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="16" cy="18" r="1.2" fill="currentColor" stroke="none" />
      <path d="M13.5 20.5q2.5 2 5 0" />
    </>
  );
}

function CatFace() {
  return (
    <>
      <path d="M10 11 7 5l6 4" />
      <path d="M22 11l3-6-6 4" />
      <path d="M11 21c-2-5-1-11 5-12s7 7 5 12c-1 3-4 4-5 4s-4-1-5-4Z" />
      <path d="M13.5 15.3v.6M18.5 15.3v.6" />
      <circle cx="16" cy="19" r="0.9" fill="currentColor" stroke="none" />
    </>
  );
}

function HamsterFace() {
  return (
    <>
      <circle cx="16" cy="17" r="8" />
      <path d="M10 12c-1.5-1.5-1-3.5 0-4" />
      <path d="M22 12c1.5-1.5 1-3.5 0-4" />
      <circle cx="12.5" cy="17.5" r="1.6" />
      <circle cx="19.5" cy="17.5" r="1.6" />
      <circle cx="13" cy="15.5" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="19" cy="15.5" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="16" cy="18.5" r="0.9" fill="currentColor" stroke="none" />
    </>
  );
}

function BirdFace() {
  return (
    <>
      <circle cx="14" cy="17" r="7" />
      <path d="M20.5 16 27 14.2 20.5 19Z" />
      <path d="M12 10.5c1-1 2.4-1.3 3.6-.8" />
      <circle cx="12.5" cy="15" r="1" fill="currentColor" stroke="none" />
    </>
  );
}

const FACES: Record<PetType, () => React.ReactNode> = {
  Dog: DogFace,
  Cat: CatFace,
  Hamster: HamsterFace,
  Bird: BirdFace,
};

export default function AnimalTypeIcon({
  type,
  size = 24,
  className,
}: {
  type: PetType;
  size?: number;
  className?: string;
}) {
  const Face = FACES[type];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="16"
        cy="16"
        r="15"
        fill={TINTS[type]}
        opacity={TINT_OPACITY[type]}
      />
      <g
        fill="none"
        stroke="#410075"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Face />
      </g>
    </svg>
  );
}
