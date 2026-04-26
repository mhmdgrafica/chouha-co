import { PublicHeader } from "./public-header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicHeader />

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
