export type PublicLang = "en" | "ar";

export const PUBLIC_LANGUAGE_COOKIE = "site_lang";

export function resolvePublicLang(lang?: string | null): PublicLang {
  return lang === "ar" ? "ar" : "en";
}

export function buildPublicLangCookie(lang: PublicLang) {
  return `${PUBLIC_LANGUAGE_COOKIE}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
}
