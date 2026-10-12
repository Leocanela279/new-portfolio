import { experience } from "@/data/experience";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MaskedHeading } from "@/components/ui/MaskedHeading";
import { EditorialLink } from "@/components/ui/EditorialLink";
import { ProjectPlate } from "@/components/plates/ProjectPlate";

const numerals = ["I", "II", "III", "IV", "V", "VI"];

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="section-space bg-parchment">
      <div className="page-container">
        <div className="grid gap-x-6 lg:grid-cols-12">
          <Eyebrow index="02" className="lg:col-span-12">
            Experience
          </Eyebrow>
          <MaskedHeading
            id="experience-title"
            lines={["In", <span key="p" className="lg:pl-[1.15em]">Production</span>]}
            className="type-section mt-8 lg:col-span-8 lg:mt-12"
          />
        </div>

        <ol className="mt-16 space-y-24 lg:mt-24">
          {experience.map((item) => (
            <li key={item.name}>
              <article className="grid gap-x-6 gap-y-10 border-t border-ink/70 pt-6 lg:grid-cols-12 lg:pt-8" aria-labelledby={`${item.name}-title`}>
                <div className="type-label flex flex-wrap items-center justify-between gap-4 text-stone lg:col-span-12" data-reveal="fade">
                  <p className="text-ink">{item.role}</p>
                  <p className="flex items-center gap-2">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-bronze" />
                    {item.status}
                  </p>
                </div>

                <div className="lg:col-span-6 lg:row-start-2" data-reveal="fade">
                  <h3 id={`${item.name}-title`} className="type-project uppercase">
                    {item.name}
                  </h3>
                  <p className="type-body mt-6 max-w-[34rem] text-stone">{item.summary}</p>

                  <ul className="mt-10 border-t border-rule">
                    {item.highlights.map((highlight, i) => (
                      <li key={highlight} className="flex gap-5 border-b border-rule py-4">
                        <span className="w-8 shrink-0 font-serif text-xl font-light italic leading-[1.4]">{numerals[i]}</span>
                        <span className="type-small">{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="type-label mt-8 text-stone">{item.stack.join(" · ")}</p>

                  <div className="mt-8">
                    <EditorialLink href={item.href} direction="up-right" external>
                      Visit the platform
                    </EditorialLink>
                  </div>
                </div>

                <div className="lg:col-span-5 lg:col-start-8 lg:row-start-2 lg:self-center">
                  <div className="relative aspect-[5/4] overflow-hidden border border-rule" data-reveal="image">
                    <div className="absolute inset-0" data-reveal-zoom>
                      <ProjectPlate motif={item.plate} figure="04" />
                    </div>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
