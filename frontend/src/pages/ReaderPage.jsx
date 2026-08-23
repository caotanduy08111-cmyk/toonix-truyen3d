import { useEffect, useMemo, useRef, useState, forwardRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import { AnimatePresence, motion } from 'framer-motion';
import { CaretLeft, CaretRight, House, ListBullets, X } from '@phosphor-icons/react';
import { getStory, paginate } from '../data/stories';
import { pushHistory } from '../lib/store';
import { CoverArt } from '../components/CoverArt';
import { ReaderAmbience } from '../components/ReaderAmbience';
import { FlipBurst } from '../components/FlipBurst';
import { getTheme } from '../lib/readerTheme';
import { PANELS } from '../data/panels';

const clipText = (t, max = 220) => {
  if (!t) return '';
  return t.length > max ? t.slice(0, max).replace(/\s+\S*$/, '') + '…' : t;
};

const Page = forwardRef(({ children, right, themeKey }, ref) => (
  <div
    ref={ref}
    className={`book-page ${right ? 'book-page-right' : ''} paper-${themeKey || 'huyen-huyen'} p-8 md:p-10 flex flex-col`}
  >
    {children}
  </div>
));
Page.displayName = 'Page';

export default function ReaderPage() {
  const { slug, num } = useParams();
  const navigate = useNavigate();
  const story = getStory(slug);
  const bookRef = useRef(null);
  const [pageIdx, setPageIdx] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const [burst, setBurst] = useState(null);

  const chapterNum = Math.min(Math.max(parseInt(num || '1', 10) || 1, 1), story ? story.chapters.length : 1);
  const chapter = story?.chapters[chapterNum - 1];

  const pages = useMemo(() => {
    if (!chapter) return [];
    return [
      { paras: chapter.paras.slice(0, 2), figure: true },
      ...paginate(chapter.paras.slice(2), 3).map((paras) => ({ paras })),
    ];
  }, [chapter]);
  const panels = PANELS[slug];
  const totalPages = panels ? panels.length + 2 : pages.length + 3;

  useEffect(() => {
    if (story) pushHistory(story.slug, chapterNum);
  }, [story, chapterNum]);

  useEffect(() => {
    const key = (e) => {
      const flip = bookRef.current?.pageFlip();
      if (!flip) return;
      if (e.key === 'ArrowRight') flip.flipNext();
      if (e.key === 'ArrowLeft') flip.flipPrev();
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);

  if (!story) {
    return (
      <div className="relative z-10 min-h-screen flex items-center justify-center" data-testid="reader-not-found">
        <div className="text-center">
          <h1 className="font-display text-5xl text-bone">Không tìm thấy truyện</h1>
          <Link to="/" className="text-gold mt-4 inline-block hover:underline">← Về trang chủ</Link>
        </div>
      </div>
    );
  }

  const flip = () => bookRef.current?.pageFlip();

  return (
    <div data-testid="reader-page" className="relative z-10 min-h-screen flex flex-col pt-20 pb-6">
      <div className="fixed top-0 inset-x-0 z-50 glass border-x-0 border-t-0">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 h-16 flex items-center justify-between gap-3">
          <Link to={`/truyen/${story.slug}`} data-testid="reader-back-btn" className="flex items-center gap-2 text-ash hover:text-gold transition-colors text-sm min-w-0">
            <CaretLeft size={16} weight="bold" className="shrink-0" />
            <span className="font-display text-base md:text-lg text-bone truncate">{story.title}</span>
          </Link>
          <div className="flex items-center gap-2">
            <button data-testid="reader-toc-btn" onClick={() => setTocOpen(true)} className="h-10 px-4 rounded-full border border-white/15 text-ash hover:text-gold hover:border-gold/50 text-xs uppercase tracking-wider flex items-center gap-2 transition-colors">
              <ListBullets size={15} /> <span className="hidden sm:inline">Mục lục</span>
            </button>
            <Link to="/" data-testid="reader-home-btn" className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-ash hover:text-gold hover:border-gold/50 transition-colors" aria-label="Trang chủ">
              <House size={16} />
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center -mt-3 mb-1 px-4">
        <p className="text-[11px] uppercase tracking-[0.4em] text-gold/80">{chapter.title.split(':')[0]}</p>
        <h1 className="font-display text-xl md:text-2xl text-bone/90 italic mt-1">{chapter.title.split(':')[1]?.trim()}</h1>
      </div>

      <div className="flex-1 flex items-center justify-center px-2 relative">
        <ReaderAmbience genres={story.genres} />
        <motion.div
          key={`${slug}-${chapterNum}`}
          initial={{ opacity: 0, rotateY: -28, scale: 0.94 }}
          animate={{ opacity: 1, rotateY: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="book-stage relative w-full max-w-[980px] h-[64vh] min-h-[440px] -mt-4"
        >
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[60%] blur-[100px] rounded-full pointer-events-none"
            style={{ background: `hsl(${story.hue} 80% 55% / 0.13)` }}
          />
          <HTMLFlipBook
            ref={bookRef}
            width={480}
            height={660}
            size="stretch"
            minWidth={280}
            maxWidth={470}
            minHeight={400}
            maxHeight={640}
            showCover
            drawShadow
            flippingTime={900}
            maxShadowOpacity={0.55}
            mobileScrollSupport
            className="mx-auto"
            onFlip={(e) => {
              setPageIdx((prev) => {
                if (e.data !== prev) setBurst({ id: Date.now(), dir: e.data > prev ? 1 : -1 });
                return e.data;
              });
            }}
            data-testid="flip-book"
          >
            <div className="book-cover-page relative overflow-hidden">
              {story.img ? (
                <img src={story.img} alt={story.title} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <CoverArt story={story} showTitle={false} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/30" />
              <p className="relative text-[10px] uppercase tracking-[0.5em] text-gold drop-shadow">TOONIX</p>
              <p className="absolute bottom-6 text-[10px] text-bone/60 uppercase tracking-[0.3em] animate-pulse-gold">Lật trang để bắt đầu →</p>
            </div>
            {panels ? (
              panels.map((src, i) => (
                <Page key={i} themeKey={story.genres[0]}>
                  <div className="absolute inset-3 md:inset-4 rounded-lg overflow-hidden border border-white/15">
                    <motion.img
                      src={src}
                      alt={`${story.title} — trang tranh ${i + 1}`}
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="cloud-bubble top-5 left-5 max-w-[46%] md:max-w-[230px]" data-testid={`cloud-top-${i}`}>
                      {clipText(chapter.paras[(i * 2) % chapter.paras.length], 110)}
                    </div>
                    {chapter.paras.length > 1 && (
                      <div className="cloud-bubble bottom-7 right-5 max-w-[46%] md:max-w-[230px]" data-testid={`cloud-bottom-${i}`}>
                        {clipText(chapter.paras[(i * 2 + 1) % chapter.paras.length], 110)}
                      </div>
                    )}
                  </div>
                  <span className="absolute bottom-1.5 right-6 z-10 text-[10px] uppercase tracking-[0.3em] text-bone/80 drop-shadow">
                    Trang {i + 1} / {panels.length}
                  </span>
                </Page>
              ))
            ) : ([
                <Page key="illo" themeKey={story.genres[0]}>
                  <div className="absolute inset-8 rounded-xl overflow-hidden border border-white/15">
                    {story.img ? (
                      <motion.img
                        src={story.img}
                        alt={story.title}
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <CoverArt story={story} showTitle={false} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
                    <p className="absolute bottom-4 inset-x-0 text-center font-display italic text-lg text-bone drop-shadow-lg">“{chapter.title}”</p>
                  </div>
                  <div className="absolute bottom-2 inset-x-8 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-ash/70">
                    <span>Minh họa</span>
                    <span className="text-gold/60">{story.author}</span>
                  </div>
                </Page>,
                ...pages.map((pg, i) => (
                  <Page key={i} right={i % 2 === 0} themeKey={story.genres[0]}>
                    {pg.figure && (
                      <figure className="relative h-36 md:h-44 rounded-xl overflow-hidden border border-white/15 mb-5 shrink-0">
                        {story.img ? (
                          <img src={story.img} alt={story.title} className="absolute inset-0 w-full h-full object-cover object-top" />
                        ) : (
                          <CoverArt story={story} showTitle={false} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <figcaption className="absolute bottom-2 left-3 text-[10px] uppercase tracking-[0.3em] text-bone/90 drop-shadow">Minh họa — {story.title}</figcaption>
                      </figure>
                    )}
                    <div className="reader-serif flex-1" style={{ '--reader-text': getTheme(story.genres).paper.text, '--reader-accent': getTheme(story.genres).paper.accent }}>
                      {pg.paras.map((p, j) => <p key={j}>{p}</p>)}
                    </div>
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-ash/70 pt-3 border-t border-white/5">
                      <span>{story.title}</span>
                      <span className="text-gold/60">Trang {i + 1} / {pages.length}</span>
                    </div>
                  </Page>
                ))
            ])}
            <div className="book-cover-page">
              <p className="font-display italic text-3xl text-gold">Hết chương</p>
              <p className="text-sm text-ash mt-4 max-w-[240px]">Câu chuyện còn tiếp diễn. Hãy đón đọc chương tiếp theo.</p>
              <div className="flex flex-col gap-3 mt-8 w-full max-w-[220px]">
                {chapterNum < story.chapters.length && (
                  <button
                    data-testid="next-chapter-btn"
                    onClick={() => navigate(`/doc/${story.slug}/${chapterNum + 1}`)}
                    className="py-3 rounded-full bg-gold text-obsidian text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_30px_rgba(34,200,234,0.45)] transition-shadow"
                  >
                    Chương tiếp theo
                  </button>
                )}
                <Link to={`/truyen/${story.slug}`} data-testid="back-to-story-btn" className="py-3 rounded-full border border-white/20 text-bone text-xs uppercase tracking-wider hover:border-gold/60 hover:text-gold transition-colors text-center">
                  Về trang truyện
                </Link>
              </div>
            </div>
          </HTMLFlipBook>
          <FlipBurst burst={burst} kind={getTheme(story.genres).kind} />
        </motion.div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        <button data-testid="prev-page-btn" onClick={() => flip()?.flipPrev()} className="h-11 px-5 rounded-full border border-white/15 text-ash hover:text-gold hover:border-gold/50 flex items-center gap-2 text-xs uppercase tracking-wider transition-colors">
          <CaretLeft size={15} weight="bold" /> Trang trước
        </button>
        <span data-testid="page-indicator" className="text-xs text-ash uppercase tracking-[0.25em] min-w-[90px] text-center">
          {Math.min(pageIdx + 1, totalPages)} / {totalPages}
        </span>
        <button data-testid="next-page-btn" onClick={() => flip()?.flipNext()} className="h-11 px-5 rounded-full bg-gold text-obsidian font-bold flex items-center gap-2 text-xs uppercase tracking-wider hover:shadow-[0_0_30px_rgba(34,200,234,0.45)] transition-shadow">
          Trang sau <CaretRight size={15} weight="bold" />
        </button>
      </div>

      <AnimatePresence>
        {tocOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] bg-obsidian/80 backdrop-blur-md flex justify-end" onClick={() => setTocOpen(false)} data-testid="toc-overlay">
            <motion.div
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-sm h-full bg-coal border-l border-white/10 p-7 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-7">
                <h3 className="font-display text-2xl font-semibold text-bone">Mục lục</h3>
                <button data-testid="toc-close-btn" onClick={() => setTocOpen(false)} className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-ash hover:text-gold transition-colors" aria-label="Đóng">
                  <X size={15} />
                </button>
              </div>
              {story.chapters.map((c) => (
                <button
                  key={c.num}
                  data-testid={`toc-chapter-${c.num}`}
                  onClick={() => { setTocOpen(false); navigate(`/doc/${story.slug}/${c.num}`); }}
                  className={`w-full text-left flex items-center gap-4 py-3.5 border-b border-white/5 hover:pl-2 transition-[padding] duration-300 ${c.num === chapterNum ? 'text-gold' : 'text-bone/80 hover:text-gold'}`}
                >
                  <span className="font-display text-lg w-8 shrink-0 opacity-60">{String(c.num).padStart(2, '0')}</span>
                  <span className="text-sm truncate">{c.title}</span>
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
