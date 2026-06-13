import React, { Suspense, lazy, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import portfolio from './data/portfolio.json';
import { ActiveSectionProvider } from './hooks/useActiveSection.jsx';
import Sidebar from './components/Sidebar';
import Loader from './components/Loader';

const HeroSection = lazy(() => import('./sections/HeroSection'));
const AboutSection = lazy(() => import('./sections/AboutSection'));
const ProjectsSection = lazy(() => import('./sections/ProjectsSection'));
const SkillsSection = lazy(() => import('./sections/SkillsMatterSection'));
const ProcessSection = lazy(() => import('./sections/ProcessSection'));
const ContactSection = lazy(() => import('./sections/ContactSection'));
const Footer = lazy(() => import('./sections/Footer'));

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <ActiveSectionProvider>
      <div className="relative min-h-screen bg-black text-white">
        <AnimatePresence>
          {isLoading ? <Loader initials={portfolio.metadata.logoCharacter} name={portfolio.metadata.title} /> : null}
        </AnimatePresence>
        <motion.div
          className="min-h-screen bg-black text-white"
          initial={false}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <Sidebar logo={portfolio.metadata.logoCharacter} />
          <main className="lg:ml-20">
            <Suspense fallback={<div className="min-h-screen bg-black" />}>
              <HeroSection data={portfolio.hero} />
              {portfolio.sections.aboutMe ? <AboutSection data={portfolio.about} /> : null}
              {portfolio.sections.projects ? <ProjectsSection data={portfolio.projects} /> : null}
              {portfolio.sections.skills ? <SkillsSection data={portfolio.skillGroups} /> : null}
              {portfolio.sections.process ? <ProcessSection data={portfolio.process} /> : null}
              {portfolio.sections.contact ? <ContactSection data={portfolio.contact} /> : null}
              <Footer data={portfolio.footer} />
            </Suspense>
          </main>
        </motion.div>
      </div>
    </ActiveSectionProvider>
  );
}
