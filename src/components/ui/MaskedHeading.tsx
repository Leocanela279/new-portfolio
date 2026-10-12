type HeadingTag = "h1" | "h2" | "h3";

type MaskedHeadingProps = {
  as?: HeadingTag;
  lines: React.ReactNode[];
  className?: string;
  id?: string;
  /** Set on hero lines so the intro timeline can find them. */
  heroItem?: boolean;
};

/**
 * A heading split into explicit lines, each inside an overflow mask so it
 * can slide up into view. The full text stays in the DOM as one heading,
 * so screen readers and search engines read it normally.
 */
export function MaskedHeading({
  as: Tag = "h2",
  lines,
  className = "",
  id,
  heroItem = false,
}: MaskedHeadingProps) {
  return (
    <Tag id={id} className={className} data-reveal={heroItem ? undefined : "lines"}>
      {lines.map((line, i) => (
        <span key={i} className="mask-line">
          <span className="mask-line-inner" data-hero-item={heroItem ? "line" : undefined}>
            {line}
          </span>
          {/* Keeps words separated when the heading is read as plain text. */}
          {i < lines.length - 1 && <span className="sr-only"> </span>}
        </span>
      ))}
    </Tag>
  );
}
