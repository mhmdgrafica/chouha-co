export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#e6dfd3] bg-[#f8f6f2]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="text-lg font-semibold tracking-tight text-[#1f2f4d]">
            Chouha
          </div>

          <nav className="flex items-center gap-8 text-sm font-medium text-[#5b6472]">
            <a href="/" className="transition hover:text-[#1f2f4d]">
              Home
            </a>
            <a href="/products" className="transition hover:text-[#1f2f4d]">
              Products
            </a>
            <a href="/about" className="transition hover:text-[#1f2f4d]">
              About
            </a>
            <a href="/contact" className="transition hover:text-[#1f2f4d]">
              Contact
            </a>
          </nav>

          <a
            href="/contact"
            className="hidden rounded-lg bg-[#243b6b] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 md:inline-flex"
          >
            Inquiry
          </a>
        </div>
      </header>

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