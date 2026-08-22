/**
 * Placeholder mirroring LostPetCard's block structure while results resolve —
 * same padding, photo height and row rhythm, so the grid doesn't shift when
 * the real cards land.
 */
export default function LostPetCardSkeleton() {
  return (
    <article
      aria-hidden
      className="flex h-full flex-col gap-[15px] rounded-card border border-purple-4/60 bg-white p-[15px] shadow-card"
    >
      <div className="skeleton h-[177px] rounded-card" />

      <div className="flex items-center justify-between gap-[10px]">
        <div className="skeleton h-[20px] w-[45%] rounded-btn" />
        <div className="skeleton h-[20px] w-[70px] rounded-full" />
      </div>

      <div className="skeleton h-[14px] w-[65%] rounded-btn" />
      <div className="skeleton h-[14px] w-[80%] rounded-btn" />

      <div className="flex flex-col gap-[5px]">
        <div className="skeleton h-[16px] w-[35%] rounded-btn" />
        <div className="skeleton h-[12px] w-full rounded-btn" />
        <div className="skeleton h-[12px] w-[90%] rounded-btn" />
      </div>

      <div className="mt-auto flex flex-col gap-[6px] border-t border-purple-5 pt-[10px]">
        <div className="skeleton h-[14px] w-[55%] rounded-btn" />
        <div className="skeleton h-[14px] w-[50%] rounded-btn" />
      </div>

      <div className="skeleton h-[44px] w-full rounded-btn" />
    </article>
  );
}
