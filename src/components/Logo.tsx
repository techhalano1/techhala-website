export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 88 58"
      fill="currentColor"
      aria-hidden="true"
      className={`shrink-0 text-accent ${className}`}
    >
      <path d="M14 2 44 28 19 56 4 44l13-15L2 17z" />
      <path d="M58 2 88 28 63 56 48 44l13-15L46 17z" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-semibold tracking-tight ${className}`}>
      <LogoMark className="h-5 w-auto" />
      <span>
        Tech<span className="text-accent">Hala</span>
      </span>
    </span>
  );
}
