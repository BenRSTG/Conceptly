"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { addProductImage, deleteProductImage, setPrimaryImage } from "../actions";

type ProductImage = {
  id: string;
  storage_path: string;
  is_primary: boolean;
};

export function ImageUploader({
  productId,
  images,
  publicBaseUrl,
}: {
  productId: string;
  images: ProductImage[];
  publicBaseUrl: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    const supabase = createClient();

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const path = `${productId}/${crypto.randomUUID()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, file, { cacheControl: "3600" });
        if (uploadError) throw uploadError;

        await addProductImage(productId, path, images.length === 0);
      }
      router.refresh();
    } catch {
      setError("Upload fehlgeschlagen. Bitte erneut versuchen.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          uploadFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 text-center text-sm transition-colors ${
          isDragging ? "border-sand-dark bg-cream" : "border-anthracite/20"
        }`}
      >
        {uploading ? "Lädt hoch…" : "Bilder hierher ziehen oder klicken zum Auswählen"}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => uploadFiles(e.target.files)}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((image) => (
            <div key={image.id} className="group relative aspect-square overflow-hidden rounded-xl border border-anthracite/10">
              <Image
                src={`${publicBaseUrl}/${image.storage_path}`}
                alt=""
                fill
                sizes="200px"
                className="object-cover"
              />
              {image.is_primary && (
                <span className="absolute top-1 left-1 rounded-full bg-anthracite px-2 py-0.5 text-[10px] font-medium text-white">
                  Titelbild
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/50 px-2 py-1 opacity-0 transition-opacity group-hover:opacity-100">
                {!image.is_primary && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      startTransition(async () => {
                        await setPrimaryImage(productId, image.id);
                        router.refresh();
                      })
                    }
                    className="text-[10px] text-white hover:underline"
                  >
                    Als Titelbild
                  </button>
                )}
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    startTransition(async () => {
                      await deleteProductImage(productId, image.id, image.storage_path);
                      router.refresh();
                    })
                  }
                  className="ml-auto text-[10px] text-white hover:underline"
                >
                  Entfernen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
