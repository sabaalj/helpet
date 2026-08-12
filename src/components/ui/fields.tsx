"use client";

import { CaretDown, UploadSimple } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

/**
 * Form controls replicating the Figma floating-label field pattern
 * (label sits on the top border line — see Register / Checkout frames).
 */

interface BaseProps {
  label: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  name?: string;
  type?: string;
}

export function Field({
  label,
  placeholder,
  required,
  className,
  name,
  type = "text",
}: BaseProps) {
  return (
    <label className={cn("field block", className)}>
      <span className="field-label">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="field-input"
      />
    </label>
  );
}

export function SelectField({
  label,
  options,
  className,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  options: readonly string[];
  className?: string;
  name?: string;
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className={cn("field block", className)}>
      <span className="field-label">{label}</span>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="field-input appearance-none pr-[44px] text-neutral-800"
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <CaretDown
          size={18}
          className="pointer-events-none absolute right-[16px] top-1/2 -translate-y-1/2 text-purple-3"
        />
      </div>
    </label>
  );
}

export function TextareaField({
  label,
  placeholder,
  className,
  name,
  rows = 4,
}: BaseProps & { rows?: number }) {
  return (
    <label className={cn("field block", className)}>
      <span className="field-label">{label}</span>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        className="field-input resize-none"
      />
    </label>
  );
}

/** Dashed photo-upload drop area, styled with the design's purple accents. */
export function PhotoUpload({
  label = "Pet Photo",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className={cn("field", className)}>
      <span className="field-label z-10">{label}</span>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex min-h-[160px] w-full flex-col items-center justify-center gap-[10px] rounded-btn border border-dashed border-purple-4 bg-purple-5/40 px-[20px] py-[24px] transition-colors hover:border-purple-1 hover:bg-purple-5"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Selected pet"
            className="h-[110px] w-[110px] rounded-card object-cover"
          />
        ) : (
          <span className="flex size-[44px] items-center justify-center rounded-full bg-purple-4 text-purple-3">
            <UploadSimple size={22} weight="bold" />
          </span>
        )}
        <span className="text-small-14 font-semibold text-purple-3">
          {fileName ?? "Click to upload a clear photo"}
        </span>
        <span className="text-desc-12 text-neutral-600">
          JPG or PNG, up to 5 MB
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) {
            setFileName(f.name);
            setPreview(URL.createObjectURL(f));
          }
        }}
      />
    </div>
  );
}
export function DocumentUpload({
  label,
  className,
  onChange,
}: {
  label: string;
  className?: string;
  onChange?: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className={cn("field", className)}>
      <span className="field-label z-10">{label}</span>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex min-h-[120px] w-full flex-col items-center justify-center gap-[8px] rounded-btn border border-dashed border-purple-4 bg-purple-5/40 px-[20px] py-[20px] transition-colors hover:border-purple-1 hover:bg-purple-5"
      >
        <span className="flex size-[40px] items-center justify-center rounded-full bg-purple-4 text-purple-3">
          <UploadSimple size={20} weight="bold" />
        </span>

        <span className="text-small-14 font-semibold text-purple-3">
          {fileName ?? "Click to upload document"}
        </span>

        <span className="text-desc-12 text-neutral-600">
          JPG, PNG or PDF
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;

          setFileName(file?.name ?? null);
          onChange?.(file);
        }}
      />
    </div>
  );
}
