export type PublicLang = "en" | "ar";

export const PUBLIC_LANGUAGE_COOKIE = "site_lang";

export function resolvePublicLang(lang?: string | null): PublicLang {
  return lang === "ar" ? "ar" : "en";
}
