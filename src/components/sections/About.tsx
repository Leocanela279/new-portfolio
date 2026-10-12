import Image from "next/image";
import observer from "@/assets/images/delos-observer.jpg";
import { siteConfig } from "@/config/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MaskedHeading } from "@/components/ui/MaskedHeading";
import { EditorialLink } from "@/components/ui/EditorialLink";

const facts = [
  { numeral: "I", label: "Backend" },
  { numeral: "II", label: "Laravel · Go" },
  { numeral: "III", label: "SaaS · CLI" },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section-space bg-ivory">
      <div className="page-container grid gap-x-6 gap-y-14 lg:grid-cols-12">
        <figure className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden bg-parchment" data-reveal="image">
            <div className="absolute inset-x-0 -bottom-[8%] -top-[8%]" data-parallax="inner">
              <Image
                src={observer}
                alt="A marble statue in a laurel crown stands between classical columns, looking out over a river valley toward distant mountains."
                fill
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover object-[40%_50%]"
              />
            </div>
          </div>
          <figcaption className="type-label mt-4 flex justify-between gap-6 text-stone">
            <span>Fig. II — The observer</span>
            <span className="hidden sm:inline">Detail of the hero landscape</span>
          </figcaption>
        </figure>

        <div className="lg:col-span-6 lg:col-start-7 lg:self-center">
          <Eyebrow index="03">About me</Eyebrow>
          <MaskedHeading
            id="about-title"
            lines={["Engineering", "Ideas into", "Reality"]}
            className="type-section mt-8 lg:mt-10"
          />

          <div className="type-body mt-10 max-w-[30rem] space-y-5 text-stone lg:mt-12" data-reveal="fade">
            <p>
              I’m a full stack web developer with a stronger interest in the backend: business logic,
              internal tools and applications with a solid structure.
            </p>
            <p>
              I study computer science and I’m drawn to systems, networks and AI — projects that pose a
              real technical challenge and have a clear use.
            </p>
          </div>

          <div className="mt-9" data-reveal="fade">
            <EditorialLink href={siteConfig.cvUrl} direction="up-right" rule={false} external>
              Read my CV
            </EditorialLink>
          </div>

          <ul className="mt-14 grid grid-cols-3 gap-4 sm:gap-6 lg:mt-20" data-reveal="stagger">
            {facts.map((fact) => (
              <li key={fact.label} className="border-t border-ink/70 pt-4">
                <span className="block font-serif text-2xl font-light italic leading-none">{fact.numeral}</span>
                <span className="type-label mt-3 block">{fact.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
