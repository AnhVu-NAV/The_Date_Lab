import { Event } from './types';

export const getMockEvents = (lng: 'vi' | 'en'): Event[] => {
  if (lng === 'vi') {
    return [
      {
        id: 1, title: "Workshop Làm Gốm Pastel", type: "Thủ công", date: "15/07/2026", time: "14:00 - 16:30",
        location: "The Date Lab Studio, Q.1", locationType: "Fixed", price: 490000, attendees: 12, maxAttendees: 15,
        image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600&h=400", vibe: "Sáng Tạo", 
        status: "Available", forWho: ["Couple", "Solo"],
        schedule: [
          { duration: "15p", activity: "Chơi mini-game phá băng" },
          { duration: "90p", activity: "Trải nghiệm tự tay làm gốm" },
          { duration: "30p", activity: "Thưởng thức trà bánh & chụp ảnh" },
        ],
        description: "Trải nghiệm cuối tuần chữa lành với đất sét và màu pastel. Tự tay thiết kế chiếc cốc mang dấu ấn riêng của bạn! Hoàn hảo cho cạ cứng hoặc một buổi hẹn hò lãng mạn."
      },
      {
        id: 2, title: "Chế Tác Nước Hoa Cá Nhân", type: "Nước hoa", date: "16/07/2026", time: "18:00 - 20:30",
        location: "Trạm Pop-up Quận 2", locationType: "Pop-up", price: 650000, attendees: 18, maxAttendees: 20,
        image: "https://images.unsplash.com/photo-1595166440263-d3ab1a5ad569?auto=format&fit=crop&q=80&w=600&h=400", vibe: "Lãng Mạn",
        status: "Almost Sold Out", forWho: ["Couple", "Group"],
        schedule: [
          { duration: "20p", activity: "Kiểm tra khứu giác & chọn base" },
          { duration: "100p", activity: "Chế tác và pha điều hương" },
          { duration: "30p", activity: "Gói quà và check-in không gian vòm" }
        ],
        description: "Tìm kiếm mùi hương đại diện cho tình yêu của hai bạn? Lưu giữ khoảnh khắc với workshop nước hoa cao cấp từ The Date Lab."
      },
      {
        id: 3, title: "Đổ Nến Thơm Nghệ Thuật", type: "Nến", date: "18/07/2026", time: "09:00 - 11:30",
        location: "The Date Lab Studio, Q.3", locationType: "Fixed", price: 350000, attendees: 20, maxAttendees: 20,
        image: "https://images.unsplash.com/photo-1602928308479-79f94f99589d?auto=format&fit=crop&q=80&w=600&h=400", vibe: "Chữa Lành",
        status: "Sold Out", forWho: ["Solo", "Group"],
        schedule: [
          { duration: "15p", activity: "Tìm hiểu các loại sáp và bấc" },
          { duration: "90p", activity: "Pha màu, chọn tầng hương & đổ nến" },
          { duration: "45p", activity: "Trang trí với hoa khô & đợi nến đông" }
        ],
        description: "Thắp sáng tâm hồn bằng những hũ nến thơm do tự tay bạn design."
      },
      {
        id: 4, title: "Baking: Bánh Kem Bento", type: "Nấu ăn", date: "20/07/2026", time: "10:00 - 12:30",
        location: "Kitchen Studio Q.1", locationType: "Fixed", price: 400000, attendees: 8, maxAttendees: 12,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600&h=400", vibe: "Sôi Động",
        status: "Available", forWho: ["Group", "Couple"],
        schedule: [
          { duration: "30p", activity: "Hướng dẫn chà láng & nướng bento" },
          { duration: "90p", activity: "Trang trí tự do theo concept" },
          { duration: "30p", activity: "Đóng hộp và thưởng thức trà" }
        ],
        description: "Học cách tạo ra chiếc bánh bento độc nhất vô nhị. Vui vẻ, dễ dàng ngay cả khi bạn chưa từng vào bếp!"
      }
    ];
  }
  return [
    {
      id: 1, title: "Pastel Pottery Workshop", type: "Craft", date: "Jul 15, 2026", time: "02:00 PM - 04:30 PM",
      location: "The Date Lab Studio, Dist 1", locationType: "Fixed", price: 20, attendees: 12, maxAttendees: 15,
      image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600&h=400", vibe: "Creative",
      status: "Available", forWho: ["Couple", "Solo"],
      schedule: [
        { duration: "15m", activity: "Ice-breaking mini game" },
        { duration: "90m", activity: "Hands-on pottery making" },
        { duration: "30m", activity: "Tea break & Photo session" }
      ],
      description: "A healing weekend with clay and pastel colors. Design your own signature mug! Perfect for besties or a romantic date."
    },
    {
      id: 2, title: "Signature Perfume Crafting", type: "Perfume", date: "Jul 16, 2026", time: "06:00 PM - 08:30 PM",
      location: "Pop-up Station Dist 2", locationType: "Pop-up", price: 28, attendees: 18, maxAttendees: 20,
      image: "https://images.unsplash.com/photo-1595166440263-d3ab1a5ad569?auto=format&fit=crop&q=80&w=600&h=400", vibe: "Romantic",
      status: "Almost Sold Out", forWho: ["Couple", "Group"],
      schedule: [
        { duration: "20m", activity: "Olfactory test & Base selection" },
        { duration: "100m", activity: "Crafting & blending scent" },
        { duration: "30m", activity: "Gift wrapping & Check-in" }
      ],
      description: "Looking for a scent that represents your love? Capture the moment with a premium perfume workshop from The Date Lab."
    },
    {
      id: 3, title: "Artistic Candle Pouring", type: "Candle", date: "Jul 18, 2026", time: "09:00 AM - 11:30 AM",
      location: "The Date Lab Studio, Dist 3", locationType: "Fixed", price: 15, attendees: 20, maxAttendees: 20,
      image: "https://images.unsplash.com/photo-1602928308479-79f94f99589d?auto=format&fit=crop&q=80&w=600&h=400", vibe: "Healing",
      status: "Sold Out", forWho: ["Solo", "Group"],
      schedule: [
        { duration: "15m", activity: "Learning about wax and wicks" },
        { duration: "90m", activity: "Color mixing, scenting & pouring" },
        { duration: "45m", activity: "Dried flower decor & setting" }
      ],
      description: "Light up your soul with scented candles designed entirely by you."
    },
    {
      id: 4, title: "Bento Cake Baking", type: "Cooking", date: "Jul 20, 2026", time: "10:00 AM - 12:30 PM",
      location: "Kitchen Studio Dist 1", locationType: "Fixed", price: 18, attendees: 8, maxAttendees: 12,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600&h=400", vibe: "Lively",
      status: "Available", forWho: ["Group", "Couple"],
      schedule: [
        { duration: "30m", activity: "Frosting guide & baking" },
        { duration: "90m", activity: "Freestyle decorating" },
        { duration: "30m", activity: "Boxing & Tea time" }
      ],
      description: "Learn to create a unique bento cake. Fun and easy even if you've never been in a kitchen!"
    }
  ];
};
