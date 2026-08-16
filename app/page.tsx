import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Thinking } from "@/components/sections/Thinking";
import { Experience } from "@/components/sections/Experience";
import { AILab } from "@/components/sections/AILab";
import { Projects } from "@/components/sections/Projects";
import { Research } from "@/components/sections/Research";
import { Education } from "@/components/sections/Education";
import { Activity } from "@/components/sections/Activity";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <About />
      <Skills />
      <Thinking />
      <Experience />
      <AILab />
      <Projects />
      <Research />
      <Education />
      <Activity />
      <Contact />
      <Footer />
    </main>
  );
}