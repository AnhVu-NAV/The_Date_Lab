import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, MapPin, Minus, Plus, Sparkles, CreditCard, CheckCircle2, ChevronRight } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMockEvents } from '../data';
import { useLanguage } from '../i18n';

export default function EventDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lng, t } = useLanguage();
  const events = getMockEvents('vi');
  const event = events.find((e) => String(e.id) === id);

  const [qty, setQty] = useState(1);
  const [instax, setInstax] = useState(false);
  const [keychain, setKeychain] = useState(false);
  const [step, setStep] = useState<'info' | 'pay' | 'done'>('info');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  if (!event) return (
    <div className="text-center py-20">
      <p className="text-[#243d91]/50 font-bold mb-4">
        {lng === 'vi' ? 'Không tìm thấy sự kiện' : 'Event not found'}
      </p>
      <button onClick={() => navigate('/')} className="bg-[#e8539e] text-white px-6 py-3 rounded-xl font-bold">
        {lng === 'vi' ? 'Về trang chủ' : 'Back to home'}
      </button>
    </div>
  );

  const basePrice = event.price * qty;
  const discount = qty >= 2 ? basePrice * 0.1 : 0;
  const addonCost = (instax ? 50000 : 0) + (keychain ? 85000 : 0);
  const total = basePrice - discount + addonCost;
  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

  const statusLabel = event.status === 'Available'
    ? (lng === 'vi' ? '✅ Còn chỗ' : '✅ Available')
    : event.status === 'Almost Sold Out'
    ? (lng === 'vi' ? '🔥 Sắp hết' : '🔥 Almost Sold Out')
    : '❌ Sold Out';

  const statusColor = event.status === 'Available'
    ? 'bg-emerald-100 text-emerald-700'
    : event.status === 'Almost Sold Out'
    ? 'bg-orange-100 text-orange-600'
    : 'bg-red-100 text-red-600';

  const addons = [
    {
      id: 'instax',
      label: lng === 'vi' ? '📸 Ảnh Instax lấy liền' : '📸 Instant Instax Photo',
      price: 50000,
      val: instax,
      set: setInstax,
    },
    {
      id: 'key',
      label: lng === 'vi' ? '🗝 Móc khoá TDL' : '🗝 TDL Keychain',
      price: 85000,
      val: keychain,
      set: setKeychain,
    },
  ];

  const payFields = [
    { key: 'name', label: t('fullName'), type: 'text', placeholder: lng === 'vi' ? 'Nguyễn Văn A' : 'Your full name' },
    { key: 'email', label: t('email'), type: 'email', placeholder: 'email@example.com' },
    { key: 'phone', label: lng === 'vi' ? 'Số điện thoại' : 'Phone number', type: 'tel', placeholder: '0912 345 678' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-[#243d91]/60 hover:text-[#243d91] mb-6 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        {lng === 'vi' ? 'Quay lại' : 'Go back'}
      </button>

      {step === 'done' ? (
        /* SUCCESS */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
          <h2 className="font-display font-bold text-3xl text-[#243d91] mb-3">
            {lng === 'vi' ? 'Đặt vé thành công! 🎉' : 'Ticket confirmed! 🎉'}
          </h2>
          <p className="text-[#243d91]/60 mb-2">
            {lng === 'vi' ? 'E-Ticket đã được gửi về' : 'Your e-ticket was sent to'} <strong>{form.email}</strong>
          </p>
          <p className="text-sm text-[#243d91]/40 mb-8">
            {lng === 'vi' ? 'Vé sẽ được lưu trong kho vé của bạn.' : 'Your ticket is saved in your dashboard.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-[#243d91] text-white font-bold rounded-xl hover:bg-[#243d91]/90 transition-all">
              {lng === 'vi' ? 'Xem vé của tôi' : 'View my tickets'}
            </button>
            <button onClick={() => navigate('/')} className="px-6 py-3 bg-[#f0ede6] text-[#243d91] font-bold rounded-xl hover:bg-[#f0ede6]/70 transition-all">
              {lng === 'vi' ? 'Về trang chủ' : 'Back to home'}
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT - Event Info */}
          <div className="lg:col-span-3 space-y-5">
            {/* Hero */}
            <div className="relative rounded-2xl overflow-hidden h-64 md:h-80">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusColor}`}>{event.type}</span>
              </div>
              <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full ${statusColor}`}>
                {statusLabel}
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h1 className="font-display font-bold text-2xl md:text-3xl text-white leading-tight">{event.title}</h1>
              </div>
            </div>

            {/* Meta info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-4 border border-[#f0ede6]">
                <div className="flex items-center gap-2 text-[#e8539e] mb-1">
                  <Calendar size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {lng === 'vi' ? 'Thời gian' : 'Date & Time'}
                  </span>
                </div>
                <p className="font-bold text-[#243d91] text-sm">{event.date}</p>
                <p className="text-[#243d91]/60 text-xs">{event.time}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#f0ede6]">
                <div className="flex items-center gap-2 text-[#4ecef5] mb-1">
                  <MapPin size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {lng === 'vi' ? 'Địa điểm' : 'Location'}
                  </span>
                </div>
                <p className="font-bold text-[#243d91] text-sm">{event.location}</p>
                <p className="text-[#243d91]/60 text-xs">{event.locationType}</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-5 border border-[#f0ede6]">
              <h3 className="font-bold text-[#243d91] mb-2">
                {lng === 'vi' ? 'Mô tả' : 'Description'}
              </h3>
              <p className="text-[#243d91]/70 text-sm leading-relaxed">{event.description}</p>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-2xl p-5 border border-[#f0ede6]">
              <h3 className="font-bold text-[#243d91] mb-4">{t('schedule')}</h3>
              <div className="space-y-3">
                {event.schedule.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 bg-gradient-to-br from-[#e8539e] to-[#4ecef5] text-white text-xs font-bold rounded-full flex items-center justify-center">{i + 1}</div>
                    <div className="flex-1 pt-1">
                      <span className="inline-block bg-[#4ecef5]/10 text-[#4ecef5] text-xs font-bold px-2 py-0.5 rounded-full mr-2">{item.duration}</span>
                      <span className="text-sm font-semibold text-[#243d91]">{item.activity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT - Booking */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 bg-white rounded-2xl border border-[#f0ede6] shadow-lg shadow-[#243d91]/5 overflow-hidden">
              {/* Price header */}
              <div className="bg-gradient-to-r from-[#243d91] to-[#243d91]/80 text-white p-5">
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
                  {lng === 'vi' ? 'Giá vé' : 'Ticket price'}
                </p>
                <p className="font-display font-bold text-3xl">
                  {fmt(event.price)}
                  <span className="text-lg font-sans font-normal text-white/60">
                    /{lng === 'vi' ? 'người' : 'person'}
                  </span>
                </p>
              </div>

              {step === 'info' && (
                <div className="p-5 space-y-5">
                  {/* Qty */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#243d91]/60 mb-2">
                      {t('numPeople')}
                    </label>
                    <div className="flex items-center justify-between bg-[#f0ede6]/50 rounded-xl p-2">
                      <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-[#e8539e] hover:text-white transition-all"><Minus size={16} /></button>
                      <span className="font-display font-bold text-2xl text-[#243d91]">{qty}</span>
                      <button onClick={() => setQty(Math.min(event.maxAttendees, qty + 1))} className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-[#4ecef5] hover:text-white transition-all"><Plus size={16} /></button>
                    </div>
                    {qty >= 2 && (
                      <p className="mt-2 text-xs font-bold text-[#e8539e] bg-[#e8539e]/10 px-3 py-2 rounded-lg flex items-center gap-1.5">
                        <Sparkles size={12} />
                        {lng === 'vi' ? `Combo ${qty} người — giảm 10%!` : `${qty}-person combo — 10% off!`}
                      </p>
                    )}
                  </div>

                  {/* Add-ons */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#243d91]/60 mb-2">
                      {t('addons')}
                    </label>
                    <div className="space-y-2">
                      {addons.map((a) => (
                        <label key={a.id} className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${a.val ? 'border-[#e8539e] bg-[#e8539e]/5' : 'border-[#f0ede6] hover:border-[#4ecef5]'}`}>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" className="accent-[#e8539e] w-4 h-4" checked={a.val} onChange={(e) => a.set(e.target.checked)} />
                            <span className="text-sm font-bold text-[#243d91]">{a.label}</span>
                          </div>
                          <span className="text-xs font-bold text-[#243d91]/50">+{fmt(a.price)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price breakdown */}
                  <div className="border-t border-[#f0ede6] pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-[#243d91]/60">
                      <span>{lng === 'vi' ? `Tạm tính (${qty} vé)` : `Subtotal (${qty} ticket${qty > 1 ? 's' : ''})`}</span>
                      <span>{fmt(basePrice)}</span>
                    </div>
                    {discount > 0 && <div className="flex justify-between text-[#e8539e]"><span>{lng === 'vi' ? 'Ưu đãi combo' : 'Combo discount'}</span><span>-{fmt(discount)}</span></div>}
                    {addonCost > 0 && <div className="flex justify-between text-[#4ecef5]"><span>{lng === 'vi' ? 'Dịch vụ thêm' : 'Add-ons'}</span><span>+{fmt(addonCost)}</span></div>}
                    <div className="flex justify-between font-display font-bold text-lg text-[#243d91] border-t border-dashed border-[#f0ede6] pt-2">
                      <span>{lng === 'vi' ? 'Tổng cộng' : 'Total'}</span>
                      <span className="text-[#e8539e]">{fmt(total)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('pay')}
                    disabled={event.status === 'Sold Out'}
                    className="w-full py-3.5 bg-[#e8539e] text-white font-bold rounded-xl hover:bg-[#e8539e]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#e8539e]/30 flex items-center justify-center gap-2"
                  >
                    {event.status === 'Sold Out'
                      ? (lng === 'vi' ? 'Hết vé' : 'Sold Out')
                      : (<><span>{t('getTickets')}</span><ChevronRight size={18} /></>)
                    }
                  </button>
                </div>
              )}

              {step === 'pay' && (
                <form className="p-5 space-y-4" onSubmit={(e) => { e.preventDefault(); setStep('done'); }}>
                  <h3 className="font-bold text-[#243d91]">
                    {lng === 'vi' ? 'Thông tin người đặt' : 'Booking information'}
                  </h3>
                  {payFields.map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs font-bold uppercase text-[#243d91]/60 mb-1">{f.label}</label>
                      <input
                        type={f.type}
                        required
                        placeholder={f.placeholder}
                        value={form[f.key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-[#f0ede6] text-sm font-semibold text-[#243d91] outline-none focus:border-[#e8539e] transition-all bg-[#f0ede6]/30"
                      />
                    </div>
                  ))}

                  {/* Mock payment */}
                  <div className="bg-[#243d91] rounded-xl p-4 text-white flex items-center gap-3">
                    <CreditCard size={20} className="text-[#4ecef5] shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white/60 mb-0.5">
                        {lng === 'vi' ? 'Thanh toán qua' : 'Payment via'}
                      </p>
                      <p className="font-bold text-sm">VNPay / Momo / QR Bank</p>
                    </div>
                    <span className="ml-auto font-display font-bold text-[#e8539e]">{fmt(total)}</span>
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep('info')} className="flex-1 py-3 rounded-xl bg-[#f0ede6] text-[#243d91] font-bold text-sm">
                      {lng === 'vi' ? 'Quay lại' : 'Back'}
                    </button>
                    <button type="submit" className="flex-[2] py-3 rounded-xl bg-[#e8539e] text-white font-bold text-sm shadow-lg shadow-[#e8539e]/30">
                      {lng === 'vi' ? 'Xác nhận & Thanh toán' : t('payNow')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
