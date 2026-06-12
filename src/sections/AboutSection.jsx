import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import { useSectionReveal } from '../hooks/useActiveSection.jsx';
import { fadeScale, staggerSlow, itemUp } from '../components/motion';

export default function AboutSection({ data }) {
  const sectionRef = useSectionReveal('about');

  return (
    <motion.section
      ref={sectionRef}
      id="about"
      className="bg-black px-6 py-24 lg:px-16"
      variants={staggerSlow}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto max-w-6xl">
        <motion.div variants={itemUp}>
          <SectionHeading>About Me</SectionHeading>
        </motion.div>
        <div className="mt-12 grid gap-8 md:grid-cols-10 md:gap-12">
          <div className="md:col-span-2">
            <motion.div className="profile-image-container aspect-square w-full max-w-md overflow-hidden rounded-full border border-zinc-700" variants={fadeScale}>
              <div className="flex h-full w-full items-center justify-center">
                {data.avatar ? (
                  <motion.img
                    src={data.avatar}
                    alt="Mohin Uddin"
                    className="h-full w-full object-cover"
                    loading="lazy"
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                ) : (
                  <UserPlaceholder />
                )}
              </div>
            </motion.div>
          </div>
          <motion.div className="md:col-span-7 space-y-6" variants={staggerSlow}>
            <motion.p className="text-base leading-relaxed text-gray-300 md:text-lg" variants={itemUp} dangerouslySetInnerHTML={{ __html: data.text }} />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

function UserPlaceholder() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-1/2 w-1/2 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
