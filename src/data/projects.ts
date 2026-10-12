/**
 * Selected projects shown on the home page.
 *
 * Preview images: drop a screenshot in `src/assets/projects/`, import it
 * here and set `image`. Until then the project shows an engraved
 * schematic plate (`plate`), drawn in code — no stock imagery.
 */

import type { StaticImageData } from "next/image";

export type PlateMotif = "calendar" | "orrery" | "terminal" | "radar";

export type Project = {
  slug: string;
  number: string;
  title: string;
  category: string;
  year: string;
  /** Two short sentences — the layout is designed for roughly two lines. */
  description: string;
  stack: string[];
  href: string;
  /** Text for the call to action, e.g. "Visit site" or "View code". */
  cta: string;
  image?: { src: StaticImageData; alt: string };
  plate: PlateMotif;
};

export const projects: Project[] = [
  {
    slug: "stastarat",
    number: "01",
    title: "stastarat.com",
    category: "Web Platform",
    year: "2026",
    description:
      "Website for Club Stas Tarat. It presents the association, its sections, its calendar and its game library with a clear structure.",
    stack: ["Laravel", "VPS"],
    href: "https://stastarat.com",
    cta: "Visit site",
    plate: "calendar",
  },
  {
    slug: "restaurant-saas",
    number: "02",
    title: "Restaurant SaaS",
    category: "Laravel · Product",
    year: "2026",
    description:
      "A multi-tenant platform built with Laravel for internal management and the day-to-day operations of restaurants.",
    stack: ["Laravel", "Multi-tenant", "SaaS"],
    href: "https://leo-dev.es/login",
    cta: "Open app",
    plate: "orrery",
  },
  {
    slug: "cli-password-manager",
    number: "03",
    title: "CLI Password Manager",
    category: "Go · Local Tool",
    year: "2026",
    description:
      "A local password manager written in Go, designed for a direct experience straight from the terminal.",
    stack: ["Go", "CLI", "Local tool"],
    href: "https://github.com/Leocanela279/cli-password-manager",
    cta: "View code",
    plate: "terminal",
  },
];
