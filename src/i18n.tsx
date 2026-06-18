import React, { createContext, useContext, useState } from 'react';

export type Language = 'vi' | 'en';

export const translations = {
  vi: {
    appTitle: 'The Date Lab',
    navEvents: 'Sự kiện',
    navFindVibe: 'Quiz & Vibe',
    navTarot: 'Tarot Hàng Ngày',
    navDashboard: 'Tài khoản của tôi',
    navVault: 'Kho Kỷ Niệm',
    login: 'Đăng Nhập',
    signup: 'Đăng Ký',
    bannerTitle1: 'Tìm vibe của bạn.',
    bannerTitle2: 'Tham gia đúng sự kiện.',
    bannerDesc: 'Khám phá các buổi workshop, concert, và các buổi gặp mặt phù hợp với tính cách, tâm trạng và thời tiết của bạn.',
    btnFindEvents: 'Bắt Đầu Quiz',
    btnDrawTarot: 'Bốc Bài Tarot',
    btnWeather: 'Hỏi AI tư vấn thời tiết & trang phục hôm nay',
    btnChecking: 'Đang kiểm tra vibe...',
    recommended: 'Gợi ý cho bạn',
    searchPlaceholder: 'Tìm kiếm sự kiện...',
    going: 'người tham gia',
    getTickets: 'Đặt Vé',
    cancel: 'Hủy',
    vibeCheck: 'Vibe Thời Tiết',
    outfitAdvice: 'Gợi ý Trang Phục',
    tarotAdvice: 'Lời khuyên Tarot',
    expectMood: 'Bạn sẽ có tâm trạng',
    tarotSuggestion: 'Gợi ý:',
    yourVibe: 'Vibe của bạn:',
    quizMood: 'Tâm trạng:',
    greatFor: 'Phù hợp với:',
    aiDresscode: 'AI Gợi ý Trang Phục',
    
    // Feature 1: Filters
    filterRelationship: 'Đi cùng ai?',
    filterTopic: 'Chủ đề',
    topicCandle: 'Nến thơm',
    topicPerfume: 'Nước hoa',
    topicBeads: 'Xỏ hạt',
    topicBaking: 'Làm bánh',
    btnSave: 'Lưu lại',
    btnInterested: 'Quan tâm',
    statusAvailable: 'Còn vé',
    statusAlmostSoldOut: 'Sắp hết',
    statusSoldOut: 'Sold out',

    // Feature 2: Event Details
    schedule: 'Lịch trình trải nghiệm',
    customization: 'Tùy chọn đặt vé',
    numPeople: 'Số người tham gia',
    comboSuggest: 'Gợi ý: Chọn combo 2 người để tiết kiệm 10%',
    addons: 'Dịch vụ thêm (Cross-sell)',
    addonInstax: 'Chụp ảnh Instax lấy ngay',
    addonKeychain: 'Móc khóa The Date Lab',
    
    // Feature 3: Dashboard
    dashboardTitle: 'Quản lý Tài Khoản',
    profile: 'Hồ sơ cá nhân',
    myTickets: 'Ví vé điện tử',
    upcomingTickets: 'Sắp tham gia',
    pastTickets: 'Đã tham gia',
    bio: 'Giới thiệu ngắn (Bio)',
    preferences: 'Sở thích cá nhân',
    notifications: 'Thông báo',
    notifyEmail: 'Nhận thông báo qua Email',
    notifySMS: 'Nhận thông báo qua SMS',
    daysLeft: 'ngày nữa',
    hoursLeft: 'giờ nữa',
    viewMap: 'Xem Bản đồ',
    
    // Feature 4: Memory Vault
    vaultTitle: 'Kho Kỷ Niệm (Memory Vault)',
    vaultDesc: 'Nơi lưu giữ những khoảnh khắc đẹp nhất của bạn tại The Date Lab. Hình ảnh chất lượng cao được cập nhật sau mỗi workshop.',
    downloadAll: 'Tải xuống tất cả',
    
    // Feature 5: Quiz
    quizWho: 'Hôm nay bạn muốn đi cùng ai?',
    quizWhoPartner: 'Người yêu',
    quizWhoFriends: 'Hội bạn thân',
    quizWhoSolo: 'Đi một mình',
    quizFeeling: 'Bạn đang tìm kiếm cảm giác gì?',
    quizFeelingRomantic: 'Lãng mạn, yên tĩnh',
    quizFeelingLively: 'Sôi động, phá băng',
    quizFeelingHealing: 'Chữa lành, chill',
    findingMatches: 'Đang tìm workshop phù hợp nhất...',
    
    // Quiz (Legacy)
    findingVibe: 'Đang tìm vibe của bạn...',
    analyzingInfo: 'Phân tích câu trả lời...',
    q1: 'Bạn thích nơi đông đúc hay yên tĩnh?',
    q1o1: 'Đông đúc & Ồn ào', q1o2: 'Yên tĩnh & Chill',
    q2: 'Trong nhà hay Ngoài trời?',
    q2o1: 'Trong nhà', q2o2: 'Ngoài trời',
    q3: 'Mục tiêu hôm nay là gì?',
    q3o1: 'Gặp gỡ bạn mới', q3o2: 'Thư giãn cùng bạn bè', q3o3: 'Học hỏi điều mới',
    q4: 'Cung hoàng đạo của bạn là gì?',
    q4o1: 'Cung Lửa', q4o2: 'Cung Đất', q4o3: 'Cung Khí', q4o4: 'Cung Nước',
    
    // Tarot
    readingStars: 'Đang đọc các vì sao...',
    dailyTarot: 'Tarot Sự Kiện',
    drawCardDesc: 'Bốc một lá bài để xem hôm nay bạn mang năng lượng gì nhé!',
    drawBtn: 'BỐC BÀI',
    pickACard: 'Chọn Một Lá Bài',
    cardRevealed: 'Lá Bài Của Bạn',
    gettingMessage: 'Đang giải mã thông điệp...',
    seeEvents: 'Xem Sự Kiện Phù Hợp',
    
    // Ticket
    checkout: 'Thanh Toán',
    fullName: 'Họ và tên',
    email: 'Email',
    cardNumber: 'Số thẻ (Mock)',
    payNow: 'Thanh toán ngay',
    ticketSecured: 'Đã Giữ Vé!',
    ticketSent: 'Vé điện tử đã được gửi vào email của bạn.',
    
    // Chatbot
    botGreeting: 'Chào bạn! Cần trợ giúp chọn sự kiện hay trang phục không?',
    vibeAssistant: 'Trợ lý The Date Lab',
    chatPlaceholder: 'Hỏi về workshop, cách đặt vé...',
    botError: 'Có lỗi xảy ra. Hãy thử lại!',
  },
  en: {
    appTitle: 'The Date Lab',
    navEvents: 'Events',
    navFindVibe: 'Quiz & Vibe',
    navTarot: 'Daily Tarot',
    navDashboard: 'My Account',
    navVault: 'Memory Vault',
    login: 'Log In',
    signup: 'Sign Up',
    bannerTitle1: 'Find your vibe.',
    bannerTitle2: 'Join the right event.',
    bannerDesc: 'Discover workshops, concerts, and social gatherings perfectly matched to your personality, mood, and even the weather.',
    btnFindEvents: 'Start Quiz',
    btnDrawTarot: 'Draw a Tarot Card',
    btnWeather: 'Ask AI for weather & outfit advice today',
    btnChecking: 'Checking the vibes...',
    recommended: 'Recommended for you',
    searchPlaceholder: 'Search events...',
    going: 'going',
    getTickets: 'Book Tickets',
    cancel: 'Cancel',
    vibeCheck: 'Weather Vibe Check',
    outfitAdvice: 'Outfit Advice',
    tarotAdvice: 'Tarot Advice',
    expectMood: 'Expect a',
    tarotSuggestion: 'Suggestion:',
    yourVibe: 'Your Vibe:',
    quizMood: 'Mood:',
    greatFor: 'Great for:',
    aiDresscode: 'AI Dresscode Suggestion',
    
    // Feature 1: Filters
    filterRelationship: 'Who with?',
    filterTopic: 'Topic',
    topicCandle: 'Candles',
    topicPerfume: 'Perfume',
    topicBeads: 'Beads',
    topicBaking: 'Baking',
    btnSave: 'Save',
    btnInterested: 'Interested',
    statusAvailable: 'Available',
    statusAlmostSoldOut: 'Almost Sold Out',
    statusSoldOut: 'Sold Out',

    // Feature 2: Event Details
    schedule: 'Experience Schedule',
    customization: 'Booking Options',
    numPeople: 'Attendees',
    comboSuggest: 'Tip: 2-person combo saves 10%',
    addons: 'Add-ons (Cross-sell)',
    addonInstax: 'Instax Instant Photo',
    addonKeychain: 'TDL Keychain',
    
    // Feature 3: Dashboard
    dashboardTitle: 'Account Management',
    profile: 'Profile',
    myTickets: 'My e-Tickets',
    upcomingTickets: 'Upcoming',
    pastTickets: 'Past',
    bio: 'Short Bio',
    preferences: 'Preferences',
    notifications: 'Notifications',
    notifyEmail: 'Email alerts',
    notifySMS: 'SMS alerts',
    daysLeft: 'days left',
    hoursLeft: 'hours left',
    viewMap: 'View Map',
    
    // Feature 4: Memory Vault
    vaultTitle: 'Memory Vault',
    vaultDesc: 'Your beautiful moments at The Date Lab. High-quality photos are unlocked here after every workshop.',
    downloadAll: 'Download All',
    
    // Feature 5: Quiz
    quizWho: 'Who are you going with today?',
    quizWhoPartner: 'My Partner',
    quizWhoFriends: 'Close Friends',
    quizWhoSolo: 'Going Solo',
    quizFeeling: 'What feeling are you looking for?',
    quizFeelingRomantic: 'Romantic, quiet',
    quizFeelingLively: 'Lively, ice breaking',
    quizFeelingHealing: 'Healing, chill',
    findingMatches: 'Finding the perfect workshops...',
    
    // Quiz
    findingVibe: 'Finding your vibe...',
    analyzingInfo: 'Our AI is analyzing your answers',
    q1: 'Do you prefer crowded places or quiet spots?',
    q1o1: 'Crowded & Loud', q1o2: 'Quiet & Chill',
    q2: 'Indoors or Outdoors?',
    q2o1: 'Indoors', q2o2: 'Outdoors',
    q3: 'What\'s the goal today?',
    q3o1: 'Meet new people', q3o2: 'Relax with friends', q3o3: 'Learn something new',
    q4: 'What\'s your Zodiac sign?',
    q4o1: 'Fire sign', q4o2: 'Earth sign', q4o3: 'Air sign', q4o4: 'Water sign',

    // Tarot
    readingStars: 'Reading the stars...',
    dailyTarot: 'Daily Event Tarot',
    drawCardDesc: 'Draw a card to see what energy to bring to your next event!',
    drawBtn: 'DRAW',
    pickACard: 'Pick a Card',
    cardRevealed: 'Your Card',
    gettingMessage: 'Interpreting message...',
    seeEvents: 'See Suggested Events',
    
    // Ticket
    checkout: 'Checkout',
    fullName: 'Full Name',
    email: 'Email',
    cardNumber: 'Card Number (Mock)',
    payNow: 'Pay Now',
    ticketSecured: 'Ticket Secured!',
    ticketSent: 'Your e-ticket has been sent to your email.',

    // Chatbot
    botGreeting: 'Hey there! Need help picking an event or figuring out what to wear?',
    vibeAssistant: 'TDL Assistant',
    chatPlaceholder: 'Ask about workshops...',
    botError: 'Oops! My wires got crossed. Try asking again!',
  }
};

interface LanguageContextType {
  lng: Language;
  setLng: (lng: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lng, setLng] = useState<Language>('vi'); // Default to Vietnamese

  const t = (key: keyof typeof translations.en) => {
    return translations[lng][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lng, setLng, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
