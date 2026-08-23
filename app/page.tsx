import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BrushCircle } from "@/components/site/BrushCircle";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";

export default async function Home() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, slug, name")
    .order("sort_order")
    .limit(6);

  return (
    <div>
      <section className="relative overflow-hidden px-4 pt-20 pb-28 sm:px-6">
        <BrushCircle className="absolute top-1/2 left-1/2 -z-10 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 opacity-40" />
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.35em] text-sand-dark uppercase">
            Handpicked. Urban. You.
          </p>
          <h1 className="mt-6 font-script text-5xl text-anthracite sm:text-6xl">
            Deko mit Haltung für dein Zuhause
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-anthracite-soft">
            Conceptly kuratiert Deko- und Lifestyle-Produkte, die urbanes
            Wohnen persönlich machen — sorgfältig ausgewählt, nicht
            massenproduziert.
          </p>
          <Link
            href="/shop"
            className="mt-10 inline-flex items-center rounded-full bg-anthracite px-8 py-3 text-sm font-medium tracking-wide text-white transition-colors hover:bg-anthracite-soft"
          >
            Shop entdecken
          </Link>
        </div>
      </section>

      <section id="kategorien" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-sm font-semibold tracking-[0.3em] text-anthracite uppercase">
          Kategorien
        </h2>
        {categories && categories.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?kategorie=${category.slug}`}
                className="rounded-2xl border border-anthracite/10 bg-cream px-6 py-10 text-center font-medium text-anthracite transition-colors hover:border-sand-dark"
              >
                {category.name}
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-sm text-anthracite-soft">
            Die ersten Kategorien sind bald da — schau gern wieder vorbei.
          </p>
        )}
      </section>

      <section
        id="ueber-uns"
        className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6"
      >
        <h2 className="font-script text-3xl text-anthracite">
          Kuratiert statt beliebig
        </h2>
        <p className="mt-4 text-anthracite-soft">
          Jedes Stück bei Conceptly wird persönlich ausgewählt — für Räume,
          die etwas erzählen, statt einfach nur eingerichtet zu sein.
        </p>
      </section>

      <section className="mx-auto max-w-lg px-4 pb-24 text-center sm:px-6">
        <h2 className="text-sm font-semibold tracking-[0.3em] text-anthracite uppercase">
          Auf dem Laufenden bleiben
        </h2>
        <p className="mt-3 text-sm text-anthracite-soft">
          Neue Stücke, kuratierte Empfehlungen — kein Spam.
        </p>
        <NewsletterForm source="popup" className="mt-6" />
      </section>
    </div>
  );
}
