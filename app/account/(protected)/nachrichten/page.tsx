import type { Metadata } from "next";

export const metadata: Metadata = { title: "Nachrichten" };

export default function MessagesPlaceholderPage() {
  return (
    <div>
      <h1 className="font-script text-3xl text-anthracite">Nachrichten</h1>
      <p className="mt-4 text-sm text-anthracite-soft">
        Dein Nachrichten-Postfach ist bald verfügbar.
      </p>
    </div>
  );
}
