import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const makeBolt = (x0, seed, w = 800, h = 420) => {
  let d = `M ${x0} -30`;
  let x = x0;
  for (let y = 30; y <= h + 30; y += 42) {
    x += ((seed * 97 + y * 31) % 110) - 55;
    x = Math.max(20, Math.min(w - 20, x));
    d += ` L ${Math.round(x)} ${y}`;
  }
  return d;
};

let introDone = false;

export const LightningIntro = () => {
  const [show, setShow] = useState(() => !introDone && !sessionStorage.getItem('toonix_intro'));

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => {
      introDone = true;
      sessionStorage.setItem('toonix_intro', '1');
      setShow(false);
    }, 2600);
    return () => clearTimeout(t);
  }, [show]);

  const bolts = useMemo(() => [140, 340, 520, 680].map((x, i) => makeBolt(x, i + 3)), []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          className="fixed inset-0 z-[100] bg-obsidian flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={() => setShow(false)}
          data-testid="lightning-intro"
        >
          {bolts.map((_, i) => (
            <motion.div
              key={`flash-${i}`}
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(34,200,234,0.28),transparent_60%)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.42 }}
            />
          ))}

          <div className="relative w-[86vw] max-w-[760px]">
            <motion.img
              src="/logo.png"
              alt="TOONIX — Infinite Story Universe"
              data-testid="intro-logo"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{
                opacity: [0, 1, 0.5, 1, 0.7, 1],
                scale: [0.92, 1, 1, 1, 1, 1],
                filter: ['brightness(1)', 'brightness(2.4)', 'brightness(0.7)', 'brightness(1.8)', 'brightness(0.9)', 'brightness(1)'],
              }}
              transition={{ duration: 2.3, times: [0, 0.18, 0.32, 0.5, 0.68, 1], ease: 'easeOut' }}
              className="w-full h-auto drop-shadow-[0_0_50px_rgba(34,200,234,0.55)]"
            />
            <svg className="absolute -inset-[12%] w-[124%] h-[124%]" viewBox="0 0 800 420" preserveAspectRatio="none">
              {bolts.map((d, i) => (
                <motion.path
                  key={i}
                  d={d}
                  stroke={i % 2 ? '#4DD8F0' : '#22C8EA'}
                  strokeWidth={i % 2 ? 2 : 3.2}
                  strokeLinecap="round"
                  fill="none"
                  style={{ filter: 'drop-shadow(0 0 5px #22C8EA) drop-shadow(0 0 16px #22C8EA)' }}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.5, delay: 0.35 + i * 0.35, times: [0, 0.35, 1], ease: 'easeOut', repeat: 3, repeatDelay: 0.12 }}
                />
              ))}
            </svg>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.4, 1] }}
            transition={{ delay: 1.7, duration: 0.7 }}
            className="absolute bottom-10 text-[11px] uppercase tracking-[0.5em] text-gold/80"
          >
            Infinite Story Universe
          </motion.p>
          <span className="absolute bottom-10 right-8 text-[10px] uppercase tracking-[0.3em] text-ash/60">Chạm để bỏ qua</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
