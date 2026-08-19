import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';
import { Toaster } from 'sonner';
import '@/App.css';
import { BackgroundFX } from '@/components/BackgroundFX';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import GenresPage from '@/pages/GenresPage';
import StoryPage from '@/pages/StoryPage';
import ReaderPage from '@/pages/ReaderPage';
import ListPage from '@/pages/ListPage';
import ProfilePage from '@/pages/ProfilePage';
import { LoginPage, RegisterPage } from '@/pages/AuthPages';

let lenisInstance = null;

const LenisProvider = ({ children }) => {
  const { pathname } = useLocation();
  useEffect(() => {
    lenisInstance = new Lenis({ duration: 1.15, smoothWheel: true });
    const raf = (t) => { lenisInstance.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => { lenisInstance.destroy(); lenisInstance = null; };
  }, []);
  useEffect(() => {
    lenisInstance?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname]);
  return children;
};

const PageShell = ({ children, testid }) => (
  <motion.main
    data-testid={testid}
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.main>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  const isReader = location.pathname.startsWith('/doc/');
  return (
    <>
      {!isReader && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageShell testid="page-home"><HomePage /></PageShell>} />
          <Route path="/the-loai" element={<PageShell testid="page-genres"><GenresPage /></PageShell>} />
          <Route path="/the-loai/:slug" element={<PageShell testid="page-genre-list"><ListPage kind="genre" /></PageShell>} />
          <Route path="/danh-sach" element={<PageShell testid="page-all"><ListPage kind="all" /></PageShell>} />
          <Route path="/truyen-cap-nhat" element={<PageShell testid="page-updated"><ListPage kind="updated" /></PageShell>} />
          <Route path="/truyen-full" element={<PageShell testid="page-full"><ListPage kind="full" /></PageShell>} />
          <Route path="/top" element={<PageShell testid="page-top"><ListPage kind="top" /></PageShell>} />
          <Route path="/lich-su" element={<PageShell testid="page-history"><ListPage kind="history" /></PageShell>} />
          <Route path="/truyen/:slug" element={<PageShell testid="page-story"><StoryPage /></PageShell>} />
          <Route path="/doc/:slug/:num" element={<ReaderPage />} />
          <Route path="/dang-nhap" element={<PageShell testid="page-login"><LoginPage /></PageShell>} />
          <Route path="/dang-ky" element={<PageShell testid="page-register"><RegisterPage /></PageShell>} />
          <Route path="/ho-so" element={<PageShell testid="page-profile"><ProfilePage /></PageShell>} />
          <Route path="*" element={<PageShell testid="page-404"><HomePage /></PageShell>} />
        </Routes>
      </AnimatePresence>
      {!isReader && <Footer />}
    </>
  );
};

function App() {
  return (
    <div className="font-body bg-obsidian text-bone min-h-screen">
      <BrowserRouter>
        <LenisProvider>
          <BackgroundFX />
          <div className="grain-overlay" />
          <AnimatedRoutes />
          <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: '#121C38', border: '1px solid rgba(34,200,234,0.3)', color: '#EEF4FF' } }} />
        </LenisProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
