import { Star, Quotes } from "@phosphor-icons/react/dist/ssr";
import type { Testimonial } from "@/data/content";

export default function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <article className="relative flex h-full flex-col gap-[15px] rounded-card border border-purple-4/60 bg-white p-[25px] shadow-card transition-shadow hover:shadow-panel">
      <Quotes
        size={40}
        weight="fill"
        className="absolute right-[20px] top-[20px] text-purple-5"
        aria-hidden
      />
      <div className="flex gap-[4px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={18}
            weight="fill"
            className={i < t.stars ? "text-yellow" : "text-neutral-200"}
          />
        ))}
      </div>
      <p className="text-content-18 leading-[24px] text-neutral-700">
        “{t.quote}”
      </p>
      <div className="mt-auto flex items-center gap-[12px] border-t border-purple-5 pt-[15px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={t.avatar}
          alt={t.name}
          className="size-[44px] rounded-full border-2 border-purple-4 object-cover"
        />
        <div>
          <p className="text-content-18 font-bold text-neutral-800">{t.name}</p>
          <p className="text-small-14 text-purple-3">{t.role}</p>
        </div>
      </div>
    </article>
  );
}
