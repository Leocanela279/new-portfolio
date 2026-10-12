import { getImageProps } from "next/image";
import landscape from "@/assets/images/delos-landscape.jpg";
import landscapePortrait from "@/assets/images/delos-landscape-portrait.jpg";
import { siteConfig } from "@/config/site";
import { EditorialLink } from "@/components/ui/EditorialLink";
import { MaskedHeading } from "@/components/ui/MaskedHeading";

/**
 * Art direction: on desktop the full landscape sits to the right and fades
 * into ivory under the type. On smaller screens a tall crop of the city
 * and planets rises from the bottom of the viewport behind the content.
 */
function HeroArtwork() {
  // Decorative: the page heading carries the meaning, so alt is empty.
  const common = { alt: "", quality: 85, loading: "eager" as const };

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: landscape, sizes: "74vw" });

  const {
    props: { srcSet: mobileSrcSet, ...imgProps },
  } = getImageProps({ ...common, src: landscapePortrait, sizes: "100vw" });

  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={desktopSrcSet} sizes="74vw" />
      <img
        {...imgProps}
        alt=""
        srcSet={mobileSrcSet}
        sizes="100vw"
        fetchPriority="high"
        className="hero-art absolute inset-0 size-full object-cover object-[50%_32%] lg:object-[100%_50%]"
      />
    </picture>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-ivory"
    >
      {/* Artwork */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 top-[42%] -z-10 overflow-hidden sm:top-[38%] lg:inset-y-0 lg:left-auto lg:right-0 lg:w-[74%]"
      >
        <div className="absolute inset-0" data-parallax="hero">
          <HeroArtwork />
        </div>
        {/* Ivory veil: keeps the type side bright and calm. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-bg)_0%,rgb(248_247_244/0.72)_22%,rgb(248_247_244/0)_55%)] lg:bg-[linear-gradient(to_right,var(--color-bg)_0%,rgb(248_247_244/0.82)_16%,rgb(248_247_244/0.32)_38%,rgb(248_247_244/0)_58%)]" />
      </div>

      <div className="page-container flex flex-1 flex-col pt-[calc(var(--nav-height)+28px)] lg:pt-[var(--nav-height)]">
        <div className="flex flex-1 flex-col lg:justify-center lg:pb-10">
          <div className="max-w-[44rem]">
            <p className="type-label text-stone" data-hero-item="eyebrow">
              Building
              <br />
              <span className="text-ink">Worlds through code</span>
            </p>

            <MaskedHeading
              as="h1"
              id="hero-title"
              heroItem
              lines={["Leandro", "Canela"]}
              className="type-hero mt-7 lg:mt-9"
            />

            <p
              className="type-body mt-7 max-w-[25rem] text-stone lg:mt-10 lg:max-w-[26rem]"
              data-hero-item="description"
            >
              {siteConfig.description}
            </p>

            <div className="mt-8 lg:mt-12" data-hero-item="cta">
              <EditorialLink href="#projects">View projects</EditorialLink>
            </div>
          </div>
        </div>

        <div
          className="hidden items-end justify-between pb-10 lg:flex"
          data-hero-item="cue"
        >
          <a href="#projects" className="group flex items-end gap-4">
            <span aria-hidden="true" className="relative block h-14 w-px overflow-hidden bg-rule">
              <span className="scroll-cue-dot absolute inset-x-0 top-0 block h-4 bg-ink" />
            </span>
            <span className="type-label">Scroll to explore</span>
          </a>
        </div>
      </div>
    </section>
  );
}
