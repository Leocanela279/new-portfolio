import { Eyebrow } from "@/components/ui/Eyebrow";

/** A quiet, dark pause between the image-heavy sections. */
export function Philosophy() {
  return (
    <section aria-labelledby="philosophy-label" className="on-dark section-space bg-night text-on-night">
      <div className="page-container">
        <div className="flex items-center gap-6">
          <div id="philosophy-label">
            <Eyebrow index="04" tone="dark">
              Philosophy
            </Eyebrow>
          </div>
          <span aria-hidden="true" className="h-px flex-1 bg-on-night/20" />
        </div>

        <figure className="mx-auto mt-20 max-w-[15em] text-center type-statement sm:mt-28 lg:mt-36" data-reveal="fade">
          <span aria-hidden="true" className="block font-serif text-[1.6em] leading-[0.5] text-bronze">
            “
          </span>
          <blockquote className="mt-6">
            <p>
              Technology is most <em className="font-normal italic">interesting</em> when it becomes{" "}
              <em className="font-normal italic">an act of creation.</em>
            </p>
          </blockquote>
          <figcaption className="type-label mt-12 flex items-center justify-center gap-4 text-on-night-muted lg:mt-16">
            <span aria-hidden="true" className="h-px w-10 bg-on-night/30" />
            <span>L. C.</span>
            <span aria-hidden="true" className="h-px w-10 bg-on-night/30" />
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
