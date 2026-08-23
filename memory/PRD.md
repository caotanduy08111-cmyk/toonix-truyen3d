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
- Trang đọc: CHẾ ĐỘ TRUYỆN TRANH — 18 bộ có 2 trang manga full-page do AI (Gemini Nano Banana qua Emergent LLM key) tạo riêng theo cốt truyện (/public/panels, /app/scripts/gen_panels.py, map ở /src/data/panels.js), lời truyện đặt trong khung đám mây nhỏ (class .cloud-bubble, tối đa ~110 ký tự/bong bóng, không che tranh); truyện chưa có tranh dùng chế độ chữ + minh họa (layout absolute vì thư viện lật sách ép display:block). Hết ngân sách key nên 2 bộ chưa có tranh: toi-khong-phai-an-tuong-hon, lan-nua-toa-sang (chạy lại gen_panels.py sau khi nạp thêm credit) ReaderAmbience — hiệu ứng không khí theo thể loại (tiên/kiếm hiệp: luồng kiếm khí bay lên, huyền huyễn: hạt lấp lánh, kinh dị: sương đỏ trôi, đô thị: mưa neon rơi, khoa huyễn: bụi sao, lãng mạn: cánh hoa hồng rơi, hài hước: bong bóng bay); sách mở vào với hiệu ứng xoay 3D + hào quang màu theo hue truyện
- Bảng xếp hạng trang chủ: mỗi hàng có ảnh bìa thu nhỏ; Top 1 là thẻ "quán quân" riêng — vương miện bay, bìa lớn phát sáng, viền cyan, tia sáng quét ngang lặp vô hạn
- Trang chi tiết truyện theo wireframe: 3 cột SÁT ảnh bìa (Tác giả+Thể loại | Bìa 3D+Tên truyện+Đọc từ đầu | Bảng xếp hạng+Lượt xem+Nội dung), "Lộ trình chương mới" là ĐƯỜNG CONG S bằng SVG vẽ dần khi cuộn tới (pathLength animation, node tròn sáng), thẻ chương so le trái/phải, mục Bình luận (đăng/thích bình luận demo, sắp theo lượt mới + pill chap)
- Trang Top (/top) thiết kế lại theo wireframe: Đài Vinh Danh podium Top3-Top1-Top2 (Top1 giữa to hơn, vương miện bay, hào quang), mục Top ngày (lưới 6 thẻ + panel tab Top ngày/tuần/tháng), mục Top tháng (lưới 6 + danh sách Top tuần) — TopPage.jsx, route thay ListPage kind=top
- LinkCard dùng chung (/src/components/LinkCard.jsx): thẻ icon mũi tên phát sáng nối trang — dạng tile ở Kiệt tác/Mới cập nhật/dải Thể loại, dạng bar ngang dưới Bảng xếp hạng
- REBRAND: Logo TOONIX (chuyển từ file .ai → PNG nền trong suốt, /public/logo.png) thay logo cũ ở Navbar/Footer/trang đọc; title tab = "TOONIX — Infinite Story Universe"
- Hero trang chủ: logo TOONIX lớn phát sáng làm tâm điểm, xoay 3D theo chuột (rotateX/rotateY springs) + float nhịp nhàng; hào quang BÁM THEO NÉT CHỮ (drop-shadow đa lớp, thở nhịp 6s); tia sét CSS keyframes (.hero-bolt) đánh zigzag qua logo mỗi 4,5 giây kèm chớp sáng
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
