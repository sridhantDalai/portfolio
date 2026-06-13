import React, { useMemo } from 'react';
import Particles, { ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const initParticles = async (engine) => {
  await loadSlim(engine);
};

export default function SectionParticles({
  id = 'section-particles',
  count = 200,
  mobileCount = 170,
  tabletCount = 170,
  overlayClassName = 'bg-black/35',
}) {
  const options = useMemo(
    () => ({
      fullScreen: {
        enable: false,
      },
      fpsLimit: 60,
      detectRetina: true,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: 'repulse',
          },
          onClick: {
            enable: false,
          },
          resize: true,
        },
        modes: {
          repulse: {
            distance: 140,
            duration: 0.45,
            speed: 1,
          },
        },
      },
      particles: {
        color: {
          value: '#ffffff',
        },
        links: {
          color: '#c3c3c3',
          distance: 160,
          enable: true,
          opacity: 0.4,
          width: 1,
        },
        collisions: {
          enable: false,
        },
        move: {
          direction: 'none',
          enable: true,
          outModes: {
            default: 'out',
          },
          random: false,
          speed: 0.9,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 900,
          },
          value: count,
        },
        opacity: {
          value: 0.78,
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 1.2, max: 3.2 },
        },
      },
      responsive: [
        {
          maxWidth: 1024,
          options: {
            particles: {
              number: {
                value: tabletCount,
              },
              links: {
                distance: 150,
              },
            },
          },
        },
        {
          maxWidth: 640,
          options: {
            particles: {
              number: {
                value: mobileCount,
              },
              links: {
                distance: 130,
                opacity: 0.26,
              },
              move: {
                speed: 0.55,
              },
            },
          },
        },
      ],
    }),
    [count, mobileCount, tabletCount],
  );

  return (
    <ParticlesProvider init={initParticles}>
      <Particles
        id={id}
        className="absolute inset-0 h-full w-full"
        style={{ position: 'absolute', inset: 0 }}
        options={options}
      />
      <div className={`pointer-events-none absolute inset-0 ${overlayClassName}`} />
    </ParticlesProvider>
  );
}
