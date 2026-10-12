export type ExpertiseArea = {
  number: string;
  title: string;
  /** Short keywords shown at the end of the row. */
  topics: string;
};

export const expertise: ExpertiseArea[] = [
  {
    number: "01",
    title: "Software Engineering",
    topics: "Laravel · Go · Next.js",
  },
  {
    number: "02",
    title: "Systems & Infrastructure",
    topics: "Docker · VPS · Railway",
  },
  {
    number: "03",
    title: "Networks & Protocols",
    topics: "Sockets · TCP/IP · SMTP",
  },
  {
    number: "04",
    title: "Artificial Intelligence",
    topics: "Gemini · AI-assisted products",
  },
];
