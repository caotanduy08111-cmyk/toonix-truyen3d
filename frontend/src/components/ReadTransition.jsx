import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from '@phosphor-icons/react';

const makeBolt = (x0, seed, w = 800, h = 420) => {
  const segments = 9;
  let d = `M ${x0} -30`;
  let x = x0;
  let dir = seed % 2 === 0 ? 1 : -1;
  for (let i = 1; i <= segments; i++) {
    const y = -30 + (i * (h + 60)) / segments;
    const amp = 24 + ((seed * 53 + i * 19) % 34);
    x += dir * amp;
    x = Math.max(20, Math.min(w - 20, x));
    d += ` L ${Math.round(x)} ${Math.round(y)}`;
    dir *= -1;
  }
  return d;
};

export const ReadTransition = ({ show, message = 'Chúc bạn đọc truyện vui vẻ', onDone }) => {
  useEffect(() => {
    if (!show) return undefined;
    const t = setTimeout(() => onDone?.(), 5000);
    return () => clearTimeout(t);
  }, [show, onDone]);

  const bolts = useMemo(() => [140, 340, 520, 680].map((x, i) => makeBolt(x, i + 3)), []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="fixed inset-0 z-[200] bg-obsidian flex items-center justify-center overflow-hidden pointer-events-none"
          data-testid="read-transition"
        >
          {bolts.map((_, i) => (
            <motion.div
              key={`flash-${i}`}
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(34,200,234,0.28),transparent_60%)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.35, delay: i * 0.12 }}
            />
          ))}

          <div className="relative w-[86vw] max-w-[620px] flex items-center justify-center">
            <svg className="absolute -inset-[30%] w-[160%] h-[160%] overflow-visible" viewBox="0 0 800 420" preserveAspectRatio="none">
              {bolts.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  pathLength="1"
                  className="hero-bolt"
                  stroke={i % 2 ? '#4DD8F0' : '#EEF4FF'}
                  strokeWidth={i % 2 ? 2 : 3.2}
                  fill="none"
                  strokeLinecap="round"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </svg>
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: [0, 1, 0.6, 1, 1, 0.75, 1],
                scale: 1,
                filter: ['brightness(1)', 'brightness(1.7)', 'brightness(1)', 'brightness(1)', 'brightness(1.2)', 'brightness(1)', 'brightness(1.2)'],
              }}
              transition={{ duration: 4.6, times: [0, 0.1, 0.2, 0.2, 0.55, 0.78, 1], ease: 'easeInOut' }}
              className="relative font-display text-2xl md:text-4xl font-bold text-bone text-center px-6 drop-shadow-[0_0_30px_rgba(34,200,234,0.6)] flex items-center justify-center gap-3 flex-wrap"
            >
              <span>{message}</span>
              <motion.span
                className="inline-flex text-blood drop-shadow-[0_0_18px_rgba(224,85,74,0.75)]"
                animate={{ scale: [1, 1.3, 1, 1.18, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Heart weight="fill" size={30} />
              </motion.span>
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
