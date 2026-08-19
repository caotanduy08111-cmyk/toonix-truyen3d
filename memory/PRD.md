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
