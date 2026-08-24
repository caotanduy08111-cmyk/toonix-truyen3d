import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Sparkle, Lightning, Star, Heart, BookOpen, Fire } from '@phosphor-icons/react';
import { playClickSound } from '@/lib/clickSound';

const ICONS = [Sparkle, Lightning, Star, Heart, BookOpen, Fire];
const COLORS = ['#22C8EA', '#4DD8F0', '#F8C93A', '#4891E7'];

let particleId = 0;

export const CursorFX = () => {
  const [trailEnabled, setTrailEnabled] = useState(false);
  const [particles, setParticles] = useState([]);
  const mx = useMotionValue(-300);
  const my = useMotionValue(-300);
  const glowX = useSpring(mx, { damping: 22, stiffness: 180, mass: 0.4 });
  const glowY = useSpring(my, { damping: 22, stiffness: 180, mass: 0.4 });
  const lastSpawn = useRef({ x: 0, y: 0, t: 0 });

  useEffect(() => {
    const handleClick = () => playClickSound();
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    const fineNoTouch = window.matchMedia('(pointer: fine)').matches;
    const noReducedMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const enabled = fineNoTouch && noReducedMotion;
    setTrailEnabled(enabled);
    if (!enabled) return undefined;

    const handleMove = (e) => {
      mx.set(e.clientX);
      my.set(e.clientY);

      const dx = e.clientX - lastSpawn.current.x;
      const dy = e.clientY - lastSpawn.current.y;
      const dist = Math.hypot(dx, dy);
      const now = performance.now();
      if (dist > 90 && now - lastSpawn.current.t > 110) {
        lastSpawn.current = { x: e.clientX, y: e.clientY, t: now };
        const Icon = ICONS[Math.floor(Math.random() * ICONS.length)];
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const id = particleId++;
        const drift = (Math.random() - 0.5) * 70;
        const rotate = (Math.random() - 0.5) * 60;
        setParticles((p) => [...p.slice(-14), { id, x: e.clientX, y: e.clientY, Icon, color, drift, rotate }]);
        setTimeout(() => {
          setParticles((p) => p.filter((it) => it.id !== id));
        }, 850);
      }
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mx, my]);

  if (!trailEnabled) return null;

  return (
    <div className="fixed inset-0 z-[95] pointer-events-none overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute w-[220px] h-[220px] rounded-full"
        style={{
          left: glowX,
          top: glowY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(34,200,234,0.20) 0%, rgba(34,200,234,0.08) 40%, transparent 70%)',
          mixBlendMode: 'screen',
        }}
      />
      <AnimatePresence>
        {particles.map(({ id, x, y, Icon, color, drift, rotate }) => (
          <motion.div
            key={id}
            className="absolute"
            style={{ left: x, top: y, translateX: '-50%', translateY: '-50%', color }}
            initial={{ opacity: 0, scale: 0.4, x: 0, y: 0, rotate: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.7], x: drift, y: -46, rotate }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
          >
            <Icon size={22} weight="fill" style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
