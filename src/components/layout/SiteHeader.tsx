"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navItems, siteConfig } from "@/config/site";
import { Monogram } from "@/components/ui/Monogram";

/**
 * Fixed navigation. Transparent over the hero, then settles into a solid
 * ivory surface with a hairline once the page scrolls. On small screens the
 * links move into a full-screen panel.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu: lock page scroll, close on Escape, move focus in and back out.
  useEffect(() => {
    if (!menuOpen) return;

    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    const menuButton = menuButtonRef.current;
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      menuButton?.focus();
    };
  }, [menuOpen]);

  // Close the panel if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onChange = () => desktop.matches && setMenuOpen(false);
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  const solid = scrolled || menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500 ease-editorial ${
        solid ? "border-rule bg-ivory" : "border-transparent bg-transparent"
      }`}
    >
      <div className="page-container flex h-[var(--nav-height)] items-center justify-between lg:grid lg:grid-cols-12 lg:gap-6">
        <a
          href="#top"
          className="relative z-10 -ml-1 inline-flex min-h-11 min-w-11 items-center px-1 text-[30px] lg:col-span-3 lg:text-[34px]"
          aria-label={`${siteConfig.name} — home`}
          onClick={() => setMenuOpen(false)}
        >
          <Monogram />
        </a>

        <nav aria-label="Primary" className="hidden lg:col-span-6 lg:flex lg:justify-center">
          <ul className="flex items-center gap-7 xl:gap-11">
            {navItems.map((item, i) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group type-nav relative inline-flex min-h-11 items-center gap-2"
                >
                  <span className="text-[9px] tracking-[0.1em] text-stone">0{i + 1}</span>
                  <span className="relative">
                    {item.label}
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-[var(--duration-hover)] ease-editorial group-hover:origin-left group-hover:scale-x-100"
                    />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center justify-end gap-3 lg:col-span-3 lg:flex">
          <span className="type-nav whitespace-nowrap">
            <span className="xl:hidden">{siteConfig.roleShort}</span>
            <span className="hidden xl:inline">{siteConfig.role}</span>
          </span>
          <span aria-hidden="true" className="relative inline-flex size-3.5 items-center justify-center rounded-full border border-ink/45">
            <span className="size-1 rounded-full bg-bronze" />
          </span>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="relative z-10 -mr-2 inline-flex size-11 items-center justify-center lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} strokeWidth={1.25} /> : <Menu size={22} strokeWidth={1.25} />}
        </button>
      </div>

      <MobileMenu open={menuOpen} onNavigate={() => setMenuOpen(false)} firstLinkRef={firstLinkRef} />
    </header>
  );
}

type MobileMenuProps = {
  open: boolean;
  onNavigate: () => void;
  firstLinkRef: React.RefObject<HTMLAnchorElement | null>;
};

function MobileMenu({ open, onNavigate, firstLinkRef }: MobileMenuProps) {
  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!open}
      // Visibility flips instantly on open (so focus can land) and only
      // after the fade on close.
      className={`fixed inset-x-0 bottom-0 top-[var(--nav-height)] flex flex-col bg-ivory duration-500 ease-editorial lg:hidden ${
        open ? "visible opacity-100 transition-opacity" : "invisible opacity-0 transition-[opacity,visibility]"
      }`}
    >
      <nav aria-label="Mobile" className="page-container flex flex-1 flex-col justify-center">
        <ul>
          {navItems.map((item, i) => (
            <li key={item.href} className="border-b border-rule first:border-t">
              <a
                ref={i === 0 ? firstLinkRef : undefined}
                href={item.href}
                onClick={onNavigate}
                className={`flex min-h-11 items-baseline justify-between py-5 transition-transform duration-700 ease-editorial ${
                  open ? "translate-y-0" : "translate-y-3"
                }`}
                style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
              >
                <span className="font-serif text-[clamp(2.75rem,12vw,4.5rem)] font-light uppercase leading-none tracking-[-0.04em]">
                  {item.label}
                </span>
                <span className="type-label text-stone">0{i + 1}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="page-container flex flex-wrap items-center justify-between gap-x-6 gap-y-1 pb-8">
        <span className="type-label text-stone">{siteConfig.role}</span>
        <div className="flex gap-6">
          <a href={siteConfig.social.github} className="type-label inline-flex min-h-11 items-center" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={siteConfig.social.gitlab} className="type-label inline-flex min-h-11 items-center" target="_blank" rel="noopener noreferrer">
            GitLab
          </a>
        </div>
      </div>
    </div>
  );
}
