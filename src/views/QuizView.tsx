import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Users, Star, ArrowRight, RotateCcw, Ticket, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMockEvents } from '../data';

const STEPS = [
  {
    q: 'Hôm nay bạn đến The Date Lab cùng ai?',
    key: 'who',
    opts: [
      { id: 'couple', label: 'Người yêu', sub: 'Lãng mạn & kết nối', icon: Heart, accent: '#e8539e' },
      { id: 'friends', label: 'Hội bạn thân', sub: 'Vui vẻ & náo nhiệt', icon: Users, accent: '#4ecef5' },
      { id: 'solo', label: 'Đi một mình', sub: 'Tự do & chill', icon: Star, accent: '#f59e0b' },
    ],
  },
  {
    q: 'Bạn muốn nhịp độ buổi hẹn thế nào?',
    key: 'pace',
    opts: [
      { id: 'calm', label: 'Tỉ mẩn, tập trung', sub: 'Không gian yên tĩnh', icon: Star, accent: '#243d91' },
      { id: 'lively', label: 'Vui vẻ, sôi động', sub: 'Cười nhiều, nói nhiều', icon: Users, accent: '#4ecef5' },
      { id: 'chill', label: 'Nhẹ nhàng, thả lỏng', sub: 'Không áp lực', icon: Heart, accent: '#e8539e' },
    ],
  },
  {
    q: 'Muốn lưu giữ kỷ niệm qua giác quan nào?',
    key: 'sense',
    opts: [
      { id: 'touch', label: 'Xúc giác', sub: 'Tự tay tạo ra, mang theo mãi', icon: Heart, accent: '#f59e0b' },
      { id: 'sight', label: 'Thị giác', sub: 'Màu sắc, hình ảnh rực rỡ', icon: Star, accent: '#e8539e' },
      { id: 'smell', label: 'Khứu giác', sub: 'Hương thơm dễ chịu, thư giãn', icon: Star, accent: '#4ecef5' },
    ],
  },
];

const SENSE_MAP: Record<string, { workshop: string; desc: string; eventId: number }> = {
  touch: {
    workshop: 'Workshop Vòng Tay Handmade',
    desc: 'Tự tay tỉ mẩn chọn từng hạt cườm, thắt từng nút dây — lưu giữ kỷ niệm thành món đồ mang theo bên mình.',
    eventId: 1,
  },
  sight: {
    workshop: 'Workshop Ghép Hạt Ủi',
    desc: 'Những mảng màu rực rỡ và vui nhộn — chắc chắn sẽ mang lại rất nhiều tiếng cười.',
    eventId: 4,
  },
  smell: {
    workshop: 'Workshop Làm Mùi Hương',
    desc: 'Một không gian ngập tràn hương thơm — liệu pháp thư giãn hoàn hảo.',
    eventId: 2,
  },
};

const WHO_LABEL: Record<string, string> = { couple: 'người yêu', friends: 'hội bạn thân', solo: 'riêng bạn' };

