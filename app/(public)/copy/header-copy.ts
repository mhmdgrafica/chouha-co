import type { PublicLang } from "./shared";

export const publicHeaderNavigation = [
  { href: "/", labelEn: "Home", labelAr: "الرئيسية" },
  { href: "/products", labelEn: "Products", labelAr: "المنتجات" },
  { href: "/contact", labelEn: "Contact Us", labelAr: "تواصل معنا" },
] as const;

export const languageSwitcherCopy = {
  en: {
    english: "English",
    arabic: "العربية",
    changeLanguage: "Change language",
  },
  ar: {
    english: "English",
    arabic: "العربية",
    changeLanguage: "تغيير اللغة",
  },
} as const satisfies Record<PublicLang, {
  english: string;
  arabic: string;
  changeLanguage: string;
}>;
