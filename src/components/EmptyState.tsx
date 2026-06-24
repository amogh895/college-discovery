interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
      {/* Decorative background circle */}
      <div className="relative mb-6">
        <div className="absolute inset-0 -m-4 rounded-full bg-primary/5 animate-pulse-soft" />
        {icon ? (
          <div className="relative text-muted-light">{icon}</div>
        ) : (
          <div className="relative">
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-muted-light"
              aria-hidden="true"
            >
              <rect
                x="8"
                y="12"
                width="48"
                height="40"
                rx="6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray="4 3"
              />
              <path
                d="M24 32h16M28 38h8"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle
                cx="32"
                cy="24"
                r="4"
                stroke="currentColor"
                strokeWidth="2.5"
              />
            </svg>
          </div>
        )}
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted max-w-sm leading-relaxed mb-6">
        {description}
      </p>

      {action && <div className="animate-bounce-in">{action}</div>}
    </div>
  );
}
