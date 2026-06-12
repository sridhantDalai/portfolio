import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const ActiveSectionContext = createContext(null);

export function ActiveSectionProvider({ children }) {
  const [activeSection, setActiveSection] = useState('home');
  const value = { activeSection, setActiveSection };

  return <ActiveSectionContext.Provider value={value}>{children}</ActiveSectionContext.Provider>;
}

export function useActiveSection() {
  const context = useContext(ActiveSectionContext);
  if (!context) {
    throw new Error('useActiveSection must be used within ActiveSectionProvider');
  }
  return context;
}

export function useSectionReveal(sectionId) {
  const sectionRef = useRef(null);
  const { setActiveSection } = useActiveSection();

  useEffect(() => {
    const element = sectionRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      element?.classList.add('in-view');
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            setActiveSection(sectionId);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '-15% 0px -55% 0px',
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [sectionId, setActiveSection]);

  return sectionRef;
}
