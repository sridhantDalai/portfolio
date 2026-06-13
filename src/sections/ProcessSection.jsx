import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import { useSectionReveal } from '../hooks/useActiveSection.jsx';
import { staggerSlow, itemUp, lineReveal, fadeScale } from '../components/motion';
import SectionParticles from '../components/SectionParticles';

export default function ProcessSection({ data }) {
  const sectionRef = useSectionReveal('process');

  return (
    <motion.section
      ref={sectionRef}
      id="process"
      className="isolate relative overflow-hidden bg-zinc-950 px-6 py-24 lg:px-16"
      variants={staggerSlow}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <SectionParticles
          id="process-particles"
          count={84}
          tabletCount={64}
          mobileCount={40}
          overlayClassName="bg-black/45"
        />
      </div>
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="relative">
          <motion.div variants={itemUp}>
            <SectionHeading>My Process</SectionHeading>
          </motion.div>
          <p className="mt-6 mb-12 max-w-2xl text-gray-400">{data.description}</p>

          <div className="grid gap-12 md:grid-cols-12">


            <div className="md:col-span-12">
              <motion.div className="timeline-container" variants={staggerSlow}>
                <motion.div className="absolute left-2 top-0 bottom-0 w-px origin-top bg-zinc-700" variants={lineReveal} style={{ transformOrigin: 'top center' }} />
                {data.steps.map((step, index) => (
                  <motion.div key={step.id} className="timeline-item" style={{ ['--item-index']: index + 1 }} variants={itemUp}>
                    <h3 className="mb-3 font-mono text-xl font-bold">{step.title}</h3>
                    <p className="mb-6 ml-6 text-gray-300" dangerouslySetInnerHTML={{ __html: step.description }} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function ProcessPlaceholder() {
  return (
    <motion.div
      className="flex h-full w-full items-center justify-center"
      animate={{ y: [0, -4, 0], opacity: [0.72, 1, 0.72] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <IdeaSvg />
    </motion.div>
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
