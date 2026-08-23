"use client";

import { useState } from "react";
import { ProductForm } from "../ProductForm";
import { LivePreview } from "./LivePreview";
import type { ProductFormState } from "../actions";
import type { ProductRow } from "@/lib/types/database";

export function ProductEditor({
  action,
  categories,
  defaultValues,
  imageUrl,
}: {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  categories: { id: string; name: string }[];
  defaultValues: Partial<ProductRow>;
  imageUrl: string | null;
}) {
  const [preview, setPreview] = useState({
    title: defaultValues.title ?? "",
    shortDescription: defaultValues.short_description ?? "",
    price: defaultValues.base_price ?? 0,
    salePrice: defaultValues.sale_price ?? null,
  });

  return (
    <div
      className="grid gap-8 lg:grid-cols-[1fr_260px]"
      onInput={(e) => {
        const form = e.currentTarget.querySelector("form");
        if (!form) return;
        const data = new FormData(form);
        setPreview({
          title: String(data.get("title") ?? ""),
          shortDescription: String(data.get("short_description") ?? ""),
          price: Number(data.get("base_price") ?? 0),
          salePrice: data.get("sale_price") ? Number(data.get("sale_price")) : null,
        });
      }}
    >
      <ProductForm
        action={action}
        categories={categories}
        defaultValues={defaultValues}
        submitLabel="Speichern"
      />
      <LivePreview
        title={preview.title}
        shortDescription={preview.shortDescription}
        price={preview.price}
        salePrice={preview.salePrice}
        currency={defaultValues.currency ?? "EUR"}
        imageUrl={imageUrl}
      />
    </div>
  );
}
