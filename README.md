# 🎨 The Date Lab — Platform Workshop & Hẹn Hò Sáng Tạo

> *Khơi nguồn cảm hứng, lưu giữ kỷ niệm. Nơi mỗi buổi hẹn đều trở thành tác phẩm.*

---

## 📖 Giới thiệu

**The Date Lab (TDL)** là nền tảng web dành cho các workshop thủ công và sự kiện sáng tạo tại Hà Nội. Ứng dụng giúp người dùng khám phá, đặt vé và lưu giữ kỷ niệm từ các buổi hẹn tại studio TDL.

### Điểm nổi bật
- 🧭 **Khám phá sự kiện** — Feed workshop theo dạng thẻ có lọc thông minh
- ✨ **Quiz cá nhân hoá** — 3 câu hỏi, gợi ý workshop phù hợp nhất
- ✦ **Khám phá Tarot** — Lật bài ngẫu nhiên, nhận thông điệp và gợi ý sự kiện
- 🎫 **Đặt vé & QR Code** — Quản lý vé trực tiếp trong tài khoản
- 🗝️ **Kho kỷ niệm** — Lưu ảnh workshop theo từng sự kiện (private vault)
- 🛠️ **Admin Dashboard** — Quản lý sự kiện, người dùng, doanh thu, upload ảnh
- 🤖 **Trợ lý Chatbot** — Mascot TDL hỗ trợ tư vấn 24/7

---

## 🖥️ Công nghệ sử dụng

| Layer | Công nghệ |
|---|---|
| Frontend Framework | React 18 + TypeScript |
| Styling | TailwindCSS v4 |
| Routing | React Router DOM v6 |
| Animations | Motion (Framer Motion) |
| Icons | Lucide React |
| Build Tool | Vite |
| Backend (mock) | Express + tsx |
| AI (optional) | Google Gemini API |

---

## 🚀 Cài đặt & Chạy

### Yêu cầu
- Node.js >= 18
- npm >= 9

### Các bước

```bash
# 1. Clone repo
git clone https://github.com/your-org/the-date-lab.git
cd the-date-lab

# 2. Cài dependencies
npm install

# 3. Cấu hình biến môi trường (tuỳ chọn — cho Gemini chatbot)
cp .env.example .env
# Điền GEMINI_API_KEY vào .env

# 4. Chạy dev server
npm run dev
```

Ứng dụng sẽ chạy tại: **http://localhost:3000**

---

## 📁 Cấu trúc dự án

```
the-date-lab/
├── src/
│   ├── assets/
│   │   ├── Logo/          # Logo TDL
│   │   └── MASCOT/        # Nhân vật mascot (nam/nữ)
│   ├── components/
│   │   ├── Layout.tsx     # Navbar + Footer + Chatbot wrapper
│   │   ├── Chatbot.tsx    # Floating chatbot với mascot
│   │   └── TarotModal.tsx # Popup Tarot lật bài ngẫu nhiên
│   ├── views/
│   │   ├── HomeView.tsx        # Trang chủ — feed sự kiện
│   │   ├── QuizView.tsx        # Quiz 3 bước cá nhân hoá
│   │   ├── EventDetailView.tsx # Trang chi tiết sự kiện + đặt vé
│   │   ├── DashboardView.tsx   # Tài khoản người dùng / Admin panel
│   │   ├── VaultView.tsx       # Kho kỷ niệm
│   │   └── AuthView.tsx        # Đăng nhập / Đăng ký
│   ├── data.ts       # Mock data sự kiện
│   ├── types.ts      # TypeScript interfaces
│   ├── App.tsx       # Routing chính
│   ├── main.tsx      # Entry point
│   └── index.css     # TailwindCSS v4 theme + global styles
├── server.ts         # Express backend (API + Vite proxy)
├── vite.config.ts
└── package.json
```

---

## 🎨 Hệ thống màu sắc

| Token | Hex | Dùng cho |
|---|---|---|
| **Pink** | `#e8539e` | Accent chính, CTA buttons |
| **Cyan** | `#4ecef5` | Accent phụ, highlights |
| **Navy** | `#243d91` | Text, backgrounds |
| **Beige** | `#f0ede6` | Nền trang chính |

---

## 👥 Tài khoản demo

| Role | Email | Mật khẩu |
|---|---|---|
| **Admin** | `admin@thedatelab.com` | bất kỳ |
| **User** | bất kỳ email nào | bất kỳ |

---

## 📋 Tính năng theo roadmap

### ✅ Phase 1 — MVP (Hoàn thành)
- [x] Trang chủ feed sự kiện với bộ lọc
- [x] Quiz cá nhân hoá 3 bước
- [x] Tarot popup lật bài + gợi ý sự kiện
- [x] Trang chi tiết sự kiện + booking flow
- [x] Dashboard người dùng (vé, hồ sơ, thông báo)
- [x] Admin dashboard (sự kiện, người dùng, doanh thu, upload ảnh)
- [x] Kho kỷ niệm riêng tư
- [x] Chatbot mascot TDL
- [x] Thiết kế responsive (mobile + desktop)

### 🔜 Phase 2 — Coming Soon
- [ ] Thanh toán thực tế (VNPay / MoMo)
- [ ] Xác thực JWT thực sự
- [ ] Push notification trước sự kiện
- [ ] Tích hợp Gemini AI chatbot đầy đủ
- [ ] Upload ảnh thực lên cloud storage
- [ ] Social sharing kỷ niệm

---

## 📄 License

MIT © 2026 The Date Lab Team

---

*Made with 💕 by The Date Lab — FPT University, Hoà Lạc, Hà Nội*
