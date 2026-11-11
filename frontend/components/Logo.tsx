export default function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={className}>
      <rect width="32" height="32" rx="8" fill="#27408B" />
      <path d="M6 21Q16 7 26 21" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M5 21H27" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M11.5 21v-3.4M16 21v-6M20.5 21v-3.4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-serif text-xl font-semibold tracking-tight text-ink ${className}`}>
      Setu<span className="text-brand">AI</span>
    </span>
  );
}
