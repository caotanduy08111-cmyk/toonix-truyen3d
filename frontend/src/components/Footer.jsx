import { Link } from 'react-router-dom';
import { BookOpen } from '@phosphor-icons/react';
import { GENRES } from '../data/stories';

export const Footer = () => (
  <footer className="relative z-10 border-t border-white/10 bg-coal/60 backdrop-blur-md mt-24">
    <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
      <div className="col-span-2 md:col-span-1">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-lg bg-gold/15 border border-gold/40 flex items-center justify-center">
            <BookOpen size={18} weight="duotone" className="text-gold" />
          </span>
          <span className="font-display text-xl font-bold text-bone">HUYỄN<span className="text-gold italic">CẢNH</span></span>
        </Link>
        <p className="text-sm text-ash mt-4 leading-relaxed max-w-xs">
          Thư viện truyện 3D — nơi mỗi câu chuyện là một thế giới bạn có thể chạm vào.
        </p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Điều hướng</p>
        <ul className="space-y-2.5 text-sm text-ash">
          {[['/', 'Trang chủ'], ['/danh-sach', 'Danh sách truyện'], ['/truyen-cap-nhat', 'Mới cập nhật'], ['/truyen-full', 'Truyện full'], ['/top', 'Bảng xếp hạng']].map(([to, label]) => (
            <li key={to}><Link to={to} className="hover:text-gold transition-colors duration-300">{label}</Link></li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Thể loại</p>
        <ul className="space-y-2.5 text-sm text-ash">
          {GENRES.slice(0, 5).map((g) => (
            <li key={g.slug}><Link to={`/the-loai/${g.slug}`} className="hover:text-gold transition-colors duration-300">{g.name}</Link></li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Tài khoản</p>
        <ul className="space-y-2.5 text-sm text-ash">
          {[['/dang-nhap', 'Đăng nhập'], ['/dang-ky', 'Đăng ký'], ['/ho-so', 'Hồ sơ'], ['/lich-su', 'Lịch sử đọc']].map(([to, label]) => (
            <li key={to}><Link to={to} className="hover:text-gold transition-colors duration-300">{label}</Link></li>
          ))}
        </ul>
      </div>
    </div>
    <div className="border-t border-white/5 py-5 text-center text-xs text-ash/70">
      © 2026 Huyễn Cảnh 3D — Đọc truyện theo cách chưa từng có
    </div>
  </footer>
);
