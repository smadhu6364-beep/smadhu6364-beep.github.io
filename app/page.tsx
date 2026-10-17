import { SettingsProvider } from "@/components/Settings";
import Intro from "@/components/Intro";
import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import CircuitNav from "@/components/CircuitNav";
import SpeedLines from "@/components/SpeedLines";
import Footer from "@/components/Footer";
import { Contact, Education, Experience, Projects, Skills } from "@/components/Sections";

export default function Home() {
  return (
    <SettingsProvider>
      <a href="#main" className="sr-only z-[200] bg-papaya px-4 py-2 text-carbon-950 focus:not-sr-only focus:fixed focus:left-2 focus:top-2">
        Skip to content
      </a>
      <Intro />
      <TopBar />
      <SpeedLines />
      <main id="main" className="relative z-10">
        <Hero />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <CircuitNav />
      <Footer />
    </SettingsProvider>
  );
}
