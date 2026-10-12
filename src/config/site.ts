/**
 * Site-wide settings. Everything personal lives here so it can be edited
 * in one place without touching the components.
 *
 * The email and site URL can also be set through environment variables.
 */

export const siteConfig = {
  name: "Leandro Canela",
  role: "Computer Science Student",
  roleShort: "CS Student", // used where space is tight
  description:
    "Full stack web developer with a stronger focus on the backend. I like projects that pose a real technical challenge and have a clear use.",

  // Used for absolute URLs in metadata (Open Graph). Set it to the deployed domain.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "leandrocanela279@gmail.com",

  social: {
    github: "https://github.com/Leocanela279",
    gitlab: "https://gitlab.com/leandrocanela279",
  },

  cvUrl: "https://porfoli-leo.vercel.app/cvLeo.pdf",
} as const;

export const navItems = [
  { label: "Home", href: "#top" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;
