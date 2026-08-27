import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, Eye } from '@phosphor-icons/react';
import { STORIES, byGenre, fullStories, topStories, genreName, GENRES } from '../data/stories';
import { StoryCard } from '../components/StoryCard';
import { StoryLink } from '../components/StoryLink';
import { Reveal } from '../components/Reveal';
import { getHistory } from '../lib/store';
import { CoverArt } from '../components/CoverArt';

const HERO_BANNERS = [
  '/banners/naruto.jpg',
  '/banners/iruma.jpg',
  '/banners/hiep-si-hoa-bang.jpg',
  '/banners/tien-dao-so-1.jpg',
  '/banners/cuoc-chien-cac-vi-than.jpg',
  '/banners/lan-nua-toa-sang.jpg',
  '/banners/mr-devourer.jpg',
  '/banners/bao-mau-xac-uop.jpg',
  '/banners/the-thao-cuc-han.jpg',
];

const bannerIndexFor = (key) => {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return hash % HERO_BANNERS.length;
};

const CONFIG = {
  all: { kicker: 'Kho truyện', title: 'Danh sách truyện', desc: 'Toàn bộ kho truyện trong thư viện TOONIX.', get: () => STORIES, display: 'grid' },
  updated: { kicker: 'Vừa ra lò', title: 'Truyện mới cập nhật', desc: 'Những chương truyện nóng hổi vừa được đăng tải.', get: () => STORIES, display: 'grid' },
  full: { kicker: 'Đọc một hơi', title: 'Truyện đã hoàn thành', desc: 'Không cần chờ đợi — đọc từ trang đầu đến hồi kết.', get: () => fullStories, display: 'grid' },
  top: { kicker: 'Bảng phong thần', title: 'Top truyện đọc nhiều', desc: 'Bảng xếp hạng dựa trên lượt đọc của cộng đồng.', get: () => topStories, display: 'rank' },
  genre: { kicker: 'Thể loại', display: 'grid' },
  history: { kicker: 'Hành trình của bạn', title: 'Lịch sử đọc', desc: 'Tiếp tục đúng nơi bạn đã dừng lại.', display: 'history' },
};

export default function ListPage({ kind }) {
  const { slug } = useParams();
  const cfg = CONFIG[kind];
  const genre = kind === 'genre' ? GENRES.find((g) => g.slug === slug) : null;
  const title = genre ? genre.name : cfg.title;
  const desc = genre ? genre.desc : cfg.desc;
  const stories = kind === 'genre' ? byGenre(slug) : cfg.get ? cfg.get() : [];
  const history = kind === 'history' ? getHistory() : [];
  const [bannerIdx, setBannerIdx] = useState(() => bannerIndexFor(`${kind}-${slug || ''}`));

  useEffect(() => {
    setBannerIdx(bannerIndexFor(`${kind}-${slug || ''}`));
  }, [kind, slug]);

  useEffect(() => {
    const id = setInterval(() => setBannerIdx((i) => (i + 1) % HERO_BANNERS.length), 5000);
    return () => clearInterval(id);
  }, []);

  const banner = HERO_BANNERS[bannerIdx];

  return (
    <div data-testid={`list-page-${kind}`} className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 pt-32 md:pt-40 pb-10 min-h-screen">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-coal/40 px-6 md:px-12 py-12 md:py-16" data-testid="list-hero">
        <AnimatePresence initial={false}>
          <motion.img
            key={banner}
            src={banner}
            alt=""
            initial={{ x: '100%', opacity: 0.4 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0.4 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full object-cover"
            data-testid="list-hero-banner"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(2,8,23,0.98)_0%,rgba(2,8,23,0.85)_35%,rgba(2,8,23,0.35)_55%,transparent_68%)]" />
        <div className="relative">
          <div>
            <motion.p
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs uppercase tracking-[0.5em] text-gold mb-4 flex items-center gap-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            >
              <span className="w-10 h-px bg-gold/60" /> {cfg.kicker}
            </motion.p>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="font-display text-5xl md:text-7xl font-bold text-bone leading-[1.05] drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)]"
              >
                {title}
              </motion.h1>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-ash mt-4 max-w-xl text-base md:text-lg drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]"
            >
              {desc}
            </motion.p>
            {cfg.display !== 'history' && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-7 inline-flex items-center gap-3 glass rounded-full pl-2 pr-5 py-2 gold-glow"
                data-testid="list-count-chip"
              >
                <span className="w-9 h-9 rounded-full bg-gold text-obsidian flex items-center justify-center font-display font-bold text-lg">{stories.length}</span>
                <span className="text-xs uppercase tracking-[0.25em] text-ash">bộ truyện trong tuyển tập</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {cfg.display === 'grid' && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-7 mt-14">
          {stories.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 4) * 0.06}><StoryCard story={s} /></Reveal>
          ))}
        </div>
      )}

      {cfg.display === 'rank' && (
        <div className="mt-14 max-w-4xl">
          {stories.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.04} y={24}>
              <StoryLink slug={s.slug} data-testid={`top-row-${s.slug}`} className="group flex items-center gap-5 md:gap-8 py-5 border-b border-white/8 hover:bg-gold/[0.04] hover:pl-3 transition-[background-color,padding] duration-300 rounded-lg">
                <span className={`font-display text-4xl md:text-6xl font-bold w-16 shrink-0 ${i < 3 ? 'text-gold' : 'text-stroke-faint group-hover:text-gold/60'} transition-colors duration-300`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="relative w-14 aspect-[3/4] rounded-md overflow-hidden border border-white/10 shrink-0 hidden sm:block">
                  <CoverArt story={s} showTitle={false} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-display text-xl md:text-2xl font-semibold text-bone truncate group-hover:text-gold transition-colors">{s.title}</span>
                  <span className="block text-xs text-ash mt-1">{s.genres.map(genreName).join(' · ')} — {s.author} — {s.status}</span>
                </span>
                <span className="flex items-center gap-1.5 text-sm text-ash shrink-0"><Eye size={15} className="text-gold/60" />{s.views}</span>
              </StoryLink>
            </Reveal>
          ))}
        </div>
      )}

      {cfg.display === 'history' && (
        <HistoryList history={history} />
      )}
    </div>
  );
}

