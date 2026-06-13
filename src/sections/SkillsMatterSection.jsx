import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import SectionHeading from '../components/SectionHeading';
import { useSectionReveal } from '../hooks/useActiveSection.jsx';

// ----------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------
const SKILLS = [
  'Numpy',
  'Statistics',
  'Pandas',
  'Matplotlib',
  'Seaborn',
  'Plotly',
  'Beautiful Soup',
  'Scikit-Learn',
  'HTML5',
  'CSS',
  'JavaScript',
  'TailwindCSS',
  'Sass',
  'Django',
  'Node.js',
  'phpMyAdmin',
  'SQLite',
  'VS Code',
  'Figma',
  'Jupyter',
  'Adobe Illustrator',
  'Anaconda',
  'Linux',
  'Git'
];

const BOX_HEIGHT = 46;
const BOX_RADIUS = 12;
const WALL_THICKNESS = 200;
const BOX_PADDING_X = 26;

// ----------------------------------------------------------------------
// Helper Functions (Declared before use to avoid TDZ issues)
// ----------------------------------------------------------------------

/**
 * Estimates the width of a skill box based on its text length.
 */
function estimateBoxWidth(label) {
  return Math.max(108, Math.min(220, Math.round(label.length * 8.5 + BOX_PADDING_X * 2)));
}

/**
 * Normalizes an angle (in radians) to the range [-pi/2, pi/2] (i.e. [-90 deg, 90 deg])
 * by adding or subtracting pi (180 deg) as necessary.
 * This keeps the symmetric card upright and readable while preserving its physical alignment.
 */
function normalizeAngle(angle) {
  let norm = angle % (2 * Math.PI);
  if (norm > Math.PI) norm -= 2 * Math.PI;
  if (norm < -Math.PI) norm += 2 * Math.PI;

  if (norm > Math.PI / 2) {
    norm -= Math.PI;
  } else if (norm < -Math.PI / 2) {
    norm += Math.PI;
  }
  return norm;
}

/**
 * Creates boundary walls outside the visible viewport area.
 */
function createWalls(MatterLib, width, height, thickness) {
  const { Bodies } = MatterLib;
  const wallOptions = {
    isStatic: true,
    friction: 0.1,
    restitution: 0.3, // Matches realistic bouncy wall behavior
    render: { visible: false }
  };

  return [
    // Top wall
    Bodies.rectangle(width / 2, -thickness / 2, width + thickness * 2, thickness, wallOptions),
    // Bottom wall (floor)
    Bodies.rectangle(width / 2, height + thickness / 2, width + thickness * 2, thickness, wallOptions),
    // Left wall
    Bodies.rectangle(-thickness / 2, height / 2, thickness, height + thickness * 2, wallOptions),
    // Right wall
    Bodies.rectangle(width + thickness / 2, height / 2, thickness, height + thickness * 2, wallOptions)
  ];
}

/**
 * Creates rectangular Matter.js bodies for all skills arranged in a neat grid/stack at the top.
 */
