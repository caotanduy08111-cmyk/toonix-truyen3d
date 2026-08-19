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
  return (
    <div key={burst.id} className="absolute inset-0 pointer-events-none z-30" data-testid="flip-burst">
      {k.flash && (
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,220,255,0.32),transparent_65%)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.4 }}
        />
      )}
      {Array.from({ length: 18 }, (_, i) => {
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
