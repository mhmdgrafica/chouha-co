import { contactPageCopy } from "../copy/contact-copy";
import { resolvePublicLang } from "../copy/shared";

type ContactPageProps = {
  searchParams?: Promise<{
    lang?: string;
  }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const lang = resolvePublicLang(resolvedSearchParams?.lang);
  const isArabic = lang === "ar";
  const t = contactPageCopy[lang];

  const cards = [
    { title: t.phoneTitle, value: t.phoneValue },
    { title: t.emailTitle, value: t.emailValue },
    { title: t.addressTitle, value: t.addressValue },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] bg-[#f3efe7] p-6 md:p-8 lg:p-10">
        <div className={`max-w-3xl ${isArabic ? "mr-auto text-right" : ""}`}>
          <span className="inline-flex rounded-full border border-[#d8d1c4] bg-white px-3 py-1 text-xs font-medium tracking-wide text-[#243b6b]">
            {t.badge}
          </span>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#1f2f4d] md:text-5xl">
            {t.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#5b6472]">
            {t.description}
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`rounded-[24px] border border-[#e6dfd3] bg-white p-5 shadow-sm ${
              isArabic ? "text-right" : ""
            }`}
          >
            <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#7b8796]">
              {card.title}
            </p>
            <p className="mt-3 text-lg font-semibold text-[#1f2f4d]">{card.value}</p>
          </div>
        ))}
      </section>

      <section
        className={`rounded-[24px] border border-[#e6dfd3] bg-white p-6 shadow-sm ${
          isArabic ? "text-right" : ""
        }`}
      >
        <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#7b8796]">
          {t.noteTitle}
        </p>
        <p className="mt-3 text-[15px] leading-7 text-[#4f5a69]">{t.noteBody}</p>
      </section>
    </div>
  );
}
