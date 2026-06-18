// Test script: Neon DB + Cloudinary + seed initial data
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { v2 as cloudinary } from 'cloudinary';
import * as schema from '../src/db/schema.js';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

// ─── Test Cloudinary ────────────────────────────────────────────────────────
async function testCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connected:', result.status);
  } catch (err) {
    console.error('❌ Cloudinary error:', err);
  }
}

// ─── Seed admin user ────────────────────────────────────────────────────────
async function seedAdmin() {
  try {
    const existing = await db.select().from(schema.users).limit(1);
    if (existing.length > 0) {
      console.log('ℹ️  Database already has data, skipping seed.');
      return;
    }

    // Admin account
    const adminHash = await bcrypt.hash('admin123', 12);
    const [admin] = await db.insert(schema.users).values({
      email: 'admin@thedatelab.vn',
      passwordHash: adminHash,
      name: 'TDL Admin',
      role: 'admin',
      phone: '0912345678',
    }).returning();
    console.log('✅ Admin created:', admin.email);

    // Test user
    const userHash = await bcrypt.hash('user123', 12);
    const [user] = await db.insert(schema.users).values({
      email: 'user@thedatelab.vn',
      passwordHash: userHash,
      name: 'Nguyễn Test',
      role: 'user',
    }).returning();
    console.log('✅ Test user created:', user.email);

    // Sample events
    const events = await db.insert(schema.events).values([
      {
        title: 'Workshop Làm Gốm Pastel',
        type: 'Gốm',
        date: '20/07/2026',
        time: '14:00 - 17:00',
        location: 'TDL Studio – Hòa Lạc',
        locationType: 'Fixed',
        price: 350000,
        maxAttendees: 12,
        attendees: 5,
        imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800',
        status: 'Available',
        forWho: ['Solo', 'Couple'],
        description: 'Trải nghiệm nặn gốm với màu sắc pastel dịu dàng. Mang về một tác phẩm handmade độc đáo do chính bạn tạo ra.',
        schedule: [
          { duration: '30 phút', activity: 'Giới thiệu kỹ thuật nặn gốm cơ bản' },
          { duration: '90 phút', activity: 'Tự do sáng tạo với đất sét' },
          { duration: '30 phút', activity: 'Tô màu & hoàn thiện tác phẩm' },
          { duration: '30 phút', activity: 'Chụp ảnh kỷ niệm & wrap up' },
        ],
      },
      {
        title: 'Chế Tác Nước Hoa Cá Nhân',
        type: 'Nước hoa',
        date: '27/07/2026',
        time: '15:00 - 17:30',
        location: 'TDL Popup – Hồ Tây',
        locationType: 'Pop-up',
        price: 420000,
        maxAttendees: 10,
        attendees: 8,
        imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&q=80&w=800',
        status: 'Almost Sold Out',
        forWho: ['Couple', 'Solo'],
        description: 'Tự tay pha chế một chai nước hoa mang đậm cá tính riêng của bạn. Được hướng dẫn bởi chuyên gia nước hoa.',
        schedule: [
          { duration: '30 phút', activity: 'Khám phá bảng hương liệu' },
          { duration: '60 phút', activity: 'Pha chế nước hoa cá nhân' },
          { duration: '30 phút', activity: 'Đóng chai & đặt tên tác phẩm' },
        ],
      },
      {
        title: 'Workshop Làm Nến Thơm',
        type: 'Nến',
        date: '05/08/2026',
        time: '10:00 - 12:30',
        location: 'TDL Studio – Hòa Lạc',
        locationType: 'Fixed',
        price: 280000,
        maxAttendees: 15,
        attendees: 3,
        imageUrl: 'https://images.unsplash.com/photo-1602607965793-d1e8b7bb614e?auto=format&fit=crop&q=80&w=800',
        status: 'Available',
        forWho: ['Solo', 'Couple', 'Group'],
        description: 'Tạo nên những cây nến thơm đẹp mắt và thư giãn. Chọn hương thơm, màu sắc và container yêu thích.',
        schedule: [
          { duration: '20 phút', activity: 'Giới thiệu về nến & hương liệu' },
          { duration: '70 phút', activity: 'Thực hành làm nến' },
          { duration: '30 phút', activity: 'Đổ nến & trang trí' },
        ],
      },
      {
        title: 'Baking Bánh Bento',
        type: 'Baking',
        date: '12/08/2026',
        time: '09:00 - 12:00',
        location: 'TDL Kitchen – Cầu Giấy',
        locationType: 'Pop-up',
        price: 380000,
        maxAttendees: 8,
        attendees: 8,
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800',
        status: 'Sold Out',
        forWho: ['Couple', 'Group'],
        description: 'Học cách làm bánh bento Hàn Quốc siêu cute. Mang về những chiếc bánh ngon để làm quà cho người thân.',
        schedule: [
          { duration: '30 phút', activity: 'Chuẩn bị nguyên liệu' },
          { duration: '90 phút', activity: 'Làm bánh & trang trí' },
          { duration: '30 phút', activity: 'Thưởng thức & chụp ảnh' },
        ],
      },
    ]).returning();
    console.log(`✅ ${events.length} events created`);

    // Sample bank account
    const [bank] = await db.insert(schema.bankAccounts).values({
      bankName: 'MB Bank',
      bankCode: 'MB',
      accountNumber: '0123456789',
      accountName: 'THE DATE LAB',
      isActive: true,
    }).returning();
    console.log('✅ Bank account created:', bank.bankCode, bank.accountNumber);

    // Sample tarot cards (6 default cards)
    const tarotData = [
      { name: 'The Star', nameVi: 'Ngôi Sao', symbol: '✦', colorClass: 'from-[#243d91] to-[#4ecef5]', messageVi: 'Hôm nay là ngày của hy vọng và sáng tạo. Ánh sao dẫn đường cho đôi tay tài hoa của bạn.', messageEn: 'Today is a day of hope and creativity. The starlight guides your talented hands.', vibeVi: 'Lãng mạn & Sáng tạo', vibeEn: 'Romantic & Creative', eventSuggestionVi: 'Workshop Làm Nến Thơm', eventSuggestionEn: 'Scented Candle Workshop', eventDescVi: 'Ánh nến như ánh sao — tự tay tạo ra ánh sáng cho không gian của bạn.', eventDescEn: 'Candlelight like starlight — craft your own glow.', eventId: events[2].id },
      { name: 'The Moon', nameVi: 'Mặt Trăng', symbol: '◐', colorClass: 'from-purple-900 to-[#243d91]', messageVi: 'Đêm nay huyền bí và đầy cảm xúc. Hãy để trực giác dẫn dắt và khám phá thế giới hương thơm.', messageEn: 'Tonight is mysterious and full of emotion. Let your intuition guide you.', vibeVi: 'Huyền bí & Chill', vibeEn: 'Mysterious & Chill', eventSuggestionVi: 'Chế Tác Nước Hoa Cá Nhân', eventSuggestionEn: 'Personal Perfume Crafting', eventDescVi: 'Tìm mùi hương đại diện cho bạn trong đêm tối đầy cảm xúc này.', eventDescEn: 'Find the scent that represents you.', eventId: events[1].id },
      { name: 'The Sun', nameVi: 'Mặt Trời', symbol: '☀', colorClass: 'from-amber-400 to-[#e8539e]', messageVi: 'Năng lượng tích cực tràn đầy! Đây là ngày tuyệt vời để tạo ra điều gì đó rực rỡ.', messageEn: 'Pure positive energy! A wonderful day to create something bright.', vibeVi: 'Sôi động & Vui vẻ', vibeEn: 'Vibrant & Joyful', eventSuggestionVi: 'Baking Bánh Bento', eventSuggestionEn: 'Bento Cake Baking', eventDescVi: 'Chiếc bánh ngọt ngào — như năng lượng mặt trời bạn mang đến!', eventDescEn: 'A sweet little cake — just like the sunny energy you bring!', eventId: events[3].id },
      { name: 'The World', nameVi: 'Thế Giới', symbol: '◎', colorClass: 'from-[#4ecef5] to-emerald-500', messageVi: 'Bạn đang ở đỉnh cao. Hãy tạo ra tác phẩm thể hiện toàn bộ bản thân.', messageEn: 'You are at your peak. Create something that expresses your whole self.', vibeVi: 'Tự tin & Chữa lành', vibeEn: 'Confident & Healing', eventSuggestionVi: 'Workshop Làm Gốm Pastel', eventSuggestionEn: 'Pastel Pottery Workshop', eventDescVi: 'Tự tay nặn ra tác phẩm mang dấu ấn riêng — bạn là nghệ sĩ!', eventDescEn: 'Hand-shape a piece uniquely yours — you are the artist!', eventId: events[0].id },
      { name: 'The Lovers', nameVi: 'Tình Nhân', symbol: '♡', colorClass: 'from-[#e8539e] to-rose-600', messageVi: 'Kết nối và tình yêu đang tỏa sáng. Chia sẻ kỷ niệm cùng người thân.', messageEn: 'Love and connection are shining. Share memories with someone special.', vibeVi: 'Lãng mạn & Kết nối', vibeEn: 'Romantic & Connected', eventSuggestionVi: 'Chế Tác Nước Hoa Cá Nhân', eventSuggestionEn: 'Personal Perfume Crafting', eventDescVi: 'Cùng người thương tạo ra mùi hương chung — kỷ niệm gắn kết hai trái tim.', eventDescEn: 'Create a shared scent — a memory that bonds two hearts.', eventId: events[1].id },
      { name: 'The Hermit', nameVi: 'Ẩn Sĩ', symbol: '◇', colorClass: 'from-slate-700 to-[#243d91]', messageVi: 'Sự tĩnh lặng mang lại sự sáng suốt. Dành thời gian cho bản thân và những khoảnh khắc chữa lành.', messageEn: 'Stillness brings clarity. Take time for yourself and quiet healing.', vibeVi: 'Tĩnh lặng & Chữa lành', vibeEn: 'Calm & Healing', eventSuggestionVi: 'Workshop Làm Gốm Pastel', eventSuggestionEn: 'Pastel Pottery Workshop', eventDescVi: 'Một mình với đất sét — liệu pháp chữa lành tuyệt vời.', eventDescEn: 'Alone with clay — a wonderful healing therapy.', eventId: events[0].id },
    ];
    const tarotCards = await db.insert(schema.tarotCards).values(tarotData).returning();
    console.log(`✅ ${tarotCards.length} tarot cards created`);

    // Sample add-ons
    await db.insert(schema.addons).values([
      { name: 'Ảnh Instax lấy liền', nameEn: 'Instant Instax Photo', price: 50000 },
      { name: 'Móc khoá TDL', nameEn: 'TDL Keychain', price: 85000 },
    ]);
    console.log('✅ Add-ons created');

    console.log('\n🎉 Seed completed! Login credentials:');
    console.log('   Admin: admin@thedatelab.vn / admin123');
    console.log('   User:  user@thedatelab.vn / user123');

  } catch (err) {
    console.error('❌ Seed error:', err);
  }
}

async function main() {
  console.log('🔌 Testing connections...\n');
  await testCloudinary();
  await seedAdmin();
  process.exit(0);
}

main();
