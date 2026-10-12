import { ArrowCircle } from "./ArrowCircle";

type EditorialLinkProps = {
  href: string;
  children: React.ReactNode;
  direction?: "right" | "up-right" | "down";
  /** Show the thin leading rule (hero style) or not (inline style). */
  rule?: boolean;
  className?: string;
  external?: boolean;
};

/**
 * Editorial call to action: thin rule, uppercase label, outlined circular
 * arrow. Never a filled rectangle.
 */
export function EditorialLink({
  href,
  children,
  direction = "right",
  rule = true,
  className = "",
  external = false,
}: EditorialLinkProps) {
  return (
    <a
      href={href}
      className={`group inline-flex min-h-11 items-center gap-4 ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {rule && (
        <span
          aria-hidden="true"
          className="h-px w-10 origin-left bg-current transition-[width] duration-[var(--duration-hover)] ease-editorial group-hover:w-16"
        />
      )}
      <span className="type-nav transition-transform duration-[var(--duration-hover)] ease-editorial group-hover:translate-x-1">
        {children}
      </span>
      <ArrowCircle direction={direction} />
    </a>
  );
}
