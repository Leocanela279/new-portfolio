import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Hero } from "@/components/sections/Hero";
import { SelectedProjects } from "@/components/sections/SelectedProjects";
import { Experience } from "@/components/sections/Experience";
import { About } from "@/components/sections/About";
import { Philosophy } from "@/components/sections/Philosophy";
import { Expertise } from "@/components/sections/Expertise";
import { Contact } from "@/components/sections/Contact";
import { MotionController } from "@/components/motion/MotionController";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <SelectedProjects />
        <Experience />
        <About />
        <Philosophy />
        <Expertise />
        <Contact />
      </main>
      <SiteFooter />
      <MotionController />
    </>
  );
}
