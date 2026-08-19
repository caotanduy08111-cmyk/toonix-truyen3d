import { useMemo } from 'react';
import { motion } from 'framer-motion';

const rnd = (i, k) => ((i * 37 + k * 91) % 100) / 100;

const FX = {
  'tien-hiep': { n: 14, kind: 'streak', dir: 'up', colors: ['rgba(34,200,234,0.55)', 'rgba(77,216,240,0.4)'] },
  'kiem-hiep': { n: 14, kind: 'streak', dir: 'up', colors: ['rgba(238,244,255,0.45)', 'rgba(34,200,234,0.4)'] },
  'huyen-huyen': { n: 24, kind: 'dot', dir: 'up', colors: ['rgba(34,200,234,0.85)', 'rgba(248,201,58,0.75)', 'rgba(77,216,240,0.65)'] },
  'kinh-di': { n: 8, kind: 'fog', dir: 'drift', colors: ['rgba(224,85,74,0.16)', 'rgba(120,130,160,0.15)'] },
  'do-thi': { n: 18, kind: 'streak', dir: 'down', colors: ['rgba(34,200,234,0.45)', 'rgba(72,145,231,0.4)'] },
  'khoa-huyen': { n: 20, kind: 'dot', dir: 'drift', colors: ['rgba(77,216,240,0.75)', 'rgba(238,244,255,0.55)'] },
  'lang-man': { n: 16, kind: 'petal', dir: 'down', colors: ['rgba(244,114,182,0.6)', 'rgba(248,201,58,0.45)'] },
  'hai-huoc': { n: 16, kind: 'bubble', dir: 'up', colors: ['rgba(77,216,240,0.55)', 'rgba(248,201,58,0.5)'] },
};

const kindStyle = (kind, p) => {
  switch (kind) {
    case 'streak':
      return { width: p.size, height: p.len, background: `linear-gradient(to bottom, transparent, ${p.color})`, borderRadius: 999, filter: 'blur(0.5px)' };
    case 'fog':
      return { width: p.size, height: p.size, borderRadius: '50%', background: p.color, filter: 'blur(42px)' };
    case 'petal':
      return { width: p.size * 2.2, height: p.size * 1.3, background: p.color, borderRadius: '70% 30% 70% 30%' };
    case 'bubble':
      return { width: p.size * 2.6, height: p.size * 2.6, borderRadius: '50%', border: `1.5px solid ${p.color}`, background: 'transparent' };
    default:
      return { width: p.size, height: p.size, borderRadius: '50%', background: p.color, boxShadow: `0 0 ${p.size * 2.5}px ${p.color}` };
  }
};

export const ReaderAmbience = ({ genres = [] }) => {
  const cfg = FX[genres[0]] || FX['huyen-huyen'];
  const parts = useMemo(
    () =>
      Array.from({ length: cfg.n }, (_, i) => ({
        left: rnd(i, 1) * 100,
        size: cfg.kind === 'fog' ? 130 + rnd(i, 2) * 170 : cfg.kind === 'streak' ? 2 + rnd(i, 2) * 2 : 4 + rnd(i, 2) * 6,
        len: 40 + rnd(i, 3) * 60,
        dur: 6 + rnd(i, 4) * 8,
        delay: -rnd(i, 5) * 12,
        color: cfg.colors[i % cfg.colors.length],
        drift: (rnd(i, 6) - 0.5) * 120,
      })),
    [cfg]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true" data-testid="reader-ambience">
      {parts.map((p, i) => {
        const vertical =
          cfg.dir === 'down' ? { y: ['-12vh', '112vh'] } : cfg.dir === 'up' ? { y: ['112vh', '-12vh'] } : { y: ['0vh', '-6vh', '0vh'] };
        return (
          <motion.span
            key={i}
            className="absolute top-0"
            style={{ left: `${p.left}%`, ...kindStyle(cfg.kind, p) }}
            animate={{
              ...vertical,
              x: [0, p.drift, 0],
              opacity: cfg.kind === 'fog' ? [0.5, 0.95, 0.5] : [0, 1, 1, 0],
              rotate: cfg.kind === 'petal' ? [0, 320] : 0,
            }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: cfg.kind === 'fog' || cfg.dir === 'drift' ? 'easeInOut' : 'linear' }}
          />
        );
      })}
    </div>
  );
};
