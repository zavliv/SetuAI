import type { Text } from "./i18n";

export type Profile = {
  age: number | null;
  income: "" | "lt1" | "1to25" | "25to5" | "gt5";
  work: "" | "farmer" | "student" | "salaried" | "selfemployed" | "homemaker" | "other";
};

export type Scheme = {
  id: string;
  title: Text;
  why: Text;
  serviceId?: string;
  url: string;
  matches: (p: Profile) => boolean;
};

const lowIncome = (p: Profile) => p.income === "lt1" || p.income === "1to25";

export const schemes: Scheme[] = [
  {
    id: "pm-kisan",
    title: { en: "PM-Kisan", hi: "पीएम-किसान" },
    why: {
      en: "You are a farmer. This scheme sends money to eligible farming families.",
      hi: "आप किसान हैं। यह योजना पात्र किसान परिवारों को पैसे भेजती है।",
    },
    serviceId: "kisan",
    url: "https://pmkisan.gov.in",
    matches: (p) => p.work === "farmer",
  },
  {
    id: "ayushman",
    title: { en: "Ayushman Bharat", hi: "आयुष्मान भारत" },
    why: {
      en: "Your family income is on the lower side. The scheme gives health cover to eligible families.",
      hi: "आपके परिवार की आय कम है। यह योजना पात्र परिवारों को स्वास्थ्य बीमा देती है।",
    },
    serviceId: "ayushman",
    url: "https://pmjay.gov.in",
    matches: lowIncome,
  },
  {
    id: "ration",
    title: { en: "Ration card", hi: "राशन कार्ड" },
    why: {
      en: "Your family income is on the lower side. A ration card gives food grain at low prices.",
      hi: "आपके परिवार की आय कम है। राशन कार्ड से कम दाम पर अनाज मिलता है।",
    },
    serviceId: "ration",
    url: "https://nfsa.gov.in",
    matches: lowIncome,
  },
  {
    id: "scholarship",
    title: { en: "National Scholarship Portal", hi: "राष्ट्रीय छात्रवृत्ति पोर्टल" },
    why: {
      en: "You are a student with a lower family income. Many scholarships ask for an income certificate.",
      hi: "आप विद्यार्थी हैं और परिवार की आय कम है। कई छात्रवृत्तियों में आय प्रमाण पत्र माँगा जाता है।",
    },
    serviceId: "income",
    url: "https://scholarships.gov.in",
    matches: (p) => p.work === "student" && lowIncome(p),
  },
  {
    id: "apy",
    title: { en: "Atal Pension Yojana", hi: "अटल पेंशन योजना" },
    why: {
      en: "It is meant for people aged 18 to 40 who want a pension in old age.",
      hi: "यह 18 से 40 साल के उन लोगों के लिए है जो बुढ़ापे में पेंशन चाहते हैं।",
    },
    url: "https://www.pfrda.org.in",
    matches: (p) => p.age !== null && p.age >= 18 && p.age <= 40,
  },
  {
    id: "mudra",
    title: { en: "PM Mudra Yojana", hi: "पीएम मुद्रा योजना" },
    why: {
      en: "You run your own work. This scheme gives loans to small businesses.",
      hi: "आप अपना काम करते हैं। यह योजना छोटे व्यवसायों को लोन देती है।",
    },
    url: "https://www.mudra.org.in",
    matches: (p) => p.work === "selfemployed",
  },
  {
    id: "itr",
    title: { en: "Income tax return", hi: "आयकर रिटर्न" },
    why: {
      en: "Your income may be above the tax-free limit, so you may need to file a return.",
      hi: "आपकी आय टैक्स-मुक्त सीमा से ज़्यादा हो सकती है, इसलिए आपको रिटर्न भरना पड़ सकता है।",
    },
    serviceId: "itr",
    url: "https://www.incometax.gov.in",
    matches: (p) => (p.income === "25to5" || p.income === "gt5") && (p.work === "salaried" || p.work === "selfemployed"),
  },
];
