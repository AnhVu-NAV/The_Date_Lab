import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, MapPin, Users, Minus, Plus, Sparkles, CreditCard, CheckCircle2, ChevronRight } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMockEvents } from '../data';

export default function EventDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const events = getMockEvents('vi');
  const event = events.find((e) => String(e.id) === id);

  const [qty, setQty] = useState(1);
  const [instax, setInstax] = useState(false);
  const [keychain, setKeychain] = useState(false);
  const [step, setStep] = useState<'info' | 'pay' | 'done'>('info');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  if (!event) return (
    <div className="text-center py-20">
      <p className="text-[#243d91]/50 font-bold mb-4">Không tìm thấy sự kiện</p>
      <button onClick={() => navigate('/')} className="bg-[#e8539e] text-white px-6 py-3 rounded-xl font-bold">Về trang chủ</button>
    </div>
  );

  const basePrice = event.price * qty;
  const discount = qty >= 2 ? basePrice * 0.1 : 0;
  const addons = (instax ? 50000 : 0) + (keychain ? 85000 : 0);
  const total = basePrice - discount + addons;
  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

  const statusColor = event.status === 'Available'
    ? 'bg-emerald-100 text-emerald-700'
    : event.status === 'Almost Sold Out'
    ? 'bg-orange-100 text-orange-600'
    : 'bg-red-100 text-red-600';

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-[#243d91]/60 hover:text-[#243d91] mb-6 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Quay lại
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
          <h2 className="font-display font-bold text-3xl text-[#243d91] mb-3">Đặt vé thành công! 🎉</h2>
          <p className="text-[#243d91]/60 mb-2">E-Ticket đã được gửi về <strong>{form.email}</strong></p>
          <p className="text-sm text-[#243d91]/40 mb-8">Vé sẽ được lưu trong kho vé của bạn.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-[#243d91] text-white font-bold rounded-xl hover:bg-[#243d91]/90 transition-all">
              Xem vé của tôi
            </button>
            <button onClick={() => navigate('/')} className="px-6 py-3 bg-[#ebe8dd] text-[#243d91] font-bold rounded-xl hover:bg-[#ebe8dd]/70 transition-all">
              Về trang chủ
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
                {event.status === 'Available' ? '✅ Còn chỗ' : event.status === 'Almost Sold Out' ? '🔥 Sắp hết' : '❌ Sold Out'}
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h1 className="font-display font-bold text-2xl md:text-3xl text-white leading-tight">{event.title}</h1>
              </div>
            </div>

            {/* Meta info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-4 border border-[#ebe8dd]">
                <div className="flex items-center gap-2 text-[#e8539e] mb-1"><Calendar size={16} /><span className="text-xs font-bold uppercase tracking-widest">Thời gian</span></div>
                <p className="font-bold text-[#243d91] text-sm">{event.date}</p>
                <p className="text-[#243d91]/60 text-xs">{event.time}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#ebe8dd]">
                <div className="flex items-center gap-2 text-[#4ecef5] mb-1"><MapPin size={16} /><span className="text-xs font-bold uppercase tracking-widest">Địa điểm</span></div>
                <p className="font-bold text-[#243d91] text-sm">{event.location}</p>
                <p className="text-[#243d91]/60 text-xs">{event.locationType}</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-5 border border-[#ebe8dd]">
              <h3 className="font-bold text-[#243d91] mb-2">Mô tả</h3>
              <p className="text-[#243d91]/70 text-sm leading-relaxed">{event.description}</p>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-2xl p-5 border border-[#ebe8dd]">
              <h3 className="font-bold text-[#243d91] mb-4">Lịch trình trải nghiệm</h3>
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
            <div className="sticky top-24 bg-white rounded-2xl border border-[#ebe8dd] shadow-lg shadow-[#243d91]/5 overflow-hidden">
              {/* Price header */}
              <div className="bg-gradient-to-r from-[#243d91] to-[#243d91]/80 text-white p-5">
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Giá vé</p>
                <p className="font-display font-bold text-3xl">{fmt(event.price)}<span className="text-lg font-sans font-normal text-white/60">/người</span></p>
              </div>

              {step === 'info' && (
                <div className="p-5 space-y-5">
                  {/* Qty */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#243d91]/60 mb-2">Số người tham gia</label>
                    <div className="flex items-center justify-between bg-[#ebe8dd]/50 rounded-xl p-2">
                      <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-[#e8539e] hover:text-white transition-all"><Minus size={16} /></button>
                      <span className="font-display font-bold text-2xl text-[#243d91]">{qty}</span>
                      <button onClick={() => setQty(Math.min(event.maxAttendees, qty + 1))} className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-[#4ecef5] hover:text-white transition-all"><Plus size={16} /></button>
                    </div>
                    {qty >= 2 && (
                      <p className="mt-2 text-xs font-bold text-[#e8539e] bg-[#e8539e]/10 px-3 py-2 rounded-lg flex items-center gap-1.5">
                        <Sparkles size={12} /> Combo {qty} người — giảm 10%!
                      </p>
                    )}
                  </div>

                  {/* Add-ons */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#243d91]/60 mb-2">Dịch vụ thêm</label>
                    <div className="space-y-2">
                      {[
                        { id: 'instax', label: '📸 Ảnh Instax lấy liền', price: 50000, val: instax, set: setInstax },
                        { id: 'key', label: '🗝 Móc khoá TDL', price: 85000, val: keychain, set: setKeychain },
                      ].map((a) => (
                        <label key={a.id} className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${a.val ? 'border-[#e8539e] bg-[#e8539e]/5' : 'border-[#ebe8dd] hover:border-[#4ecef5]'}`}>
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
                  <div className="border-t border-[#ebe8dd] pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-[#243d91]/60"><span>Tạm tính ({qty} vé)</span><span>{fmt(basePrice)}</span></div>
                    {discount > 0 && <div className="flex justify-between text-[#e8539e]"><span>Ưu đãi combo</span><span>-{fmt(discount)}</span></div>}
                    {addons > 0 && <div className="flex justify-between text-[#4ecef5]"><span>Dịch vụ thêm</span><span>+{fmt(addons)}</span></div>}
                    <div className="flex justify-between font-display font-bold text-lg text-[#243d91] border-t border-dashed border-[#ebe8dd] pt-2">
                      <span>Tổng cộng</span><span className="text-[#e8539e]">{fmt(total)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('pay')}
                    disabled={event.status === 'Sold Out'}
                    className="w-full py-3.5 bg-[#e8539e] text-white font-bold rounded-xl hover:bg-[#e8539e]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#e8539e]/30 flex items-center justify-center gap-2"
                  >
                    {event.status === 'Sold Out' ? 'Hết vé' : (<><span>Tiến hành đặt vé</span><ChevronRight size={18} /></>)}
                  </button>
                </div>
              )}

              {step === 'pay' && (
                <form className="p-5 space-y-4" onSubmit={(e) => { e.preventDefault(); setStep('done'); }}>
                  <h3 className="font-bold text-[#243d91]">Thông tin người đặt</h3>
                  {[
                    { key: 'name', label: 'Họ và tên', type: 'text', placeholder: 'Nguyễn Văn A' },
                    { key: 'email', label: 'Email nhận vé', type: 'email', placeholder: 'email@example.com' },
                    { key: 'phone', label: 'Số điện thoại', type: 'tel', placeholder: '0912 345 678' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs font-bold uppercase text-[#243d91]/60 mb-1">{f.label}</label>
                      <input
                        type={f.type}
                        required
                        placeholder={f.placeholder}
                        value={form[f.key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-[#ebe8dd] text-sm font-semibold text-[#243d91] outline-none focus:border-[#e8539e] transition-all bg-[#ebe8dd]/30"
                      />
                    </div>
                  ))}

                  {/* Mock payment */}
                  <div className="bg-[#243d91] rounded-xl p-4 text-white flex items-center gap-3">
                    <CreditCard size={20} className="text-[#4ecef5] shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white/60 mb-0.5">Thanh toán qua</p>
                      <p className="font-bold text-sm">VNPay / Momo / QR Bank</p>
                    </div>
                    <span className="ml-auto font-display font-bold text-[#e8539e]">{fmt(total)}</span>
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep('info')} className="flex-1 py-3 rounded-xl bg-[#ebe8dd] text-[#243d91] font-bold text-sm">
                      Quay lại
                    </button>
                    <button type="submit" className="flex-[2] py-3 rounded-xl bg-[#e8539e] text-white font-bold text-sm shadow-lg shadow-[#e8539e]/30">
                      Xác nhận & Thanh toán
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
