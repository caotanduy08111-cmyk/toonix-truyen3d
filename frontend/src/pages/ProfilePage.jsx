import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Heart, SignOut, User } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { STORIES } from '../data/stories';
import { StoryCard } from '../components/StoryCard';
import { StoryLink } from '../components/StoryLink';
import { Reveal } from '../components/Reveal';
import { getFavs, getHistory, getUser, logout } from '../lib/store';

export default function ProfilePage() {
  const [user, setUser] = useState(getUser());
  const [tab, setTab] = useState('favs');
  const navigate = useNavigate();

  useEffect(() => {
    const sync = () => setUser(getUser());
    window.addEventListener('hc-store', sync);
    return () => window.removeEventListener('hc-store', sync);
  }, []);

  if (!user) {
    return (
      <div className="relative z-10 min-h-screen flex items-center justify-center px-5" data-testid="profile-guest">
        <div className="text-center glass rounded-3xl p-12 max-w-md gold-glow">
          <span className="w-20 h-20 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center mx-auto">
            <User size={34} className="text-gold" weight="duotone" />
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-bone mt-7">Hồ sơ của bạn</h1>
          <p className="text-sm text-ash mt-3 leading-relaxed">Đăng nhập để lưu truyện yêu thích và theo dõi hành trình đọc của riêng bạn.</p>
          <div className="flex gap-3 mt-8">
            <Link to="/dang-nhap" data-testid="profile-login-btn" className="flex-1 py-3.5 rounded-full bg-gold text-obsidian text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_30px_rgba(34,200,234,0.45)] transition-shadow text-center">Đăng nhập</Link>
            <Link to="/dang-ky" data-testid="profile-register-btn" className="flex-1 py-3.5 rounded-full border border-white/20 text-bone text-xs font-bold uppercase tracking-wider hover:border-gold/60 hover:text-gold transition-colors text-center">Đăng ký</Link>
          </div>
        </div>
      </div>
    );
  }

  const favStories = STORIES.filter((s) => getFavs().includes(s.slug));
  const history = getHistory();

  const onLogout = () => {
    logout();
    toast.success('Đã đăng xuất (bản demo)');
    navigate('/');
  };

  return (
    <div data-testid="profile-page" className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 pt-32 md:pt-40 pb-10 min-h-screen">
      <Reveal>
        <div className="flex flex-wrap items-center gap-7">
          <span className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-gold to-blood flex items-center justify-center font-display text-5xl font-bold text-obsidian border-2 border-gold/50 gold-glow">
            {user.name[0].toUpperCase()}
          </span>
          <div className="flex-1 min-w-[200px]">
            <p className="text-xs uppercase tracking-[0.4em] text-gold mb-2">Hồ sơ của bạn</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-bone">{user.name}</h1>
            <p className="text-sm text-ash mt-2">{user.email}</p>
          </div>
          <button data-testid="logout-btn" onClick={onLogout} className="h-11 px-6 rounded-full border border-white/20 text-ash hover:text-red-300 hover:border-blood flex items-center gap-2 text-xs uppercase tracking-wider transition-colors">
            <SignOut size={15} /> Đăng xuất
          </button>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="grid grid-cols-3 gap-4 md:gap-6 mt-12 max-w-2xl">
          {[[favStories.length, 'Truyện yêu thích', Heart], [history.length, 'Truyện đang đọc', BookOpen], [history.reduce((a, h) => a + h.chapter, 0), 'Chương đã đọc', Clock]].map(([num, label, Icon]) => (
            <div key={label} className="glass rounded-2xl p-5 md:p-7 text-center hover:border-gold/40 transition-colors duration-300">
              <Icon size={20} className="text-gold mx-auto mb-3" weight="duotone" />
              <p className="font-display text-3xl md:text-4xl font-bold text-bone">{num}</p>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-ash mt-1.5">{label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="flex gap-3 mt-14 border-b border-white/10 pb-0">
        {[['favs', 'Yêu thích'], ['history', 'Lịch sử đọc']].map(([key, label]) => (
          <button
            key={key}
            data-testid={`profile-tab-${key}`}
            onClick={() => setTab(key)}
            className={`px-6 py-3.5 text-sm uppercase tracking-[0.2em] font-semibold border-b-2 -mb-px transition-colors duration-300 ${tab === key ? 'text-gold border-gold' : 'text-ash border-transparent hover:text-bone'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'favs' && (
        <div className="mt-10" data-testid="profile-favs">
          {favStories.length === 0 ? (
            <div className="text-center py-16 glass rounded-2xl">
              <Heart size={40} className="text-gold/50 mx-auto mb-4" weight="duotone" />
              <p className="font-display text-2xl text-bone">Chưa có truyện yêu thích</p>
              <p className="text-sm text-ash mt-2">Chạm vào trái tim ở trang truyện để lưu lại những thế giới bạn yêu.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {favStories.map((s, i) => <Reveal key={s.slug} delay={i * 0.05}><StoryCard story={s} /></Reveal>)}
            </div>
          )}
        </div>
      )}

      {tab === 'history' && (
        <div className="mt-10 max-w-3xl space-y-4" data-testid="profile-history">
          {history.length === 0 ? (
            <div className="text-center py-16 glass rounded-2xl">
              <Clock size={40} className="text-gold/50 mx-auto mb-4" weight="duotone" />
              <p className="font-display text-2xl text-bone">Chưa có lịch sử đọc</p>
            </div>
          ) : (
            history.map((h) => {
              const s = STORIES.find((x) => x.slug === h.slug);
              if (!s) return null;
              return (
                <div key={h.slug} className="glass rounded-xl p-5 flex items-center gap-5 hover:border-gold/40 transition-colors">
                  <div className="flex-1 min-w-0">
                    <StoryLink slug={s.slug} className="font-display text-xl font-semibold text-bone hover:text-gold transition-colors">{s.title}</StoryLink>
                    <p className="text-xs text-ash mt-1">Đang đọc chương {h.chapter} / {s.chaptersCount}</p>
                  </div>
                  <Link to={`/doc/${s.slug}/${h.chapter}`} data-testid={`profile-resume-${s.slug}`} className="px-6 py-2.5 rounded-full bg-gold text-obsidian text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_25px_rgba(34,200,234,0.4)] transition-shadow shrink-0">
                    Đọc tiếp
                  </Link>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
