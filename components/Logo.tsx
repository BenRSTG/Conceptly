import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  /** "full" includes the tagline (footer, hero), "compact" is wordmark-only (header nav). */
  variant?: "full" | "compact";
  className?: string;
  priority?: boolean;
};

const SOURCES = {
  full: { src: "/logo/conceptly-full.png", width: 900, height: 716 },
  compact: { src: "/logo/conceptly-compact.png", width: 900, height: 623 },
};

/**
 * Official Conceptly wordmark, exported from `Conceptly_-_Final.pdf`
 * (see /public/logo/). "full" carries the "Handpicked. Urban. You." tagline
 * baked into the artwork; "compact" is the frame + wordmark without it.
 */
export function Logo({ variant = "full", className, priority }: LogoProps) {
  const { src, width, height } = SOURCES[variant];

  return (
    <Image
      src={src}
      width={width}
      height={height}
      alt="Conceptly — Handpicked. Urban. You."
      className={cn("h-auto w-40", className)}
      priority={priority}
    />
  );
}
