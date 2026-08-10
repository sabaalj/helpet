import { PawPrint } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

/**
 * Figma section heading — bold uppercase purple title with the rotated
 * paw ornament next to it (node 466:5651 pattern in the design).
 */
export default function SectionTitle({
  children,
  className,
  center,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  center?: boolean;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-[10px]",
        center && "justify-center",
        className
      )}
    >
      <Tag className="text-header-28 font-bold uppercase leading-[36px] text-purple-3">
        {children}
      </Tag>
      <PawPrint
        size={40}
        weight="fill"
        className="rotate-90 text-purple-4"
        aria-hidden
      />
    </div>
  );
}
