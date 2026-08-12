"use client";

import { PawPrint } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface PawPoint {
  top: string;
  left: string;
  size: number;
  rotate: number;
  /** Hidden on small screens to avoid clutter — only the primary paws remain. */
  hideOnMobile?: boolean;
}

/**
 * A wandering trail — like an animal actually walked through the section:
 * it weaves right, dips down, doubles back left, dips again, and so on,
 * rather than drifting in one steady diagonal line.
 */
const TRAIL_POINTS: PawPoint[] = [
  { top: "1%", left: "4%", size: 34, rotate: -20 },
  { top: "6%", left: "14%", size: 28, rotate: 18 },
  { top: "3%", left: "26%", size: 38, rotate: -28 },
  { top: "11%", left: "37%", size: 27, rotate: 32, hideOnMobile: true },
  { top: "5%", left: "48%", size: 36, rotate: -14 },
  { top: "13%", left: "59%", size: 29, rotate: 24 },
  { top: "8%", left: "70%", size: 40, rotate: -30, hideOnMobile: true },
  { top: "18%", left: "79%", size: 30, rotate: 16 },
  { top: "14%", left: "90%", size: 34, rotate: -22 },
  // dips down and reverses direction, heading back left
  { top: "27%", left: "83%", size: 28, rotate: 34, hideOnMobile: true },
  { top: "24%", left: "70%", size: 36, rotate: -18 },
  { top: "32%", left: "58%", size: 29, rotate: 26 },
  { top: "28%", left: "46%", size: 38, rotate: -32, hideOnMobile: true },
  { top: "36%", left: "35%", size: 30, rotate: 20 },
  { top: "33%", left: "22%", size: 34, rotate: -16 },
  { top: "41%", left: "11%", size: 27, rotate: 30, hideOnMobile: true },
  // heads back right and down through the lower half
  { top: "50%", left: "20%", size: 36, rotate: -24 },
  { top: "47%", left: "33%", size: 28, rotate: 18 },
  { top: "55%", left: "45%", size: 39, rotate: -30, hideOnMobile: true },
  { top: "51%", left: "57%", size: 29, rotate: 22 },
  { top: "58%", left: "68%", size: 34, rotate: -18, hideOnMobile: true },
  { top: "63%", left: "80%", size: 27, rotate: 28 },
  { top: "70%", left: "72%", size: 36, rotate: -22 },
  { top: "67%", left: "60%", size: 28, rotate: 20, hideOnMobile: true },
  { top: "74%", left: "48%", size: 33, rotate: -16 },
  { top: "78%", left: "36%", size: 27, rotate: 26, hideOnMobile: true },
  { top: "72%", left: "24%", size: 37, rotate: -28 },
  { top: "82%", left: "14%", size: 29, rotate: 18 },
  { top: "89%", left: "22%", size: 34, rotate: -20, hideOnMobile: true },
  { top: "93%", left: "36%", size: 27, rotate: 24 },
  { top: "88%", left: "50%", size: 35, rotate: -18, hideOnMobile: true },
  { top: "92%", left: "64%", size: 28, rotate: 22 },
];

/** A loose arch — paws climbing up and over, framing the success card. */
const ARCH_POINTS: PawPoint[] = [
  { top: "62%", left: "4%", size: 21, rotate: -28 },
  { top: "40%", left: "12%", size: 25, rotate: -14 },
  { top: "21%", left: "23%", size: 20, rotate: 10 },
  { top: "9%", left: "36%", size: 25, rotate: -20, hideOnMobile: true },
  { top: "4%", left: "50%", size: 23, rotate: 14 },
  { top: "9%", left: "64%", size: 25, rotate: -16, hideOnMobile: true },
  { top: "21%", left: "77%", size: 20, rotate: 22 },
  { top: "40%", left: "88%", size: 25, rotate: -10 },
  { top: "62%", left: "96%", size: 21, rotate: 26 },
];

export default function PawTrail({
  variant = "trail",
  className,
}: {
  variant?: "trail" | "arch";
  className?: string;
}) {
  const points = variant === "arch" ? ARCH_POINTS : TRAIL_POINTS;
  const colorClass = variant === "arch" ? "text-purple-3/10" : "text-purple-3/20";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      {points.map((p, i) => (
        <PawPrint
          key={i}
          weight="fill"
          size={p.size}
          className={cn(
            "absolute",
            colorClass,
            p.hideOnMobile && "hidden sm:block"
          )}
          style={{
            top: p.top,
            left: p.left,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
