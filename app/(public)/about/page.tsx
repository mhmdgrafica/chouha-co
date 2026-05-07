import { cookies } from "next/headers";
import { PUBLIC_LANGUAGE_COOKIE, resolvePublicLang } from "../copy/shared";

const copy = {
  en: {
    title: "About Us",
    intro:
      "Welcome to CHOUHA FOR IMPORT & EXPORT L.L.C. A third-generation family business with over 90 years of experience in Syria.",
    historyTitle: "Our History",
    history: [
      "In 1928, the late Goffril Ghanem Chouha opened a modest bookshop in Aleppo, Syria, selling books and writing instruments.",
      "In the late 1960s, the second generation transformed the business into a wholesale company, offering renowned brands of writing instruments, FMCG and office supplies.",
      "At the beginning of the 21st century, the third generation expanded the company, transforming it into a nationwide distribution business built on honesty, integrity, and trust.",
      "Despite the challenges since 2012, Chouha adapted and remained a market leader across Syria.",
    ],
    missionTitle: "Our Mission",
    mission:
      "We are committed to building long-lasting relationships with partners, clients, and employees. Guided by honesty, integrity, and trust, we aim to grow continuously on strong family values.",
  },
  ar: {
    title: "من نحن",
    intro:
      "أهلاً بكم في شركة شوحا للاستيراد والتصدير. شركة عائلية بجيلها الثالث تمتلك أكثر من 90 عاماً من الخبرة في سورية.",
    historyTitle: "تاريخنا",
    history: [
      "في عام 1928، أسس الراحل غغريل غانم شوحا مكتبة متواضعة في حلب لبيع الكتب واللوازم المكتبية.",
      "في أواخر الستينات، تم تطوير العمل ليصبح شركة مبيع بالجملة تقدم علامات تجارية معروفة.",
      "مع بداية القرن الواحد والعشرين، تطورت الشركة لتصبح شركة توزيع تغطي كامل السوق السورية مع الحفاظ على قيم الصدق والنزاهة والثقة.",
      "رغم التحديات منذ عام 2012، استمرت شوحا في الحفاظ على مكانتها كشركة رائدة في السوق.",
    ],
    missionTitle: "مهمتنا",
    mission:
      "نلتزم ببناء علاقات طويلة الأمد مع شركائنا وعملائنا وموظفينا، ونعمل وفق قيم الصدق والنزاهة والثقة، مع السعي المستمر للنمو.",
  },
} as const;

export default async function AboutPage() {
  const cookieStore = await cookies();
  const lang = resolvePublicLang(cookieStore.get(PUBLIC_LANGUAGE_COOKIE)?.value);
  const isArabic = lang === "ar";
  const t = copy[lang];

  return (
    <div className="space-y-12">
      <section className="rounded-[28px] bg-[#f3efe7] p-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold text-[#003b51]">
            {t.title}
          </h1>

          <p className="mt-4 text-lg leading-8 text-[#4f5a69]">
            {t.intro}
          </p>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#e6dfd3] bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-[#003b51]">
          {t.historyTitle}
        </h2>

        <div className="mt-6 space-y-4">
          {t.history.map((item, index) => (
            <div key={index} className="flex gap-3">
              <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#003b51]" />
              <p
                className={`text-[15px] leading-7 text-[#4f5a69] ${
                  isArabic ? "font-arabic-medium" : ""
                }`}
              >
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-[#e6dfd3] bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-[#003b51]">
          {t.missionTitle}
        </h2>

        <p
          className={`mt-4 text-[15px] leading-8 text-[#4f5a69] ${
            isArabic ? "font-arabic-medium" : ""
          }`}
        >
          {t.mission}
        </p>
      </section>
    </div>
  );
}
