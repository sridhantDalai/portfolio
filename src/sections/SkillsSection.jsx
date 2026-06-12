import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { Markup } from '../components/Markup';
import { useSectionReveal } from '../hooks/useActiveSection.jsx';

export default function SkillsSection({ data }) {
  const sectionRef = useSectionReveal('skills');

  return (
    <section ref={sectionRef} id="skills" className="bg-black px-6 py-24 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading>Technical Skills</SectionHeading>
        <div className="fade-in mt-12" style={{ animationDelay: '0.3s' }}>
          <div className="skills-grid">
            {data.map((group) => (
              <div key={group.id} className="skill-category">
                <h3 className="font-mono">{group.title || 'Untitled'}</h3>
                <ul className="skill-list">
                  {group.skills.map((skill) => (
                    <li key={skill.id}>
                      <div className="skill-icon-placeholder">
                        <Markup html={skill.icon} />
                      </div>
                      <span className="text-sm text-white">{skill.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
