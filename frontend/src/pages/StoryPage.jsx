import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { BookOpen, Clock, Eye, Heart, ListBullets, Star, User } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { getStory, genreName, STORIES } from '../data/stories';
import { CoverArt } from '../components/CoverArt';
import { StoryCard } from '../components/StoryCard';
import { Reveal } from '../components/Reveal';
import { isFav, toggleFav } from '../lib/store';

const TiltCover = ({ story }) => {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 150, damping: 18 });
  return (
    <div
      style={{ perspective: 1000 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={() => { mx.set(0.5); my.set(0.5); }}
      className="relative w-full max-w-[300px] mx-auto"
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gold/30 gold-glow shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
      >
        <CoverArt story={story} />
      </motion.div>
      <div className="absolute -inset-6 bg-gold/10 blur-3xl rounded-full -z-10 animate-pulse-gold" />
    </div>
  );
};

export default function StoryPage() {
  const { slug } = useParams();
  const story = getStory(slug);
  const [fav, setFav] = useState(false);

  useEffect(() => { setFav(isFav(slug)); }, [slug]);

  if (!story) {
    return (
      <div className="relative z-10 min-h-screen flex items-center justify-center" data-testid="story-not-found">
        <div className="text-center">
          <h1 className="font-display text-5xl text-bone">Không tìm thấy truyện</h1>
          <Link to="/danh-sach" className="text-gold mt-4 inline-block hover:underline">← Về danh sách truyện</Link>
        </div>
      </div>
    );
  }

  const related = STORIES.filter((s) => s.slug !== slug && s.genres.some((g) => story.genres.includes(g))).slice(0, 3);

  const onFav = () => {
    const now = toggleFav(slug);
    setFav(now);
    toast(now ? 'Đã thêm vào yêu thích' : 'Đã bỏ yêu thích', { description: story.title });
  };

  return (
    <div data-testid="story-page" className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 pt-28 md:pt-36 pb-10">
      <div className="grid lg:grid-cols-[340px_1fr] gap-12 lg:gap-20">
        <Reveal>
          <TiltCover story={story} />
          <div className="flex gap-3 mt-8 max-w-[300px] mx-auto">
            <Link
              to={`/doc/${story.slug}/1`}
              data-testid="read-from-start-btn"
              className="flex-1 py-3.5 rounded-full bg-gold text-obsidian text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-[0_0_35px_rgba(34,200,234,0.45)] transition-shadow duration-300"
            >
              <BookOpen size={15} weight="bold" /> Đọc từ đầu
            </Link>
            <button
              data-testid="favorite-toggle-btn"
              onClick={onFav}
              className={`w-13 px-4 rounded-full border flex items-center justify-center transition-colors duration-300 ${fav ? 'bg-blood/30 border-blood text-red-300' : 'border-white/20 text-ash hover:border-blood hover:text-red-300'}`}
              aria-label="Yêu thích"
            >
              <Heart size={18} weight={fav ? 'fill' : 'regular'} />
            </button>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <div className="flex flex-wrap gap-2 mb-5">
              {story.genres.map((g) => (
                <Link key={g} to={`/the-loai/${g}`} data-testid={`story-genre-${g}`} className="text-[11px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition-colors">
                  {genreName(g)}
                </Link>
              ))}
              <span className={`text-[11px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${story.status === 'Hoàn thành' ? 'border-gold/40 bg-gold/15 text-gold' : 'border-white/15 text-ash'}`}>
                {story.status}
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-bone leading-tight">{story.title}</h1>
            <p className="text-ash mt-4 flex items-center gap-2 text-sm">
              <User size={15} className="text-gold/70" /> {story.author}
            </p>
            <div className="flex flex-wrap gap-7 mt-7 text-sm text-ash">
              <span className="flex items-center gap-2"><Eye size={16} className="text-gold/70" />{story.views} lượt đọc</span>
              <span className="flex items-center gap-2"><Star size={16} weight="fill" className="text-[#F8C93A]" />{story.rating}/5</span>
              <span className="flex items-center gap-2"><ListBullets size={16} className="text-gold/70" />{story.chaptersCount} chương</span>
              <span className="flex items-center gap-2"><Clock size={16} className="text-gold/70" />{story.updated}</span>
            </div>
            <p className="mt-8 text-bone/85 leading-[1.9] text-base md:text-lg font-light max-w-3xl">{story.desc}</p>
            <div className="flex flex-wrap gap-2 mt-6">
              {story.tags.map((t) => (
                <span key={t} className="text-xs text-ash border border-white/10 rounded-full px-3 py-1">#{t}</span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-14">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-bone">Danh sách chương</h2>
                <Link to={`/doc/${story.slug}/${story.chapters.length}`} data-testid="read-latest-btn" className="text-xs uppercase tracking-[0.2em] text-gold hover:underline">
                  Đọc chương mới nhất →
                </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-x-8">
                {story.chapters.map((c, i) => (
                  <motion.div key={c.num} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.5 }}>
                    <Link
                      to={`/doc/${story.slug}/${c.num}`}
                      data-testid={`chapter-link-${c.num}`}
                      className="group flex items-center justify-between gap-4 py-4 border-b border-white/8 hover:bg-gold/[0.04] hover:pl-3 transition-[background-color,padding] duration-300 rounded-md"
                    >
                      <span className="flex items-center gap-4 min-w-0">
                        <span className="font-display text-lg text-stroke-faint group-hover:text-gold transition-colors w-8 shrink-0">{String(c.num).padStart(2, '0')}</span>
                        <span className="text-sm md:text-base text-bone/85 group-hover:text-gold transition-colors truncate">{c.title}</span>
                      </span>
                      <span className="text-xs text-ash shrink-0">{c.time}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-24">
          <Reveal><h2 className="font-display text-3xl md:text-4xl font-semibold text-bone mb-10">Cùng thế giới với truyện này</h2></Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl">
            {related.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.08}><StoryCard story={s} /></Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
