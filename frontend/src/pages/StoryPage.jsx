import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { BookOpen, ChatCircle, Clock, Eye, Heart, ListBullets, PaperPlaneTilt, Star, ThumbsUp, TrendUp, User } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { getStory, genreName, STORIES, topStories } from '../data/stories';
import { CoverArt } from '../components/CoverArt';
import { StoryCard } from '../components/StoryCard';
import { Reveal } from '../components/Reveal';
import { ReadTransition } from '../components/ReadTransition';
import { isFav, toggleFav } from '../lib/store';

const TiltCover = ({ story, spinning, onSpinDone }) => {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 150, damping: 18 });
  return (
    <div
      style={{ perspective: 1000 }}
      onMouseMove={(e) => {
        if (spinning) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={() => { mx.set(0.5); my.set(0.5); }}
      className="relative w-full max-w-[380px] mx-auto"
    >
      <motion.div
        style={spinning ? { transformStyle: 'preserve-3d' } : { rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        animate={spinning ? { rotateY: 360, scale: [1, 1.08, 1] } : { rotateY: 0 }}
        transition={spinning ? { duration: 0.7, ease: 'easeInOut' } : { duration: 0 }}
        onAnimationComplete={() => { if (spinning) onSpinDone?.(); }}
        className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gold/30 gold-glow shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
      >
        <CoverArt story={story} />
      </motion.div>
      <div className="absolute -inset-6 bg-gold/10 blur-3xl rounded-full -z-10 animate-pulse-gold" />
    </div>
  );
};

const likesOf = (v) => {
  const n = parseFloat(v) * 0.09;
  return n >= 1 ? `${n.toFixed(1)}M` : `${Math.round(n * 1000)}K`;
};

const COMMENTS = [
  { name: 'Mèo Đọc Truyện', text: 'Truyện hay xuất sắc, đọc từ tối qua đến giờ không ngủ được. Mong tác giả ra chương nhanh hơn nữa!', time: '2 giờ trước', likes: 214 },
  { name: 'Thư Khố Đại Hiệp', text: 'Hiệu ứng lật sách 3D đỉnh quá, đọc truyện tranh mà cứ như xem phim điện ảnh.', time: '5 giờ trước', likes: 98 },
  { name: 'Nguyệt Nha', text: 'Tình tiết chương này gây cấn thật sự, nhân vật chính ngầu đét. Cố lên tác giả!', time: 'Hôm qua', likes: 56 },
  { name: 'Độc Giả Vô Danh', text: 'Bìa đẹp, nội dung cuốn. Cho 5 sao không tiếc!', time: '2 ngày trước', likes: 12 },
];

export default function StoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const story = getStory(slug);
  const [fav, setFav] = useState(false);
  const [comments, setComments] = useState(COMMENTS);
  const [draft, setDraft] = useState('');
  const [spinTarget, setSpinTarget] = useState(null);
  const [showGreeting, setShowGreeting] = useState(false);

  const goRead = (path) => {
    if (spinTarget) return;
    setSpinTarget(path);
  };

  const onSpinDone = () => setShowGreeting(true);
  const onTransitionDone = () => navigate(spinTarget);

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

  const rank = topStories.findIndex((s) => s.slug === slug) + 1;
  const related = STORIES.filter((s) => s.slug !== slug && s.genres.some((g) => story.genres.includes(g))).slice(0, 3);

  const sPath = (() => {
    const n = story.chapters.length;
    const H = 1000 / n;
    let d = 'M 50 0';
    for (let i = 0; i < n; i++) {
      const c = i % 2 ? 8 : 92;
      d += ` C ${c} ${i * H + H * 0.35}, ${c} ${i * H + H * 0.65}, 50 ${(i + 1) * H}`;
    }
    return d;
  })();

  const onComment = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setComments([{ name: 'Bạn', text: draft.trim(), time: 'Vừa xong', likes: 0 }, ...comments]);
    setDraft('');
    toast.success('Đã đăng bình luận (demo)');
  };

  const likeComment = (i) =>
    setComments(comments.map((c, j) => (j === i ? { ...c, likes: c.likes + (c.liked ? -1 : 1), liked: !c.liked } : c)));

  const onFav = () => {
    const now = toggleFav(slug);
    setFav(now);
    toast(now ? 'Đã thêm vào yêu thích' : 'Đã bỏ yêu thích', { description: story.title });
  };

  return (
    <div data-testid="story-page" className="relative z-10 pt-16 md:pt-[72px] pb-10">
      <ReadTransition show={showGreeting} onDone={onTransitionDone} />
      <div className="relative h-[280px] md:h-[400px] overflow-hidden" data-testid="story-banner">
        {story.img ? (
          <motion.img
            src={story.img}
            alt=""
            animate={{ scale: [1.16, 1.28, 1.16] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover blur-[3px] brightness-[0.6]"
          />
        ) : (
          <div className="absolute inset-0 blur-[2px] brightness-[0.65] scale-110"><CoverArt story={story} showTitle={false} /></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/25 to-obsidian" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/70 via-transparent to-obsidian/70" />
        <div className="absolute bottom-0 inset-x-0 max-w-[1440px] mx-auto px-5 md:px-10 overflow-hidden">
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[11vw] md:text-[6.5rem] leading-[0.9] font-bold text-white/[0.08] select-none whitespace-nowrap"
          >
            {story.title}
          </motion.p>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 -mt-24 md:-mt-36 relative z-10">
      <div className="grid md:grid-cols-2 lg:grid-cols-[280px_auto_320px] gap-5 lg:gap-8 lg:justify-center">
        <div className="flex flex-col gap-5 lg:gap-11 lg:justify-start lg:py-2 order-2 lg:order-1">
          <Reveal>
            <div className="glass rounded-2xl p-6 text-center" data-testid="author-card">
              <p className="text-[10px] uppercase tracking-[0.35em] text-gold mb-4">Tác giả</p>
              <span className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-gold to-blood flex items-center justify-center font-display text-2xl font-bold text-obsidian">
                {story.author[0]}
              </span>
              <p className="font-display text-xl font-semibold text-bone mt-3">{story.author}</p>
              <p className="text-xs text-ash mt-1">{story.tags[0]} · {story.status}</p>
              <button
                data-testid="follow-author-btn"
                onClick={() => toast.success('Đã theo dõi tác giả (demo)')}
                className="mt-4 w-full py-2.5 rounded-full border border-gold/40 text-gold text-[11px] font-bold uppercase tracking-widest hover:bg-gold hover:text-obsidian transition-[background-color,color] duration-300"
              >
                Theo dõi
              </button>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="glass rounded-2xl p-6" data-testid="genre-card">
              <p className="text-[10px] uppercase tracking-[0.35em] text-gold mb-4">Thể loại</p>
              <div className="flex flex-wrap gap-2">
                {story.genres.map((g) => (
                  <Link key={g} to={`/the-loai/${g}`} data-testid={`story-genre-${g}`} className="text-[11px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition-colors">
                    {genreName(g)}
                  </Link>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {story.tags.map((t) => (
                  <span key={t} className="text-[11px] text-ash border border-white/10 rounded-full px-2.5 py-1">#{t}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="order-1 lg:order-2">
          <Reveal>
            <TiltCover
              story={story}
              spinning={!!spinTarget}
              onSpinDone={() => { if (spinTarget) onSpinDone(); }}
            />
          </Reveal>
          <Reveal delay={0.08}>
            <div className="text-center mt-8">
              <span className={`inline-block text-[11px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border mb-4 ${story.status === 'Hoàn thành' ? 'border-gold/40 bg-gold/15 text-gold' : 'border-white/15 text-ash'}`}>
                {story.status}
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-bone leading-tight">{story.title}</h1>
              <div className="flex flex-wrap justify-center gap-3 mt-7">
                <button
                  onClick={() => goRead(`/doc/${story.slug}/1`)}
                  data-testid="read-from-start-btn"
                  disabled={!!spinTarget}
                  className="px-8 py-3.5 rounded-full bg-gold text-obsidian text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:shadow-[0_0_35px_rgba(34,200,234,0.45)] transition-shadow duration-300 disabled:opacity-60"
                >
                  <BookOpen size={15} weight="bold" /> Đọc từ đầu
                </button>
                <button
                  onClick={() => goRead(`/doc/${story.slug}/${story.chapters.length}`)}
                  data-testid="read-latest-btn"
                  disabled={!!spinTarget}
                  className="px-7 py-3.5 rounded-full border border-white/20 text-bone text-xs font-bold uppercase tracking-wider hover:border-gold/60 hover:text-gold transition-colors duration-300 disabled:opacity-60"
                >
                  Đọc mới nhất
                </button>
                <button
                  data-testid="favorite-toggle-btn"
                  onClick={onFav}
                  className={`px-4 rounded-full border flex items-center justify-center transition-colors duration-300 ${fav ? 'bg-blood/30 border-blood text-red-300' : 'border-white/20 text-ash hover:border-blood hover:text-red-300'}`}
                  aria-label="Yêu thích"
                >
                  <Heart size={18} weight={fav ? 'fill' : 'regular'} />
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="flex flex-col gap-5 lg:gap-0 lg:justify-between lg:py-2 order-3">
          <Reveal delay={0.12}>
            <div className="glass rounded-2xl p-6" data-testid="rank-card">
              <p className="text-[10px] uppercase tracking-[0.35em] text-gold mb-3">Bảng xếp hạng</p>
              <p className="font-display text-4xl font-bold text-bone flex items-center gap-3">
                <TrendUp size={26} className="text-gold" weight="bold" /> #{rank > 0 ? rank : '—'}
              </p>
              <p className="text-xs text-ash mt-1.5">trên bảng Top đọc nhiều</p>
              <Link to="/top" className="inline-block mt-4 text-[11px] uppercase tracking-[0.2em] text-gold hover:underline">Xem đài vinh danh →</Link>
            </div>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="glass rounded-2xl p-6" data-testid="views-card">
              <p className="text-[10px] uppercase tracking-[0.35em] text-gold mb-3">Lượt xem</p>
              <p className="font-display text-4xl font-bold text-bone flex items-center gap-3">
                <Eye size={26} className="text-gold" /> {story.views}
              </p>
              <div className="mt-4 space-y-2.5 text-sm text-ash">
                <p className="flex items-center gap-2"><Star size={15} weight="fill" className="text-[#F8C93A]" /> {story.rating}/5 đánh giá</p>
                <p className="flex items-center gap-2"><Heart size={15} weight={fav ? 'fill' : 'regular'} className="text-blood" /> {likesOf(story.views)} lượt thích{fav ? ' (có bạn)' : ''}</p>
                <p className="flex items-center gap-2"><ListBullets size={15} className="text-gold/70" /> {story.chaptersCount} chương</p>
                <p className="flex items-center gap-2"><Clock size={15} className="text-gold/70" /> {story.updated}</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="glass rounded-2xl p-6" data-testid="content-card">
              <p className="text-[10px] uppercase tracking-[0.35em] text-gold mb-3">Nội dung</p>
              <p className="text-sm text-bone/85 leading-[1.85] font-light">{story.desc}</p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mt-24 max-w-4xl mx-auto" data-testid="chapter-roadmap">
        <Reveal><h2 className="font-display text-3xl md:text-4xl font-semibold text-bone text-center">Lộ trình chương mới</h2></Reveal>
        <div className="relative mt-12">
          <div className="absolute left-4 top-0 bottom-0 border-l-2 border-dashed border-gold/30 md:hidden" />
          <svg className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-28 hidden md:block" viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true">
            <motion.path
              d={sPath}
              fill="none"
              stroke="rgba(34,200,234,0.55)"
              strokeWidth="2.5"
              strokeDasharray="10 12"
              vectorEffect="non-scaling-stroke"
              style={{ filter: 'drop-shadow(0 0 6px rgba(34,200,234,0.6))' }}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2.2, ease: 'easeInOut' }}
            />
            {story.chapters.slice(1).map((_, i) => (
              <circle key={i} cx={50} cy={((i + 1) * 1000) / story.chapters.length} r={6} fill="#22C8EA" opacity={0.9} />
            ))}
          </svg>
          {story.chapters.map((c, i) => (
            <Reveal key={c.num} delay={i * 0.08} y={28}>
              <div className={`relative pl-12 md:pl-0 md:w-1/2 mb-8 ${i % 2 ? 'md:ml-auto md:pl-14' : 'md:pr-14'}`}>
                <span className={`absolute top-7 w-4 h-4 rounded-full bg-gold shadow-[0_0_14px_rgba(34,200,234,0.8)] left-[9px] md:hidden`} />
                <Link
                  to={`/doc/${story.slug}/${c.num}`}
                  data-testid={`chapter-link-${c.num}`}
                  className="block glass rounded-2xl p-5 hover:border-gold/50 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(34,200,234,0.15)] transition-[transform,border-color,box-shadow] duration-300 group"
                >
                  <span className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-gold">
                    Chap mới cập nhật <span className="text-ash normal-case tracking-normal">{c.time}</span>
                  </span>
                  <h4 className="font-display text-xl font-semibold text-bone mt-2 group-hover:text-gold transition-colors">{c.title}</h4>
                  <span className="text-xs text-ash mt-2 inline-flex items-center gap-1.5 group-hover:text-gold transition-colors">
                    Đọc ngay <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-24 max-w-4xl mx-auto" data-testid="comments-section">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-bone flex items-center gap-3">
              <ChatCircle size={26} weight="duotone" className="text-gold" /> Bình luận
              <span className="text-lg text-ash font-normal">({comments.length})</span>
            </h2>
            <div className="flex gap-2">
              <span className="px-4 py-2 rounded-full bg-gold/15 border border-gold/40 text-gold text-[11px] font-bold uppercase tracking-wider">Theo lượt mới</span>
              <span className="px-4 py-2 rounded-full border border-white/15 text-ash text-[11px] uppercase tracking-wider">Chap {story.chaptersCount}</span>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <form onSubmit={onComment} className="glass rounded-2xl p-3 flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-blood flex items-center justify-center font-display font-bold text-obsidian shrink-0">B</span>
            <input
              data-testid="comment-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Chia sẻ cảm nghĩ của bạn về truyện..."
              className="flex-1 bg-transparent outline-none text-sm text-bone placeholder:text-ash/60"
            />
            <button type="submit" data-testid="comment-submit-btn" className="w-10 h-10 rounded-full bg-gold text-obsidian flex items-center justify-center hover:shadow-[0_0_20px_rgba(34,200,234,0.5)] transition-shadow" aria-label="Gửi bình luận">
              <PaperPlaneTilt size={16} weight="bold" />
            </button>
          </form>
        </Reveal>
        <div className="mt-6 space-y-4">
          {comments.map((c, i) => (
            <Reveal key={`${c.name}-${i}`} delay={i * 0.05} y={20}>
              <div className="glass rounded-2xl p-5 flex gap-4 hover:border-gold/30 transition-colors duration-300" data-testid={`comment-item-${i}`}>
                <span
                  className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center font-display font-bold text-obsidian text-lg"
                  style={{ background: `linear-gradient(135deg, hsl(${(i * 67) % 360} 60% 55%), hsl(${(i * 67 + 40) % 360} 65% 40%))` }}
                >
                  {c.name[0]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="flex flex-wrap items-center gap-2.5">
                    <span className="text-sm font-bold text-gold/90">{c.name}</span>
                    <span className="text-[11px] text-ash/70">{c.time}</span>
                  </p>
                  <p className="text-sm text-bone/85 leading-relaxed mt-1.5">{c.text}</p>
                  <button type="button" data-testid={`comment-like-${i}`} onClick={() => likeComment(i)} className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-ash hover:text-gold transition-colors">
                    <ThumbsUp size={13} weight={c.liked ? 'fill' : 'regular'} className={c.liked ? 'text-gold' : ''} /> Thích · {c.likes}
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
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
    </div>
  );
}
