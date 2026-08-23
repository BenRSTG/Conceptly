import { cn } from "@/lib/utils";

type LogoProps = {
  /** "full" includes the tagline, "compact" is wordmark-only (nav, favicon-adjacent UI). */
  variant?: "full" | "compact";
  className?: string;
};

/**
 * Placeholder logo built from the Conceptly brand brief (script wordmark,
 * hand-painted sand brush circle, thin anthracite frame, spaced-caps
 * tagline). Swap for the real export from `Conceptly_-_Final.pdf` under
 * /public/logo/ once available — this component's job then becomes an
 * <Image> wrapper instead of inline SVG.
 */
export function Logo({ variant = "full", className }: LogoProps) {
  return (
    <div className={cn("inline-flex flex-col items-center gap-2", className)}>
      <svg
        viewBox="0 0 220 100"
        role="img"
        aria-label="Conceptly"
        className="h-auto w-40"
      >
        <path
          d="M110 14
             C 148 10, 182 30, 186 56
             C 190 82, 158 96, 116 94
             C 76 92, 32 84, 26 56
             C 20 28, 68 18, 110 14 Z"
          fill="var(--color-sand)"
          opacity="0.55"
        />
        <rect
          x="14"
          y="30"
          width="192"
          height="46"
          fill="none"
          stroke="var(--color-anthracite)"
          strokeWidth="1"
        />
        <text
          x="110"
          y="61"
          textAnchor="middle"
          fill="var(--color-anthracite)"
          fontFamily="var(--font-script)"
          fontSize="34"
        >
          Conceptly
        </text>
      </svg>
      {variant === "full" && (
        <span className="text-[10px] font-medium tracking-[0.3em] text-anthracite uppercase">
          Handpicked. Urban. You.
        </span>
      )}
    </div>
  );
}
