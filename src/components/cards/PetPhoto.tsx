import { cn } from "@/lib/utils";

/**
 * Card photo area — pets in the Figma cards are transparent cutouts
 * centered on a white surface (Discovery cards, node 41:262 pattern).
 */
export default function PetPhoto({
  src,
  alt,
  className,
  imgClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-[177px] items-center justify-center overflow-hidden rounded-card bg-purple-5/50",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={cn("h-[90%] w-auto object-contain drop-shadow-sm", imgClassName)}
      />
    </div>
  );
}
