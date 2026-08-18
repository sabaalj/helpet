"use client";

import { Funnel } from "@phosphor-icons/react";
import { SelectField } from "@/components/ui/fields";
import { cn } from "@/lib/utils";

export interface FilterConfig {
  key: string;
  label: string;
  options: readonly string[];
}

/**
 * Filter bar — type pill tabs (Figma field-tab) + dropdown selects,
 * inside a white rounded panel like the design's filter rows.
 */
export default function FilterBar({
  typeTabs,
  activeType,
  onType,
  selects,
  values,
  onSelect,
}: {
  typeTabs: readonly string[];
  activeType: string;
  onType: (t: string) => void;
  selects: FilterConfig[];
  values: Record<string, string>;
  onSelect: (key: string, v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-[20px] rounded-card border border-purple-4/60 bg-white p-[20px] shadow-card">
      <div className="flex items-center gap-[10px] text-purple-3">
        <Funnel size={20} weight="bold" />
        <span className="text-content-18 font-bold">Filters</span>
      </div>
      <div className="flex flex-wrap items-center gap-[15px]">
        <div className="flex flex-wrap gap-[10px]">
          {["All", ...typeTabs].map((t) => (
            <button
              key={t}
              onClick={() => onType(t)}
              className={cn(
                "rounded-btn border px-[20px] py-[8px] text-small-14 font-semibold transition-all duration-300",
                activeType === t
                  ? "border-purple-3 bg-purple-3 text-white"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-purple-3 hover:text-purple-3"
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap gap-[15px]">
          {selects.map((s) => (
            <SelectField
              key={s.key}
              label={s.label}
              options={s.options}
              placeholder="All"
              value={values[s.key] ?? ""}
              onChange={(v) => onSelect(s.key, v)}
              className="filter-field w-[190px]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
