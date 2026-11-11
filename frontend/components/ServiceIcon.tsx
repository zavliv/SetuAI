import type { ReactNode } from "react";

const paths: Record<string, ReactNode> = {
  pan: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 10h6M7 14h4M16 10h1M15.5 14h2" />
    </>
  ),
  aadhaar: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2.2" />
      <path d="M5.5 16c.6-2 2-3 3.5-3s2.9 1 3.5 3M15 9h3M15 12h3" />
    </>
  ),
  passport: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M9 10h6M12 7c1.5 1.5 1.5 4.5 0 6M9 17h6" />
    </>
  ),
  voter: (
    <>
      <rect x="4" y="12" width="16" height="8" rx="1.5" />
      <path d="M8 7l2.5 2.5L16 4" />
    </>
  ),
  licence: (
    <>
      <path d="M5 15l1.5-5a2 2 0 0 1 1.9-1.5h7.2a2 2 0 0 1 1.9 1.5L19 15" />
      <rect x="3.5" y="15" width="17" height="4" rx="1.5" />
      <path d="M7.5 17h.01M16.5 17h.01" />
    </>
  ),
  ration: (
    <>
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </>
  ),
  income: (
    <>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4M10 12h5M10 15h5M10 18h3" />
    </>
  ),
  kisan: (
    <>
      <path d="M12 21v-9" />
      <path d="M12 12c0-3.5-2.5-5.5-6-5.5 0 3.5 2.5 5.5 6 5.5z" />
      <path d="M12 14c0-3 2.2-5 6-5 0 3-2.2 5-6 5z" />
    </>
  ),
  ayushman: (
    <>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
      <path d="M12 9v4M10 11h4" />
    </>
  ),
  itr: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" />
    </>
  ),
};

export default function ServiceIcon({ id, className = "size-6" }: { id: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {paths[id]}
    </svg>
  );
}
