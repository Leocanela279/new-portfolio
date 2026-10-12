"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * All page motion in one place. Sections stay server components and only
 * describe their intent with data attributes:
 *
 *   data-hero-item="eyebrow|line|description|cta|cue"  hero intro sequence
 *   data-reveal="lines"    masked heading lines slide up
 *   data-reveal="fade"     element rises and fades in
 *   data-reveal="stagger"  children rise in sequence
 *   data-reveal="image"    frame wipes open from the bottom
 *   data-reveal-zoom       inside an image frame: settles from a slight zoom
 *   data-parallax="hero" | "inner"
 *
 * With prefers-reduced-motion, nothing is animated and everything is shown.
 * Without JavaScript, content is visible as rendered.
 */
export function MotionController() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      playHeroIntro();
      setupReveals();
      setupParallax();
    });

    // Hand the hero over from the CSS pre-state (see globals.css). Runs after
    // the intro has already set its own starting styles, so nothing flashes.
    document.documentElement.classList.add("motion-ready");

    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => mm.revert();
  });

  return null;
}

function heroItems(role: string) {
  return gsap.utils.toArray<HTMLElement>(`[data-hero-item="${role}"]`);
}

function playHeroIntro() {
  const eyebrow = heroItems("eyebrow");
  const lines = heroItems("line");
  const description = heroItems("description");
  const cta = heroItems("cta");
  const cue = heroItems("cue");
  if (!lines.length) return;

  gsap.set(lines, { yPercent: 108 });
  gsap.set([...eyebrow, ...description, ...cta, ...cue], { autoAlpha: 0, y: 16 });

  // The artwork starts fading in with CSS at first paint. Line the text up
  // with it, however long the page took to hydrate.
  const elapsed = performance.now() / 1000;
  const tl = gsap.timeline({
    delay: Math.max(0, 0.3 - elapsed),
    defaults: { ease: "power3.out" },
  });

  tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.7 }, 0)
    .to(lines, { yPercent: 0, duration: 1, stagger: 0.12 }, 0.12)
    .to(description, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.55)
    .to(cta, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.78)
    .to(cue, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.95);
}

function setupReveals() {
  const onEnter = (trigger: Element, start = "top 88%") => ({ trigger, start, once: true });

  gsap.utils.toArray<HTMLElement>('[data-reveal="lines"]').forEach((heading) => {
    gsap.from(heading.querySelectorAll(".mask-line-inner"), {
      yPercent: 108,
      duration: 0.9,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: onEnter(heading),
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-reveal="fade"]').forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0,
      y: 24,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: onEnter(el, "top 92%"),
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-reveal="stagger"]').forEach((group) => {
    gsap.from(group.children, {
      autoAlpha: 0,
      y: 20,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: onEnter(group, "top 92%"),
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-reveal="image"]').forEach((frame) => {
    const tl = gsap.timeline({ scrollTrigger: onEnter(frame, "top 85%") });
    tl.fromTo(
      frame,
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.out" },
    );
    const zoom = frame.querySelector("[data-reveal-zoom]");
    if (zoom) tl.from(zoom, { scale: 1.08, duration: 0.9, ease: "power3.out" }, 0);
  });
}

function setupParallax() {
  const hero = document.querySelector('[data-parallax="hero"]');
  if (hero) {
    gsap.to(hero, {
      yPercent: 10,
      ease: "none",
      scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true },
    });
  }

  gsap.utils.toArray<HTMLElement>('[data-parallax="inner"]').forEach((el) => {
    gsap.fromTo(
      el,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });
}
