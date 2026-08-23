import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { createCategory, updateCategory, deleteCategory } from "./actions";
import { CategoryForm } from "./CategoryForm";

export const metadata: Metadata = { title: "Kategorien" };

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, sort_order")
    .order("sort_order");

  return (
    <div>
      <h1 className="font-script text-3xl text-anthracite">Kategorien</h1>

      <div className="mt-8 space-y-4">
        {(categories ?? []).map((category) => (
          <div
            key={category.id}
            className="flex flex-wrap items-end justify-between gap-3 rounded-2xl border border-anthracite/10 p-4"
          >
            <CategoryForm
              action={updateCategory.bind(null, category.id)}
              defaultValues={category}
              submitLabel="Speichern"
            />
            <form action={deleteCategory.bind(null, category.id)}>
              <button
                type="submit"
                className="text-xs font-medium text-red-600 hover:underline"
              >
                Löschen
              </button>
            </form>
          </div>
        ))}
        {(!categories || categories.length === 0) && (
          <p className="text-sm text-anthracite-soft">Noch keine Kategorien angelegt.</p>
        )}
      </div>

      <div className="mt-10 rounded-2xl border border-dashed border-anthracite/20 p-4">
        <h2 className="text-sm font-semibold tracking-wide text-anthracite uppercase">
          Neue Kategorie
        </h2>
        <div className="mt-3">
          <CategoryForm action={createCategory} submitLabel="Anlegen" />
        </div>
      </div>
    </div>
  );
}
