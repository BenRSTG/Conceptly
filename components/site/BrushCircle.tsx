import { cn } from "@/lib/utils";

/**
 * Recurring organic brush-stroke circle motif from the logo, used as a soft
 * background shape behind featured content or section headings.
 */
export function BrushCircle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
    >
      <path
        d="M200 20
           C 280 14, 372 70, 380 160
           C 388 250, 320 350, 210 372
           C 100 394, 24 320, 18 210
           C 12 100, 100 28, 200 20 Z"
        fill="var(--color-sand)"
      />
    </svg>
  );
}
