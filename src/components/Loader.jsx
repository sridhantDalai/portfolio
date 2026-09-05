import React, { useEffect, useRef, useState } from 'react';

export default function Loader({ onComplete }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animFrameId = null;
    let isCleanedUp = false;

    // Handle high DPI displays
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system parameters
    const isMobile = width < 768;
    const targetParticleCount = isMobile ? 6000 : 14000;

    // Load PNG logo and sample coordinates
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = '/logo.png';

    let particles = [];
    let sampledPoints = [];

    img.onload = () => {
      if (isCleanedUp) return;

      // Sample logo coordinates using offscreen canvas
      const sampleCanvas = document.createElement('canvas');
      const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
      
      const sampleSize = 300;
      sampleCanvas.width = sampleSize;
      sampleCanvas.height = sampleSize;

      // Draw logo centered
      sampleCtx.drawImage(img, 0, 0, sampleSize, sampleSize);
      const imgData = sampleCtx.getImageData(0, 0, sampleSize, sampleSize).data;

      const rawPoints = [];
      for (let y = 0; y < sampleSize; y += 2) {
        for (let x = 0; x < sampleSize; x += 2) {
          const index = (y * sampleSize + x) * 4;
          const r = imgData[index];
          const g = imgData[index + 1];
          const b = imgData[index + 2];
          const a = imgData[index + 3];

          // Sample pixels belonging to the logo shape (dark stroke lines or visible non-transparent stroke)
          const isDarkStroke = a > 40 && (r < 180 || g < 180 || b < 180);
          if (isDarkStroke) {
            // Normalize around center (-0.5 to 0.5)
            const nx = (x - sampleSize / 2) / sampleSize;
            const ny = (y - sampleSize / 2) / sampleSize;
            rawPoints.push({ nx, ny });
          }
        }
      }

      if (rawPoints.length === 0) {
        // Fallback points if image sampling fails
        for (let i = 0; i < 2000; i++) {
          const angle = Math.random() * Math.PI * 2;
          const rad = Math.random() * 0.3;
          rawPoints.push({ nx: Math.cos(angle) * rad, ny: Math.sin(angle) * rad });
        }
      }

      sampledPoints = rawPoints;

      // Responsive logo display dimensions
      const logoHeight = isMobile ? Math.min(height * 0.32, 220) : Math.min(height * 0.42, 340);
      const logoWidth = logoHeight; // Square aspect ratio matching PNG

      // Generate particles
      const centerX = width / 2;
      const centerY = height / 2;

      particles = new Array(targetParticleCount);
      for (let i = 0; i < targetParticleCount; i++) {
        const pt = sampledPoints[i % sampledPoints.length];
        
        // Add subtle sub-pixel jitter to sample points for dense solid appearance
        const jitterX = (Math.random() - 0.5) * 3;
        const jitterY = (Math.random() - 0.5) * 3;

        const targetX = centerX + pt.nx * logoWidth + jitterX;
        const targetY = centerY + pt.ny * logoHeight + jitterY;

        // Scattered initial positions
        const scatterAngle = Math.random() * Math.PI * 2;
        const scatterDistance = Math.max(width, height) * (0.2 + Math.random() * 0.7);
        const scatterX = centerX + Math.cos(scatterAngle) * scatterDistance;
        const scatterY = centerY + Math.sin(scatterAngle) * scatterDistance;

        // Colors: pure white, icy blue, subtle cool cyan/gray
        const colorPalette = [
          'rgba(255, 255, 255, ',
          'rgba(240, 249, 255, ',
          'rgba(224, 242, 254, ',
          'rgba(186, 230, 253, ',
          'rgba(56, 189, 248, '
        ];
        const colorBase = colorPalette[Math.floor(Math.random() * colorPalette.length)];

        const isOrbiter = Math.random() < 0.04;

        particles[i] = {
          x: scatterX,
          y: scatterY,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          targetX,
          targetY,
          scatterX,
          scatterY,
          size: Math.random() * 1.8 + 0.9,
          baseAlpha: Math.random() * 0.5 + 0.45,
          alpha: 0,
          colorBase,
          speedFactor: Math.random() * 0.5 + 0.75,
          delay: Math.random() * 0.35, // Stagger gathering
          turbPhase: Math.random() * Math.PI * 2,
          isOrbiter,
          orbitAngle: Math.random() * Math.PI * 2,
          orbitSpeed: (Math.random() - 0.5) * 0.04,
          orbitRadius: logoWidth * (0.52 + Math.random() * 0.15),
          explosionVx: 0,
          explosionVy: 0,
          explosionFriction: 0.93 + Math.random() * 0.03,
          trailLength: Math.random() * 8 + 4
        };
      }
    };

    // Timeline durations (in seconds)
    const T_ATMOSPHERE = 0.4;
    const T_DRIFT = 1.3;
    const T_FORM = 2.1;
    const T_HOLD = 2.9;
    const T_CHARGE = 3.2;
    const T_EXPLODE = 3.7;
    const T_REVEAL_END = 4.1;

    let startTime = null;
    let explosionTriggered = false;
    let completedTriggered = false;

    const render = (now) => {
      if (isCleanedUp) return;
      if (!startTime) startTime = now;

      const elapsed = (now - startTime) / 1000;

      // Clear frame with deep dark background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Atmospheric ambient background glow during logo hold & energy charge
      if (elapsed > T_DRIFT && elapsed < T_EXPLODE) {
        const glowAlpha = Math.min((elapsed - T_DRIFT) / 0.8, 1) * (elapsed > T_HOLD ? 0.22 : 0.12);
        const grad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, Math.min(width, height) * 0.35);
        grad.addColorStop(0, `rgba(56, 189, 248, ${glowAlpha})`);
        grad.addColorStop(0.5, `rgba(14, 165, 233, ${glowAlpha * 0.4})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      if (particles.length > 0) {
        // --- PHASE 0 & 1: Atmosphere & Digital Particle Drift ---
        if (elapsed < T_DRIFT) {
          const driftProgress = Math.max(0, (elapsed - T_ATMOSPHERE) / (T_DRIFT - T_ATMOSPHERE));

          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // Organic wave drift
            p.turbPhase += 0.015;
            p.x += Math.sin(p.y * 0.003 + p.turbPhase) * 0.4 + p.vx;
            p.y += Math.cos(p.x * 0.003 + p.turbPhase) * 0.4 + p.vy;

            p.alpha = p.baseAlpha * driftProgress * 0.6;

            ctx.fillStyle = `${p.colorBase}${p.alpha})`;
            ctx.fillRect(p.x, p.y, p.size, p.size);
          }
        }
        // --- PHASE 2: Gather & Form Logo ---
        else if (elapsed < T_FORM) {
          const gatherRaw = (elapsed - T_DRIFT) / (T_FORM - T_DRIFT);
          
          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Apply individual stagger delay
            const pProgress = Math.max(0, Math.min(1, (gatherRaw - p.delay) / (1 - p.delay)));
            // Smooth cubic ease out
            const easeP = 1 - Math.pow(1 - pProgress, 3);

            // Swirl turbulence during gathering
            const dx = p.targetX - p.x;
            const dy = p.targetY - p.y;
            const dist = Math.hypot(dx, dy);

            const swirlAngle = (1 - easeP) * 1.5;
            const targetXSwirl = p.targetX + Math.sin(swirlAngle + p.turbPhase) * dist * 0.2;
            const targetYSwirl = p.targetY + Math.cos(swirlAngle + p.turbPhase) * dist * 0.2;

            p.x += (targetXSwirl - p.x) * (0.08 + easeP * 0.12) * p.speedFactor;
            p.y += (targetYSwirl - p.y) * (0.08 + easeP * 0.12) * p.speedFactor;

            p.alpha = Math.min(p.baseAlpha * 1.2, p.baseAlpha * (0.4 + easeP * 0.6));

            ctx.fillStyle = `${p.colorBase}${p.alpha})`;
            ctx.fillRect(p.x, p.y, p.size, p.size);
          }
        }
        // --- PHASE 3: Logo Formed & Shimmering Hold ---
        else if (elapsed < T_HOLD) {
          const holdTime = elapsed - T_FORM;

          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            if (p.isOrbiter) {
              p.orbitAngle += p.orbitSpeed;
              p.x = centerX + Math.cos(p.orbitAngle) * p.orbitRadius;
              p.y = centerY + Math.sin(p.orbitAngle) * (p.orbitRadius * 0.8);
              p.alpha = p.baseAlpha * 0.9;
            } else {
              // Micro vibration & alpha shimmer
              const microJitterX = (Math.random() - 0.5) * 0.6;
              const microJitterY = (Math.random() - 0.5) * 0.6;
              p.x = p.targetX + microJitterX;
              p.y = p.targetY + microJitterY;

              const shimmer = Math.sin(holdTime * 5 + p.turbPhase) * 0.15;
              p.alpha = Math.min(1, Math.max(0.2, p.baseAlpha + shimmer));
            }

            ctx.fillStyle = `${p.colorBase}${p.alpha})`;
            ctx.fillRect(p.x, p.y, p.size, p.size);
          }
        }
        // --- PHASE 4: Energy Charge Pulse ---
        else if (elapsed < T_CHARGE) {
          const chargeRatio = (elapsed - T_HOLD) / (T_CHARGE - T_HOLD);
          // Rapid vibration + Pulse scale effect
          const pulseScale = 1 + Math.sin(chargeRatio * Math.PI) * 0.08 - (chargeRatio > 0.8 ? (chargeRatio - 0.8) * 0.2 : 0);

          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            const relX = p.targetX - centerX;
            const relY = p.targetY - centerY;

            const jitterMag = 0.5 + chargeRatio * 3.5;
            const jitterX = (Math.random() - 0.5) * jitterMag;
            const jitterY = (Math.random() - 0.5) * jitterMag;

            p.x = centerX + relX * pulseScale + jitterX;
            p.y = centerY + relY * pulseScale + jitterY;

            p.alpha = Math.min(1, p.baseAlpha + chargeRatio * 0.4);

            const currSize = p.size * (1 + chargeRatio * 0.3);

            ctx.fillStyle = chargeRatio > 0.6 ? `rgba(255, 255, 255, ${p.alpha})` : `${p.colorBase}${p.alpha})`;
            ctx.fillRect(p.x, p.y, currSize, currSize);
          }
        }
        // --- PHASE 5: MASSIVE EXPLOSION ---
        else if (elapsed < T_EXPLODE) {
          if (!explosionTriggered) {
            explosionTriggered = true;
            // Initialize physical explosion vectors for every particle
            for (let i = 0; i < particles.length; i++) {
              const p = particles[i];
              const dx = p.x - centerX;
              const dy = p.y - centerY;
              let angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.5;

              if (dx === 0 && dy === 0) angle = Math.random() * Math.PI * 2;

              // High outward velocity
              const baseSpeed = isMobile ? Math.random() * 16 + 6 : Math.random() * 28 + 10;
              p.explosionVx = Math.cos(angle) * baseSpeed;
              p.explosionVy = Math.sin(angle) * baseSpeed;
            }
          }

          const explodeTime = elapsed - T_CHARGE;
          const explodeProgress = explodeTime / (T_EXPLODE - T_CHARGE);

          ctx.lineWidth = isMobile ? 1.2 : 1.8;

          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            const prevX = p.x;
            const prevY = p.y;

            // Physics step
            p.x += p.explosionVx;
            p.y += p.explosionVy;

            p.explosionVx *= p.explosionFriction;
            p.explosionVy *= p.explosionFriction;

            // Decay alpha & size
            p.alpha = Math.max(0, (1 - explodeProgress * 1.1) * p.baseAlpha * 1.2);

            if (p.alpha > 0.01) {
              // Motion streak trail
              ctx.strokeStyle = `${p.colorBase}${p.alpha})`;
              ctx.beginPath();
              ctx.moveTo(prevX, prevY);
              ctx.lineTo(p.x - p.explosionVx * 0.6, p.y - p.explosionVy * 0.6);
              ctx.stroke();

              ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
              ctx.fillRect(p.x, p.y, p.size, p.size);
            }
          }
        }
        // --- PHASE 6: Reveal Website & Fade Out Container ---
        else if (elapsed < T_REVEAL_END) {
          const revealProgress = (elapsed - T_EXPLODE) / (T_REVEAL_END - T_EXPLODE);
          
          if (containerRef.current) {
            containerRef.current.style.opacity = `${1 - revealProgress}`;
          }

          // Remaining fading particles
          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.explosionVx * 0.5;
            p.y += p.explosionVy * 0.5;
            p.alpha = Math.max(0, p.alpha * 0.85);

            if (p.alpha > 0.01) {
              ctx.fillStyle = `${p.colorBase}${p.alpha})`;
              ctx.fillRect(p.x, p.y, p.size, p.size);
            }
          }
        } else {
          if (!completedTriggered) {
            completedTriggered = true;
            if (onComplete) onComplete();
          }
          return;
        }
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      isCleanedUp = true;
      if (animFrameId) cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black overflow-hidden pointer-events-none select-none"
      style={{ transition: 'opacity 0.4s ease-out' }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
