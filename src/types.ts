export interface Event {
  id: number;
  title: string;
  type: string; // Theme e.g., Candle, Perfume, Baking
  date: string;
  time: string;
  location: string;
  locationType: 'Fixed' | 'Pop-up';
  price: number;
  attendees: number;
  maxAttendees: number;
  image: string;
  vibe: string;
  status: 'Available' | 'Almost Sold Out' | 'Sold Out';
  forWho: string[]; // Solo, Couple, Group
  schedule: { duration: string; activity: string }[];
  description: string;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export interface Ticket {
  id: string;
  eventId: number;
  eventName: string;
  date: string;
  time: string;
  location: string;
  qrCode: string;
  status: 'Upcoming' | 'Past';
  quantity: number;
  addons: Addon[];
  totalPrice: number;
}

export interface VaultMemory {
  id: string;
  eventId: number;
  eventName: string;
  date: string;
  images: string[];
}

export interface User {
  id: string;
  name: string;
  dob: string;
  email: string;
  phone: string;
  bio: string;
  preferences: string[];
  notifications: {
    email: boolean;
    sms: boolean;
  };
}

export interface QuizResult {
  personalityType: string;
  currentMood: string;
  eventTypes: string[];
}

export interface TarotResult {
  mood: string;
  advice: string;
  eventType: string;
}

export interface WeatherResult {
  insideOrOutside: string;
  outfitAdvice: string;
  vibe: string;
}

export interface DresscodeResult {
  style: string;
  outfitSuggestion: string;
}
