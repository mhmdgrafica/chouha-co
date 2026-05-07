"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { languageSwitcherCopy } from "./copy/header-copy";
import { buildPublicLangCookie, type PublicLang } from "./copy/shared";

type LanguageSwitcherProps = {
  lang: PublicLang;
};

const languages = [
  { code: "en", labelKey: "english" },
  { code: "ar", labelKey: "arabic" },
] as const;

export function LanguageSwitcher({ lang }: LanguageSwitcherProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const t = languageSwitcherCopy[lang];

  function changeLanguage(nextLang: PublicLang) {
    document.cookie = buildPublicLangCookie(nextLang);
    setIsOpen(false);
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={t.changeLanguage}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d8d1c4] bg-white text-[#003b51] transition hover:bg-[#f8f6f2]"
      >
        <Globe className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 min-w-40 rounded-2xl border border-[#e6dfd3] bg-white p-2 text-left shadow-lg">
          {languages.map((language) => (
            <button
              key={language.code}
              type="button"
              onClick={() => changeLanguage(language.code)}
              className={`block w-full rounded-xl px-4 py-2.5 text-left text-sm transition ${
                language.code === lang
                  ? "bg-[#eaf4f3] font-medium text-[#003b51]"
                  : "text-[#5b6472] hover:bg-[#f8f6f2] hover:text-[#003b51]"
              }`}
            >
              {t[language.labelKey]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
