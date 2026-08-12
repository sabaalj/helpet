export default function HappyDogIllustration({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 220 200"
      className={className}
      role="img"
      aria-label="Illustration of a happy dog"
    >
      {/* ground shadow */}
      <ellipse cx="110" cy="188" rx="50" ry="8" fill="#410075" opacity="0.08" />
      {/* wagging tail */}
      <path
        d="M176 140c22-2 34-20 28-34-4-9-15-9-14 1 1 8 9 9 8 18-1 10-11 14-22 15z"
        fill="#E5C3FF"
      />
      {/* body */}
      <ellipse cx="110" cy="150" rx="56" ry="36" fill="#E5C3FF" />
      {/* front paws */}
      <ellipse cx="86" cy="182" rx="14" ry="10" fill="#ffffff" />
      <ellipse cx="134" cy="182" rx="14" ry="10" fill="#ffffff" />
      {/* head */}
      <circle cx="110" cy="88" r="50" fill="#F2E2FF" />
      {/* floppy ears */}
      <path d="M66 68c-22 6-30 34-16 52 10-4 18-16 20-30 1-9 0-17-4-22z" fill="#E5C3FF" />
      <path d="M154 68c22 6 30 34 16 52-10-4-18-16-20-30-1-9 0-17 4-22z" fill="#E5C3FF" />
      {/* muzzle */}
      <ellipse cx="110" cy="104" rx="26" ry="20" fill="#ffffff" />
      {/* eyes (happy, closed-arc) */}
      <path
        d="M84 82 Q92 72 100 82"
        stroke="#410075"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M120 82 Q128 72 136 82"
        stroke="#410075"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* nose */}
      <ellipse cx="110" cy="98" rx="8" ry="6" fill="#410075" />
      {/* open happy mouth + tongue */}
      <path
        d="M110 104 Q110 116 96 118 Q104 124 110 120 Q116 124 124 118 Q110 116 110 104Z"
        fill="#410075"
      />
      <path d="M104 114 Q110 126 116 114 Q110 120 104 114Z" fill="#C80006" />
      {/* rosy cheeks */}
      <circle cx="78" cy="100" r="6" fill="#E5C3FF" opacity="0.8" />
      <circle cx="142" cy="100" r="6" fill="#E5C3FF" opacity="0.8" />
      {/* little heart floating beside */}
      <path
        d="M182 78c-3-6-11-6-13 0-2-6-10-6-13 0-3 7 5 14 13 20 8-6 16-13 13-20z"
        fill="#C80006"
        opacity="0.85"
      />
    </svg>
  );
}
