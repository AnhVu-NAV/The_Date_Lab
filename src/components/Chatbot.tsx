import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Send, Ticket, X } from 'lucide-react';
import MascotImg from '../assets/MASCOT/nam2-05.png';
import { useLanguage } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

interface SuggestedEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  price: number;
  status: string;
  imageUrl: string;
}

interface Msg {
  role: 'user' | 'bot';
  text: string;
  events?: SuggestedEvent[];
}

const QUICK_REPLIES_VI = [
  'Gợi ý workshop cho buổi hẹn',
  'Có sự kiện nào còn vé?',
  'Đi nhóm nên chọn gì?',
  'Dress code hôm nay?',
];

const QUICK_REPLIES_EN = [
  'Suggest a date workshop',
  'Which events have tickets?',
  'Best pick for a group?',
  'Dress code today?',
];

const MOCK_RESPONSES_VI: Record<string, string> = {
  default: 'Mình đang hơi quá tải, nhưng vẫn giúp được nè. Bạn có thể hỏi về workshop còn vé, giá vé, lịch, dress code hoặc cách đặt vé nhé.',
  'Gợi ý workshop cho buổi hẹn': 'Nếu đi hẹn hò, bạn nên chọn workshop có nhịp chậm và dễ trò chuyện như gốm, nước hoa hoặc nến. Hỏi mình “buổi tối còn vé không?” để mình lọc sát hơn nhé.',
  'Có sự kiện nào còn vé?': 'Mình chưa lấy được dữ liệu live lúc này. Bạn thử mở mục [Sự kiện](/events) hoặc hỏi lại sau vài giây nhé.',
  'Đi nhóm nên chọn gì?': 'Đi nhóm nên ưu tiên hoạt động vui, dễ chia vai như baking, thủ công hoặc workshop có mini-game. Nếu nhóm đông, chọn buổi còn nhiều chỗ để ngồi cạnh nhau.',
  'Dress code hôm nay?': 'Gợi ý nhanh: mặc đồ thoải mái, dễ vận động, ưu tiên màu trung tính/pastel. Tránh đồ trắng nếu workshop có màu, sáp, bột hoặc nguyên liệu dễ dính.',
};

const MOCK_RESPONSES_EN: Record<string, string> = {
  default: 'I am having trouble reaching the live assistant, but I can still help with workshops, prices, schedules, dress codes, and booking basics.',
  'Suggest a date workshop': 'For a date, pick something slower and conversation-friendly: pottery, perfume, candles, or baking. Ask me for a time or budget and I can narrow it down.',
  'Which events have tickets?': 'I cannot fetch live inventory right now. Try [Events](/events) or ask again in a moment.',
  'Best pick for a group?': 'For groups, choose lively workshops with easy collaboration: baking, crafts, or activities with mini-games. For larger groups, prioritize events with more seats left.',
  'Dress code today?': 'Quick tip: wear comfortable clothes, neutral or pastel colors, and shoes you can stand in. Avoid white if the workshop uses paint, wax, flour, or clay.',
};

function mapApiEvent(event: any): SuggestedEvent {
  return {
    id: String(event.id),
    title: event.title || 'The Date Lab Workshop',
    type: event.type || 'Workshop',
    date: event.date || '',
    time: event.time || '',
    location: event.location || '',
    price: Number(event.price || 0),
    status: event.status || 'Available',
    imageUrl: event.imageUrl || event.image || '',
  };
}

