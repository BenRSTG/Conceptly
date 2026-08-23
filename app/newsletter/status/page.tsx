import Link from "next/link";

const COPY: Record<string, { title: string; body: string }> = {
  confirmed: {
    title: "Anmeldung bestätigt",
    body: "Danke! Du bekommst ab jetzt kuratierte Empfehlungen von Conceptly per E-Mail.",
  },
  unsubscribed: {
    title: "Abgemeldet",
    body: "Du erhältst keine weiteren Newsletter-E-Mails von uns mehr.",
  },
  invalid: {
    title: "Link ungültig",
    body: "Dieser Link ist abgelaufen oder wurde bereits verwendet.",
  },
};

export default async function NewsletterStatusPage({
  searchParams,
}: PageProps<"/newsletter/status">) {
  const { result } = await searchParams;
  const key = typeof result === "string" && result in COPY ? result : "invalid";
  const copy = COPY[key];

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <h1 className="font-script text-4xl text-anthracite">{copy.title}</h1>
      <p className="mt-4 text-anthracite-soft">{copy.body}</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-full bg-anthracite px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-anthracite-soft"
      >
        Zurück zu Conceptly
      </Link>
    </div>
  );
}
