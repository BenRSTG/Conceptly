function slugifyHashtag(value: string) {
  return value
    .toLowerCase()
    .replace(/[äöüß]/g, (c) => ({ ä: "ae", ö: "oe", ü: "ue", ß: "ss" })[c] ?? c)
    .replace(/[^a-z0-9]+/g, "");
}

export function generateInstagramCaption({
  title,
  shortDescription,
  categoryName,
}: {
  title: string;
  shortDescription: string | null;
  categoryName: string | null;
}) {
  const intro = shortDescription?.trim() || `${title} — jetzt bei Conceptly.`;
  const captionText = `${intro}\n\nJetzt im Shop entdecken — Link in Bio. ✨`;

  const hashtags = [
    "#conceptly",
    "#handpickedurbanyou",
    "#interiordesign",
    "#deko",
    "#urbanliving",
    categoryName ? `#${slugifyHashtag(categoryName)}` : null,
  ].filter((tag): tag is string => Boolean(tag));

  return { captionText, hashtags };
}
