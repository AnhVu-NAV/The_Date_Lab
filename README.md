# 🚀 The Date Lab

Web application cho dịch vụ workshop dating & art therapy tại Hà Nội. Hỗ trợ đa ngôn ngữ (VI/EN), tìm kiếm vibe, đặt vé, lưu trữ kỷ niệm và bốc bài Tarot gợi ý sự kiện.

## 🛠 Tech Stack
- **Frontend:** React (Vite), Tailwind CSS v4, Motion (Framer), Lucide Icons
- **Backend:** Node.js, Vercel Serverless Functions (`/api/*`)
- **Database:** Neon PostgreSQL + Drizzle ORM
- **Upload:** Cloudinary
- **Payment:** VietQR API

---

## 💻 Cài đặt & Chạy Local

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Thiết lập Biến Môi Trường
Copy file `.env.example` thành `.env` và điền thông tin:
```bash
cp .env.example .env
```
- `DATABASE_URL`: Connection string từ Neon.tech
- `JWT_SECRET`: Random chuỗi tối thiểu 32 ký tự
- `CLOUDINARY_*`: Keys từ tài khoản Cloudinary

### 3. Khởi tạo Database
Push schema lên Neon:
```bash
npm run db:push
```
*(Tùy chọn) Chạy script seed dữ liệu mẫu (sẽ tự động tạo admin, user test, 4 events, tài khoản ngân hàng và 6 lá bài tarot):*
```bash
npx tsx --env-file=.env scripts/seed.ts
```

### 4. Chạy Server
Dự án sử dụng plugin Vercel để chạy cả React dev server và API functions trên cùng một port.
```bash
npm run dev
```
Mở trình duyệt tại: `http://localhost:5173`

---

## 🔑 Tài khoản Test (nếu đã chạy seed)
- **Admin:** `admin@thedatelab.vn` / `admin123`
- **User:** `user@thedatelab.vn` / `user123`

*(Tài khoản admin có quyền thêm/sửa/xóa sự kiện, lá bài tarot, xem doanh thu, thiết lập tài khoản ngân hàng nhận tiền và xác nhận đã thanh toán vé).*

---

## 🚀 Deploy lên Vercel

1. Push code lên GitHub.
2. Import project vào **Vercel Dashboard**.
3. Tại bước cấu hình, đảm bảo:
   - Framework Preset: **Vite**
   - **Environment Variables:** Thêm tất cả các biến từ file `.env` (không cần `VITE_API_BASE_URL`).
4. Click **Deploy**.

Sau khi deploy thành công, đăng nhập bằng tài khoản admin:
- Vào **Dashboard** > **Ngân hàng**.
- Thêm hoặc chọn một tài khoản ngân hàng và nhấn **Đặt Active**.
- QR thanh toán sẽ tự động sinh dựa trên tài khoản đang Active này.

---

## 📜 Các lệnh hữu ích
- `npm run dev`: Chạy dev server (Vite + Vercel Functions).
- `npm run build`: Build bản production cho frontend.
- `npm run db:push`: Đẩy schema lên database.
- `npm run db:studio`: Mở UI quản lý database của Drizzle.
