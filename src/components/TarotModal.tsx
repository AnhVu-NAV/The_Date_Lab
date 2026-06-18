import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, RefreshCw, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { api } from '../lib/api';

interface TarotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TAROT_CARDS = [
  {
    id: 1,
    name: 'The Star',
    nameVi: 'Ngôi Sao',
    symbol: '✦',
    color: 'from-[#243d91] to-[#4ecef5]',
    messageVi: 'Hôm nay là ngày của hy vọng và sáng tạo. Ánh sao dẫn đường cho đôi tay tài hoa của bạn.',
    messageEn: 'Today is a day of hope and creativity. The starlight guides your talented hands.',
    vibeVi: 'Lãng mạn & Sáng tạo',
    vibeEn: 'Romantic & Creative',
    eventSuggestionVi: 'Workshop Làm Nến Thơm',
    eventSuggestionEn: 'Scented Candle Workshop',
    eventId: 3,
    eventDescVi: 'Ánh nến như ánh sao — tự tay tạo ra ánh sáng cho không gian của bạn.',
    eventDescEn: 'Candlelight like starlight — craft your own glow to light up your space.',
  },
  {
    id: 2,
    name: 'The Moon',
    nameVi: 'Mặt Trăng',
    symbol: '◐',
    color: 'from-purple-900 to-[#243d91]',
    messageVi: 'Đêm nay huyền bí và đầy cảm xúc. Hãy để trực giác dẫn dắt và khám phá thế giới hương thơm.',
    messageEn: 'Tonight is mysterious and full of emotion. Let your intuition guide you into the world of scents.',
    vibeVi: 'Huyền bí & Chill',
    vibeEn: 'Mysterious & Chill',
    eventSuggestionVi: 'Chế Tác Nước Hoa Cá Nhân',
    eventSuggestionEn: 'Personal Perfume Crafting',
    eventId: 2,
    eventDescVi: 'Tìm mùi hương đại diện cho bạn trong đêm tối đầy cảm xúc này.',
    eventDescEn: 'Find the scent that represents you on this emotionally rich night.',
  },
  {
    id: 3,
    name: 'The Sun',
    nameVi: 'Mặt Trời',
    symbol: '☀',
    color: 'from-amber-400 to-[#e8539e]',
    messageVi: 'Năng lượng tích cực tràn đầy! Đây là ngày tuyệt vời để tạo ra điều gì đó rực rỡ và vui tươi.',
    messageEn: 'Pure positive energy! This is a wonderful day to create something bright and joyful.',
    vibeVi: 'Sôi động & Vui vẻ',
    vibeEn: 'Vibrant & Joyful',
    eventSuggestionVi: 'Baking Bánh Bento',
    eventSuggestionEn: 'Bento Cake Baking',
    eventId: 4,
    eventDescVi: 'Chiếc bánh ngọt ngào — giống như năng lượng mặt trời bạn mang đến hôm nay!',
    eventDescEn: 'A sweet little cake — just like the sunny energy you bring today!',
  },
  {
    id: 4,
    name: 'The World',
    nameVi: 'Thế Giới',
    symbol: '◎',
    color: 'from-[#4ecef5] to-emerald-500',
    messageVi: 'Bạn đang ở đỉnh cao của năng lực. Hãy tạo ra tác phẩm thể hiện toàn bộ bản thân.',
    messageEn: 'You are at your peak. Create something that expresses your whole self.',
    vibeVi: 'Tự tin & Chữa lành',
    vibeEn: 'Confident & Healing',
    eventSuggestionVi: 'Workshop Làm Gốm Pastel',
    eventSuggestionEn: 'Pastel Pottery Workshop',
    eventId: 1,
    eventDescVi: 'Tự tay nặn ra một tác phẩm mang dấu ấn riêng — bạn là nghệ sĩ của thế giới này.',
    eventDescEn: 'Hand-shape a piece that is uniquely yours — you are the artist of this world.',
  },
  {
    id: 5,
    name: 'The Lovers',
    nameVi: 'Tình Nhân',
    symbol: '♡',
    color: 'from-[#e8539e] to-rose-600',
    messageVi: 'Kết nối và tình yêu đang tỏa sáng. Đây là thời điểm hoàn hảo để chia sẻ kỷ niệm cùng người thân.',
    messageEn: 'Love and connection are shining. This is the perfect moment to share memories with someone special.',
    vibeVi: 'Lãng mạn & Kết nối',
    vibeEn: 'Romantic & Connected',
    eventSuggestionVi: 'Chế Tác Nước Hoa Cá Nhân',
    eventSuggestionEn: 'Personal Perfume Crafting',
    eventId: 2,
    eventDescVi: 'Cùng người thương tạo ra mùi hương chung — kỷ niệm gắn kết hai trái tim.',
    eventDescEn: 'Create a shared scent with your loved one — a memory that bonds two hearts.',
  },
  {
    id: 6,
    name: 'The Hermit',
    nameVi: 'Ẩn Sĩ',
    symbol: '◇',
    color: 'from-slate-700 to-[#243d91]',
    messageVi: 'Sự tĩnh lặng mang lại sự sáng suốt. Dành thời gian cho bản thân và những khoảnh khắc chữa lành.',
    messageEn: 'Stillness brings clarity. Take time for yourself and moments of quiet healing.',
    vibeVi: 'Tĩnh lặng & Chữa lành',
    vibeEn: 'Calm & Healing',
    eventSuggestionVi: 'Workshop Làm Gốm Pastel',
    eventSuggestionEn: 'Pastel Pottery Workshop',
    eventId: 1,
    eventDescVi: 'Một mình với đất sét — liệu pháp chữa lành tuyệt vời cho tâm hồn.',
    eventDescEn: 'Alone with clay — a wonderful healing therapy for the soul.',
  },
];

