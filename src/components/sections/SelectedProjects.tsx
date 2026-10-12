import Image from "next/image";
import { projects, type Project } from "@/data/projects";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MaskedHeading } from "@/components/ui/MaskedHeading";
import { ArrowCircle } from "@/components/ui/ArrowCircle";
import { ProjectPlate } from "@/components/plates/ProjectPlate";

/**
 * Four compositions that alternate the side and scale of the preview, so the
 * list reads like spreads in a magazine rather than a grid of cards.
 */
const compositions = [
  { media: "lg:col-start-6 lg:col-span-7", text: "lg:col-start-1 lg:col-span-4 lg:row-start-1", aspect: "lg:aspect-[16/10]" },
  { media: "lg:col-start-1 lg:col-span-6", text: "lg:col-start-8 lg:col-span-5", aspect: "lg:aspect-[4/3.3]" },
  { media: "lg:col-start-5 lg:col-span-8", text: "lg:col-start-1 lg:col-span-4 lg:row-start-1", aspect: "lg:aspect-[16/9]" },
  { media: "lg:col-start-1 lg:col-span-7", text: "lg:col-start-9 lg:col-span-4", aspect: "lg:aspect-[5/4]" },
] as const;

export function SelectedProjects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="section-space bg-ivory">
      <div className="page-container">
        <div className="grid gap-x-6 lg:grid-cols-12">
          <Eyebrow index="01" className="lg:col-span-12" >
            Selected work
          </Eyebrow>
          <MaskedHeading
            id="projects-title"
            lines={["Selected", <span key="p" className="lg:pl-[1.15em]">Projects</span>]}
            className="type-section mt-8 lg:col-span-8 lg:mt-12"
          />
          <p
            className="type-body mt-8 max-w-[22rem] text-stone lg:col-span-3 lg:col-start-10 lg:mt-0 lg:self-end lg:pb-3"
            data-reveal="fade"
          >
            A collection of experiments, systems and digital products.
          </p>
        </div>

        <ol className="mt-20 space-y-24 sm:space-y-28 lg:mt-32 lg:space-y-40">
          {projects.map((project, i) => (
            <li key={project.slug}>
              <ProjectEntry project={project} composition={compositions[i % compositions.length]} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

type Composition = (typeof compositions)[number];

function ProjectEntry({ project, composition }: { project: Project; composition: Composition }) {
  const external = /^https?:\/\//.test(project.href);

  return (
    <article className="group relative border-t border-rule pt-5 lg:pt-6" aria-labelledby={`${project.slug}-title`}>
      <div className="type-label flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-stone" data-reveal="fade">
        <p>
          <span className="text-ink">{project.number}</span>
          <span aria-hidden="true" className="mx-3">—</span>
          {project.category}
        </p>
        <p className="hidden sm:block">
          {project.stack.join(" · ")}
          <span aria-hidden="true" className="mx-3">—</span>
          <span className="text-ink">{project.year}</span>
        </p>
      </div>

      <div className="mt-8 grid gap-x-6 gap-y-8 lg:mt-12 lg:grid-cols-12">
        <div className={`${composition.media} lg:row-start-1`}>
          <div
            className={`relative aspect-[5/4] overflow-hidden border border-rule transition-colors duration-[var(--duration-hover)] ease-editorial group-hover:border-ink/40 ${composition.aspect}`}
            data-reveal="image"
          >
            <div className="absolute inset-0" data-reveal-zoom>
              <div className="absolute inset-0 transition-transform duration-[var(--duration-hover)] ease-editorial group-hover:scale-[1.025]">
                {project.image ? (
                  <Image
                    src={project.image.src}
                    alt={project.image.alt}
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <ProjectPlate motif={project.plate} figure={project.number} />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={`${composition.text} flex flex-col lg:self-end`} data-reveal="fade">
          <h3 id={`${project.slug}-title`} className="type-project uppercase">
            <a
              href={project.href}
              className="after:absolute after:inset-0 after:content-['']"
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {project.title}
            </a>
          </h3>
          <p className="type-body mt-6 max-w-[24rem] text-stone">{project.description}</p>
          <p className="type-label mt-5 text-stone sm:hidden">
            {project.stack.join(" · ")} — {project.year}
          </p>

          <span aria-hidden="true" className="mt-8 inline-flex items-center gap-4 lg:mt-10">
            <span className="type-nav">{project.cta}</span>
            <ArrowCircle direction="up-right" size="sm" />
          </span>
        </div>
      </div>
    </article>
  );
}
