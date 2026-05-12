import { useEffect, useState, useRef } from 'react';

interface Letter {
  char: string;
  top: string;
  left: string;
  fontSize: string;
  color: string;
  zIndex: number;
  initialX: number;
  initialY: number;
  rotation: number;
}

const letters: Letter[] = [
  { char: 'P', top: '15%', left: '10%', fontSize: '18vw', color: '#000', zIndex: 1, initialX: 0.6, initialY: 0, rotation: 15 },
  { char: 'O', top: '30%', left: '24%', fontSize: '14vw', color: '#000', zIndex: 0, initialX: -1.9, initialY: -0.3, rotation: -10 },
  { char: 'R', top: '0%', left: '30%', fontSize: '16vw', color: '#000', zIndex: 2, initialX: -2.1, initialY: -7.3, rotation: -3.5 },
  { char: 'T', top: '-15%', left: '44%', fontSize: '18vw', color: '#182848', zIndex: -1, initialX: 1.8, initialY: -10, rotation: 2 },
  { char: 'F', top: '5%', left: '58%', fontSize: '14vw', color: '#000', zIndex: 2, initialX: 2.4, initialY: -0.8, rotation: 12 },
  { char: 'O', top: '22%', left: '62%', fontSize: '13vw', color: '#000', zIndex: 1, initialX: -1.4, initialY: -7.1, rotation: 1.4 },
  { char: 'L', top: '12%', left: '76%', fontSize: '15vw', color: '#000', zIndex: 2, initialX: 1.7, initialY: -0.8, rotation: -4.8 },
  { char: 'I', top: '35%', left: '87%', fontSize: '12vw', color: '#000', zIndex: 0, initialX: -2.4, initialY: -10, rotation: 17 },
  { char: 'O', top: '45%', left: '92%', fontSize: '8vw', color: '#000', zIndex: 1, initialX: 0.9, initialY: -0.4, rotation: 0.08 },
];

export default function FloatingLetters() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [touchedIdx, setTouchedIdx] = useState<number | null>(null);
  const touchTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    let raf: number;
    const handler = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
  const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;

  const handleTouch = (i: number) => {
    // Clear previous timers
    touchTimers.current.forEach(clearTimeout);
    touchTimers.current = [];
    setTouchedIdx(i);
    const t = setTimeout(() => setTouchedIdx(null), 600);
    touchTimers.current.push(t);
  };

  return (
    <div
      style={{
        zIndex: 0,
        pointerEvents: 'none',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'absolute',
      }}
    >
      {letters.map((letter, i) => {
        const dx = (mousePos.x - centerX) * 0.01;
        const dy = (mousePos.y - centerY) * 0.01;
        const isActive = hoveredIdx === i || touchedIdx === i;

        return (
          <span
            key={i}
            className="floating-letter"
            style={{
              position: 'absolute',
              top: letter.top,
              left: letter.left,
              fontSize: letter.fontSize,
              color: isActive ? 'var(--accent-color)' : letter.color,
              zIndex: isActive ? 10 : letter.zIndex,
              fontWeight: 900,
              transformOrigin: 'center center',
              transition: 'color 0.2s, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: isActive
                ? `translateX(${letter.initialX}px) translateY(${letter.initialY - 20}px) rotate(${letter.rotation}deg) scale(1.25)`
                : `translateX(${letter.initialX + dx * (i + 1)}px) translateY(${letter.initialY + dy * (i * 0.5)}px) rotate(${letter.rotation}deg) scale(1)`,
              userSelect: 'none',
              WebkitUserSelect: 'none',
              margin: '0 -0.5rem',
              fontFamily: "'Outfit', 'Inter', sans-serif",
              display: 'inline-block',
              pointerEvents: 'auto',
              cursor: 'pointer',
            }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            onTouchStart={(e) => { e.preventDefault(); handleTouch(i); }}
          >
            {letter.char}
          </span>
        );
      })}
    </div>
  );
}
