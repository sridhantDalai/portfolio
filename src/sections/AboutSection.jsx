import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { useSectionReveal } from '../hooks/useActiveSection.jsx';

export default function AboutSection({ data }) {
  const sectionRef = useSectionReveal('about');

  return (
    <section ref={sectionRef} id="about" className="bg-black px-6 py-24 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading>About Me</SectionHeading>
        <div className="mt-12 grid gap-8 md:grid-cols-10 md:gap-12">
          <div className="md:col-span-2">
            <div className="profile-image-container aspect-square w-full max-w-md overflow-hidden rounded-full border border-zinc-700">
              <div className="flex h-full w-full items-center justify-center">
                {data.avatar ? (
                  <img src={data.avatar} alt="Mohin Uddin" className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <UserPlaceholder />
                )}
              </div>
            </div>
          </div>
          <div className="fade-in md:col-span-7 space-y-6" style={{ animationDelay: '0.3s' }}>
            <p className="text-base leading-relaxed text-gray-300 md:text-lg" dangerouslySetInnerHTML={{ __html: data.text }} />
          </div>
        </div>
      </div>
    </section>
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
