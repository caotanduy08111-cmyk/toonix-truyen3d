import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, EnvelopeSimple, FacebookLogo, GoogleLogo, LockSimple, User as UserIcon } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { STORIES } from '../data/stories';
import { CoverArt } from '../components/CoverArt';
import { setUser } from '../lib/store';

const AuthLayout = ({ children, quote }) => (
  <div className="relative z-10 min-h-screen grid lg:grid-cols-2 pt-16">
    <div className="hidden lg:flex relative overflow-hidden items-center justify-center border-r border-white/10">
      <div className="absolute inset-0">
        {[STORIES[0], STORIES[3], STORIES[5], STORIES[8]].map((s, i) => (
          <motion.div
            key={s.slug}
            animate={{ y: [0, -14, 0] }}
            transition={{ repeat: Infinity, duration: 5 + i, ease: 'easeInOut', delay: i * 0.7 }}
            className="absolute w-40 aspect-[3/4] rounded-xl overflow-hidden border border-white/10 shadow-2xl"
            style={{ left: `${12 + (i % 2) * 45}%`, top: `${8 + i * 21}%`, rotate: `${i % 2 ? 7 : -8}deg` }}
          >
            <CoverArt story={s} />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-obsidian/70" />
      </div>
      <div className="relative z-10 max-w-md px-10">
        <p className="font-display italic text-3xl xl:text-4xl text-bone leading-snug">“{quote}”</p>
        <div className="w-14 h-px bg-gold/60 my-6" />
        <p className="text-xs uppercase tracking-[0.35em] text-gold">TOONIX</p>
      </div>
    </div>
    <div className="flex items-center justify-center px-5 py-14">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-md">
        {children}
      </motion.div>
    </div>
  </div>
);

const Field = ({ icon: Icon, ...props }) => (
  <div className="glass rounded-xl flex items-center gap-3 px-4 focus-within:border-gold/50 transition-colors">
    <Icon size={17} className="text-gold/70 shrink-0" />
    <input {...props} className="flex-1 bg-transparent outline-none py-3.5 text-sm text-bone placeholder:text-ash/60" />
  </div>
);

const SocialRow = () => (
  <div className="flex gap-3">
    {[{ icon: FacebookLogo, label: 'Facebook' }, { icon: GoogleLogo, label: 'Google' }].map(({ icon: Icon, label }) => (
      <button
        key={label}
        type="button"
        data-testid={`social-${label.toLowerCase()}-btn`}
        onClick={() => toast.info(`Đăng nhập bằng ${label} đang là bản demo`, { description: 'Tính năng sẽ được kết nối thật khi bạn cung cấp dữ liệu.' })}
        className="flex-1 py-3 rounded-xl border border-white/15 flex items-center justify-center gap-2 text-sm text-ash hover:text-gold hover:border-gold/50 transition-colors"
      >
        <Icon size={18} weight="fill" /> {label}
      </button>
    ))}
  </div>
);

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const submit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Vui lòng nhập đầy đủ email và mật khẩu');
    setLoading(true);
    setTimeout(() => {
      setUser({ name: form.email.split('@')[0], email: form.email });
      toast.success('Đăng nhập thành công — chúc bạn đọc truyện vui!');
      navigate(from || '/ho-so');
    }, 800);
  };

  return (
    <AuthLayout quote="Người đọc sách sống ngàn cuộc đời trước khi chết. Kẻ không bao giờ đọc chỉ sống một cuộc.">
      <div data-testid="login-page">
        <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3">Chào mừng trở lại</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-bone">Đăng nhập</h1>
        <p className="text-sm text-ash mt-3">Bản demo — nhập email bất kỳ để trải nghiệm.</p>
        {from && (
          <div className="mt-4 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold flex items-center gap-2.5" data-testid="login-required-notice">
            <BookOpen size={16} weight="duotone" className="shrink-0" />
            Tạo tài khoản hoặc đăng nhập để bắt đầu đọc truyện nhé!
          </div>
        )}
        <form onSubmit={submit} className="space-y-4 mt-9">
          <Field icon={EnvelopeSimple} data-testid="login-email-input" type="email" placeholder="Email của bạn" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Field icon={LockSimple} data-testid="login-password-input" type="password" placeholder="Mật khẩu" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <div className="flex justify-end">
            <button type="button" data-testid="forgot-password-link" onClick={() => toast.info('Tính năng demo')} className="text-xs text-gold/80 hover:text-gold transition-colors">Quên mật khẩu?</button>
          </div>
          <button
            type="submit"
            data-testid="login-submit-btn"
            disabled={loading}
            className="w-full py-4 rounded-full bg-gold text-obsidian font-bold text-sm uppercase tracking-wider hover:shadow-[0_0_35px_rgba(34,200,234,0.45)] transition-shadow disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <span className="w-4 h-4 border-2 border-obsidian/40 border-t-obsidian rounded-full animate-spin" /> : <BookOpen size={16} weight="bold" />}
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <div className="flex items-center gap-4 my-6">
          <span className="flex-1 h-px bg-white/10" /><span className="text-xs text-ash uppercase tracking-widest">hoặc</span><span className="flex-1 h-px bg-white/10" />
        </div>
        <SocialRow />
        <p className="text-sm text-ash text-center mt-8">
          Chưa có tài khoản? <Link to="/dang-ky" data-testid="go-register-link" className="text-gold hover:underline">Đăng ký ngay</Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Vui lòng điền đầy đủ thông tin');
    if (form.password !== form.confirm) return toast.error('Mật khẩu xác nhận không khớp');
    setLoading(true);
    setTimeout(() => {
      setUser({ name: form.name, email: form.email });
      toast.success('Tạo tài khoản thành công — chúc bạn đọc truyện vui!');
      navigate(from || '/ho-so');
    }, 800);
  };

  return (
    <AuthLayout quote="Mỗi cuốn sách là một cánh cửa — và chìa khóa luôn nằm trong tay kẻ dám mở nó ra.">
      <div data-testid="register-page">
        <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3">Gia nhập thư viện</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-bone">Đăng ký</h1>
        <p className="text-sm text-ash mt-3">Bản demo — tài khoản chỉ lưu trên trình duyệt của bạn.</p>
        <form onSubmit={submit} className="space-y-4 mt-9">
          <Field icon={UserIcon} data-testid="register-name-input" placeholder="Bút danh của bạn" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Field icon={EnvelopeSimple} data-testid="register-email-input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Field icon={LockSimple} data-testid="register-password-input" type="password" placeholder="Mật khẩu" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Field icon={LockSimple} data-testid="register-confirm-input" type="password" placeholder="Xác nhận mật khẩu" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
          <button
            type="submit"
            data-testid="register-submit-btn"
            disabled={loading}
            className="w-full py-4 rounded-full bg-gold text-obsidian font-bold text-sm uppercase tracking-wider hover:shadow-[0_0_35px_rgba(34,200,234,0.45)] transition-shadow disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-obsidian/40 border-t-obsidian rounded-full animate-spin" />}
            {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
          </button>
        </form>
        <div className="flex items-center gap-4 my-6">
          <span className="flex-1 h-px bg-white/10" /><span className="text-xs text-ash uppercase tracking-widest">hoặc</span><span className="flex-1 h-px bg-white/10" />
        </div>
        <SocialRow />
        <p className="text-sm text-ash text-center mt-8">
          Đã có tài khoản? <Link to="/dang-nhap" data-testid="go-login-link" className="text-gold hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
