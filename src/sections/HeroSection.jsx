import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useSectionReveal } from '../hooks/useActiveSection.jsx';
import { stagger, itemUp, tap } from '../components/motion';

export default function HeroSection({ data }) {
  const sectionRef = useSectionReveal('home');
  const prefersReducedMotion = useReducedMotion();

  return (
      <section
        ref={sectionRef}
        id="home"
        className="relative flex min-h-screen items-center overflow-hidden px-6 lg:px-16"
      >
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dbjtjvfxd/image/upload/v1781293543/1cfb9d3b-c6ae-4502-9068-dd1eb86d2a6b_bi3chc.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
          animate={
            prefersReducedMotion
              ? undefined
              : { scale: [1, 1.02, 1], y: [0, -4, 0] }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 16, repeat: Infinity, ease: 'easeInOut' }
          }
        />
        <div className="absolute inset-0 bg-black/60" />

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
              {data.title}
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
