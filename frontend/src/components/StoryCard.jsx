import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Eye, Star } from '@phosphor-icons/react';
import { CoverArt } from './CoverArt';
import { genreName } from '../data/stories';

export const StoryCard = ({ story, className = '', tall = false }) => {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [9, -9]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-11, 11]), { stiffness: 180, damping: 18 });
  const gx = useTransform(mx, [0, 1], ['15%', '85%']);
  const gy = useTransform(my, [0, 1], ['15%', '85%']);
  const glare = useTransform([gx, gy], ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,240,200,0.16) 0%, transparent 55%)`);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => { mx.set(0.5); my.set(0.5); };

  return (
    <Link
      ref={ref}
      to={`/truyen/${story.slug}`}
      data-testid={`story-card-${story.slug}`}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`group block ${className}`}
      style={{ perspective: 1200 }}
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        className={`relative w-full ${tall ? 'aspect-[3/4]' : 'aspect-[3/4]'} rounded-2xl overflow-hidden border border-white/10 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.9)] group-hover:border-gold/40 group-hover:shadow-[0_0_45px_rgba(34,200,234,0.15)]`}
      >
        <CoverArt story={story} showTitle={false} />
        <motion.div className="absolute inset-0 pointer-events-none" style={{ background: glare }} />
        <div className="absolute top-3 left-3 flex gap-2" style={{ transform: 'translateZ(35px)' }}>
          <span className={`text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-md border ${story.status === 'Hoàn thành' ? 'bg-gold/15 text-gold border-gold/30' : 'bg-white/10 text-bone/90 border-white/15'}`}>
            {story.status}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5" style={{ transform: 'translateZ(45px)' }}>
          <div className="flex flex-wrap gap-1.5 mb-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-[opacity,transform] duration-300">
            {story.genres.slice(0, 2).map((g) => (
              <span key={g} className="text-[10px] uppercase tracking-wider text-ash border border-white/15 rounded-full px-2 py-0.5">{genreName(g)}</span>
            ))}
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold/80">{story.author}</p>
          <h3 className="font-display text-xl font-semibold text-bone leading-tight mt-0.5">{story.title}</h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-ash">
            <span className="flex items-center gap-1"><Eye size={13} weight="fill" className="text-gold/70" />{story.views}</span>
            <span className="flex items-center gap-1"><Star size={13} weight="fill" className="text-[#F8C93A]" />{story.rating}</span>
            <span>{story.chaptersCount} chương</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
