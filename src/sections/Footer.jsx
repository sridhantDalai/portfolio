import React from 'react';
import { motion } from 'framer-motion';
import { itemUp, staggerSlow } from '../components/motion';

export default function Footer({ data }) {
  return (
    <motion.footer
      className="border-t border-zinc-800 bg-black px-6 py-10 lg:px-16"
      variants={staggerSlow}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between md:flex-row">
        <motion.div className="mb-4 md:mb-0" variants={itemUp}>
          <p className="text-sm text-gray-400">&copy; {data.copyright}</p>
        </motion.div>
        <motion.div variants={itemUp}>
          <motion.a href="#home" className="text-gray-400 transition-colors hover:text-gray-600" whileHover={{ y: -1 }}>
            Back to top
          </motion.a>
        </motion.div>
      </div>
    </motion.footer>
  );
}
