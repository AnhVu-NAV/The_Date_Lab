import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Bookmark, Clock, ChevronRight, Search, MapPin, Calendar,
  Flame, Sparkles, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMockEvents } from '../data';
import { Event } from '../types';
import MascotHero from '../assets/MASCOT/nu1-05.png';
import { useLanguage } from '../i18n';

function StatusBadge({ status }: { status: Event['status'] }) {
  if (status === 'Available')
    return <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">Còn chỗ</span>;
  if (status === 'Almost Sold Out')
    return <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><Flame size={10} />Sắp hết</span>;
  return <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">Sold Out</span>;
}

function EventCard({ event, onClick }: { event: Event; onClick: () => void; key?: React.Key }) {
  const [saved, setSaved] = useState(false);
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-[#ebe8dd] hover:border-[#4ecef5]/30 hover:shadow-lg hover:shadow-[#243d91]/8 transition-all group flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden shrink-0">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 left-3"><StatusBadge status={event.status} /></div>

        {/* Bookmark */}
        <button
          onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            saved ? 'bg-[#e8539e] text-white' : 'bg-white/90 text-[#243d91] hover:bg-[#e8539e] hover:text-white'
          }`}
        >
          <Bookmark size={13} fill={saved ? 'white' : 'none'} />
        </button>

        {/* Time */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/50 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
          <Clock size={10} />{event.time.split(' - ')[0]}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4ecef5]">{event.type}</span>
          <span className="font-display font-bold text-[#e8539e] text-lg shrink-0 ml-2">{event.price.toLocaleString('vi-VN')}đ</span>
        </div>
        <h3 className="font-display font-bold text-[#243d91] text-lg leading-snug mb-3 line-clamp-2 flex-1">
          {event.title}
        </h3>
        <div className="space-y-1 text-xs text-[#243d91]/50 font-medium mb-3">
          <div className="flex items-center gap-1.5"><Calendar size={11} className="shrink-0" />{event.date}</div>
          <div className="flex items-center gap-1.5"><MapPin size={11} className="shrink-0" /><span className="line-clamp-1">{event.location}</span></div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-[#ebe8dd]">
          <div className="flex items-center gap-1.5 text-xs text-[#243d91]/40 font-semibold">
            <div className="flex -space-x-1">
              {[...Array(Math.min(3, event.attendees))].map((_, i) => (
                <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-[#e8539e] to-[#4ecef5] border-2 border-white" />
              ))}
            </div>
            {event.attendees}/{event.maxAttendees}
          </div>
          <span className="text-xs font-bold text-[#243d91]/30 group-hover:text-[#e8539e] transition-colors flex items-center gap-1">
            Chi tiết <ChevronRight size={11} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function HomeView() {
  const navigate = useNavigate();
  const { lng, t } = useLanguage();
  const events = getMockEvents('vi');
  const [search, setSearch] = useState('');
  const [relFilter, setRelFilter] = useState('');

  const filtered = events.filter((e) => {
    const q = search.toLowerCase();
    return (
      (e.title.toLowerCase().includes(q) || e.type.toLowerCase().includes(q)) &&
      (relFilter === '' || e.forWho.includes(relFilter))
    );
  });

  // Hero content by language
  const hero = {
    badge: lng === 'vi' ? 'The Date Lab · Hà Nội' : 'The Date Lab · Hanoi',
    title1: lng === 'vi' ? 'Khám phá workshop' : 'Discover workshops',
    title2: lng === 'vi' ? 'dành riêng cho bạn' : 'made just for you',
    desc: lng === 'vi'
      ? 'Từ làm gốm đến chế tác nước hoa — mỗi buổi hẹn tại The Date Lab đều là một kỷ niệm đáng nhớ.'
      : 'From pottery to perfume crafting — every date at The Date Lab becomes an unforgettable memory.',
    cta1: t('btnFindEvents'),
    cta2: lng === 'vi' ? 'Xem sự kiện' : 'Browse events',
    stats: [
      { label: lng === 'vi' ? 'Workshop mỗi tháng' : 'Workshops/month', value: '45+' },
      { label: lng === 'vi' ? 'Thành viên' : 'Members', value: '1,200+' },
      { label: lng === 'vi' ? 'Đánh giá tích cực' : 'Positive reviews', value: '98%' },
    ],
  };

  return (
    <div className="space-y-8">
      {/* HERO BANNER */}
      <section className="relative rounded-3xl overflow-hidden p-8 md:p-14 min-h-[380px] flex items-center">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?auto=format&fit=crop&q=80&w=1400&h=600')" }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#243d91]/90 via-[#243d91]/75 to-[#243d91]/20" />
        {/* Pink blob */}
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#e8539e]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex items-end justify-between w-full gap-6">
          <div className="max-w-xl">
            <p className="text-[#4ecef5] text-xs font-bold uppercase tracking-widest mb-3">{hero.badge}</p>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-white leading-tight mb-4">
              {hero.title1}<br />
              <span className="text-[#e8539e]">{hero.title2}</span>
            </h1>
            <p className="text-white/60 text-sm md:text-base leading-relaxed mb-8 max-w-md">
              {hero.desc}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={() => navigate('/quiz')}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#e8539e] text-white font-bold rounded-xl hover:bg-[#e8539e]/90 transition-all shadow-lg shadow-[#e8539e]/30"
              >
                <Sparkles size={16} /> {hero.cta1}
              </button>
              <button
                onClick={() => document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20"
              >
                {hero.cta2} <ArrowRight size={16} />
              </button>
            </div>
            {/* Stats row */}
            <div className="flex flex-wrap gap-6">
              {hero.stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display font-bold text-2xl text-white">{s.value}</p>
                  <p className="text-xs text-white/40 font-semibold">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mascot character */}
          <div className="hidden lg:block shrink-0 self-end">
            <img
              src={MascotHero}
              alt="TDL Mascot"
              className="h-72 w-auto object-contain drop-shadow-2xl"
              style={{ filter: 'drop-shadow(0 8px 32px rgba(232,83,158,0.3))' }}
            />
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <div id="events-section" className="bg-white rounded-2xl shadow-sm border border-[#f0ede6] p-3 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#243d91]/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lng === 'vi' ? 'Tìm sự kiện, workshop...' : t('searchPlaceholder')}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#f0ede6]/60 text-sm font-semibold text-[#243d91] placeholder-[#243d91]/30 outline-none focus:bg-[#f0ede6]"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto shrink-0">
          {[
            { val: '', label: 'Tất cả' },
            { val: 'Couple', label: 'Cặp đôi' },
            { val: 'Group', label: 'Hội bạn' },
            { val: 'Solo', label: 'Solo' },
          ].map((f) => (
            <button
              key={f.val}
              onClick={() => setRelFilter(f.val)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                relFilter === f.val ? 'bg-[#243d91] text-white' : 'bg-[#f0ede6] text-[#243d91] hover:bg-[#243d91]/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* EVENT GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-2xl text-[#243d91]">Sự kiện sắp diễn ra</h2>
          <span className="text-sm text-[#243d91]/40 font-semibold">{filtered.length} sự kiện</span>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#f0ede6] text-[#243d91]/40 font-bold">
            Không tìm thấy sự kiện phù hợp
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filtered.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => { navigate(`/event/${event.id}`); }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
