// Small stroke icons, sized and coloured by the parent's text classes.

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const ArrowUpIcon = ({ className = "size-4" }: IconProps) => (
  <svg {...base} className={className}><path d="M12 19V5M5 12l7-7 7 7" /></svg>
);

export const StopIcon = ({ className = "size-3.5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}><rect x="5" y="5" width="14" height="14" rx="2" /></svg>
);

export const PlusIcon = ({ className = "size-4" }: IconProps) => (
  <svg {...base} className={className}><path d="M12 5v14M5 12h14" /></svg>
);

export const CopyIcon = ({ className = "size-3.5" }: IconProps) => (
  <svg {...base} className={className}><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
);

export const CheckIcon = ({ className = "size-3.5" }: IconProps) => (
  <svg {...base} className={className}><path d="M5 12l5 5L20 7" /></svg>
);

export const RetryIcon = ({ className = "size-3.5" }: IconProps) => (
  <svg {...base} className={className}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
);

export const ArrowDownIcon = ({ className = "size-4" }: IconProps) => (
  <svg {...base} className={className}><path d="M12 5v14M5 12l7 7 7-7" /></svg>
);

export const ArrowRightIcon = ({ className = "size-4" }: IconProps) => (
  <svg {...base} className={className}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
);

export const ExternalIcon = ({ className = "size-4" }: IconProps) => (
  <svg {...base} className={className}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
);

export const SearchIcon = ({ className = "size-4" }: IconProps) => (
  <svg {...base} className={className}><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
);

export const ShareIcon = ({ className = "size-4" }: IconProps) => (
  <svg {...base} className={className}><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6" /></svg>
);

export const MenuIcon = ({ className = "size-5" }: IconProps) => (
  <svg {...base} className={className}><path d="M4 6h16M4 12h16M4 18h16" /></svg>
);

export const SidebarIcon = ({ className = "size-5" }: IconProps) => (
  <svg {...base} className={className}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" /></svg>
);

export const TrashIcon = ({ className = "size-4" }: IconProps) => (
  <svg {...base} className={className}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3" /></svg>
);

export const GridIcon = ({ className = "size-4" }: IconProps) => (
  <svg {...base} className={className}><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></svg>
);

export const CompassIcon = ({ className = "size-4" }: IconProps) => (
  <svg {...base} className={className}><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></svg>
);

export const ShieldIcon = ({ className = "size-4" }: IconProps) => (
  <svg {...base} className={className}><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" /><path d="M9 12l2 2 4-4" /></svg>
);

export const ChevronUpIcon = ({ className = "size-4" }: IconProps) => (
  <svg {...base} className={className}><path d="M6 15l6-6 6 6" /></svg>
);

export const CloseIcon = ({ className = "size-5" }: IconProps) => (
  <svg {...base} className={className}><path d="M6 6l12 12M18 6L6 18" /></svg>
);

export const EyeIcon = ({ className = "size-5" }: IconProps) => (
  <svg {...base} className={className}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
);

export const EyeOffIcon = ({ className = "size-5" }: IconProps) => (
  <svg {...base} className={className}><path d="M3 3l18 18M10.6 6.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.5 6.9C3.7 8.7 2 12 2 12s3.5 7 10 7c1.6 0 3-.4 4.2-1M9.9 9.9a3 3 0 0 0 4.2 4.2" /></svg>
);

export const ChatIcon = ({ className = "size-6" }: IconProps) => (
  <svg {...base} className={className}><path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-8l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" /><path d="M8 10h8M8 13h5" /></svg>
);

export const ListCheckIcon = ({ className = "size-6" }: IconProps) => (
  <svg {...base} className={className}><path d="M10 6h10M10 12h10M10 18h10" /><path d="M3.5 6l1.5 1.5L7.5 5M3.5 12l1.5 1.5L7.5 11M3.5 18l1.5 1.5L7.5 17" /></svg>
);

export const QuestionIcon = ({ className = "size-6" }: IconProps) => (
  <svg {...base} className={className}><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01" /></svg>
);
