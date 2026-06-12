import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { Markup } from '../components/Markup';
import { useSectionReveal } from '../hooks/useActiveSection.jsx';

export default function ProjectsSection({ data }) {
  const sectionRef = useSectionReveal('projects');

  return (
    <section ref={sectionRef} id="projects" className="bg-zinc-950 px-6 py-24 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading>Projects</SectionHeading>
        <div className="fade-in mt-12 grid gap-8 md:grid-cols-2" style={{ animationDelay: '0.3s' }}>
          {data.map((project) => (
            <article key={project.id} className="group overflow-hidden rounded-sm border border-zinc-800 bg-black hover-card">
              <div className="relative aspect-video overflow-hidden bg-zinc-800">
                  {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ProjectPlaceholder />
                      </div>
                    )}
                <div className="absolute inset-0 hidden items-center justify-center transition-all group-hover:flex" style={{ transitionDelay: '0.3s' }}>
                  <div
                    className="absolute inset-0 z-0 bg-black/70 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
                    style={{ transitionDelay: '0.3s' }}
                  />
                  <div className="z-10 flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
                    {project.demoUrl ? (
                      <a href={project.demoUrl} target="_blank" rel="noreferrer" className="rounded-sm bg-white px-4 py-2 text-sm font-medium text-black">
                        See Demo
                      </a>
                    ) : null}
                    <a href={project.sourceUrl} target="_blank" rel="noreferrer" className="rounded-sm border border-white bg-transparent px-4 py-2 text-sm font-medium text-gray-100">
                      View
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 font-mono text-xl font-bold">{project.title}</h3>
                <p className="mb-4 text-gray-400">{project.description}</p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.skills.map((skill) => (
                    <span key={skill} className="tech-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectPlaceholder() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-600 lg:h-32 lg:w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}
