interface RatingStarsProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { width: 14, height: 14, gap: "gap-0.5" },
  md: { width: 18, height: 18, gap: "gap-1" },
  lg: { width: 24, height: 24, gap: "gap-1.5" },
} as const;

function StarIcon({
  fillPercentage,
  width,
  height,
  index,
}: {
  fillPercentage: number;
  width: number;
  height: number;
  index: number;
}) {
  const clipId = `star-clip-${index}-${fillPercentage}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width={(fillPercentage / 100) * 24} height="24" />
        </clipPath>
      </defs>
      {/* Background star (empty) */}
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="#d1d5db"
        stroke="#d1d5db"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      {/* Filled star (clipped) */}
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="#f59e0b"
        stroke="#f59e0b"
        strokeWidth="0.5"
        strokeLinejoin="round"
        clipPath={`url(#${clipId})`}
        style={{
          filter:
            fillPercentage > 0
              ? "drop-shadow(0 0 2px rgba(245, 158, 11, 0.3))"
              : "none",
        }}
      />
    </svg>
  );
}

export default function RatingStars({ rating, size = "md" }: RatingStarsProps) {
  const { width, height, gap } = sizeMap[size];
  const clampedRating = Math.min(5, Math.max(0, rating));

  return (
    <div className={`flex items-center ${gap}`} aria-label={`Rating: ${clampedRating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const starValue = i + 1;
        let fillPercentage = 0;

        if (clampedRating >= starValue) {
          fillPercentage = 100;
        } else if (clampedRating > starValue - 1) {
          fillPercentage = (clampedRating - (starValue - 1)) * 100;
        }

        return (
          <StarIcon
            key={i}
            index={i}
            fillPercentage={fillPercentage}
            width={width}
            height={height}
          />
        );
      })}
      <span
        className={`ml-1 font-semibold text-foreground ${
          size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"
        }`}
      >
        {clampedRating.toFixed(1)}
      </span>
    </div>
  );
}
