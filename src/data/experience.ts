import type { PlateMotif } from "./projects";

export type Experience = {
  name: string;
  role: string;
  status: string;
  summary: string;
  highlights: string[];
  stack: string[];
  href: string;
  plate: PlateMotif;
};

export const experience: Experience[] = [
  {
    name: "Reskillia",
    role: "Full stack development",
    status: "Live in production",
    summary:
      "A competency-assessment platform. It identifies the strengths and gaps in a team’s digital skills, brings them together in one place and turns them into a clear roadmap for improvement.",
    highlights: [
      "Competency assessment built on the DigComp framework",
      "Asynchronous job pipeline with BullMQ",
      "Multilingual content through a Supabase Edge Function with retries and backfill",
      "Containerised with Docker and deployed on Railway",
    ],
    stack: ["Next.js", "Supabase", "Gemini", "BullMQ", "Docker"],
    href: "https://skillia-dev-production.up.railway.app/es",
    plate: "radar",
  },
];
