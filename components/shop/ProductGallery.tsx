"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({
  images,
  title,
}: {
  images: { url: string; alt: string | null }[];
  title: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return <div className="aspect-square rounded-2xl bg-cream" />;
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
        <Image
          src={images[active].url}
          alt={images[active].alt ?? title}
          fill
          sizes="(min-width: 1024px) 480px, 100vw"
          className="object-cover"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2">
          {images.map((image, i) => (
            <button
              key={image.url}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 ${
                i === active ? "border-sand-dark" : "border-transparent"
              }`}
            >
              <Image src={image.url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
