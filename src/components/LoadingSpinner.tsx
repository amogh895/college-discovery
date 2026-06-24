interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="relative w-12 h-12">
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border-4 border-surface"
          aria-hidden="true"
        />
        {/* Spinning ring */}
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary-light animate-spin"
          role="status"
          aria-label="Loading"
        />
        {/* Inner glow dot */}
        <div className="absolute inset-3 rounded-full bg-primary/20 animate-pulse-soft" />
      </div>
      {message && (
        <p className="mt-4 text-sm text-muted font-medium tracking-wide">
          {message}
        </p>
      )}
    </div>
  );
}

export function CollegeCardSkeleton() {
  return (
    <div className="rounded-2xl border border-card-border bg-card-bg overflow-hidden">
      {/* Image placeholder */}
      <div
        className="h-48 animate-shimmer"
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--surface) 0%, var(--card-bg) 50%, var(--surface) 100%)",
          backgroundSize: "200% 100%",
        }}
      />
      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Badge */}
        <div
          className="h-5 w-20 rounded-full animate-shimmer"
          style={{
            backgroundImage:
              "linear-gradient(90deg, var(--surface) 0%, var(--card-bg) 50%, var(--surface) 100%)",
            backgroundSize: "200% 100%",
          }}
        />
        {/* Title */}
        <div
          className="h-5 w-3/4 rounded-md animate-shimmer"
          style={{
            backgroundImage:
              "linear-gradient(90deg, var(--surface) 0%, var(--card-bg) 50%, var(--surface) 100%)",
            backgroundSize: "200% 100%",
          }}
        />
        {/* Location */}
        <div
          className="h-4 w-1/2 rounded-md animate-shimmer"
          style={{
            backgroundImage:
              "linear-gradient(90deg, var(--surface) 0%, var(--card-bg) 50%, var(--surface) 100%)",
            backgroundSize: "200% 100%",
          }}
        />
        {/* Fees + Rating row */}
        <div className="flex items-center justify-between pt-2">
          <div
            className="h-5 w-24 rounded-md animate-shimmer"
            style={{
              backgroundImage:
                "linear-gradient(90deg, var(--surface) 0%, var(--card-bg) 50%, var(--surface) 100%)",
              backgroundSize: "200% 100%",
            }}
          />
          <div
            className="h-5 w-28 rounded-md animate-shimmer"
            style={{
              backgroundImage:
                "linear-gradient(90deg, var(--surface) 0%, var(--card-bg) 50%, var(--surface) 100%)",
              backgroundSize: "200% 100%",
            }}
          />
        </div>
        {/* Action row */}
        <div className="flex items-center justify-between pt-3 border-t border-card-border">
          <div
            className="h-9 w-28 rounded-lg animate-shimmer"
            style={{
              backgroundImage:
                "linear-gradient(90deg, var(--surface) 0%, var(--card-bg) 50%, var(--surface) 100%)",
              backgroundSize: "200% 100%",
            }}
          />
          <div className="flex gap-2">
            <div
              className="h-9 w-9 rounded-lg animate-shimmer"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, var(--surface) 0%, var(--card-bg) 50%, var(--surface) 100%)",
                backgroundSize: "200% 100%",
              }}
            />
            <div
              className="h-9 w-9 rounded-lg animate-shimmer"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, var(--surface) 0%, var(--card-bg) 50%, var(--surface) 100%)",
                backgroundSize: "200% 100%",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
