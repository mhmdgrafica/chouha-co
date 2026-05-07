import { cookies } from "next/headers";
import "./globals.css";
import {
  PUBLIC_LANGUAGE_COOKIE,
  resolvePublicLang,
} from "./(public)/copy/shared";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const lang = resolvePublicLang(cookieStore.get(PUBLIC_LANGUAGE_COOKIE)?.value);

  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <body>{children}</body>
    </html>
  );
}
