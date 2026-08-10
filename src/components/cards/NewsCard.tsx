import { CalendarBlank } from "@phosphor-icons/react/dist/ssr";
import type { NewsArticle } from "@/data/content";

export default function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-purple-4/60 bg-white shadow-card transition-shadow hover:shadow-panel">
      <div className="relative h-[220px] overflow-hidden bg-purple-5/60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.photo}
          alt={article.title}
          className="size-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <span className="absolute left-[15px] top-[15px] rounded-btn bg-white/95 px-[10px] py-[4px] text-desc-12 font-bold uppercase tracking-[1px] text-purple-3">
          {article.tag}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-[10px] p-[20px]">
        <p className="flex items-center gap-[6px] text-small-14 text-neutral-600">
          <CalendarBlank size={16} className="text-purple-3" />
          {article.date}
        </p>
        <h3 className="text-title-20 font-bold text-neutral-800">
          {article.title}
        </h3>
        <p className="line-clamp-3 text-small-14 leading-[18px] text-neutral-700">
          {article.excerpt}
        </p>
        <span className="mt-auto pt-[5px] text-small-14 font-semibold text-purple-3 underline">
          Learn More
        </span>
      </div>
    </article>
  );
}
