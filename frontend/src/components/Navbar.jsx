import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlass, List, X, User, BookOpen } from '@phosphor-icons/react';
import { STORIES } from '../data/stories';
import { getUser } from '../lib/store';

const LINKS = [
  { to: '/', label: 'Trang chủ' },
  { to: '/the-loai', label: 'Thể loại' },
  { to: '/danh-sach', label: 'Danh sách' },
  { to: '/truyen-cap-nhat', label: 'Mới cập nhật' },
  { to: '/truyen-full', label: 'Truyện full' },
  { to: '/top', label: 'Top' },
];

export const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState('');
  const [user, setUser] = useState(getUser());
  const navigate = useNavigate();

  useEffect(() => {
    const sync = () => setUser(getUser());
    window.addEventListener('hc-store', sync);
    return () => window.removeEventListener('hc-store', sync);
  }, []);

  const results = q.trim()
    ? STORIES.filter((s) => (s.title + s.author).toLowerCase().includes(q.toLowerCase())).slice(0, 6)
    : [];

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 glass border-x-0 border-t-0">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 h-16 md:h-[72px] flex items-center justify-between gap-4">
          <Link to="/" data-testid="nav-logo" className="flex items-center gap-2.5 shrink-0">
            <span className="w-9 h-9 rounded-lg bg-gold/15 border border-gold/40 flex items-center justify-center">
              <BookOpen size={18} weight="duotone" className="text-gold" />
            </span>
            <span className="font-display text-xl md:text-2xl font-bold tracking-wide text-bone">
              HUYỄN<span className="text-gold italic">CẢNH</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7" data-testid="nav-menu">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                data-testid={`nav-${l.label.toLowerCase().replace(/\s/g, '-')}`}
                className={({ isActive }) =>
                  `text-[13px] uppercase tracking-[0.15em] transition-colors duration-300 hover:text-gold ${isActive ? 'text-gold' : 'text-ash'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              data-testid="search-open-btn"
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-ash hover:text-gold hover:border-gold/50 transition-colors duration-300"
              aria-label="Tìm kiếm"
            >
              <MagnifyingGlass size={17} />
            </button>
            {user ? (
              <Link to="/ho-so" data-testid="nav-profile-btn" className="h-10 pl-1.5 pr-4 rounded-full border border-gold/40 bg-gold/10 flex items-center gap-2 text-gold hover:bg-gold/20 transition-colors duration-300">
                <span className="w-7 h-7 rounded-full bg-gold text-obsidian flex items-center justify-center text-xs font-bold">{user.name[0].toUpperCase()}</span>
                <span className="text-xs font-semibold hidden sm:block">{user.name}</span>
              </Link>
            ) : (
              <Link to="/dang-nhap" data-testid="nav-login-btn" className="h-10 px-4 md:px-5 rounded-full bg-gold text-obsidian text-[13px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#e8c55a] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-[background-color,box-shadow] duration-300">
                <User size={15} weight="bold" />
                <span className="hidden sm:block">Đăng nhập</span>
              </Link>
            )}
            <button data-testid="menu-toggle-btn" onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-ash" aria-label="Menu">
              {menuOpen ? <X size={17} /> : <List size={17} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-white/10"
              data-testid="mobile-menu"
            >
              <div className="px-6 py-4 flex flex-col gap-1">
                {LINKS.map((l) => (
                  <NavLink key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className="py-2.5 text-sm uppercase tracking-[0.15em] text-ash hover:text-gold transition-colors">
                    {l.label}
                  </NavLink>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-obsidian/85 backdrop-blur-xl flex justify-center pt-28 px-5"
            onClick={() => setSearchOpen(false)}
            data-testid="search-overlay"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass rounded-2xl p-2 flex items-center gap-3">
                <MagnifyingGlass size={20} className="text-gold ml-3 shrink-0" />
                <input
                  autoFocus
                  data-testid="search-input"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
                  placeholder="Tìm truyện, tác giả..."
                  className="flex-1 bg-transparent outline-none text-lg py-3 text-bone placeholder:text-ash/60"
                />
                <button data-testid="search-close-btn" onClick={() => setSearchOpen(false)} className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-ash hover:text-gold transition-colors">
                  <X size={16} />
                </button>
              </div>
              {results.length > 0 && (
                <div className="glass rounded-2xl mt-3 overflow-hidden" data-testid="search-results">
                  {results.map((s) => (
                    <button
                      key={s.slug}
                      data-testid={`search-result-${s.slug}`}
                      onClick={() => { setSearchOpen(false); setQ(''); navigate(`/truyen/${s.slug}`); }}
                      className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-gold/10 transition-colors text-left border-b border-white/5 last:border-0"
                    >
                      <span className="w-2 h-2 rotate-45 bg-gold/70 shrink-0" />
                      <span className="flex-1">
                        <span className="block font-display text-lg text-bone">{s.title}</span>
                        <span className="block text-xs text-ash">{s.author} · {s.chaptersCount} chương</span>
                      </span>
                      <span className="text-xs text-gold/70">{s.views} đọc</span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
