import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Minimize2 } from 'lucide-react';
import MascotImg from '../assets/MASCOT/nam2-05.png';

interface Msg { role: 'user' | 'bot'; text: string; }

const QUICK_REPLIES = ['Sự kiện sắp tới?', 'Dresscode gợi ý?', 'Giá vé bao nhiêu?'];

const MOCK_RESPONSES: Record<string, string> = {
  default: 'Xin chào! Mình là trợ lý TDL 💕 Mình có thể giúp bạn tìm sự kiện phù hợp, gợi ý trang phục, hoặc giải đáp bất kỳ thắc mắc nào nhé!',
  'Sự kiện sắp tới?': 'Hiện TDL có 4 sự kiện sắp diễn ra:\n1. 🏺 Làm Gốm Pastel — 15/07\n2. 🌸 Chế Tác Nước Hoa — 16/07\n3. 🕯 Đổ Nến Thơm — 18/07\n4. 🎂 Baking Bánh Bento — 20/07\nBạn thích cái nào nhất?',
  'Dresscode gợi ý?': 'Tùy theo buổi nhé! Gợi ý chung:\n👗 Cặp đôi: Tông pastel nhẹ nhàng, đồ đôi cute\n🎉 Hội bạn: Màu sắc vui tươi, thoải mái\n✨ Solo: Casual chic, thoải mái là nhất!\nTránh đồ trắng vì có thể dính màu khi làm thủ công 😄',
  'Giá vé bao nhiêu?': 'Giá vé tại TDL từ 350,000đ — 650,000đ/người tùy workshop. Mua combo 2 người sẽ được giảm 10% nhé! 🎁',
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'bot', text: MOCK_RESPONSES.default }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    setMsgs((p) => [...p, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context: 'TDL event platform assistant', lng: 'vi' }),
      });
      const data = await res.json();
      setMsgs((p) => [...p, { role: 'bot', text: data.reply }]);
    } catch {
      // Fallback mock
      const reply = MOCK_RESPONSES[text] || 'Câu hỏi hay đó! Mình sẽ hỏi team TDL và phản hồi sớm nhất có thể nhé 💕';
      setTimeout(() => setMsgs((p) => [...p, { role: 'bot', text: reply }]), 800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
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
          >
            <img src={MascotImg} alt="Mascot" className="w-24 h-auto object-contain" />
            <div className="absolute top-2 right-1 w-4 h-4 bg-[#e8539e] rounded-full border-2 border-white shadow-sm" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
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
            {/* Header */}
            <div className="bg-gradient-to-r from-[#243d91] to-[#4ecef5] p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/50">
                <img src={MascotImg} alt="Mascot" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-sm">Trợ lý The Date Lab</p>
                <p className="text-white/60 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" /> Đang hoạt động
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="ml-auto w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#ebe8dd]/20">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'bot' && (
                    <div className="w-7 h-7 rounded-full overflow-hidden mr-2 shrink-0 mt-auto">
                      <img src={MascotImg} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-medium whitespace-pre-line ${
                    m.role === 'user'
                      ? 'bg-[#e8539e] text-white rounded-br-sm'
                      : 'bg-white text-[#243d91] rounded-bl-sm shadow-sm border border-[#ebe8dd]'
                  }`}>
                    {m.text}
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
                      <motion.div key={i} className="w-1.5 h-1.5 bg-[#243d91]/30 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick replies */}
            <div className="px-3 pt-2 flex gap-2 overflow-x-auto no-scrollbar pb-1 border-t border-[#ebe8dd]">
              {QUICK_REPLIES.map((q) => (
                <button key={q} onClick={() => send(q)} className="shrink-0 bg-[#ebe8dd] hover:bg-[#4ecef5]/10 text-[#243d91] text-xs font-bold px-3 py-1.5 rounded-full transition-all">
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-[#ebe8dd] flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send(input)}
                placeholder="Nhắn tin cho TDL..."
                className="flex-1 bg-[#ebe8dd]/60 rounded-xl px-4 py-2 text-sm font-semibold text-[#243d91] outline-none placeholder-[#243d91]/30 focus:bg-[#ebe8dd]"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                className="w-9 h-9 bg-[#e8539e] disabled:opacity-40 text-white rounded-xl flex items-center justify-center hover:bg-[#e8539e]/90 transition-all"
              >
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
