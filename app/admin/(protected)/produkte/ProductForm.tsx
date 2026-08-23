"use client";

import { useActionState, useState } from "react";
import type { ProductFormState } from "./actions";
import type { ProductRow } from "@/lib/types/database";

const initialState: ProductFormState = {};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[äöüß]/g, (c) => ({ ä: "ae", ö: "oe", ü: "ue", ß: "ss" })[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const inputClass =
  "mt-1 w-full rounded-lg border border-anthracite/20 px-3 py-2 text-sm focus:border-sand-dark focus:outline-none";
const labelClass = "block text-xs font-medium text-anthracite-soft";

export function ProductForm({
  action,
  categories,
  defaultValues,
  submitLabel,
}: {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  categories: { id: string; name: string }[];
  defaultValues?: Partial<ProductRow>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(defaultValues?.slug));

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Titel</label>
          <input
            name="title"
            required
            defaultValue={defaultValues?.title}
            onChange={(e) => {
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Slug</label>
          <input
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Kurzbeschreibung</label>
        <textarea
          name="short_description"
          rows={2}
          defaultValue={defaultValues?.short_description ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Beschreibung</label>
        <textarea
          name="description"
          rows={6}
          defaultValue={defaultValues?.description ?? ""}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Kategorie</label>
          <select
            name="category_id"
            defaultValue={defaultValues?.category_id ?? ""}
            className={inputClass}
          >
            <option value="">Keine</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select name="status" defaultValue={defaultValues?.status ?? "draft"} className={inputClass}>
            <option value="draft">Entwurf</option>
            <option value="published">Veröffentlicht</option>
            <option value="archived">Archiviert</option>
          </select>
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm text-anthracite">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={defaultValues?.featured}
            />
            Featured-Produkt
          </label>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Preis (€)</label>
          <input
            name="base_price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={defaultValues?.base_price}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Aktionspreis (€, optional)</label>
          <input
            name="sale_price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={defaultValues?.sale_price ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Gewicht (g)</label>
          <input
            name="weight_grams"
            type="number"
            min="0"
            defaultValue={defaultValues?.weight_grams ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Lagerbestand</label>
          <input
            name="stock_quantity"
            type="number"
            min="0"
            defaultValue={defaultValues?.stock_quantity ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Warnschwelle</label>
          <input
            name="low_stock_threshold"
            type="number"
            min="0"
            defaultValue={defaultValues?.low_stock_threshold ?? 5}
            className={inputClass}
          />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm text-anthracite">
            <input
              type="checkbox"
              name="stock_tracking"
              defaultChecked={defaultValues?.stock_tracking ?? true}
            />
            Lagerbestand verfolgen
          </label>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>SEO-Titel</label>
          <input
            name="seo_title"
            defaultValue={defaultValues?.seo_title ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>SEO-Beschreibung</label>
          <input
            name="seo_description"
            defaultValue={defaultValues?.seo_description ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-anthracite px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-anthracite-soft disabled:opacity-60"
      >
        {pending ? "Speichern…" : submitLabel}
      </button>
    </form>
  );
}
