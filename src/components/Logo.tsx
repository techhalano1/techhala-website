export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold tracking-tight ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="th-g" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0" stopColor="var(--accent)" />
            <stop offset="1" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#th-g)" />
        <path
          d="M9 10h14M16 10v12M11 22h10"
          stroke="white"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </svg>
      <span>
        Tech<span className="text-gradient">Hala</span>
      </span>
    </span>
  );
}
