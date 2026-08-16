import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { DecisionSimulator } from "@/components/interactive/DecisionSimulator";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Education } from "@/components/sections/Education";
import { Achievements } from "@/components/sections/Achievements";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <SectionDivider />
      <About />
      <SectionDivider />
      <ScrollReveal><DecisionSimulator /></ScrollReveal>
      <SectionDivider />
      <ScrollReveal><Skills /></ScrollReveal>
      <SectionDivider />
      <ScrollReveal><Projects /></ScrollReveal>
      <SectionDivider />
      <ScrollReveal><Education /></ScrollReveal>
      <SectionDivider />
      <ScrollReveal><Achievements /></ScrollReveal>
      <SectionDivider />
      <ScrollReveal><Contact /></ScrollReveal>
      <ScrollReveal><Footer /></ScrollReveal>
    </main>
  );
}
