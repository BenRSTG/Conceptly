import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { formatPrice } from "@/lib/utils";

const SIZES = {
  square: { width: 1080, height: 1080, imageHeight: 780, bandHeight: 300 },
  story: { width: 1080, height: 1920, imageHeight: 1400, bandHeight: 520 },
} as const;

export type InstagramFormat = keyof typeof SIZES;

let logoDataUrlCache: string | null = null;
async function getLogoDataUrl() {
  if (!logoDataUrlCache) {
    const filePath = path.join(process.cwd(), "public", "logo", "conceptly-compact.png");
    const buffer = await readFile(filePath);
    logoDataUrlCache = `data:image/png;base64,${buffer.toString("base64")}`;
  }
  return logoDataUrlCache;
}

export async function renderInstagramPostImage({
  format,
  title,
  price,
  salePrice,
  currency,
  imageUrl,
}: {
  format: InstagramFormat;
  title: string;
  price: number;
  salePrice: number | null;
  currency: string;
  imageUrl: string | null;
}) {
  const size = SIZES[format];
  const logoDataUrl = await getLogoDataUrl();

  const image = new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: size.width,
            height: size.imageHeight,
            display: "flex",
            background: "#e4d6bf",
          }}
        >
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt=""
              width={size.width}
              height={size.imageHeight}
              style={{ objectFit: "cover" }}
            />
          )}
        </div>
        <div
          style={{
            width: size.width,
            height: size.bandHeight,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 64px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", maxWidth: size.width - 320 }}>
            <div style={{ fontSize: 52, fontWeight: 700, color: "#313139", lineHeight: 1.15 }}>
              {title}
            </div>
            <div style={{ fontSize: 40, color: "#8c6f47", marginTop: 16 }}>
              {formatPrice(salePrice ?? price, currency)}
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoDataUrl} alt="" width={220} height={165} style={{ objectFit: "contain" }} />
        </div>
      </div>
    ),
    { width: size.width, height: size.height },
  );

  const arrayBuffer = await image.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
