import { Link } from 'react-router-dom';
import { GENRES } from '../data/stories';

export const Footer = () => (
  <footer className="relative z-10 border-t border-white/10 bg-coal/60 backdrop-blur-md mt-24">
    <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
      <div className="col-span-2 md:col-span-1">
        <Link to="/" className="inline-flex items-center">
          <img src="/logo.png" alt="TOONIX" className="h-11 w-auto drop-shadow-[0_0_16px_rgba(34,200,234,0.4)]" />
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
      © 2026 TOONIX — Infinite Story Universe
    </div>
  </footer>
);
