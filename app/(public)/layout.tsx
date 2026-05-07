import { cookies } from "next/headers";
import { PublicHeader } from "./public-header";
import { PUBLIC_LANGUAGE_COOKIE, resolvePublicLang } from "./copy/shared";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const lang = resolvePublicLang(cookieStore.get(PUBLIC_LANGUAGE_COOKIE)?.value);

  return (
    <>
      <PublicHeader lang={lang} />

      <main className="min-h-screen bg-[#f8f6f2]">
        <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
      </main>

      <footer className="border-t border-[#e6dfd3] bg-white">
        <div className="mx-auto max-w-6xl p-4 text-center text-sm text-gray-500">
          © 2026 Chouha Company
        </div>
      </footer>
    </>
  );
}
