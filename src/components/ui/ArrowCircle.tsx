import { ArrowDown, ArrowRight, ArrowUp, ArrowUpRight } from "lucide-react";

const icons = {
  right: ArrowRight,
  "up-right": ArrowUpRight,
  down: ArrowDown,
  up: ArrowUp,
} as const;

type ArrowCircleProps = {
  direction?: keyof typeof icons;
  size?: "sm" | "md" | "lg";
  variant?: "outline" | "solid";
  className?: string;
};

const sizes = {
  sm: { box: "size-9", icon: 14 },
  md: { box: "size-11", icon: 16 },
  lg: { box: "size-20 sm:size-24", icon: 26 },
} as const;

/**
 * Circular arrow used by every call to action. Hover motion is driven by
 * the parent's `group` class, so the whole link reacts, not just the icon.
 */
export function ArrowCircle({
  direction = "right",
  size = "md",
  variant = "outline",
  className = "",
}: ArrowCircleProps) {
  const Icon = icons[direction];
  const { box, icon } = sizes[size];

  const look =
    variant === "solid"
      ? "bg-ink text-ivory group-hover:bg-[#3a3833]"
      : "border border-current/35 group-hover:border-current";

  const shift = {
    right: "group-hover:translate-x-1",
    "up-right": "group-hover:translate-x-1 group-hover:-translate-y-1",
    down: "group-hover:translate-y-1",
    up: "group-hover:-translate-y-1",
  }[direction];

  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full transition-colors duration-[var(--duration-hover)] ease-editorial ${box} ${look} ${className}`}
    >
      <Icon
        size={icon}
        strokeWidth={1.25}
        className={`transition-transform duration-[var(--duration-hover)] ease-editorial ${shift}`}
      />
    </span>
  );
}