const HistoryList = ({ history }) => {
  const [, tick] = useState(0);
  useEffect(() => {
    const sync = () => tick((t) => t + 1);
    window.addEventListener('hc-store', sync);
    return () => window.removeEventListener('hc-store', sync);
  }, []);

  if (history.length === 0) {
    return (
      <div className="mt-20 text-center py-20 glass rounded-2xl" data-testid="history-empty">
        <Clock size={44} className="text-gold/50 mx-auto mb-5" weight="duotone" />
        <p className="font-display text-2xl text-bone">Bạn chưa đọc truyện nào</p>
        <p className="text-sm text-ash mt-2">Hành trình ngàn dặm bắt đầu từ một trang sách.</p>
        <Link to="/danh-sach" data-testid="history-browse-btn" className="inline-flex items-center gap-2 mt-7 px-7 py-3 rounded-full bg-gold text-obsidian text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_30px_rgba(34,200,234,0.4)] transition-shadow">
          <BookOpen size={15} weight="bold" /> Khám phá truyện
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-14 max-w-4xl space-y-4" data-testid="history-list">
      {history.map((h, i) => {
        const s = STORIES.find((x) => x.slug === h.slug);
        if (!s) return null;
        return (
          <Reveal key={h.slug} delay={i * 0.05} y={20}>
            <div className="glass rounded-xl p-5 flex flex-wrap items-center gap-5 hover:border-gold/40 transition-colors duration-300">
              <span className="relative w-12 aspect-[3/4] rounded-md overflow-hidden border border-white/10 shrink-0">
                <span className="absolute inset-0" style={{ background: `linear-gradient(160deg, hsl(${s.hue} 45% 18%), #0a0908)` }} />
              </span>
              <div className="flex-1 min-w-[180px]">
                <StoryLink slug={s.slug} className="font-display text-xl font-semibold text-bone hover:text-gold transition-colors">{s.title}</StoryLink>
                <p className="text-xs text-ash mt-1">Đã đọc đến chương {h.chapter} · {new Date(h.at).toLocaleDateString('vi-VN')}</p>
              </div>
              <Link to={`/doc/${s.slug}/${h.chapter}`} data-testid={`history-resume-${s.slug}`} className="px-6 py-2.5 rounded-full border border-gold/40 text-gold text-xs font-bold uppercase tracking-wider hover:bg-gold hover:text-obsidian transition-[background-color,color] duration-300">
                Đọc tiếp
              </Link>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
};
