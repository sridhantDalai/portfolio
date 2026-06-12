import React from 'react';
import { useSectionReveal } from '../hooks/useActiveSection.jsx';

export default function HeroSection({ data }) {
  const sectionRef = useSectionReveal('home');

  return (
<section
  ref={sectionRef}
  id="home"
  className="relative flex min-h-screen items-center px-6 lg:px-16"
  style={{
    backgroundImage:
      "url('https://res.cloudinary.com/dbjtjvfxd/image/upload/v1781293543/1cfb9d3b-c6ae-4502-9068-dd1eb86d2a6b_bi3chc.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/60"></div>

  {/* Content */}
  <div className="relative z-10 mx-auto w-full max-w-4xl">
    <div className="fade-up space-y-4">
      <div>
        <span className="font-mono text-base text-gray-400 sm:text-lg md:text-xl">
          {data.greeting}
        </span>

        <h1 className="mt-2 font-mono text-4xl font-bold leading-tight sm:text-5xl md:text-7xl">
          {data.fullName}
        </h1>

        <h2 className="mt-2 font-mono text-3xl font-bold leading-tight text-gray-400 sm:text-4xl md:text-5xl">
          {data.title}
        </h2>
      </div>

      <p className="max-w-xl text-base text-gray-400 sm:text-lg md:text-xl">
        {data.bio}
      </p>

      <div className="flex flex-wrap gap-4 pt-6">
        <a href="#projects" className="btn-primary">
          View Projects
        </a>

        <a href="#contact" className="btn-secondary">
          Get In Touch
        </a>
      </div>
    </div>
  </div>
</section>
  );
}