export default function QuizView() {
  const navigate = useNavigate();
  const events = getMockEvents('vi');

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAnswer = (key: string, id: string) => {
    const next = { ...answers, [key]: id };
    setAnswers(next);

    if (step < STEPS.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      setLoading(true);
      setTimeout(() => { setLoading(false); setDone(true); }, 1400);
    }
  };

  const reset = () => { setStep(0); setAnswers({}); setDone(false); };

  const sense = answers['sense'];
  const result = sense ? SENSE_MAP[sense] : null;
  const matchEvent = result ? events.find((e) => e.id === result.eventId) || events[0] : null;

  return (
    <div className="max-w-2xl mx-auto py-4">
      {/* Page header */}
      <div className="text-center mb-8">
        <p className="text-[#4ecef5] text-xs font-bold uppercase tracking-widest mb-2">Cá nhân hoá trải nghiệm</p>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-[#243d91]">Quiz tìm workshop</h1>
        <p className="text-[#243d91]/50 mt-2 text-sm">Trả lời 3 câu hỏi ngắn — chúng tôi gợi ý sự kiện phù hợp nhất cho bạn.</p>
      </div>

      {/* Quiz card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-[#243d91]/8 border border-[#ebe8dd] overflow-hidden">
        {/* Progress bar */}
        {!done && (
          <div className="h-1 bg-[#ebe8dd]">
            <motion.div
              className="h-full bg-gradient-to-r from-[#e8539e] to-[#4ecef5]"
              animate={{ width: loading ? '100%' : `${(step / STEPS.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}

        <div className="p-6 md:p-10">
          <AnimatePresence mode="wait">
            {/* QUIZ STEPS */}
            {!done && !loading && (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              >
                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-5">
                  {STEPS.map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= step ? (i < step ? 'bg-[#4ecef5]' : 'bg-[#e8539e]') : 'bg-[#ebe8dd]'}`} />
                  ))}
                </div>

                <p className="text-xs font-bold uppercase tracking-widest text-[#243d91]/40 mb-2">Câu {step + 1} / {STEPS.length}</p>
                <h2 className="font-display font-bold text-xl md:text-2xl text-[#243d91] mb-6 leading-snug">
                  {STEPS[step].q}
                </h2>

                <div className="grid grid-cols-1 gap-3">
                  {STEPS[step].opts.map((opt) => (
                    <motion.button
                      key={opt.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(STEPS[step].key, opt.id)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-[#ebe8dd] hover:border-current text-left transition-all group bg-white hover:bg-[#ebe8dd]/20"
                      style={{ '--hover-color': opt.accent } as React.CSSProperties}
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110"
                        style={{ backgroundColor: `${opt.accent}15` }}
                      >
                        <opt.icon size={20} style={{ color: opt.accent }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-[#243d91] text-sm">{opt.label}</p>
                        <p className="text-xs text-[#243d91]/50 mt-0.5">{opt.sub}</p>
                      </div>
                      <ArrowRight size={16} className="text-[#243d91]/20 group-hover:text-[#243d91]/60 shrink-0 transition-all" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* LOADING */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 text-center"
              >
                <div className="flex justify-center gap-2 mb-5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-3 h-3 rounded-full bg-[#e8539e]"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity }}
                    />
                  ))}
                </div>
                <p className="font-display font-bold text-[#243d91] text-lg">Đang phân tích kết quả...</p>
                <p className="text-[#243d91]/50 text-sm mt-1">Chỉ một chút nữa thôi!</p>
              </motion.div>
            )}

            {/* RESULT */}
            {done && result && matchEvent && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 250 }}
              >
                {/* Result header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-[#e8539e]/10 text-[#e8539e] text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                    <Star size={11} fill="currentColor" /> Gợi ý dành riêng cho bạn
                  </div>
                  <h2 className="font-display font-bold text-2xl text-[#243d91]">{result.workshop}</h2>
                  <p className="text-[#243d91]/60 text-sm mt-2 leading-relaxed max-w-md mx-auto">
                    {result.desc.replace('bạn', `${WHO_LABEL[answers['who'] || 'solo']}`)}
                  </p>
                </div>

                {/* Matched event card */}
                <div className="rounded-2xl border-2 border-[#ebe8dd] overflow-hidden mb-5">
                  <div className="relative h-44">
                    <img src={matchEvent.image} alt={matchEvent.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div>
                        <p className="text-white font-display font-bold text-lg leading-tight">{matchEvent.title}</p>
                        <p className="text-white/70 text-xs">{matchEvent.type}</p>
                      </div>
                      <span className="bg-[#e8539e] text-white text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
                        {matchEvent.price.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                  <div className="bg-[#ebe8dd]/30 px-4 py-3 flex items-center gap-4 text-xs text-[#243d91]/60 font-semibold">
                    <span className="flex items-center gap-1.5"><Calendar size={11} />{matchEvent.date}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={11} />{matchEvent.location}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate(`/event/${matchEvent.id}`)}
                    className="flex-1 py-3.5 bg-[#e8539e] text-white font-bold rounded-xl hover:bg-[#e8539e]/90 transition-all shadow-lg shadow-[#e8539e]/25 flex items-center justify-center gap-2"
                  >
                    <Ticket size={16} /> Đặt vé ngay
                  </button>
                  <button
                    onClick={reset}
                    className="flex items-center justify-center gap-2 py-3.5 px-5 bg-[#ebe8dd] text-[#243d91] font-bold rounded-xl hover:bg-[#ebe8dd]/70 transition-all"
                  >
                    <RotateCcw size={15} /> Làm lại
                  </button>
                </div>

                {/* Browse more */}
                <div className="text-center mt-4">
                  <button
                    onClick={() => navigate('/')}
                    className="text-xs text-[#243d91]/40 hover:text-[#243d91] font-semibold transition-colors"
                  >
                    Xem tất cả sự kiện →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
