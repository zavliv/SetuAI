import { CheckIcon } from "../icons";

type Props = { steps: string[]; current: number; label: string };

export default function Stepper({ steps, current, label }: Props) {
  return (
    <ol className="flex items-center" aria-label={label}>
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const last = i === steps.length - 1;
        return (
          <li key={step} aria-current={active ? "step" : undefined} className={`flex items-center ${last ? "" : "flex-1"}`}>
            <span
              className={`grid size-6 shrink-0 place-items-center rounded-full border text-xs font-semibold transition-colors ${
                done
                  ? "border-brand bg-brand text-white"
                  : active
                    ? "border-brand bg-tint text-brand ring-4 ring-brand/10"
                    : "border-line bg-white text-muted"
              }`}
            >
              {done ? <CheckIcon className="size-3.5" /> : i + 1}
            </span>
            <span className={`ml-2 text-xs font-semibold whitespace-nowrap ${active || done ? "text-ink" : "text-muted"}`}>{step}</span>
            {!last && <span className={`mx-3 h-px flex-1 transition-colors ${done ? "bg-brand" : "bg-line"}`} />}
          </li>
        );
      })}
    </ol>
  );
}
