type MonogramProps = {
  className?: string;
};

/**
 * "LC" — an upright L leaning into an italic C, set tight like a
 * stonecutter's ligature. Purely typographic, no image asset.
 */
export function Monogram({ className = "" }: MonogramProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-baseline font-serif leading-none tracking-[-0.12em] ${className}`}
    >
      <span className="font-normal">L</span>
      <span className="-ml-[0.04em] font-light italic">C</span>
    </span>
  );
}
