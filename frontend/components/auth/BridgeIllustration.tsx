const ticks = Array.from({ length: 22 }, (_, i) => 20 + i * 20);
const wave = (y: number) => {
  let d = `M0 ${y}`;
  for (let x = 0; x < 480; x += 40) d += ` q10 -8 20 0 t20 0`;
  return d;
};

export default function BridgeIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 230" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden className={className}>
      <g strokeWidth="3">
        <path d="M10 110H470" />
        <path d="M20 170Q90 70 160 170M160 170Q230 70 300 170M300 170Q370 70 440 170" />
      </g>
      <g strokeWidth="2" opacity="0.7">
        <path d="M20 110V192M160 110V192M300 110V192M440 110V192" />
        {ticks.map((x) => (
          <path key={x} d={`M${x} 98V110`} />
        ))}
      </g>
      <g strokeWidth="2">
        <path d={wave(196)} opacity="0.6" />
        <path d={wave(208)} opacity="0.4" />
        <path d={wave(220)} opacity="0.25" />
      </g>
    </svg>
  );
}
