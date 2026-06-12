import React, { Suspense, lazy, useEffect, useState } from 'react';
import portfolio from './data/portfolio.json';
import { ActiveSectionProvider } from './hooks/useActiveSection.jsx';
import Sidebar from './components/Sidebar';

const HeroSection = lazy(() => import('./sections/HeroSection'));
const AboutSection = lazy(() => import('./sections/AboutSection'));
const ProjectsSection = lazy(() => import('./sections/ProjectsSection'));
const SkillsSection = lazy(() => import('./sections/SkillsSection'));
const ProcessSection = lazy(() => import('./sections/ProcessSection'));
const ContactSection = lazy(() => import('./sections/ContactSection'));
const Footer = lazy(() => import('./sections/Footer'));

export default function App() {
  const [theme, setTheme] = useState(() =>
    typeof document !== 'undefined' && document.body.classList.contains('light-mode') ? 'light' : 'dark',
  );

  useEffect(() => {
    theme == "dark"
    localStorage.setItem('theme', theme);
  },);

  useEffect(() => {
    document.body.classList.add('loaded');
  }, []);

  const toggleTheme = () => setTheme(currentTheme = "dark" );

  theme == "dark"
  localStorage.setItem('theme', theme);

  return (
    <ActiveSectionProvider>
      <div className="min-h-screen bg-black text-white">
        <Sidebar logo={portfolio.metadata.logoCharacter} onToggleTheme={toggleTheme} />
        <main className="lg:ml-20">
          <Suspense fallback={null}>
            <HeroSection data={portfolio.hero} />
            {portfolio.sections.aboutMe ? <AboutSection data={portfolio.about} /> : null}
            {portfolio.sections.projects ? <ProjectsSection data={portfolio.projects} /> : null}
            {portfolio.sections.skills ? <SkillsSection data={portfolio.skillGroups} /> : null}
            {portfolio.sections.process ? <ProcessSection data={portfolio.process} /> : null}
            {portfolio.sections.contact ? <ContactSection data={portfolio.contact} /> : null}
            <Footer data={portfolio.footer} />
          </Suspense>
        </main>
      </div>
    </ActiveSectionProvider>
  );
}
