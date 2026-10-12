import { ArrowUp } from "lucide-react";
import { navItems, siteConfig } from "@/config/site";
import { Monogram } from "@/components/ui/Monogram";
import { CurrentYear } from "@/components/ui/CurrentYear";
import { AsciiAthens } from "./AsciiAthens";

const linkClass =
  "type-nav relative inline-flex min-h-11 items-center transition-colors duration-300 hover:text-stone";

export function SiteFooter() {
  const elsewhere = [
    { label: "GitHub", href: siteConfig.social.github, external: true },
    { label: "GitLab", href: siteConfig.social.gitlab, external: true },
    { label: "CV", href: siteConfig.cvUrl, external: true },
    { label: "Email", href: `mailto:${siteConfig.email}`, external: false },
  ];

  return (
    <footer className="border-t border-rule bg-ivory">
      {/* Above the closing rule: Athens in colour ASCII behind everything.
          The bottom padding leaves the city clear of the text. */}
      <div className="relative isolate overflow-hidden">
        <AsciiAthens />

        <div className="ascii-legible page-container pb-[80vw] lg:pb-[34vw]">
          {/* Index */}
          <div className="grid items-start gap-10 pt-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6 lg:pt-16">
            <a
              href="#top"
              className="inline-flex text-[44px] sm:col-span-2 lg:col-span-3"
              aria-label={`${siteConfig.name} — back to top`}
            >
              <Monogram />
            </a>

            <nav aria-label="Footer" className="lg:col-span-5 lg:col-start-4 xl:col-span-4 xl:col-start-5">
              <ul className="grid grid-cols-2 gap-x-8 sm:flex sm:flex-wrap sm:gap-x-10 lg:gap-x-8 xl:gap-x-10">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className={linkClass}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <ul className="grid grid-cols-2 gap-x-8 sm:flex sm:flex-wrap sm:justify-end sm:gap-x-10 lg:col-span-4 lg:col-start-9">
              {elsewhere.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={linkClass}
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* The inscription, set in the sky above the city. */}
          <div className="mt-16 max-w-[34rem] sm:mt-24 lg:mt-20" data-reveal="fade">
            <p className="type-label text-stone">Fig. III — Inscription</p>
            <p className="mt-6 max-w-[15em] font-serif text-[clamp(2rem,3.2vw,3rem)] font-light italic leading-[1.06] tracking-[-0.02em]">
              “Let no one ignorant of geometry enter.”
            </p>
            <p className="type-label mt-6 text-stone">Said to be carved above the door of Plato’s Academy</p>
          </div>
        </div>
      </div>

      {/* The plinth everything stands on. */}
      <div className="relative border-t border-rule bg-ivory">
        <div className="page-container flex flex-col-reverse gap-4 pb-10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-label text-stone">
            © <CurrentYear /> — {siteConfig.name}
          </p>
          <a href="#top" className="group type-label inline-flex min-h-11 items-center gap-2 self-start sm:self-auto">
            Back to top
            <ArrowUp
              size={12}
              strokeWidth={1.5}
              aria-hidden="true"
              className="transition-transform duration-300 ease-editorial group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
