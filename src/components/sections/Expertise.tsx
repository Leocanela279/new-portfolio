import { ArrowRight } from "lucide-react";
import { expertise } from "@/data/expertise";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MaskedHeading } from "@/components/ui/MaskedHeading";

export function Expertise() {
  return (
    <section aria-labelledby="explore-title" className="section-space bg-ivory">
      <div className="page-container grid gap-x-6 lg:grid-cols-12">
        <Eyebrow className="lg:col-span-12">Areas of inquiry</Eyebrow>
        <MaskedHeading
          id="explore-title"
          lines={["What I", <span key="e" className="lg:pl-[1.15em]">Explore</span>]}
          className="type-section mt-8 lg:col-span-8 lg:mt-12"
        />
      </div>

      {/* Rows run edge to edge so the hover tint reads as a full band. */}
      <ul className="mt-16 border-t border-rule lg:mt-24">
        {expertise.map((area) => (
          <li
            key={area.number}
            className="group border-b border-rule transition-colors duration-[var(--duration-hover)] ease-editorial hover:bg-parchment"
            data-reveal="fade"
          >
            <div className="page-container grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 py-7 sm:py-9 lg:grid-cols-12 lg:gap-x-6 lg:py-11">
              <span className="type-label text-stone lg:col-span-1">{area.number}</span>

              <div className="lg:col-span-7">
                <h3 className="type-row transition-transform duration-[var(--duration-hover)] ease-editorial group-hover:translate-x-3">
                  {area.title}
                </h3>
                <p className="type-label mt-3 text-stone lg:hidden">{area.topics}</p>
              </div>

              <p className="type-label hidden text-stone lg:col-span-3 lg:block">{area.topics}</p>

              <span
                aria-hidden="true"
                className="justify-self-end text-ink/30 transition-[color,transform] duration-[var(--duration-hover)] ease-editorial group-hover:translate-x-1 group-hover:text-ink lg:col-span-1"
              >
                <ArrowRight size={22} strokeWidth={1} />
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
