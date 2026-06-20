# 💻 Hướng Dẫn Cài Đặt (Dành cho Reviewer)

Nếu bạn muốn chạy thử dự án này trên môi trường local:

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Thiết lập Biến Môi Trường
Copy file `.env.example` thành `.env` và thiết lập các API keys cần thiết:
```bash
cp .env.example .env
```
*(Các biến môi trường chính bao gồm: DATABASE_URL, JWT_SECRET, CLOUDINARY Keys, GEMINI API Key)*

### 3. Khởi tạo & Phục hồi Dữ Liệu Mẫu
```bash
# Push schema mới nhất lên database
npm run db:push

# Chạy seed để tạo sẵn tài khoản Admin, dữ liệu sự kiện, bài tarot mẫu
npx tsx --env-file=.env scripts/seed.ts
```

### 4. Khởi động Ứng Dụng
```bash
npm run dev
```
Truy cập `http://localhost:5173` để trải nghiệm dự án.

> **Tài khoản Admin (Dữ liệu Seed):** `admin@thedatelab.vn` / `admin123`