export default function TarotModal({ isOpen, onClose }: TarotModalProps) {
  const navigate = useNavigate();
  const { lng, t } = useLanguage();
  const [phase, setPhase] = useState<'intro' | 'flipping' | 'revealed'>('intro');
  const [pickedCard, setPickedCard] = useState<any | null>(null);
  const [cards, setCards] = useState<any[]>(TAROT_CARDS);

  // Fetch real cards from DB when modal opens
  useEffect(() => {
    if (isOpen) {
      api.getTarotCards()
        .then(data => { if (data.length > 0) setCards(data); })
        .catch(() => {}); // fall back to hardcoded
    }
  }, [isOpen]);

  const handleDraw = () => {
    setPhase('flipping');
    setTimeout(() => {
      const random = cards[Math.floor(Math.random() * cards.length)];
      setPickedCard(random);
      setPhase('revealed');
    }, 1800);
  };

  const handleReset = () => {
    setPhase('intro');
    setPickedCard(null);
  };

  const handleClose = () => {
    onClose();
    setTimeout(handleReset, 400);
  };

  const txt = {
    subtitle: lng === 'vi' ? 'Khám phá Tarot ✦' : 'Daily Tarot ✦',
    desc: lng === 'vi' ? 'Lật một lá bài và nhận thông điệp' : 'Draw a card and receive your message',
    focus: lng === 'vi'
      ? <>Tập trung vào năng lượng hiện tại của bạn,<br />rồi chạm để lật lá bài.</>
      : <>Focus on your current energy,<br />then tap to draw your card.</>,
    drawBtn: lng === 'vi' ? 'Rút bài ngẫu nhiên' : t('drawBtn'),
    flipping: lng === 'vi' ? 'Đang lật bài...' : 'Drawing your card...',
    suggestionLabel: lng === 'vi' ? 'Gợi ý hôm nay' : "Today's suggestion",
    bookBtn: lng === 'vi' ? 'Đặt vé ngay' : t('seeEvents'),
    redrawBtn: lng === 'vi' ? 'Rút lại' : 'Draw again',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-sm bg-[#243d91] rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative px-6 pt-6 pb-4 text-center">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-all"
                >
                  <X size={15} />
                </button>
                <p className="text-[#4ecef5] text-xs font-bold uppercase tracking-widest mb-1">The Date Lab</p>
                <h2 className="font-display font-bold text-2xl text-white">{txt.subtitle}</h2>
                <p className="text-white/50 text-sm mt-1">{txt.desc}</p>
              </div>

              {/* Card Area */}
              <div className="px-6 pb-6">
                <AnimatePresence mode="wait">

                  {/* INTRO */}
                  {phase === 'intro' && (
                    <motion.div
                      key="intro"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center"
                    >
                      {/* Decorative card stack */}
                      <div className="relative h-52 flex items-center justify-center mb-6">
                        {[2, 1, 0].map((i) => (
                          <motion.div
                            key={i}
                            className="absolute w-32 h-48 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-xl"
                            style={{ rotate: (i - 1) * 6 }}
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 2.5, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            {i === 0 && (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-4xl text-white/30">✦</span>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>

                      <p className="text-white/60 text-sm mb-6 leading-relaxed">{txt.focus}</p>

                      <button
                        onClick={handleDraw}
                        className="w-full py-3.5 bg-gradient-to-r from-[#e8539e] to-[#4ecef5] text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-lg"
                      >
                        {txt.drawBtn}
                      </button>
                    </motion.div>
                  )}

                  {/* FLIPPING */}
                  {phase === 'flipping' && (
                    <motion.div
                      key="flipping"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-8"
                    >
                      <motion.div
                        className="w-32 h-48 mx-auto rounded-2xl bg-gradient-to-br from-[#e8539e] to-[#4ecef5]"
                        animate={{ rotateY: [0, 90, 180, 270, 360], scale: [1, 0.9, 1, 0.9, 1] }}
                        transition={{ duration: 1.6, ease: 'easeInOut', repeat: 1 }}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <motion.span
                            className="text-4xl text-white"
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                          >
                            ✦
                          </motion.span>
                        </div>
                      </motion.div>
                      <p className="text-white/60 text-sm mt-6 font-medium">{txt.flipping}</p>
                    </motion.div>
                  )}

                  {/* REVEALED */}
                  {phase === 'revealed' && pickedCard && (
                    <motion.div
                      key="revealed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 250 }}
                    >
                      {/* Card */}
                      <div className={`relative w-40 h-56 mx-auto rounded-2xl bg-gradient-to-br ${pickedCard.color} shadow-2xl mb-5 flex flex-col items-center justify-center border border-white/10`}>
                        <span className="text-6xl text-white/80 mb-2">{pickedCard.symbol}</span>
                        <p className="text-white/90 font-display font-bold text-sm text-center px-3">
                          {lng === 'vi' ? pickedCard.nameVi : pickedCard.name}
                        </p>
                        <p className="text-white/50 text-xs mt-0.5">
                          {lng === 'vi' ? pickedCard.name : pickedCard.nameVi}
                        </p>
                      </div>

                      {/* Vibe badge */}
                      <div className="text-center mb-3">
                        <span className="inline-block bg-[#4ecef5]/20 text-[#4ecef5] text-xs font-bold px-3 py-1 rounded-full">
                          {lng === 'vi' ? pickedCard.vibeVi : pickedCard.vibeEn}
                        </span>
                      </div>

                      {/* Message */}
                      <p className="text-white/80 text-sm text-center leading-relaxed mb-5 italic">
                        "{lng === 'vi' ? pickedCard.messageVi : pickedCard.messageEn}"
                      </p>

                      {/* Event suggestion */}
                      <div className="bg-white/8 rounded-2xl p-4 border border-white/10 mb-4">
                        <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-1.5">
                          {txt.suggestionLabel}
                        </p>
                        <p className="text-white font-bold text-sm mb-1">
                          {lng === 'vi' ? pickedCard.eventSuggestionVi : pickedCard.eventSuggestionEn}
                        </p>
                        <p className="text-white/60 text-xs leading-relaxed">
                          {lng === 'vi' ? pickedCard.eventDescVi : pickedCard.eventDescEn}
                        </p>
                        <button
                          onClick={() => { handleClose(); navigate(`/event/${pickedCard.eventId}`); }}
                          className="mt-3 flex items-center gap-1.5 bg-[#e8539e] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#e8539e]/90 transition-all"
                        >
                          <Ticket size={12} /> {txt.bookBtn}
                        </button>
                      </div>

                      <button
                        onClick={handleReset}
                        className="w-full py-3 bg-white/10 hover:bg-white/15 text-white/70 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
                      >
                        <RefreshCw size={14} /> {txt.redrawBtn}
                      </button>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
