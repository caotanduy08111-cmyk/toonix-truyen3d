# HUYỄN CẢNH 3D — Website đọc truyện 3D

## Problem statement gốc
"tôi muốn thiết kế 1 website đọc truyện 3D dựa trên ladingpace này. giúp tôi tạo hiệu ứng nhiều vào." — kèm wireframe landing page gồm: Trang chủ, Thể loại, Trang truyện, Top, Danh sách, Đăng nhập, Đăng ký, Hồ sơ, Truyện cập nhật, Truyện full, Lịch sử đọc.

## Lựa chọn của người dùng
- Nhiều trang: Trang chủ, Thể loại, Truyện, Đăng nhập/Đăng ký, Hồ sơ
- Hiệu ứng: TẤT CẢ — thẻ 3D tilt khi hover, parallax cuộn, lật sách 3D, nền Three.js particles/vật thể nổi
- Auth: chỉ mockup, chưa cần thật
- Dữ liệu truyện: người dùng sẽ cung cấp sau → hiện dùng dữ liệu mẫu

## Kiến trúc
- Frontend: React 19 + Tailwind + framer-motion + lenis (smooth scroll) + @react-three/fiber + drei + react-pageflip + @phosphor-icons/react
- Backend: FastAPI + MongoDB (giữ nguyên template, chưa dùng — data đang là mock ở `/app/frontend/src/data/stories.js`)
- State client (favorites/history/user demo): localStorage qua `/app/frontend/src/lib/store.js`
- Design: Dark Cinematic Fantasy — obsidian #050505, gold #D4AF37, blood #8A1C1C; Cormorant Garamond (headings) + Manrope (body); grain overlay toàn site

## Đã triển khai (19/08/2026)
- REBRAND: Logo TOONIX (chuyển từ file .ai → PNG nền trong suốt, /public/logo.png) thay logo cũ ở Navbar/Footer/trang đọc; title tab = "TOONIX — Infinite Story Universe"
- Hero trang chủ: logo TOONIX lớn phát sáng làm tâm điểm, xoay 3D theo chuột (rotateX/rotateY springs) + float nhịp nhàng + hào quang cyan
- LightningIntro (/src/components/LightningIntro.jsx): intro 2.6s khi mở trang chủ lần đầu mỗi session — logo TOONIX flicker điện + 4 tia sét cyan SVG (pathLength animation, lặp 3 lần) đánh qua chữ + flash nền, chạm để bỏ qua, lưu sessionStorage
- Trang truyện: banner ngang đầu trang từ chính ảnh bìa (blur + ken-burns zoom chậm 26s + gradient fade), tên truyện khổng lồ mờ nền, bìa truyện xếp chồm lên banner
- Đổi toàn bộ tone màu sang bảng màu người dùng: nền #020817, surface #121C38, border #1E2C50, chữ #EEF4FF/#93A4C9, accent cyan #22C8EA/#4DD8F0, xanh #4891E7, sao đánh giá vàng #F8C93A, danger #E0554A
- 20 ảnh bìa thật do người dùng cung cấp (Iruma, Hóa Thân Thành Mèo, Frieren, Hội Pháp Sư, One Piece, Naruto, Blue Lock, Ragnarok, Mashle, Gakuen Babysitters, Một Đêm Không Bóng, Công Chúa Bị Bỏ Rơi, Tôi Không Phải Ấn Tượng Hơn, Lần Nữa Tỏa Sáng, Hiệp Sĩ Hoa Băng, Kotaro, Bảo Mẫu Xác Ướp, Thể Thao Cực Hạn, Bong Bóng Sóng Biển, Mr Devourer) trong /public/covers
- 20 truyện mới có nội dung riêng: tên 4 chương + đoạn mở đầu chương 1 viết riêng theo cốt truyện (/src/data/content.js), CoverArt hỗ trợ ảnh thật
- Trang chủ: hero kinetic masked line-reveal, nền Three.js (Stars + Sparkles + sách 3D bay), parallax chuột + cuộn, marquee editorial, bento grid truyện nổi bật, mới cập nhật, top 10 ranking, dải thể loại, manifesto 01/02/03
- Thẻ truyện 3D tilt (rotateX/rotateY theo chuột + glare) — CoverArt SVG procedural theo hue/motif từng truyện
- Trang thể loại (/the-loai) + lọc theo thể loại (/the-loai/:slug)
- Trang chi tiết truyện (/truyen/:slug): bìa tilt 3D, meta, danh sách chương, yêu thích (localStorage), truyện liên quan
- Trang đọc (/doc/:slug/:num): sách lật 3D react-pageflip, bìa sách, drop-cap, mục lục trượt, phím mũi tên, ghi lịch sử đọc
- Danh sách: /danh-sach, /truyen-cap-nhat, /truyen-full, /top (rank), /lich-su
- Auth mockup: /dang-nhap, /dang-ky (lưu user localStorage, chuyển tới /ho-so)
- Hồ sơ (/ho-so): avatar, thống kê, tab Yêu thích / Lịch sử đọc
- Navbar glass + tìm kiếm overlay, Footer, page transitions AnimatePresence
- 12 truyện mẫu tiếng Việt, 8 thể loại, mỗi truyện 4 chương demo

## Backlog
- P0: Kết nối dữ liệu truyện thật (người dùng cung cấp) — API backend + MongoDB
- P0: Auth thật (JWT hoặc Emergent Google Auth) khi người dùng yêu cầu
- P1: Trang quản trị đăng truyện/chương; upload ảnh bìa (object storage)
- P1: Bình luận chương, đánh giá sao
- P2: Chế độ đọc tối/sáng, cỡ chữ; PWA offline; gợi ý AI

## Next tasks
1. Nhận dữ liệu truyện thật từ người dùng → xây API /api/stories
2. Auth thật khi được yêu cầu
3. Tinh chỉnh hiệu ứng theo phản hồi
