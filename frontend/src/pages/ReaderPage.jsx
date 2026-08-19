import { useEffect, useMemo, useRef, useState, forwardRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import { AnimatePresence, motion } from 'framer-motion';
import { CaretLeft, CaretRight, House, ListBullets, X } from '@phosphor-icons/react';
import { getStory, paginate } from '../data/stories';
import { pushHistory } from '../lib/store';

const Page = forwardRef(({ children, right }, ref) => (
  <div ref={ref} className={`book-page ${right ? 'book-page-right' : ''} p-8 md:p-10 flex flex-col`}>
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

  const chapterNum = Math.min(Math.max(parseInt(num || '1', 10) || 1, 1), story ? story.chapters.length : 1);
  const chapter = story?.chapters[chapterNum - 1];

  const pages = useMemo(() => (chapter ? paginate(chapter.paras, 3) : []), [chapter]);
  const totalPages = pages.length + 2;

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

      <div className="text-center mt-4 mb-2 px-4">
        <p className="text-[11px] uppercase tracking-[0.4em] text-gold/80">{chapter.title.split(':')[0]}</p>
        <h1 className="font-display text-xl md:text-2xl text-bone/90 italic mt-1">{chapter.title.split(':')[1]?.trim()}</h1>
      </div>

      <div className="flex-1 flex items-center justify-center px-2">
        <div className="book-stage relative w-full max-w-[1160px] h-[68vh] min-h-[520px]">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[60%] bg-gold/[0.07] blur-[100px] rounded-full pointer-events-none" />
          <HTMLFlipBook
            ref={bookRef}
            width={520}
            height={700}
            size="stretch"
            minWidth={300}
            maxWidth={560}
            minHeight={460}
            maxHeight={780}
            showCover
            drawShadow
            flippingTime={900}
            maxShadowOpacity={0.55}
            mobileScrollSupport
            className="mx-auto"
            onFlip={(e) => setPageIdx(e.data)}
            data-testid="flip-book"
          >
            <div className="book-cover-page">
              <p className="text-[10px] uppercase tracking-[0.5em] text-gold/70 mb-5">Huyễn Cảnh 3D</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-bone leading-tight">{story.title}</h2>
              <p className="font-display italic text-gold mt-4 text-lg">{chapter.title}</p>
              <div className="w-14 h-px bg-gold/50 my-6" />
              <p className="text-xs text-ash tracking-widest uppercase">{story.author}</p>
              <p className="absolute bottom-6 text-[10px] text-ash/70 uppercase tracking-[0.3em] animate-pulse-gold">Lật trang để bắt đầu →</p>
            </div>
            {pages.map((paras, i) => (
              <Page key={i} right={i % 2 === 0}>
                <div className="reader-serif flex-1">
                  {paras.map((p, j) => <p key={j}>{p}</p>)}
                </div>
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-ash/70 pt-3 border-t border-white/5">
                  <span>{story.title}</span>
                  <span className="text-gold/60">Trang {i + 1} / {pages.length}</span>
                </div>
              </Page>
            ))}
            <div className="book-cover-page">
              <p className="font-display italic text-3xl text-gold">Hết chương</p>
              <p className="text-sm text-ash mt-4 max-w-[240px]">Câu chuyện còn tiếp diễn. Hãy đón đọc chương tiếp theo.</p>
              <div className="flex flex-col gap-3 mt-8 w-full max-w-[220px]">
                {chapterNum < story.chapters.length && (
                  <button
                    data-testid="next-chapter-btn"
                    onClick={() => navigate(`/doc/${story.slug}/${chapterNum + 1}`)}
                    className="py-3 rounded-full bg-gold text-obsidian text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_30px_rgba(212,175,55,0.45)] transition-shadow"
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
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        <button data-testid="prev-page-btn" onClick={() => flip()?.flipPrev()} className="h-11 px-5 rounded-full border border-white/15 text-ash hover:text-gold hover:border-gold/50 flex items-center gap-2 text-xs uppercase tracking-wider transition-colors">
          <CaretLeft size={15} weight="bold" /> Trang trước
        </button>
        <span data-testid="page-indicator" className="text-xs text-ash uppercase tracking-[0.25em] min-w-[90px] text-center">
          {Math.min(pageIdx + 1, totalPages)} / {totalPages}
        </span>
        <button data-testid="next-page-btn" onClick={() => flip()?.flipNext()} className="h-11 px-5 rounded-full bg-gold text-obsidian font-bold flex items-center gap-2 text-xs uppercase tracking-wider hover:shadow-[0_0_30px_rgba(212,175,55,0.45)] transition-shadow">
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
