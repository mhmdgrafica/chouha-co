"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { languageSwitcherCopy, publicHeaderNavigation } from "./copy/header-copy";
import { buildPublicLangCookie, type PublicLang } from "./copy/shared";

type PublicHeaderProps = {
  lang: PublicLang;
};

export function PublicHeader({ lang }: PublicHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isArabic = lang === "ar";
  const brandLabel = "Chouha";
  const languageCopy = languageSwitcherCopy[lang];

  const links = useMemo(
    () =>
      publicHeaderNavigation.map((item) => ({
        href: item.href,
        label: isArabic ? item.labelAr : item.labelEn,
        isActive:
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`),
      })),
    [isArabic, pathname]
  );

  function changeMobileLanguage(nextLang: PublicLang) {
    document.cookie = buildPublicLangCookie(nextLang);
    setIsMenuOpen(false);
    router.refresh();
  }

  const linkClassName = (isActive: boolean) =>
    `group relative inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition ${
      isActive ? "text-[#003b51]" : "text-[#5b6472] hover:text-[#003b51]"
    }`;

  const frameClassName = (isActive: boolean) =>
    `pointer-events-none absolute inset-0 rounded-full border transition duration-300 ${
      isActive
        ? "border-[#003b51]/50"
        : "scale-[0.94] border-[#003b51]/0 group-hover:scale-100 group-hover:border-[#003b51]/35"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-[#e6dfd3] bg-[#f8f6f2]/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-3 text-[#003b51]">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9d2c7] bg-white text-base font-semibold shadow-sm">
            C
          </span>
          <span className="text-lg font-semibold tracking-[0.08em]">
            {brandLabel}
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkClassName(item.isActive)}
            >
              <span aria-hidden="true" className={frameClassName(item.isActive)} />
              <span className="relative z-10">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher lang={lang} />

          <button
            type="button"
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d8d1c4] bg-white text-[#003b51] transition hover:bg-[#f8f6f2] md:hidden"
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-[#e6dfd3] bg-[#f8f6f2] md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-4">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-2xl border border-[#e1dbd0] bg-white px-4 py-3 text-sm font-medium text-[#003b51]"
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-2 border-t border-[#e6dfd3] pt-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-[#7b8796]">
                {languageCopy.language}
              </p>

              <div className="flex gap-2">
                {(["en", "ar"] as const).map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => changeMobileLanguage(language)}
                    className={`rounded-xl px-4 py-2 text-sm font-medium ${
                      language === lang
                        ? "bg-[#003b51] text-white"
                        : "border border-[#e1dbd0] bg-white text-[#003b51]"
                    }`}
                  >
                    {language === "en"
                      ? languageCopy.english
                      : languageCopy.arabic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
