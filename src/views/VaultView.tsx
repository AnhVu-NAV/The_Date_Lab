import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Download, Image as Img, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VaultViewProps {
  isAuthenticated: boolean;
}

const MOCK_VAULT = [
  {
    id: 1, title: 'Workshop Làm Gốm Pastel', date: 'Tháng 6 · 2026',
    cover: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=400&h=300',
    count: 12,
  },
  {
    id: 2, title: 'Đêm Cà Phê & Chuyện Kể', date: 'Tháng 5 · 2026',
    cover: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400&h=300',
    count: 8,
  },
];

export default function VaultView({ isAuthenticated }: VaultViewProps) {
  const navigate = useNavigate();
  const [hoverId, setHoverId] = useState<number | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-[#243d91]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock size={28} className="text-[#243d91]" />
        </div>
        <h2 className="font-display font-bold text-2xl text-[#243d91] mb-2">Kho Kỷ Niệm</h2>
        <p className="text-[#243d91]/50 mb-6">Bạn cần đăng nhập để xem kỷ niệm của mình</p>
        <button onClick={() => navigate('/login')} className="bg-[#e8539e] text-white px-6 py-3 rounded-xl font-bold">Đăng nhập ngay</button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-xl border border-[#ebe8dd] flex items-center justify-center hover:bg-[#ebe8dd] transition-all">
          <ArrowLeft size={18} className="text-[#243d91]" />
        </button>
        <div>
          <h1 className="font-display font-bold text-3xl text-[#243d91]">Kho Kỷ Niệm 🗝️</h1>
          <p className="text-sm text-[#243d91]/50">Những khoảnh khắc đẹp nhất tại The Date Lab</p>
        </div>
        <div className="ml-auto bg-[#243d91] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <Lock size={11} /> Riêng tư
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {MOCK_VAULT.map((vault) => (
          <motion.div
            key={vault.id}
            onHoverStart={() => setHoverId(vault.id)}
            onHoverEnd={() => setHoverId(null)}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl overflow-hidden border border-[#ebe8dd] shadow-sm group cursor-pointer"
          >
            <div className="relative h-48 overflow-hidden">
              <img src={vault.cover} alt={vault.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: hoverId === vault.id ? 1 : 0, scale: hoverId === vault.id ? 1 : 0.8 }}
                  className="bg-white text-[#243d91] font-bold text-sm px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg"
                >
                  <Download size={14} /> Tải tất cả
                </motion.button>
              </div>
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-[#243d91] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Img size={11} /> {vault.count} ảnh
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-display font-bold text-[#243d91] mb-1">{vault.title}</h3>
              <p className="text-xs text-[#243d91]/50 font-semibold">{vault.date}</p>
            </div>
          </motion.div>
        ))}

        {/* Locked slot */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-[#ebe8dd] h-60 flex flex-col items-center justify-center text-center p-6">
          <div className="w-12 h-12 bg-[#ebe8dd] rounded-full flex items-center justify-center mb-3">
            <Lock size={20} className="text-[#243d91]/30" />
          </div>
          <p className="font-bold text-sm text-[#243d91]/40">Thư mục đã khóa</p>
          <p className="text-xs text-[#243d91]/30 mt-1">Tham gia sự kiện tiếp theo để mở khoá</p>
          <button onClick={() => navigate('/')} className="mt-4 text-xs font-bold text-[#e8539e] hover:underline">
            Khám phá sự kiện →
          </button>
        </div>
      </div>
    </div>
  );
}
