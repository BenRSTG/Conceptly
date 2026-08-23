import type { ReactNode } from "react";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-script text-4xl text-anthracite">{title}</h1>
      <div className="prose-legal mt-8 space-y-5 text-sm leading-relaxed text-anthracite-soft [&_h2]:mt-8 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-anthracite [&_strong]:text-anthracite">
        {children}
      </div>
    </div>
  );
}

export function PlaceholderNotice() {
  return (
    <p className="rounded-lg border border-sand-dark/40 bg-cream px-4 py-3 text-xs text-anthracite">
      Platzhaltertext — vor Live-Gang von einer:m Fachanwält:in für IT-/Wettbewerbsrecht
      prüfen und mit den echten Unternehmensdaten befüllen.
    </p>
  );
}
