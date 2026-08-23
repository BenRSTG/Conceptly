import Image from "next/image";
import { formatPrice } from "@/lib/utils";

export function LivePreview({
  title,
  shortDescription,
  price,
  salePrice,
  currency,
  imageUrl,
}: {
  title: string;
  shortDescription: string | null;
  price: number;
  salePrice: number | null;
  currency: string;
  imageUrl: string | null;
}) {
  return (
    <div className="rounded-2xl border border-anthracite/10 p-4">
      <p className="text-xs font-semibold tracking-wide text-anthracite-soft uppercase">
        Live-Vorschau
      </p>
      <div className="mt-3 max-w-[220px] rounded-2xl border border-anthracite/10 p-3">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-cream">
          {imageUrl && <Image src={imageUrl} alt="" fill sizes="220px" className="object-cover" />}
        </div>
        <p className="mt-3 text-sm font-medium text-anthracite">{title || "Produkttitel"}</p>
        {shortDescription && (
          <p className="mt-1 line-clamp-2 text-xs text-anthracite-soft">{shortDescription}</p>
        )}
        <p className="mt-1 text-sm text-anthracite-soft">
          {formatPrice(salePrice ?? price, currency)}
        </p>
      </div>
    </div>
  );
}
