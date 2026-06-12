import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import { Markup } from '../components/Markup';
import { useSectionReveal } from '../hooks/useActiveSection.jsx';
import { staggerSlow, itemUp, fadeScale } from '../components/motion';

export default function SkillsSection({ data }) {
  const sectionRef = useSectionReveal('skills');

  return (
    <motion.section
      ref={sectionRef}
      id="skills"
      className="bg-black px-6 py-24 lg:px-16"
      variants={staggerSlow}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto max-w-6xl">
        <motion.div variants={itemUp}>
          <SectionHeading>Technical Skills</SectionHeading>
        </motion.div>
        <motion.div className="mt-12" variants={staggerSlow}>
          <div className="skills-grid">
            {data.map((group) => (
              <motion.div key={group.id} className="skill-category" variants={fadeScale}>
                <h3 className="font-mono">{group.title || 'Untitled'}</h3>
                <ul className="skill-list">
                  {group.skills.map((skill) => (
                    <motion.li key={`${group.id}-${skill.id}-${skill.title}`} variants={itemUp}>
                      <div className="skill-icon-placeholder">
                        <Markup html={skill.icon} />
                      </div>
                      <span className="text-sm text-white">{skill.title}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
