import { siteConfig } from "@/config/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MaskedHeading } from "@/components/ui/MaskedHeading";
import { ArrowCircle } from "@/components/ui/ArrowCircle";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="section-space bg-parchment">
      <div className="page-container grid gap-x-6 gap-y-12 lg:grid-cols-12">
        <Eyebrow index="05" className="lg:col-span-12">
          Contact
        </Eyebrow>

        <MaskedHeading
          id="contact-title"
          lines={[
            "Let’s build",
            <span key="s" className="sm:pl-[0.9em]">Something</span>,
            <span key="i">
              Interesting<span className="text-bronze">.</span>
            </span>,
          ]}
          className="type-display -mt-2 lg:col-span-9 lg:mt-6"
        />

        <div className="lg:col-span-3 lg:col-start-10 lg:self-end" data-reveal="fade">
          <p className="type-body max-w-[22rem] text-stone">
            Have an idea, an opportunity or something interesting to discuss? I’d love to hear about it.
          </p>

          <a href={`mailto:${siteConfig.email}`} className="group mt-10 inline-flex items-center gap-6">
            <span className="type-nav transition-transform duration-[var(--duration-hover)] ease-editorial group-hover:translate-x-1">
              Get in touch
            </span>
            <ArrowCircle direction="up-right" size="lg" variant="solid" />
          </a>

          <p className="type-small mt-8">
            <a
              href={`mailto:${siteConfig.email}`}
              className="border-b border-ink/25 pb-0.5 transition-colors duration-300 hover:border-ink"
            >
              {siteConfig.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
