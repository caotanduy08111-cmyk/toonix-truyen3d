import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

const heroBolt = (seed) => {
  const x0 = 120 + seed * 60;
  const segments = 7;
  let d = `M ${x0} -20`;
  let x = x0;
  let dir = seed % 2 === 0 ? 1 : -1;
  for (let i = 1; i <= segments; i++) {
    const y = -20 + (i * 300) / segments;
    const amp = 22 + ((seed * 41 + i * 17) % 30);
    x += dir * amp;
    x = Math.max(20, Math.min(780, x));
    d += ` L ${Math.round(x)} ${Math.round(y)}`;
    dir *= -1;
  }
  return d;
};
import { ArrowRight, BookOpen, Crown, Eye, Fire, Star } from '@phosphor-icons/react';
import { STORIES, topStories, fullStories, GENRES, genreName, byGenre } from '../data/stories';
import { StoryCard } from '../components/StoryCard';
import { CoverArt } from '../components/CoverArt';
import { Marquee } from '../components/Marquee';
import { LinkCard } from '../components/LinkCard';
import { LightningIntro } from '../components/LightningIntro';
import { RunningMascot } from '../components/RunningMascot';
import { Reveal, SectionHeading } from '../components/Reveal';

const Hero = () => {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 180]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x1 = useSpring(useTransform(mx, [-0.5, 0.5], [-22, 22]), { stiffness: 55, damping: 16 });
  const y1 = useSpring(useTransform(my, [-0.5, 0.5], [-14, 14]), { stiffness: 55, damping: 16 });
  const x2 = useSpring(useTransform(mx, [-0.5, 0.5], [30, -30]), { stiffness: 45, damping: 14 });
  const y2 = useSpring(useTransform(my, [-0.5, 0.5], [20, -20]), { stiffness: 45, damping: 14 });

  useEffect(() => {
    const move = (e) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mx, my]);

  const [strike, setStrike] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStrike((s) => s + 1), 4500);
    return () => clearInterval(t);
  }, []);

  const logoRx = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 60, damping: 15 });
  const logoRy = useSpring(useTransform(mx, [-0.5, 0.5], [-13, 13]), { stiffness: 60, damping: 15 });

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" data-testid="hero-section">
      <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 pt-28 pb-16 w-full pointer-events-none">
        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-xs md:text-sm uppercase tracking-[0.5em] text-gold mb-6 flex items-center gap-3"
        >
          <span className="w-10 h-px bg-gold/60 inline-block" />
          Thư viện truyện 3D số một
        </motion.p>

        <div style={{ perspective: 1400 }} className="select-none">
          <motion.div
            initial={{ opacity: 0, y: 90, rotateX: 38 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.35, duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ rotateX: logoRx, rotateY: logoRy, transformStyle: 'preserve-3d' }}
            className="relative w-fit"
          >
            <motion.img
              src="/logo.png"
              alt="TOONIX — Infinite Story Universe"
              data-testid="hero-logo"
              animate={{
                y: [0, -14, 0],
                filter: ['brightness(1)', 'brightness(1.1)', 'brightness(1)'],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-[80vw] max-w-[620px] h-auto"
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse 75% 60% at 50% 50%, #000 60%, transparent 100%)',
                maskImage: 'radial-gradient(ellipse 75% 60% at 50% 50%, #000 60%, transparent 100%)',
              }}
            />
            <svg key={`bolt-${strike}`} className="absolute -inset-[10%] w-[120%] h-[120%] pointer-events-none overflow-visible" viewBox="0 0 800 260" preserveAspectRatio="none">
              {[0, 1].map((i) => (
                <path
                  key={i}
                  d={heroBolt((strike + i) % 5)}
                  pathLength="1"
                  className="hero-bolt"
                  stroke={i ? '#4DD8F0' : '#EEF4FF'}
                  strokeWidth={i ? 2.2 : 3.4}
                  fill="none"
                  strokeLinecap="round"
                  style={{ animationDelay: `${i * 0.12}s` }}
                />
              ))}
            </svg>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-7 max-w-xl text-ash text-base md:text-lg leading-relaxed"
        >
          Hàng ngàn bộ truyện được dựng lại như những thế giới sống động — lật từng trang giấy trong không gian 3D, đắm chìm giữa bụi sao và ánh băng xanh vô tận.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.8 }}
          className="mt-9 flex flex-wrap items-center gap-4 pointer-events-auto"
        >
          <Link
            to={`/doc/${STORIES[0].slug}/1`}
            data-testid="hero-read-now-btn"
            className="group h-13 px-8 py-3.5 rounded-full bg-gold text-obsidian font-bold text-sm uppercase tracking-wider flex items-center gap-2.5 hover:shadow-[0_0_40px_rgba(34,200,234,0.5)] transition-shadow duration-400"
          >
            <BookOpen size={17} weight="bold" />
            Đọc ngay
            <ArrowRight size={16} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
          <Link
            to="/the-loai"
            data-testid="hero-explore-btn"
            className="px-8 py-3.5 rounded-full border border-white/20 text-bone text-sm uppercase tracking-wider font-semibold hover:border-gold/60 hover:text-gold hover:bg-gold/5 transition-[color,border-color,background-color] duration-300"
          >
            Khám phá thể loại
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 1 }}
          className="mt-14 flex gap-10 md:gap-16"
        >
          {[['1.200+', 'Đầu truyện'], ['12', 'Thể loại'], ['98M', 'Lượt đọc']].map(([num, label]) => (
            <div key={label}>
              <p className="font-display text-3xl md:text-5xl font-semibold text-bone">{num}</p>
              <p className="text-xs uppercase tracking-[0.25em] text-ash mt-1.5">{label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div className="absolute right-[7%] top-[12%] hidden xl:block w-[430px] z-[5]" style={{ perspective: 1100 }}>
        <motion.div style={{ x: x1, y: y1 }} className="absolute top-0 -left-14 w-56 rotate-[8deg] animate-floaty">
          <motion.div animate={{ scale: [1, 1.12, 1], x: [0, -46, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gold/30 gold-glow group">
            <Link to={`/truyen/${STORIES[3].slug}`} data-testid="hero-cover-link-1" className="relative block w-full h-full cursor-pointer" title="Bấm để xem truyện">
              <CoverArt story={STORIES[3]} />
              <span className="absolute inset-0 bg-gold/0 group-hover:bg-gold/15 transition-colors duration-300" />
            </Link>
          </motion.div>
        </motion.div>
        <motion.div style={{ x: x2, y: y2 }} className="absolute top-52 right-[-8px] w-60 -rotate-[6deg] animate-floaty [animation-delay:1.4s]">
          <motion.div animate={{ scale: [1.08, 0.95, 1.08], x: [0, -64, 0] }} transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/15 shadow-2xl group">
            <Link to={`/truyen/${STORIES[0].slug}`} data-testid="hero-cover-link-2" className="relative block w-full h-full cursor-pointer" title="Bấm để xem truyện">
              <CoverArt story={STORIES[0]} />
              <span className="absolute inset-0 bg-gold/0 group-hover:bg-gold/15 transition-colors duration-300" />
            </Link>
          </motion.div>
        </motion.div>
        <motion.div style={{ x: x1, y: y2 }} className="absolute top-[500px] left-2 w-48 rotate-[14deg] animate-floaty [animation-delay:2.6s]">
          <motion.div animate={{ scale: [0.95, 1.14, 0.95], x: [0, -38, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10 opacity-90 group">
            <Link to={`/truyen/${STORIES[5].slug}`} data-testid="hero-cover-link-3" className="relative block w-full h-full cursor-pointer" title="Bấm để xem truyện">
              <CoverArt story={STORIES[5]} />
              <span className="absolute inset-0 bg-gold/0 group-hover:bg-gold/15 transition-colors duration-300" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ash"
      >
        <span className="text-[10px] uppercase tracking-[0.4em]">Cuộn xuống</span>
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }} className="w-px h-10 bg-gradient-to-b from-gold to-transparent" />
      </motion.div>
    </section>
  );
};

const FeaturedGrid = () => {
  const feats = STORIES.filter((s) => s.featured);
  return (
    <section className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 py-24 md:py-32" data-testid="featured-section">
      <Reveal><SectionHeading kicker="Tuyển chọn" title="Truyện đề cử" link="/danh-sach" /></Reveal>
      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        <Reveal className="h-full">
          <StoryCard story={feats[0]} className="h-full [&>div]:h-full [&>div]:aspect-auto" tall />
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {feats.slice(1, 5).map((s, i) => (
            <Reveal key={s.slug} delay={0.08 + i * 0.07}><StoryCard story={s} /></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const UpdatedSection = () => (
  <section className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 py-24 md:py-32" data-testid="updated-section">
    <Reveal><SectionHeading kicker="Mới cập nhật" title="Chương mới mỗi giờ" link="/truyen-cap-nhat" /></Reveal>
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
      {STORIES.slice(0, 5).map((s, i) => (
        <Reveal key={s.slug} delay={i * 0.06}>
          <StoryCard story={s} />
        </Reveal>
      ))}
      <Reveal delay={0.3}>
        <LinkCard to="/truyen-cap-nhat" label="Xem tất cả" sub={`${STORIES.length}+ bộ truyện`} testid="updated-view-all-card" />
      </Reveal>
    </div>
  </section>
);

const RankSection = () => (
  <section className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 py-24 md:py-32" data-testid="ranking-section">
    <div className="grid lg:grid-cols-[1fr_380px] gap-14">
      <div>
        <Reveal><SectionHeading kicker="Bảng xếp hạng" title="Top đọc nhiều nhất" link="/top" /></Reveal>
        <div>
          {topStories.slice(0, 10).map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.04} y={24}>
              {i === 0 ? (
                <Link
                  to={`/truyen/${s.slug}`}
                  data-testid={`rank-row-${s.slug}`}
                  className="group relative flex items-center gap-5 md:gap-7 p-4 md:p-5 mb-4 rounded-2xl border border-gold/40 bg-gradient-to-r from-gold/10 via-coal/70 to-transparent gold-glow overflow-hidden hover:border-gold/70 transition-colors duration-300"
                >
                  <motion.span
                    aria-hidden="true"
                    initial={{ x: '-120%' }}
                    animate={{ x: '240%' }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'linear', repeatDelay: 1.4 }}
                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-gold/15 to-transparent skew-x-12 pointer-events-none"
                  />
                  <span className="relative shrink-0 flex flex-col items-center w-14">
                    <Crown size={20} weight="fill" className="text-gold drop-shadow-[0_0_10px_rgba(34,200,234,0.9)] animate-floaty" />
                    <span className="font-display text-4xl md:text-5xl font-bold text-gold">01</span>
                  </span>
                  <span className="relative w-14 md:w-16 aspect-[3/4] rounded-lg overflow-hidden border border-gold/60 shadow-[0_0_28px_rgba(34,200,234,0.3)] shrink-0 transition-[transform] duration-400 group-hover:scale-105 group-hover:-rotate-2">
                    <CoverArt story={s} showTitle={false} />
                  </span>
                  <span className="relative flex-1 min-w-0">
                    <span className="block text-[10px] uppercase tracking-[0.35em] text-gold/80 mb-1">Quán quân tuần này</span>
                    <span className="block font-display text-2xl md:text-3xl font-bold text-gold truncate">{s.title}</span>
                    <span className="block text-xs text-ash mt-1">{s.genres.map(genreName).join(' · ')} — {s.author}</span>
                  </span>
                  <span className="relative hidden sm:flex items-center gap-1.5 text-sm text-gold/90 shrink-0">
                    <Eye size={15} />{s.views}
                  </span>
                  <Fire size={20} weight="fill" className="relative text-blood shrink-0 animate-pulse-gold" />
                </Link>
              ) : (
                <Link
                  to={`/truyen/${s.slug}`}
                  data-testid={`rank-row-${s.slug}`}
                  className="group flex items-center gap-5 md:gap-6 py-4 border-b border-white/8 hover:bg-gold/[0.04] hover:pl-3 transition-[background-color,padding] duration-300 rounded-lg"
                >
                  <span className={`font-display text-4xl md:text-5xl font-bold w-14 shrink-0 transition-all duration-300 ${i < 3 ? 'text-gold' : 'text-stroke-faint group-hover:text-gold/70'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="relative w-11 md:w-12 aspect-[3/4] rounded-md overflow-hidden border border-white/10 shrink-0 group-hover:border-gold/50 group-hover:shadow-[0_0_18px_rgba(34,200,234,0.25)] transition-[border-color,box-shadow] duration-300">
                    <CoverArt story={s} showTitle={false} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-display text-xl md:text-2xl font-semibold text-bone truncate group-hover:text-gold transition-colors duration-300">{s.title}</span>
                    <span className="block text-xs text-ash mt-1">{s.genres.map(genreName).join(' · ')} — {s.author}</span>
                  </span>
                  <span className="hidden sm:flex items-center gap-1.5 text-sm text-ash shrink-0">
                    <Eye size={15} className="text-gold/60" />{s.views}
                  </span>
                  {i < 3 && <Fire size={18} weight="fill" className="text-blood shrink-0 animate-pulse-gold" />}
                </Link>
              )}
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2} y={20}>
          <LinkCard layout="bar" to="/top" label="Xem đầy đủ bảng xếp hạng" sub={`Top ${topStories.length} bộ truyện`} testid="rank-view-all-card" className="mt-8" />
        </Reveal>
      </div>
      <div>
        <Reveal delay={0.15}>
          <div className="lg:sticky lg:top-28 glass rounded-2xl p-7 gold-glow">
            <p className="text-xs uppercase tracking-[0.35em] text-gold mb-5 flex items-center gap-2">
              <Star size={14} weight="fill" /> Truyện full đáng đọc
            </p>
            <div className="space-y-5">
              {fullStories.slice(0, 3).map((s) => (
                <Link key={s.slug} to={`/truyen/${s.slug}`} data-testid={`full-pick-${s.slug}`} className="group flex gap-4 items-center">
                  <span className="relative w-14 aspect-[3/4] rounded-md overflow-hidden border border-white/10 shrink-0 group-hover:border-gold/50 transition-colors">
                    <CoverArt story={s} showTitle={false} />
                  </span>
                  <span>
                    <span className="block font-display text-lg font-semibold text-bone group-hover:text-gold transition-colors leading-tight">{s.title}</span>
                    <span className="block text-xs text-ash mt-1">{s.chaptersCount} chương · Full</span>
                  </span>
                </Link>
              ))}
            </div>
            <Link to="/truyen-full" data-testid="full-more-link" className="mt-7 flex items-center justify-center gap-2 py-3 rounded-full border border-gold/40 text-gold text-xs uppercase tracking-[0.2em] font-bold hover:bg-gold hover:text-obsidian transition-[background-color,color] duration-300">
              Xem tất cả truyện full
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

const GenreStrip = () => (
  <section className="relative z-10 py-24 md:py-32 overflow-hidden" data-testid="genres-strip-section">
    <div className="max-w-[1440px] mx-auto px-5 md:px-10">
      <Reveal><SectionHeading kicker="Thế giới" title="Chọn cõi mơ của bạn" link="/the-loai" /></Reveal>
    </div>
    <div className="relative overflow-hidden marquee-hover pb-4" data-testid="genre-marquee">
      <div className="flex w-max animate-marquee gap-5 px-5 md:px-10" style={{ animationDuration: '48s' }}>
        {[0, 1].map((dup) => (
          <div key={dup} className="flex gap-5" aria-hidden={dup === 1}>
            {GENRES.map((g, i) => (
              <div key={g.slug} className="shrink-0">
                <Link
                  to={`/the-loai/${g.slug}`}
                  data-testid={dup === 0 ? `genre-card-${g.slug}` : undefined}
                  className="group relative block w-[240px] md:w-[280px] h-[340px] rounded-2xl overflow-hidden border border-white/10 hover:border-gold/40 transition-colors duration-400"
                >
                  <div className="absolute inset-0 bg-coal" />
                  {byGenre(g.slug)[0] && (
                    <div className="absolute inset-0 overflow-hidden opacity-25 blur-[2px] saturate-[0.7] group-hover:opacity-50 group-hover:blur-0 group-hover:saturate-100 group-hover:scale-105 transition-[opacity,filter,transform] duration-700">
                      <CoverArt story={byGenre(g.slug)[0]} showTitle={false} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-obsidian/20" />
                  <span className="absolute -right-6 -bottom-10 font-display text-[11rem] leading-none font-bold text-white/[0.05] group-hover:text-gold/15 transition-colors duration-500 select-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-display text-3xl font-semibold text-bone group-hover:text-gold transition-colors duration-300">{g.name}</h3>
                    <p className="text-sm text-ash mt-2 leading-relaxed">{g.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold/80 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-[opacity,transform] duration-300">
                      Khám phá <ArrowRight size={13} weight="bold" />
                    </span>
                  </div>
                </Link>
              </div>
            ))}
            <div className="shrink-0">
              <LinkCard to="/the-loai" label="Tất cả thể loại" sub={`${GENRES.length} cõi mơ`} testid={dup === 0 ? 'genre-view-all-card' : undefined} className="w-[240px] md:w-[280px] h-[340px] aspect-auto" />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-y-0 left-0 w-20 md:w-36 bg-gradient-to-r from-obsidian to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 md:w-36 bg-gradient-to-l from-obsidian to-transparent z-10 pointer-events-none" />
    </div>
  </section>
);

const Manifesto = () => (
  <section className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 py-24 md:py-36" data-testid="manifesto-section">
    <Reveal>
      <p className="font-display italic text-3xl md:text-5xl lg:text-6xl leading-snug text-bone max-w-4xl">
        “Mỗi cuốn sách là một cánh cửa. <span className="text-gold">Chúng tôi chỉ làm cho cánh cửa ấy mở ra chậm rãi hơn</span>, đủ để bạn nghe thấy tiếng thế giới bên kia đang thở.”
      </p>
    </Reveal>
    <div className="grid md:grid-cols-3 gap-10 md:gap-14 mt-20">
      {[
        ['01', 'Đắm chìm', 'Không gian 3D với bụi sao, ánh trăng và những cuốn sách biết bay — bối cảnh sống động bao quanh từng câu chữ.'],
        ['02', 'Chạm vào trang giấy', 'Hiệu ứng lật trang vật lý như sách thật. Mỗi chương truyện là một cuốn sách bạn cầm trên tay.'],
        ['03', 'Của riêng bạn', 'Lưu truyện yêu thích, theo dõi lịch sử đọc và tiếp tục hành trình đúng nơi bạn đã dừng lại.'],
      ].map(([num, title, desc], i) => (
        <Reveal key={num} delay={i * 0.12}>
          <div className="border-t border-gold/30 pt-7 group">
            <span className="font-display text-5xl font-bold text-stroke-gold group-hover:text-gold transition-colors duration-500">{num}</span>
            <h3 className="font-display text-2xl font-semibold text-bone mt-4">{title}</h3>
            <p className="text-sm text-ash leading-relaxed mt-3">{desc}</p>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

export default function HomePage() {
  return (
    <div data-testid="home-page">
      <LightningIntro />
      <Hero />
      <Marquee items={['Tiên Hiệp', 'Kiếm Hiệp', 'Huyền Huyễn', 'Đô Thị', 'Khoa Huyễn', 'Kinh Dị', 'Lãng Mạn', 'Hài Hước']} />
      <FeaturedGrid />
      <RunningMascot />
      <UpdatedSection />
      <Marquee items={['1.200+ Đầu Truyện', 'Chương Mới Mỗi Giờ', 'Trải Nghiệm 3D', 'Lật Sách Như Thật', 'Hoàn Toàn Miễn Phí']} />
      <RankSection />
      <GenreStrip />
      <Manifesto />
    </div>
  );
}
