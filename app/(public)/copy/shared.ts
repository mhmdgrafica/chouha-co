export type PublicLang = "en" | "ar";

export function resolvePublicLang(lang?: string | null): PublicLang {
  return lang === "ar" ? "ar" : "en";
}

export function appendPublicLang(path: string, lang: PublicLang) {
  return path === "/" ? `/?lang=${lang}` : `${path}?lang=${lang}`;
}
