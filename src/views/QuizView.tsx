import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Users, Star, ArrowRight, RotateCcw, Ticket, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMockEvents } from '../data';
import { useLanguage } from '../i18n';

export default function QuizView() {
  const navigate = useNavigate();
  const { lng, t } = useLanguage();
  const events = getMockEvents('vi');

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  // Steps built from t()
  const STEPS = [
    {
      q: t('quizWho'),
      key: 'who',
      opts: [
        { id: 'couple', label: t('quizWhoPartner'), sub: lng === 'vi' ? 'Lãng mạn & kết nối' : 'Romantic & connected', icon: Heart, accent: '#e8539e' },
        { id: 'friends', label: t('quizWhoFriends'), sub: lng === 'vi' ? 'Vui vẻ & náo nhiệt' : 'Fun & lively', icon: Users, accent: '#4ecef5' },
        { id: 'solo', label: t('quizWhoSolo'), sub: lng === 'vi' ? 'Tự do & chill' : 'Free & chill', icon: Star, accent: '#f59e0b' },
      ],
    },
    {
      q: t('quizFeeling'),
      key: 'pace',
      opts: [
        { id: 'calm', label: t('quizFeelingRomantic'), sub: lng === 'vi' ? 'Không gian yên tĩnh' : 'Quiet atmosphere', icon: Star, accent: '#243d91' },
        { id: 'lively', label: t('quizFeelingLively'), sub: lng === 'vi' ? 'Cười nhiều, nói nhiều' : 'Laugh & chat a lot', icon: Users, accent: '#4ecef5' },
        { id: 'chill', label: t('quizFeelingHealing'), sub: lng === 'vi' ? 'Không áp lực' : 'No pressure', icon: Heart, accent: '#e8539e' },
      ],
    },
    {
      q: lng === 'vi' ? 'Muốn lưu giữ kỷ niệm qua giác quan nào?' : 'How do you want to preserve the memory?',
      key: 'sense',
      opts: [
        { id: 'touch', label: lng === 'vi' ? 'Xúc giác' : 'Touch', sub: lng === 'vi' ? 'Tự tay tạo ra, mang theo mãi' : 'Handmade, keep forever', icon: Heart, accent: '#f59e0b' },
        { id: 'sight', label: lng === 'vi' ? 'Thị giác' : 'Sight', sub: lng === 'vi' ? 'Màu sắc, hình ảnh rực rỡ' : 'Vivid colors & visuals', icon: Star, accent: '#e8539e' },
        { id: 'smell', label: lng === 'vi' ? 'Khứu giác' : 'Smell', sub: lng === 'vi' ? 'Hương thơm dễ chịu, thư giãn' : 'Soothing scents, relaxing', icon: Star, accent: '#4ecef5' },
      ],
    },
  ];

  const SENSE_MAP: Record<string, { workshop: string; desc: string; eventId: number }> = {
    touch: {
      workshop: lng === 'vi' ? 'Workshop Vòng Tay Handmade' : 'Handmade Bracelet Workshop',
      desc: lng === 'vi' ? 'Tự tay tỉ mẩn chọn từng hạt cườm — lưu giữ kỷ niệm thành món đồ mang theo bên mình.' : 'Pick each bead with care — preserve the memory as something you carry with you.',
      eventId: 1,
    },
    sight: {
      workshop: lng === 'vi' ? 'Workshop Ghép Hạt Ủi' : 'Bead Art Workshop',
      desc: lng === 'vi' ? 'Những mảng màu rực rỡ và vui nhộn — chắc chắn sẽ mang lại rất nhiều tiếng cười.' : 'Bright and playful colors — guaranteed to bring plenty of laughter.',
      eventId: 4,
    },
    smell: {
      workshop: lng === 'vi' ? 'Workshop Làm Mùi Hương' : 'Scent Crafting Workshop',
      desc: lng === 'vi' ? 'Một không gian ngập tràn hương thơm — liệu pháp thư giãn hoàn hảo.' : 'A space filled with fragrance — the perfect relaxation therapy.',
      eventId: 2,
    },
  };

  const WHO_LABEL: Record<string, string> = {
    couple: lng === 'vi' ? 'người yêu' : 'your partner',
    friends: lng === 'vi' ? 'hội bạn thân' : 'your friends',
    solo: lng === 'vi' ? 'riêng bạn' : 'yourself',
  };

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
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-[#4ecef5] text-xs font-bold uppercase tracking-widest mb-2">
          {lng === 'vi' ? 'Cá nhân hoá trải nghiệm' : 'Personalise your experience'}
        </p>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-[#243d91]">
          {lng === 'vi' ? 'Quiz tìm workshop' : 'Find your workshop'}
        </h1>
        <p className="text-[#243d91]/50 mt-2 text-sm">
          {lng === 'vi'
            ? 'Trả lời 3 câu hỏi ngắn — chúng tôi gợi ý sự kiện phù hợp nhất cho bạn.'
            : 'Answer 3 quick questions — we\'ll suggest the perfect event for you.'}
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-[#243d91]/8 border border-[#f0ede6] overflow-hidden">
        {!done && (
          <div className="h-1 bg-[#f0ede6]">
            <motion.div
              className="h-full bg-gradient-to-r from-[#e8539e] to-[#4ecef5]"
              animate={{ width: loading ? '100%' : `${(step / STEPS.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}

        <div className="p-6 md:p-10">
          <AnimatePresence mode="wait">
            {!done && !loading && (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              >
                <div className="flex items-center gap-2 mb-5">
                  {STEPS.map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= step ? (i < step ? 'bg-[#4ecef5]' : 'bg-[#e8539e]') : 'bg-[#f0ede6]'}`} />
                  ))}
                </div>

                <p className="text-xs font-bold uppercase tracking-widest text-[#243d91]/40 mb-2">
                  {lng === 'vi' ? `Câu ${step + 1} / ${STEPS.length}` : `Question ${step + 1} / ${STEPS.length}`}
                </p>
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
                      className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-[#f0ede6] text-left transition-all group bg-white hover:bg-[#f0ede6]/30"
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

            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-12 text-center">
                <div className="flex justify-center gap-2 mb-5">
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} className="w-3 h-3 rounded-full bg-[#e8539e]"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity }}
                    />
                  ))}
                </div>
                <p className="font-display font-bold text-[#243d91] text-lg">{t('findingMatches')}</p>
                <p className="text-[#243d91]/50 text-sm mt-1">{lng === 'vi' ? 'Chỉ một chút nữa thôi!' : 'Just a moment!'}</p>
              </motion.div>
            )}

            {done && result && matchEvent && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 250 }}>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-[#e8539e]/10 text-[#e8539e] text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                    <Star size={11} fill="currentColor" />
                    {lng === 'vi' ? 'Gợi ý dành riêng cho bạn' : 'Personalised recommendation'}
                  </div>
                  <h2 className="font-display font-bold text-2xl text-[#243d91]">{result.workshop}</h2>
                  <p className="text-[#243d91]/60 text-sm mt-2 leading-relaxed max-w-md mx-auto">
                    {result.desc.replace(lng === 'vi' ? 'bạn' : 'you', WHO_LABEL[answers['who'] || 'solo'])}
                  </p>
                </div>

                <div className="rounded-2xl border-2 border-[#f0ede6] overflow-hidden mb-5">
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
                  <div className="bg-[#f0ede6]/30 px-4 py-3 flex items-center gap-4 text-xs text-[#243d91]/60 font-semibold">
                    <span className="flex items-center gap-1.5"><Calendar size={11} />{matchEvent.date}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={11} />{matchEvent.location}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate(`/event/${matchEvent.id}`)}
                    className="flex-1 py-3.5 bg-[#e8539e] text-white font-bold rounded-xl hover:bg-[#e8539e]/90 transition-all shadow-lg shadow-[#e8539e]/25 flex items-center justify-center gap-2"
                  >
                    <Ticket size={16} /> {t('getTickets')}
                  </button>
                  <button
                    onClick={reset}
                    className="flex items-center justify-center gap-2 py-3.5 px-5 bg-[#f0ede6] text-[#243d91] font-bold rounded-xl hover:bg-[#f0ede6]/70 transition-all"
                  >
                    <RotateCcw size={15} /> {lng === 'vi' ? 'Làm lại' : 'Restart'}
                  </button>
                </div>

                <div className="text-center mt-4">
                  <button onClick={() => navigate('/')} className="text-xs text-[#243d91]/40 hover:text-[#243d91] font-semibold transition-colors">
                    {lng === 'vi' ? 'Xem tất cả sự kiện →' : 'Browse all events →'}
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
