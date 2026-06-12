import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp, itemUp, lineReveal, stagger, staggerSlow } from './motion';

const letters = ['B', 'u', 'i', 'l', 'd', 'i', 'n', 'g', ' ', 'E', 'x', 'p', 'e', 'r', 'i', 'e', 'n', 'c', 'e', 's', '.', '.', '.'];

export default function Loader({ initials, name }) {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black text-white"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
    >
      <div className="relative mx-auto flex w-full max-w-xl flex-col items-center px-6 text-center">
        <motion.div
          className="absolute inset-0 -z-10 mx-auto h-40 w-40 rounded-full bg-white/5 blur-3xl"
          animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="mb-5 flex items-center gap-3"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.span
            className="font-mono text-4xl font-bold tracking-[0.25em] text-white sm:text-5xl"
            variants={itemUp}
          >
            {initials}
          </motion.span>
          <motion.span
            className="h-px w-10 bg-white/30"
            variants={lineReveal}
            style={{ transformOrigin: 'left center' }}
          />
        </motion.div>

        <motion.p
          className="font-mono text-sm uppercase tracking-[0.45em] text-gray-400 sm:text-base"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.1}
        >
          {name}
        </motion.p>

        <motion.div className="mt-6" variants={staggerSlow} initial="hidden" animate="show">
          <motion.div className="font-mono text-lg text-white sm:text-xl" variants={stagger} initial="hidden" animate="show">
            {letters.map((letter, index) => (
              <motion.span
                key={`${letter}-${index}`}
                className="inline-block"
                variants={itemUp}
                style={{ minWidth: letter === ' ' ? '0.35em' : undefined }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>

          <motion.div className="mt-6 flex items-center justify-center" variants={itemUp}>
            <div className="relative h-px w-64 overflow-hidden rounded-full bg-white/10 sm:w-80">
              <motion.div
                className="absolute inset-y-0 left-0 w-full origin-left bg-gradient-to-r from-transparent via-white to-transparent"
                variants={lineReveal}
                style={{ transformOrigin: 'left center' }}
                initial="hidden"
                animate="show"
              />
              <motion.div
                className="absolute inset-y-0 left-0 w-12 rounded-full bg-white/70"
                animate={{ x: ['-30%', '150%'] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
