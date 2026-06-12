import React from 'react';
import { motion } from 'framer-motion';
import { useSectionReveal } from '../hooks/useActiveSection.jsx';
import { stagger, itemUp, tap } from '../components/motion';
import SectionParticles from '../components/SectionParticles';

export default function HeroSection({ data }) {
  const sectionRef = useSectionReveal('home');

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-6 lg:px-16"
    >
      <div className="absolute inset-0 z-0">
        <SectionParticles id="hero-particles" />
      </div>

      <motion.div
        className="relative z-10 mx-auto w-full max-w-4xl"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
      >
        <div className="space-y-4">
          <motion.span className="block font-mono text-base text-gray-400 sm:text-lg md:text-xl" variants={itemUp}>
            {data.greeting}
          </motion.span>

          <motion.h1 className="mt-2 font-mono text-4xl font-bold leading-tight sm:text-5xl md:text-7xl" variants={itemUp}>
            {data.fullName}
          </motion.h1>

          <motion.h2 className="mt-2 font-mono text-3xl font-bold leading-tight text-gray-400 sm:text-4xl md:text-5xl" variants={itemUp}>
            <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-red-500 bg-clip-text text-transparent font-bold">
              {data.title}
            </span>
          </motion.h2>
        </div>

        <motion.p className="max-w-xl text-base text-gray-400 sm:text-lg md:text-xl" variants={itemUp}>
          {data.bio}
        </motion.p>

        <motion.div className="flex flex-wrap gap-4 pt-6" variants={itemUp}>
          <motion.a href="#projects" className="btn-primary" whileHover={{ y: -2, scale: 1.01 }} whileTap={tap}>
            View Projects
          </motion.a>

          <motion.a href="#contact" className="btn-secondary" whileHover={{ y: -2, scale: 1.01 }} whileTap={tap}>
            Get In Touch
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
