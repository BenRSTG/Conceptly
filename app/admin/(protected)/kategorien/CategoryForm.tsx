"use client";

import { useActionState, useState } from "react";
import type { CategoryFormState } from "./actions";

const initialState: CategoryFormState = {};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[äöüß]/g, (c) => ({ ä: "ae", ö: "oe", ü: "ue", ß: "ss" })[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CategoryForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (state: CategoryFormState, formData: FormData) => Promise<CategoryFormState>;
  defaultValues?: { name: string; slug: string; sort_order: number };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(defaultValues));

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div>
        <label className="block text-xs font-medium text-anthracite-soft">Name</label>
        <input
          name="name"
          required
          defaultValue={defaultValues?.name}
          onChange={(e) => {
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className="mt-1 rounded-lg border border-anthracite/20 px-3 py-1.5 text-sm focus:border-sand-dark focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-anthracite-soft">Slug</label>
        <input
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          className="mt-1 rounded-lg border border-anthracite/20 px-3 py-1.5 text-sm focus:border-sand-dark focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-anthracite-soft">Reihenfolge</label>
        <input
          name="sort_order"
          type="number"
          defaultValue={defaultValues?.sort_order ?? 0}
          className="mt-1 w-20 rounded-lg border border-anthracite/20 px-3 py-1.5 text-sm focus:border-sand-dark focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-anthracite px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-anthracite-soft disabled:opacity-60"
      >
        {pending ? "…" : submitLabel}
      </button>
      {state.error && <p className="w-full text-xs text-red-600">{state.error}</p>}
    </form>
  );
}
