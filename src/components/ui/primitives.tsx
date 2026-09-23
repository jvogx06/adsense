import Link from "next/link";
import type { ReactNode } from "react";
import { CategoryIcon, iconForSlug, type CategoryIconName } from "@/components/ui/CategoryIcon";

/** Soft rounded tile holding a decorative category icon (navy-green on tint). */
export function IconTile({
  name,
  size = 24,
  className = "",
}: {
  name: CategoryIconName;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-primary/5 text-primary ${className}`}
    >
      <CategoryIcon name={name} size={size} />
    </span>
  );
}

export function Container({
  children,
  className = "",
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`mx-auto ${wide ? "max-w-[1280px]" : "max-w-[1120px]"} px-4 sm:px-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "section" | "li";
}) {
  return (
    <Tag
      className={`rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-card ${className}`}
    >
      {children}
    </Tag>
  );
}

/** A card that is entirely a link (used for navigation tiles). */
export function LinkCard({
  href,
  title,
  description,
  eyebrow,
  icon,
  className = "",
}: {
  href: string;
  title: string;
  description?: string;
  eyebrow?: string;
  icon?: CategoryIconName;
  className?: string;
}) {
  // Auto-resolve a category icon from the href when one isn't passed, so hub
  // and homepage cards get consistent icons without per-card wiring. Unmapped
  // links (e.g. state guides) resolve to undefined and render no icon.
  const resolvedIcon = icon ?? iconForSlug(href);
  return (
    <Link
      href={href}
      className={`group block rounded-[var(--radius-card)] border border-border bg-surface p-5 no-underline shadow-card transition-colors hover:border-primary ${className}`}
    >
      {resolvedIcon && <IconTile name={resolvedIcon} className="mb-3" />}
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">
          {eyebrow}
        </span>
      )}
      <h3 className="mt-1 text-base font-semibold text-primary-dark group-hover:text-primary">
        {title}
      </h3>
      {description && <p className="mt-1.5 text-sm text-muted">{description}</p>}
    </Link>
  );
}

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
}: {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}) {
  const base =
    "inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold no-underline transition-colors min-h-11";
  const styles =
    variant === "primary"
      ? "bg-primary text-white hover:bg-primary-dark"
      : "border border-border bg-surface text-primary-dark hover:border-primary";
  const cls = `${base} ${styles} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function SectionHeading({
  title,
  intro,
  id,
}: {
  title: string;
  intro?: string;
  id?: string;
}) {
  return (
    <div className="mb-6 max-w-2xl">
      <h2 id={id} className="text-2xl font-bold text-text">
        {title}
      </h2>
      {intro && <p className="mt-2 text-muted">{intro}</p>}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-wide text-primary">
      {children}
    </span>
  );
}

export function TrustBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
      {children}
    </span>
  );
}
