import type { PublicLang } from "./shared";

export const contactPageCopy = {
  en: {
    badge: "CONTACT",
    title: "Let’s talk about products, brands, and supply requests.",
    description:
      "Use this page as your editable contact surface. You can replace every line manually with your preferred English and Arabic wording.",
    phoneTitle: "Phone",
    phoneValue: "+963 XXX XXX XXX",
    emailTitle: "Email",
    emailValue: "info@chouha.com",
    addressTitle: "Address",
    addressValue: "Damascus, Syria",
    noteTitle: "Manual editing",
    noteBody:
      "All text on this page now comes from a simple front-end copy file, so you can rewrite it manually without any i18n library.",
  },
  ar: {
    badge: "تواصل",
    title: "لنتحدث عن المنتجات والبراندات وطلبات التوريد.",
    description:
      "استخدم هذه الصفحة كنقطة تواصل قابلة للتعديل. يمكنك استبدال كل سطر يدويًا بالنص العربي والإنكليزي الذي تفضله.",
    phoneTitle: "الهاتف",
    phoneValue: "+963 XXX XXX XXX",
    emailTitle: "البريد الإلكتروني",
    emailValue: "info@chouha.com",
    addressTitle: "العنوان",
    addressValue: "دمشق، سوريا",
    noteTitle: "تعديل يدوي",
    noteBody:
      "كل نصوص هذه الصفحة أصبحت قادمة من ملف front-end بسيط، لذلك يمكنك إعادة كتابتها يدويًا بدون أي مكتبة ترجمة.",
  },
} as const satisfies Record<PublicLang, Record<string, string>>;
