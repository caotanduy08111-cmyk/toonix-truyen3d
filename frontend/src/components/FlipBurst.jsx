import { motion } from 'framer-motion';

const KIND_STYLE = {
  fire: { colors: ['#ffd27d', '#ff7a18', '#ff3d00'], size: [5, 11], up: true, glow: 14 },
  blood: { colors: ['#ff9a8a', '#E0554A', '#9a1515'], size: [5, 11], up: true, glow: 14 },
  ice: { colors: ['#ffffff', '#bfefff', '#4DD8F0'], size: [4, 9], up: false, shard: true, glow: 10 },
  lightning: { colors: ['#EEF4FF', '#4DD8F0', '#22C8EA'], size: [3, 6], up: true, glow: 16, flash: true },
  bubble: { colors: ['rgba(77,216,240,0.9)', 'rgba(248,201,58,0.85)'], size: [8, 16], up: true, ring: true },
};

const rnd = (i, k, seed) => ((i * 53 + k * 97 + seed * 31) % 100) / 100;

export const FlipBurst = ({ burst, kind = 'lightning' }) => {
  if (!burst) return null;
  const k = KIND_STYLE[kind] || KIND_STYLE.lightning;
  const seed = burst.id % 97;
  const side = burst.dir > 0 ? { right: '4%' } : { left: '4%' };
  const flashColor = k.colors[0];
  return (
    <div key={burst.id} className="absolute inset-0 pointer-events-none z-30 overflow-hidden" data-testid="flip-burst">
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${burst.dir > 0 ? '85%' : '15%'} 50%, ${flashColor}55, transparent 62%)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: k.flash ? 0.45 : 0.3 }}
      />
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 rounded-full"
        style={{
          ...side,
          width: 4,
          height: 4,
          boxShadow: `0 0 40px 18px ${flashColor}`,
          background: flashColor,
        }}
        initial={{ opacity: 0.9, scale: 0.3 }}
        animate={{ opacity: 0, scale: 14 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      />
      {Array.from({ length: 30 }, (_, i) => {
        const out = (burst.dir > 0 ? 1 : -1) * (40 + rnd(i, 1, seed) * 160);
        const vy = k.up ? -(30 + rnd(i, 2, seed) * 150) : 20 + rnd(i, 2, seed) * 140;
        const size = k.size[0] + rnd(i, 3, seed) * (k.size[1] - k.size[0]);
        const color = k.colors[i % k.colors.length];
        return (
          <motion.span
            key={i}
            className="absolute top-1/2"
            style={{
              ...side,
              width: size,
              height: k.shard ? size * 2.2 : size,
              background: k.ring ? 'transparent' : color,
              border: k.ring ? `1.5px solid ${color}` : 'none',
              borderRadius: k.shard ? 2 : '50%',
              boxShadow: k.ring ? 'none' : `0 0 ${k.glow}px ${color}`,
            }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
            animate={{ x: out, y: vy, opacity: 0, rotate: rnd(i, 4, seed) * 320, scale: k.up ? 0.3 : 1.1 }}
            transition={{ duration: 0.7 + rnd(i, 5, seed) * 0.6, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
};
