export default function BridgeDivider({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden className={`block h-6 w-full text-brand/25 ${className}`}>
      <defs>
        <pattern id="bridge-arches" width="48" height="24" patternUnits="userSpaceOnUse">
          <path d="M0 24Q24 -4 48 24" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </pattern>
      </defs>
      <rect width="100%" height="24" fill="url(#bridge-arches)" />
    </svg>
  );
}
