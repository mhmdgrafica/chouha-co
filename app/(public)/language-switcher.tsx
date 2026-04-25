"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Globe } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

const languages = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
] as const;

export function LanguageSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = searchParams.get("lang") === "ar" ? "ar" : "en";

  const links = useMemo(() => {
    return languages.map((language) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("lang", language.code);

      return {
        ...language,
        href: `${pathname}?${params.toString()}`,
        isActive: language.code === currentLang,
      };
    });
  }, [currentLang, pathname, searchParams]);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Change language"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d8d1c4] bg-white text-[#243b6b] transition hover:bg-[#f8f6f2]"
      >
        <Globe className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 min-w-40 rounded-2xl border border-[#e6dfd3] bg-white p-2 shadow-lg">
          {links.map((language) => (
            <Link
              key={language.code}
              href={language.href}
              onClick={() => setIsOpen(false)}
              className={`block rounded-xl px-4 py-2.5 text-sm transition ${
                language.isActive
                  ? "bg-[#eef3f8] font-medium text-[#243b6b]"
                  : "text-[#5b6472] hover:bg-[#f8f6f2]"
              }`}
            >
              {language.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
