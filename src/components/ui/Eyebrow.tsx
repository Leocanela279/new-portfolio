type EyebrowProps = {
  index?: string;
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
};

/** Small editorial label: "01 / Selected Work". */
export function Eyebrow({ index, children, className = "", tone = "light" }: EyebrowProps) {
  const muted = tone === "dark" ? "text-on-night-muted" : "text-stone";
  const strong = tone === "dark" ? "text-on-night" : "text-ink";

  return (
    <p className={`type-label flex items-center gap-3 ${muted} ${className}`}>
      {index && (
        <>
          <span className={strong}>{index}</span>
          <span aria-hidden="true">/</span>
        </>
      )}
      <span>{children}</span>
    </p>
  );
}
