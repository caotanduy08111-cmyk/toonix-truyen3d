import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookOpen, Clock, Eye } from '@phosphor-icons/react';
import { STORIES, byGenre, fullStories, topStories, genreName, GENRES } from '../data/stories';
import { StoryCard } from '../components/StoryCard';
import { Reveal } from '../components/Reveal';
import { getHistory } from '../lib/store';

const CONFIG = {
  all: { kicker: 'Kho truyện', title: 'Danh sách truyện', desc: 'Toàn bộ kho truyện trong thư viện Huyễn Cảnh.', get: () => STORIES, display: 'grid' },
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

  return (
    <div data-testid={`list-page-${kind}`} className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 pt-32 md:pt-40 pb-10 min-h-screen">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.5em] text-gold mb-4 flex items-center gap-3">
          <span className="w-10 h-px bg-gold/60" /> {cfg.kicker}
        </p>
        <h1 className="font-display text-5xl md:text-7xl font-bold text-bone leading-tight">{title}</h1>
        <p className="text-ash mt-4 max-w-2xl text-base md:text-lg">{desc}</p>
        {cfg.display !== 'history' && (
          <p className="text-xs uppercase tracking-[0.3em] text-ash mt-6">{stories.length} bộ truyện</p>
        )}
      </Reveal>

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
              <Link to={`/truyen/${s.slug}`} data-testid={`top-row-${s.slug}`} className="group flex items-center gap-5 md:gap-8 py-5 border-b border-white/8 hover:bg-gold/[0.04] hover:pl-3 transition-[background-color,padding] duration-300 rounded-lg">
                <span className={`font-display text-4xl md:text-6xl font-bold w-16 shrink-0 ${i < 3 ? 'text-gold' : 'text-stroke-faint group-hover:text-gold/60'} transition-colors duration-300`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="relative w-14 aspect-[3/4] rounded-md overflow-hidden border border-white/10 shrink-0 hidden sm:block">
                  <span className="absolute inset-0" style={{ background: `linear-gradient(160deg, hsl(${s.hue} 45% 18%), #0a0908)` }} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-display text-xl md:text-2xl font-semibold text-bone truncate group-hover:text-gold transition-colors">{s.title}</span>
                  <span className="block text-xs text-ash mt-1">{s.genres.map(genreName).join(' · ')} — {s.author} — {s.status}</span>
                </span>
                <span className="flex items-center gap-1.5 text-sm text-ash shrink-0"><Eye size={15} className="text-gold/60" />{s.views}</span>
              </Link>
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
        <Link to="/danh-sach" data-testid="history-browse-btn" className="inline-flex items-center gap-2 mt-7 px-7 py-3 rounded-full bg-gold text-obsidian text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-shadow">
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
                <Link to={`/truyen/${s.slug}`} className="font-display text-xl font-semibold text-bone hover:text-gold transition-colors">{s.title}</Link>
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