export default function Chatbot() {
  const { lng, t } = useLanguage();
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'bot', text: t('botGreeting') }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const renderMessageText = (text: string) => {
    const lines = text.split('\n');

    const renderInline = (line: string, lineIndex: number) => {
      const parts = line.split(/(\*\*\[.*?\]\(.*?\)\*\*|\[.*?\]\(.*?\)|\*\*.*?\*\*)/g);
      return parts.map((part, partIndex) => {
        const boldLink = part.match(/^\*\*\[(.*?)\]\((.*?)\)\*\*$/);
        if (boldLink) {
          return (
            <a
              key={`${lineIndex}-${partIndex}`}
              href={boldLink[2]}
              className="underline font-bold text-[#e8539e] hover:text-[#d43c86]"
            >
              {boldLink[1]}
            </a>
          );
        }

        const link = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (link) {
          return (
            <a
              key={`${lineIndex}-${partIndex}`}
              href={link[2]}
              className="underline font-bold text-[#e8539e] hover:text-[#d43c86]"
            >
              {link[1]}
            </a>
          );
        }

        const bold = part.match(/^\*\*(.*?)\*\*$/);
        if (bold) return <strong key={`${lineIndex}-${partIndex}`}>{bold[1]}</strong>;
        return <span key={`${lineIndex}-${partIndex}`}>{part}</span>;
      });
    };

    return lines.map((line, index) => {
      const cleaned = line.replace(/^[-*]\s+/, '• ');
      return (
        <React.Fragment key={index}>
          {renderInline(cleaned, index)}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  const formatPrice = (price: number) => {
    return lng === 'vi'
      ? `${price.toLocaleString('vi-VN')}đ`
      : `${price.toLocaleString('en-US')} VND`;
  };

  const eventUrl = (id: string) => `/event/${id}#booking`;

  const renderEventCards = (events?: SuggestedEvent[]) => {
    if (!events?.length) return null;

    return (
      <div className="mt-3 space-y-2">
        {events.map((event) => (
          <div key={event.id} className="overflow-hidden rounded-xl border border-[#ebe8dd] bg-white shadow-sm">
            {event.imageUrl && (
              <a href={eventUrl(event.id)} className="block h-24 bg-[#ebe8dd]">
                <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" />
              </a>
            )}
            <div className="p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="rounded-full bg-[#4ecef5]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#243d91]">
                  {event.type}
                </span>
                <span className="text-xs font-bold text-[#e8539e]">{formatPrice(event.price)}</span>
              </div>
              <a href={eventUrl(event.id)} className="block font-display text-sm font-bold leading-tight text-[#243d91] hover:text-[#e8539e]">
                {event.title}
              </a>
              <div className="mt-2 space-y-1 text-xs font-semibold text-[#243d91]/60">
                <p className="flex items-center gap-1.5">
                  <Calendar size={12} className="shrink-0 text-[#e8539e]" />
                  <span>{[event.date, event.time].filter(Boolean).join(', ')}</span>
                </p>
                {event.location && (
                  <p className="flex items-center gap-1.5">
                    <MapPin size={12} className="shrink-0 text-[#4ecef5]" />
                    <span>{event.location}</span>
                  </p>
                )}
              </div>
              <a
                href={eventUrl(event.id)}
                className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-[#e8539e] text-xs font-bold text-white transition-all hover:bg-[#d43c86]"
              >
                <Ticket size={14} />
                {lng === 'vi' ? 'Đặt vé' : 'Book tickets'}
              </a>
            </div>
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    setMsgs([{ role: 'bot', text: t('botGreeting') }]);
  }, [lng, t]);

  const [features, setFeatures] = useState<any>(null);
  useEffect(() => {
    api.getSettings().then(data => setFeatures(data.features || {})).catch(console.error);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const history = msgs.slice(-8);
    setMsgs((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setLoading(true);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch('/api/gemini/chatbot', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: trimmed,
          context: 'TDL event platform assistant. User is chatting from the floating website widget.',
          lng,
          history,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'API failed' }));
        throw new Error(err.error || 'API failed');
      }

      const data = await res.json();
      const reply = data.reply || (lng === 'vi'
        ? 'Mình chưa có câu trả lời phù hợp lúc này.'
        : 'I do not have a helpful answer right now.');
      setMsgs((prev) => [...prev, { role: 'bot', text: reply, events: data.suggestedEvents || [] }]);
    } catch {
      const mocks = lng === 'vi' ? MOCK_RESPONSES_VI : MOCK_RESPONSES_EN;
      const reply = mocks[trimmed] || mocks.default;
      let fallbackEvents: SuggestedEvent[] = [];

      try {
        const eventsRes = await fetch('/api/events');
        if (eventsRes.ok) {
          const events = await eventsRes.json();
          fallbackEvents = Array.isArray(events)
            ? events
              .filter((event) => event.status !== 'Sold Out')
              .slice(0, 4)
              .map(mapApiEvent)
            : [];
        }
      } catch {
        fallbackEvents = [];
      }

      setTimeout(() => setMsgs((prev) => [...prev, { role: 'bot', text: reply, events: fallbackEvents }]), 650);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 20 }}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-4 right-5 z-50 bg-transparent border-none cursor-pointer"
            style={{ filter: 'drop-shadow(0 8px 20px rgba(36,61,145,0.25))' }}
            aria-label={lng === 'vi' ? 'Mở trợ lý The Date Lab' : 'Open The Date Lab assistant'}
          >
            <img src={MascotImg} alt="Mascot" className="w-24 h-auto object-contain" />
            <div className="absolute top-2 right-1 w-4 h-4 bg-[#e8539e] rounded-full border-2 border-white shadow-sm" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl shadow-[#243d91]/20 border border-[#ebe8dd] flex flex-col overflow-hidden"
            style={{ maxHeight: '75vh' }}
          >
            <div className="bg-gradient-to-r from-[#243d91] to-[#4ecef5] p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/50">
                <img src={MascotImg} alt="Mascot" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-sm">{t('vibeAssistant')}</p>
                <p className="text-white/60 text-xs flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full inline-block ${features?.chatbot === false ? 'bg-amber-400' : 'bg-green-400'}`} />
                  {features?.chatbot === false ? (lng === 'vi' ? 'Đang nâng cấp' : 'Upgrading') : (lng === 'vi' ? 'Đang hoạt động' : 'Online')}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="ml-auto w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                aria-label={lng === 'vi' ? 'Đóng chatbot' : 'Close chatbot'}
              >
                <X size={16} />
              </button>
            </div>

            {features?.chatbot === false ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#ebe8dd]/20">
                <div className="w-16 h-16 bg-[#e8539e]/10 rounded-full flex items-center justify-center mb-4">
                  <img src={MascotImg} alt="Mascot" className="w-12 h-auto opacity-50 grayscale" />
                </div>
                <h3 className="font-display font-bold text-xl text-[#243d91] mb-2">{lng === 'vi' ? 'Sắp ra mắt' : 'Coming Soon'}</h3>
                <p className="text-[#243d91]/60 text-sm">{lng === 'vi' ? 'Tính năng Chatbot AI đang được nâng cấp và sẽ sớm quay lại. Mong bạn thông cảm nhé!' : 'AI Chatbot is currently being upgraded and will be back soon!'}</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#ebe8dd]/20">
                  {msgs.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {m.role === 'bot' && (
                        <div className="w-7 h-7 rounded-full overflow-hidden mr-2 shrink-0 mt-auto">
                          <img src={MascotImg} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className={`max-w-[86%] px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-[#e8539e] text-white rounded-br-sm'
                          : 'bg-white text-[#243d91] rounded-bl-sm shadow-sm border border-[#ebe8dd]'
                      }`}>
                        {renderMessageText(m.text)}
                        {m.role === 'bot' && renderEventCards(m.events)}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full overflow-hidden">
                        <img src={MascotImg} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-[#ebe8dd] flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 bg-[#243d91]/30 rounded-full"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                <div className="px-3 pt-2 flex gap-2 overflow-x-auto no-scrollbar pb-1 border-t border-[#ebe8dd]">
                  {(lng === 'vi' ? QUICK_REPLIES_VI : QUICK_REPLIES_EN).map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      disabled={loading}
                      className="shrink-0 bg-[#ebe8dd] hover:bg-[#4ecef5]/10 disabled:opacity-50 text-[#243d91] text-xs font-bold px-3 py-1.5 rounded-full transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-white border-t border-[#ebe8dd] flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && send(input)}
                    placeholder={t('chatPlaceholder')}
                    disabled={loading}
                    className="flex-1 bg-[#ebe8dd]/60 rounded-xl px-4 py-2 text-sm font-semibold text-[#243d91] outline-none placeholder-[#243d91]/30 focus:bg-[#ebe8dd] disabled:opacity-60"
                  />
                  <button
                    onClick={() => send(input)}
                    disabled={!input.trim() || loading}
                    className="w-9 h-9 bg-[#e8539e] disabled:opacity-40 text-white rounded-xl flex items-center justify-center hover:bg-[#e8539e]/90 transition-all"
                    aria-label={lng === 'vi' ? 'Gửi tin nhắn' : 'Send message'}
                  >
                    <Send size={15} />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
