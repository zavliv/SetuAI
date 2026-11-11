import { services, type Service } from "./data";
import type { Lang, Strings } from "./i18n";

function findService(question: string): Service | null {
  const q = question.toLowerCase();
  let best: Service | null = null;
  let bestScore = 0;
  for (const service of services) {
    for (const keyword of service.keywords) {
      if (q.includes(keyword.toLowerCase()) && keyword.length > bestScore) {
        best = service;
        bestScore = keyword.length;
      }
    }
  }
  return best;
}

export function buildAnswer(question: string, lang: Lang, t: Strings): { text: string; serviceId?: string } {
  const service = findService(question);

  if (!service) {
    const list = services.map((s) => `- ${s.title[lang]}`).join("\n");
    return { text: `${t.chat.unsure}\n\n${list}\n\n${t.chat.unsureEnd} [services.india.gov.in](https://services.india.gov.in)` };
  }

  const docs = service.docs.map((d) => `- ${d[lang]}`).join("\n");
  const steps = service.steps.map((s, i) => `${i + 1}. ${s[lang]}`).join("\n");
  const mistakes = service.mistakes.map((m) => `- ${m[lang]}`).join("\n");

  const text = [
    `**${service.title[lang]}**`,
    service.summary[lang],
    `### ${t.chat.papers}\n${docs}`,
    `### ${t.chat.steps}\n${steps}`,
    `### ${t.chat.mistakes}\n${mistakes}`,
    `### ${t.chat.feeTime}\n${t.service.fee_text} ${t.service.time_text}`,
    `### ${t.chat.official}\n[${service.link.label}](${service.link.url})`,
    `*${t.chat.sampleNote}*`,
  ].join("\n\n");

  return { text, serviceId: service.id };
}
