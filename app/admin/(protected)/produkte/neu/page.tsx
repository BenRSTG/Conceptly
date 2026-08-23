import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { createProduct } from "../actions";
import { ProductForm } from "../ProductForm";

export const metadata: Metadata = { title: "Neues Produkt" };

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order");

  return (
    <div>
      <h1 className="font-script text-3xl text-anthracite">Neues Produkt</h1>
      <p className="mt-2 text-sm text-anthracite-soft">
        Bilder und Varianten lassen sich nach dem Anlegen im Editor ergänzen.
      </p>
      <div className="mt-8 max-w-2xl">
        <ProductForm action={createProduct} categories={categories ?? []} submitLabel="Anlegen" />
      </div>
    </div>
  );
}
