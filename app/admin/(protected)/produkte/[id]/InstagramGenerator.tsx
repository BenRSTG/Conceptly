"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { generateInstagramPost } from "./instagram-actions";
import type { InstagramFormat } from "@/lib/instagram/renderPostImage";

type PastAsset = {
  id: string;
  image_storage_path: string;
  caption_text: string;
  hashtags: string[];
  format: string;
  created_at: string;
};

export function InstagramGenerator({
  productId,
  publicBaseUrl,
  pastAssets,
}: {
  productId: string;
  publicBaseUrl: string;
  pastAssets: PastAsset[];
}) {
  const [format, setFormat] = useState<InstagramFormat>("square");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ imageUrl: string; captionText: string; hashtags: string[] } | null>(
    null,
  );
  const [copied, setCopied] = useState(false);

  function handleGenerate() {
    setError(null);
    startTransition(async () => {
      const state = await generateInstagramPost(productId, format);
      if (state.error) {
        setError(state.error);
        return;
      }
      if (state.asset) setResult(state.asset);
    });
  }

  function copyCaption(captionText: string, hashtags: string[]) {
    navigator.clipboard.writeText(`${captionText}\n\n${hashtags.join(" ")}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value as InstagramFormat)}
          className="rounded-lg border border-anthracite/20 px-3 py-2 text-sm"
        >
          <option value="square">Quadrat (1080×1080)</option>
          <option value="story">Story (1080×1920)</option>
        </select>
        <button
          onClick={handleGenerate}
          disabled={isPending}
          className="rounded-full bg-anthracite px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-anthracite-soft disabled:opacity-60"
        >
          {isPending ? "Wird generiert…" : "Instagram-Post generieren"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-4 flex flex-wrap gap-6 rounded-2xl border border-anthracite/10 p-4">
          <a href={result.imageUrl} target="_blank" rel="noreferrer" className="shrink-0">
            <Image
              src={result.imageUrl}
              alt="Generierter Instagram-Post"
              width={220}
              height={format === "square" ? 220 : 391}
              className="rounded-lg border border-anthracite/10 object-cover"
            />
          </a>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-anthracite-soft">Caption-Vorschlag</p>
            <p className="mt-1 max-w-md whitespace-pre-line text-sm text-anthracite">
              {result.captionText}
            </p>
            <p className="mt-2 text-sm text-sand-dark">{result.hashtags.join(" ")}</p>
            <button
              onClick={() => copyCaption(result.captionText, result.hashtags)}
              className="mt-3 rounded-full border border-anthracite/20 px-4 py-1.5 text-xs font-medium text-anthracite hover:bg-cream"
            >
              {copied ? "Kopiert ✓" : "Caption kopieren"}
            </button>
            <p className="mt-2 text-xs text-anthracite-soft">
              Bild öffnet in neuem Tab zum Speichern — kein automatisches Posten.
            </p>
          </div>
        </div>
      )}

      {pastAssets.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-medium text-anthracite-soft">Bisherige Posts</p>
          <div className="mt-2 flex flex-wrap gap-3">
            {pastAssets.map((asset) => (
              <a
                key={asset.id}
                href={`${publicBaseUrl}/${asset.image_storage_path}`}
                target="_blank"
                rel="noreferrer"
                className="block h-20 w-20 overflow-hidden rounded-lg border border-anthracite/10"
              >
                <Image
                  src={`${publicBaseUrl}/${asset.image_storage_path}`}
                  alt=""
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