function createSkillBodies(MatterLib, width) {
  const { Bodies, Body } = MatterLib;
  
  // Arrange them in neat rows/columns near the top
  const columns = width < 640 ? 3 : 5;
  const colWidth = width / (columns + 1);

  return SKILLS.map((label, index) => {
    const boxWidth = estimateBoxWidth(label);
    const boxHeight = BOX_HEIGHT;

    const col = index % columns;
    const row = Math.floor(index / columns);

    // Initial stacked layout coordinates near the top
    // Slight random offset to allow boxes to slide and tumble realistically
    const x = colWidth * (col + 1) + (Math.random() - 0.5) * 8;
    const y = 60 + row * (BOX_HEIGHT + 15);

    const body = Bodies.rectangle(x, y, boxWidth, boxHeight, {
      chamfer: { radius: BOX_RADIUS },
      friction: 0.1,      // Matches realistic friction
      frictionAir: 0.01,  // Matches realistic air resistance
      restitution: 0.3,   // Matches realistic bounciness
      density: 0.001
    });

    // Apply a minor initial rotation angle to ensure they tumble naturally when falling
    Body.setAngle(body, (Math.random() - 0.5) * 0.15);

    return {
      label,
      width: boxWidth,
      height: boxHeight,
      body
    };
  });
}

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
export default function SkillsMatterSection() {
  const sectionRef = useSectionReveal('skills');
  const boardRef = useRef(null);
  
  // Refs for the rendered DOM boxes
  const domRefs = useRef([]);
  
  // Refs for Matter.js engine elements (preserves state without triggering React renders)
  const engineRef = useRef(null);
  const wallsRef = useRef([]);
  const skillItemsRef = useRef([]);
  const mouseConstraintRef = useRef(null);
  const mouseRef = useRef(null);

  // Loop control & resizing references
  const requestRef = useRef(null);
  const lastTimeRef = useRef(0);
  const isIntersectingRef = useRef(false);
  const sceneSizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    // Get initial width and height (fallbacks if layout is not ready yet)
    const rect = board.getBoundingClientRect();
    const initialWidth = rect.width || 800;
    const initialHeight = rect.height || 600;
    sceneSizeRef.current = { width: initialWidth, height: initialHeight };

    // Instantiate Matter.js Engine with gravity enabled on Y-axis
    const { Engine, Composite, Mouse, MouseConstraint } = Matter;
    const engine = Engine.create({
      gravity: { x: 0, y: 1 }
    });
    engineRef.current = engine;

    // Generate skill bodies stacked in a grid near the top
    const skillItems = createSkillBodies(Matter, initialWidth);
    skillItemsRef.current = skillItems;
    
    // Add skill bodies to physical world
    const bodies = skillItems.map(item => item.body);
    Composite.add(engine.world, bodies);

    // Create and add initial wall boundaries
    const walls = createWalls(Matter, initialWidth, initialHeight, WALL_THICKNESS);
    wallsRef.current = walls;
    Composite.add(engine.world, walls);

    // Setup interactive mouse/touch input
    const mouse = Mouse.create(board);
    mouseRef.current = mouse;
    mouse.element.style.touchAction = 'none'; // Prevent scrolling when dragging on mobile
    mouse.element.style.userSelect = 'none';

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.15,
        damping: 0.1,
        render: { visible: false }
      }
    });
    mouseConstraintRef.current = mouseConstraint;
    Composite.add(engine.world, mouseConstraint);

    /**
     * Synchronizes the absolute React DOM elements with Matter.js physical bodies.
     */
    const syncDOM = () => {
      skillItemsRef.current.forEach(({ body }, index) => {
        const domElement = domRefs.current[index];
        if (domElement) {
          const { x, y } = body.position;
          
          // Normalize the angle so text is never upside down (between -90 and 90 degrees)
          const normalizedAngle = normalizeAngle(body.angle);

          // Apply rotation only once to the outer container. Text inherits it naturally.
          domElement.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${normalizedAngle}rad)`;
        }
      });
    };

    /**
     * Re-calculates boundaries and clamps body positions on container resizing.
     */
    const handleResize = () => {
      if (!boardRef.current || !engineRef.current) return;
      const currentRect = boardRef.current.getBoundingClientRect();
      const nextWidth = currentRect.width;
      const nextHeight = currentRect.height;

      if (nextWidth <= 0 || nextHeight <= 0) return;

      sceneSizeRef.current = { width: nextWidth, height: nextHeight };

      // Recreate and re-add boundaries matching new size
      if (wallsRef.current.length > 0) {
        Composite.remove(engineRef.current.world, wallsRef.current);
      }
      const newWalls = createWalls(Matter, nextWidth, nextHeight, WALL_THICKNESS);
      wallsRef.current = newWalls;
      Composite.add(engineRef.current.world, newWalls);

      // Clamp bodies inside the new boundaries so they don't get trapped outside walls
      skillItemsRef.current.forEach(({ body, width: boxW, height: boxH }) => {
        const px = body.position.x;
        const py = body.position.y;

        const clampedX = Math.max(boxW / 2 + 10, Math.min(nextWidth - boxW / 2 - 10, px));
        const clampedY = Math.max(boxH / 2 + 10, Math.min(nextHeight - boxH / 2 - 10, py));

        if (px !== clampedX || py !== clampedY) {
          Matter.Body.setPosition(body, { x: clampedX, y: clampedY });
          Matter.Body.setVelocity(body, { x: 0, y: 0 }); // reset velocity if clamped
        }
      });

      // Synchronize rendering changes immediately
      syncDOM();
    };

    /**
     * Physics and DOM animation step running on every requestAnimationFrame.
     */
    const step = (time) => {
      if (!isIntersectingRef.current) return;

      const delta = Math.min(time - lastTimeRef.current, 30);
      lastTimeRef.current = time;

      // Update Engine simulation (gravity and collisions are computed by Matter.js)
      Engine.update(engine, delta);

      // Render positions to DOM
      syncDOM();

      // Schedule next frame
      requestRef.current = requestAnimationFrame(step);
    };

    /**
     * Controls physics processing when the browser tab visibility changes.
     */
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
          requestRef.current = null;
        }
      } else {
        if (isIntersectingRef.current && !requestRef.current) {
          lastTimeRef.current = performance.now();
          requestRef.current = requestAnimationFrame(step);
        }
      }
    };

    // Monitor resize events using ResizeObserver
    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { width: entryW, height: entryH } = entry.contentRect;
          if (entryW > 0 && entryH > 0) {
            handleResize();
          }
        }
      });
      resizeObserver.observe(board);
    } else {
      window.addEventListener('resize', handleResize, { passive: true });
    }

    // Monitor section visibility using IntersectionObserver
    let intersectionObserver = null;
    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver((entries) => {
        const entry = entries[0];
        const isVisible = entry ? entry.isIntersecting : false;

        if (isVisible) {
          if (!isIntersectingRef.current) {
            isIntersectingRef.current = true;
            lastTimeRef.current = performance.now();
            requestRef.current = requestAnimationFrame(step);
          }
        } else {
          isIntersectingRef.current = false;
          if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
            requestRef.current = null;
          }
        }
      }, {
        threshold: 0.05
      });
      intersectionObserver.observe(board);
    } else {
      // Fallback: run loop immediately if IntersectionObserver isn't supported
      isIntersectingRef.current = true;
      lastTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(step);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial positioning render
    syncDOM();

    // Cleanup resources and listeners on component unmount
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', handleResize);
      }

      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }

      if (mouseRef.current) {
        Mouse.clearSourceEvents(mouseRef.current);
      }

      Composite.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="bg-black px-6 py-24 lg:px-16 select-none">
      <div className="mx-auto max-w-6xl">
        <SectionHeading>Technical Skills</SectionHeading>

        <div
          ref={boardRef}
          className="relative mt-12 overflow-hidden w-full cursor-grab active:cursor-grabbing"
          style={{
            height: 'clamp(560px, 72vh, 860px)',
            backgroundColor: '#000000',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            touchAction: 'none',
            userSelect: 'none',
          }}
        >
          {SKILLS.map((skill, index) => {
            const width = estimateBoxWidth(skill);
            return (
              <div
                key={skill}
                ref={(el) => {
                  domRefs.current[index] = el;
                }}
                className="absolute left-0 top-0 flex items-center justify-center border border-white/15 bg-[#111111] shadow-2xl transition-colors duration-200 hover:border-white/30"
                style={{
                  width: `${width}px`,
                  height: `${BOX_HEIGHT}px`,
                  borderRadius: `${BOX_RADIUS}px`,
                  transformOrigin: 'center center',
                  willChange: 'transform',
                }}
              >
                <span
                  className="skill-label text-sm font-medium tracking-wide text-white select-none pointer-events-none"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap',
                    transform: 'none',
                  }}
                >
                  {skill}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
