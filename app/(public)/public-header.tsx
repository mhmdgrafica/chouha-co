"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { publicHeaderNavigation } from "./copy/header-copy";
import { appendPublicLang, resolvePublicLang } from "./copy/shared";

export function PublicHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lang = resolvePublicLang(searchParams.get("lang"));
  const isArabic = lang === "ar";
  const brandLabel = "Chouha";

  const links = useMemo(
    () =>
      publicHeaderNavigation.map((item) => ({
        href: appendPublicLang(item.href, lang),
        label: isArabic ? item.labelAr : item.labelEn,
        isActive:
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`),
      })),
    [isArabic, lang, pathname]
  );

  const linkClassName = (isActive: boolean) =>
    `group relative inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition ${
      isActive ? "text-[#1f2f4d]" : "text-[#5b6472] hover:text-[#1f2f4d]"
    }`;

  const frameClassName = (isActive: boolean) =>
    `pointer-events-none absolute inset-0 rounded-full border transition duration-300 ${
      isActive
        ? "border-[#243b6b]/50"
        : "border-[#243b6b]/0 group-hover:border-[#243b6b]/35 group-hover:scale-100 scale-[0.94]"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-[#e6dfd3] bg-[#f8f6f2]/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href={appendPublicLang("/", lang)}
          className="inline-flex items-center gap-3 text-[#1f2f4d]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9d2c7] bg-white text-base font-semibold shadow-sm">
            C
          </span>
          <span className="text-lg font-semibold tracking-[0.08em]">{brandLabel}</span>
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
          <LanguageSwitcher />

          <button
            type="button"
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d8d1c4] bg-white text-[#243b6b] transition hover:bg-[#f8f6f2] md:hidden"
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
                className="rounded-2xl border border-[#e1dbd0] bg-white px-4 py-3 text-sm font-medium text-[#1f2f4d]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
