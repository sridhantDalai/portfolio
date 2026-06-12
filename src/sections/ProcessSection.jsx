import React, { useEffect, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { useSectionReveal } from '../hooks/useActiveSection.jsx';

export default function ProcessSection({ data }) {
  const sectionRef = useSectionReveal('process');

  return (
    <section ref={sectionRef} id="process" className="bg-zinc-950 px-6 py-24 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading>My Process</SectionHeading>
        <p className="mt-6 mb-12 max-w-2xl text-gray-400">{data.description}</p>

        <div className="grid gap-12 md:grid-cols-12">
          <div className="mb-8 md:col-span-5 md:mb-0">
            <div className="sticky top-32 hidden md:block">
              <div className="aspect-video w-full overflow-hidden rounded-sm border border-zinc-800 bg-black">
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
                  <ProcessPlaceholder />
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="timeline-container">
              {data.steps.map((step, index) => (
                <div key={step.id} className="timeline-item" style={{ ['--item-index']: index + 1 }}>
                  <h3 className="mb-3 font-mono text-xl font-bold">{step.title}</h3>
                  <p className="mb-6 ml-6 text-gray-300" dangerouslySetInnerHTML={{ __html: step.description }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessPlaceholder() {
  const [current, setCurrent] = useState(0);

  const svgs = [
    <IdeaSvg key="idea" />,
    <DesignSvg key="design" />,
    <CodeSvg key="code" />,
    <RocketSvg key="rocket" />,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % svgs.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [svgs.length]);

  return (
    <div
      key={current}
      className="flex h-full w-full items-center justify-center animate-[fadeIn_0.6s_ease]"
    >
      {svgs[current]}
    </div>
  );
}

function IdeaSvg() {
  return (
    <svg viewBox="0 0 24 24" className="h-28 w-28 text-zinc-500" fill="none" stroke="currentColor">
      <path
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0"
      />
    </svg>
  );
}

function DesignSvg() {
  return (
    <svg viewBox="0 0 24 24" className="h-28 w-28 text-zinc-500" fill="none" stroke="currentColor">
      <path
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4h16v16H4z M4 10h16 M10 4v16"
      />
    </svg>
  );
}

function CodeSvg() {
  return (
    <svg viewBox="0 0 24 24" className="h-28 w-28 text-zinc-500" fill="none" stroke="currentColor">
      <path
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 4l-4 16"
      />
    </svg>
  );
}

function RocketSvg() {
  return (
    <svg viewBox="0 0 24 24" className="h-28 w-28 text-zinc-500" fill="none" stroke="currentColor">
      <path
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2c4 2 7 7 7 12l-4-2-3 3-3-3-4 2c0-5 3-10 7-12z"
      />
    </svg>
  );
}
