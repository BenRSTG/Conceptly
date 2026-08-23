import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The hand-painted brush-stroke circle from the logo artwork, isolated as a
 * standalone motif for use as a soft background shape behind featured
 * content or section headings (see brand brief §3).
 */
export function BrushCircle({ className }: { className?: string }) {
  return (
    <Image
      src="/logo/conceptly-mark.png"
      alt=""
      aria-hidden="true"
      width={512}
      height={512}
      className={cn("pointer-events-none select-none", className)}
    />
  );
}
