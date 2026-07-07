import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Calendar, MapPin, Minus, Plus, Sparkles, CreditCard, CheckCircle2, ChevronRight, X, Copy, Clock, Flame, Ban, Lock, PartyPopper } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export default function EventDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lng, t } = useLanguage();
  const { user, token } = useAuth();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [qty, setQty] = useState(1);
  const [step, setStep] = useState<'info' | 'pay' | 'qr' | 'done'>('info');
  const [ticketData, setTicketData] = useState<any>(null);
  const [qrData, setQrData] = useState<any>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dbAddons, setDbAddons] = useState<any[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const defaultContractText = `CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập – Tự do – Hạnh Phúc
...., Ngày {{date}}

HỢP ĐỒNG ĐỘC QUYỀN SỬ DỤNG HÌNH ẢNH CÁ NHÂN

Căn cứ: Bộ luật Dân sự 2015
Căn cứ: Luật Sở hữu trí tuệ
Căn cứ: Nhu cầu và khả năng của các bên

Hôm nay, ngày {{date}}, chúng tôi bao gồm:

Bên A: Bên sở hữu hình ảnh (Khách hàng tham gia sự kiện)
- Họ và tên: {{name}}
- Số điện thoại: {{phone}}
- Địa chỉ: {{address}}
- Ngày sinh: {{dob}}

Bên B: Bên sử dụng hình ảnh độc quyền (Ban tổ chức - The Date Lab)
- Đại diện bởi Ban tổ chức sự kiện

Cùng bàn bạc thống nhất những thoả thuận sau đây:

Điều 1. Đối tượng hợp đồng
Các bên xác định đối tượng hợp đồng như sau: Bên B quản lý độc quyền hình ảnh Bên A, mục đích thực hiện công việc với những nội dung mô tả như sau:
- Quảng cáo, quảng bá hình ảnh của Bên A cùng với sản phẩm, dịch vụ của Bên B.
- Đăng thông tin sản phẩm, dịch vụ cùng hình ảnh của Bên A trên các Webstie, báo đài,..

Điều 2. Phạm vi và mục đích sử dụng hình ảnh
- Bên A đồng ý cho phép bên B toàn quyền sử dụng hình ảnh cá nhân của mình để đăng lên các website của dự án, màn hình lớn, in trên các tờ rơi, in trên vé bán, … Không một bên thứ ba nào khác có thể sử dụng hình ảnh của Bên A trong suốt thời gian thực hiện hợp đồng với Bên B.
- Bên B chỉ được sử dụng hình ảnh của bên A cho các sản phẩm, sự kiện thuộc thương hiệu của The Date Lab như đã thoả thuận. Trường hợp bên B sử dụng hình ảnh của bên A nhằm quảng cáo cho các sản phẩm khác không thuộc các sản phẩm đã nêu trên là vi phạm hợp đồng, Bên A có quyền đơn phương chấm dứt hợp đồng với bên B.
- Thời gian sử dụng hình ảnh: Vô thời hạn kể từ ngày Hợp đồng này có hiệu lực.
- Mục đích sử dụng hình ảnh: Bên B sử dụng hình ảnh của Bên A nhằm mục đích quảng cáo sản phẩm, dịch vụ của Bên B trên báo đài, website, tờ rơi, vé bán, mạng xã hội…

Điều 3. Quyền sở hữu về tác phẩm hình ảnh, bản ghi âm, ghi hình
- Các sản phẩm của bên B như hình ảnh, bản ghi âm, ghi hình,….được bên B đầu tư, sáng tác, tạo ra có chứa hình ảnh cá nhân của bên A sẽ thuộc quyền sở hữu của bên B. Bên B được toàn quyền sử dụng, sao chép trực tiếp hoặc gián tiếp, phân phối đến công chúng bằng hình thức bán, cho thuê, hoặc phân phối bằng bất kỳ phương tiện kĩ thuật nào mà công chúng có thể tiếp cận được.
- Bên A phải được giới thiệu trong các tác phẩm: Hình ảnh, bản ghi âm, ghi hình của bên B. Bên B phải bảo vệ toàn vẹn hình ảnh của bên A, không được cắt xén hoặc xuyên tạc dưới bất kì hình thức nào gây phương hại đến danh dự và uy tín của bên A.

Điều 4. Thù lao và phương thức thanh toán
Hợp đồng này được xem là một phần của điều khoản tham gia sự kiện. Việc Bên A đồng ý tham gia sự kiện đồng nghĩa với việc cho phép Bên B sử dụng hình ảnh mà không yêu cầu thù lao (trừ khi có thoả thuận khác bằng văn bản).

Điều 5. Quyền và nghĩa vụ của các bên
5.1 Quyền và nghĩa vụ của Bên A:
- Bên A có quyền yêu cầu Bên B tháo gỡ hình ảnh của mình, nếu phát hiện Bên B sử dụng không đúng phạm vi, mục đích sử dụng. Đồng thời yêu cầu Bên B bồi thường thiệt hại, nếu Bên B sử dụng hình ảnh của Bên A vào mục đích xấu, gây ảnh hưởng đến hình cảnh của Bên A.
- Cung cấp độc quyền hình ảnh cho Bên B đúng thời hạn, và đầy đủ (thông qua việc tham gia sự kiện).

5.2 Quyền và nghĩa vụ của Bên B:
- Được toàn quyền sử dụng hình ảnh của Bên A đăng lên các Website quảng cáo, trên báo đài, in hình ảnh của Bên A trên các tờ rơi, vé bán, mạng xã hội… nhằm mục đích quảng cáo sản phẩm, dịch vụ của công ty.
- Được quyền chỉnh sửa hình ảnh của Bên A, nếu được Bên A đồng ý.
- Sử dụng hình ảnh của Bên A đúng phạm vi và mục đích sử dụng.
- Không được tự ý chỉnh sửa hình ảnh của Bên A khi Bên A chưa cho phép hay đồng ý làm sai lệch bản chất hình ảnh.

Điều 6. Phạt vi phạm & Điều 7. Bồi thường thiệt hại
Theo quy định của pháp luật hiện hành và các quy định chung của ban tổ chức.

Điều 8. Giải quyết tranh chấp
- Trường hợp các bên có tranh chấp hoặc liên quan đến hợp đồng này thì hai bên cùng nhau bàn bạc giải quyết thông qua thương lượng, hoà giải để đảm bảo quyền lợi của cả hai bên.
- Trường hợp không thương lượng, hoà giải được thì một hoặc cả hai bên được khởi kiện tại Toà án có thẩm quyền.

Điều 9. Chấm dứt hợp đồng
- Khi có yêu cầu bằng văn bản và được sự đồng ý của cả hai bên.
- Theo quy định của pháp luật.

Điều 10. Hiệu lực hợp đồng
- Hợp đồng này có hiệu lực kể từ khi Khách hàng (Bên A) tích chọn "Tôi đồng ý" và hoàn tất việc mua vé.
- Hai bên cam kết thực hiện đúng các điều khoản của hợp đồng.`;

  const [contractText, setContractText] = useState(defaultContractText);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.getEvent(id),
      api.getAddons().catch(() => []), // Fetch addons, ignore error if fails
      api.getSettings().catch(() => ({}))
    ])
      .then(([evt, addonsList, sysSettings]) => {
        setEvent(evt);
        setDbAddons(addonsList.filter((a: any) => a.isActive && (evt.addonIds || []).includes(a.id)));
        if (sysSettings.image_rights_contract) {
          setContractText(sysSettings.image_rights_contract);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-[#e8539e] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !event) return (
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
  
  let comboDiscounts = Array.isArray(event.comboDiscounts) ? event.comboDiscounts : [];
  if (comboDiscounts.length === 0 && event.comboMinTickets > 0 && event.comboDiscountPercent > 0) {
    comboDiscounts = [{ minTickets: event.comboMinTickets, discountPercent: event.comboDiscountPercent }];
  }
  
  const sortedAscDiscounts = [...(event.comboDiscounts || [])].sort((a: any, b: any) => a.minTickets - b.minTickets);
  const sortedDescDiscounts = [...(event.comboDiscounts || [])].sort((a: any, b: any) => b.minTickets - a.minTickets);
  
  let applicableTier: any = null;
  for (const tier of sortedDescDiscounts) {
    if (qty >= tier.minTickets) {
      applicableTier = tier;
      break;
    }
  }

  let nextTier: any = null;
  for (const tier of sortedAscDiscounts) {
    if (qty < tier.minTickets) {
      nextTier = tier;
      break;
    }
  }

  let discount = 0;
  if (applicableTier) {
    if (applicableTier.fixedPrice > 0) {
      const numCombos = Math.floor(qty / applicableTier.minTickets);
      const remainder = qty % applicableTier.minTickets;
      const comboTotal = (numCombos * applicableTier.fixedPrice) + (remainder * event.price);
      discount = basePrice - comboTotal;
    } else if (applicableTier.discountPercent > 0) {
      discount = Math.round(basePrice * (applicableTier.discountPercent / 100));
    }
  }
  
  // Calculate selected addon cost
  const addonCost = dbAddons.filter(a => selectedAddons.has(a.id)).reduce((sum, a) => sum + (a.price || 0), 0);
  
  const total = basePrice - discount + addonCost;
  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

  const statusContent = event.status === 'Available'
    ? <><CheckCircle2 size={14} className="mr-1 inline-block shrink-0 -mt-0.5" />{lng === 'vi' ? 'Còn chỗ' : 'Available'}</>
    : event.status === 'Almost Sold Out'
    ? <><Flame size={14} className="mr-1 inline-block shrink-0 -mt-0.5" />{lng === 'vi' ? 'Sắp hết' : 'Almost Sold Out'}</>
    : <><Ban size={14} className="mr-1 inline-block shrink-0 -mt-0.5" />Sold Out</>;

  const statusColor = event.status === 'Available' ? 'bg-emerald-100 text-emerald-700'
    : event.status === 'Almost Sold Out' ? 'bg-orange-100 text-orange-600'
    : 'bg-red-100 text-red-600';

  const handleAddonToggle = (addonId: string) => {
    const next = new Set(selectedAddons);
    if (next.has(addonId)) next.delete(addonId);
    else next.add(addonId);
    setSelectedAddons(next);
  };

  const handleBook = async () => {
    if (!user || !token) { navigate('/login'); return; }
    setBookingLoading(true);
    try {
      const addonList = dbAddons
        .filter(a => selectedAddons.has(a.id))
        .map(a => ({ name: lng === 'vi' ? a.name : a.nameEn, price: a.price }));
        
      const ticket = await api.bookTicket({ eventId: event.id, quantity: qty, addons: addonList, totalPrice: total }, token);
      setTicketData(ticket);

      // Generate QR
      const qr = await api.generateQR({ amount: total, description: `Dat ve ${event.title}`, ticketId: ticket.paymentRef });
      setQrData(qr);
      setStep('qr');
    } catch (err: any) {
      toast.error(err.message || (lng === 'vi' ? 'Đặt vé thất bại' : 'Booking failed'));
    } finally {
      setBookingLoading(false);
    }
  };

  const copyRef = () => {
    navigator.clipboard.writeText(qrData?.ref || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const processedContractText = contractText
    .replace(/{{name}}/g, user?.name || '...........................................')
    .replace(/{{phone}}/g, user?.phone || '.........................')
    .replace(/{{dob}}/g, user?.dob || '.........................')
    .replace(/{{address}}/g, user?.address || '...........................................')
    .replace(/{{date}}/g, new Date().toLocaleDateString('vi-VN'))
    .replace(/{{event_name}}/g, event.title || '.........................');

  return (
    <div className="max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-[#243d91]/60 hover:text-[#243d91] mb-6 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        {lng === 'vi' ? 'Quay lại' : 'Go back'}
      </button>

      {step === 'done' ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 flex flex-col items-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
          <h2 className="font-display font-bold text-3xl text-[#243d91] mb-3">
            {lng === 'vi' ? 'Đặt vé thành công!' : 'Ticket confirmed!'} <PartyPopper size={28} className="inline-block text-[#e8539e] ml-2 -mt-2" />
          </h2>
          <p className="text-[#243d91]/60 mb-2">
            {lng === 'vi' ? 'Vé của bạn đang chờ xác nhận thanh toán.' : 'Your ticket is pending payment confirmation.'}
          </p>
          <p className="text-sm text-[#243d91]/40 mb-8">
            {lng === 'vi' ? 'Admin sẽ xác nhận trong vòng 24h.' : 'Admin will confirm within 24 hours.'}
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
          {/* LEFT */}
          <div className="lg:col-span-3 space-y-5">
            <div className="relative rounded-2xl overflow-hidden h-64 md:h-80">
              <img src={event.imageUrl || event.image} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusColor}`}>{event.type}</span>
              </div>
              <div className={`absolute top-4 right-4 flex items-center text-xs font-bold px-3 py-1.5 rounded-full ${statusColor}`}>{statusContent}</div>
              <div className="absolute bottom-4 left-4 right-4">
                <h1 className="font-display font-bold text-2xl md:text-3xl text-white leading-tight">{event.title}</h1>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-4 border border-[#f0ede6]">
                <div className="flex items-center gap-2 text-[#e8539e] mb-1"><Calendar size={16} /><span className="text-xs font-bold uppercase tracking-widest">{lng === 'vi' ? 'Thời gian' : 'Date & Time'}</span></div>
                <p className="font-bold text-[#243d91] text-sm">{event.date}</p>
                <p className="text-[#243d91]/60 text-xs">{event.time}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#f0ede6]">
                <div className="flex items-center gap-2 text-[#4ecef5] mb-1"><MapPin size={16} /><span className="text-xs font-bold uppercase tracking-widest">{lng === 'vi' ? 'Địa điểm' : 'Location'}</span></div>
                <p className="font-bold text-[#243d91] text-sm">{event.location}</p>
                <p className="text-[#243d91]/60 text-xs">{event.locationType}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#f0ede6]">
              <h3 className="font-bold text-[#243d91] mb-2">{lng === 'vi' ? 'Mô tả' : 'Description'}</h3>
              <p className="text-[#243d91]/70 text-sm leading-relaxed">{event.description}</p>
            </div>

            {event.schedule && event.schedule.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-[#f0ede6]">
                <h3 className="font-bold text-[#243d91] mb-4">{t('schedule')}</h3>
                <div className="space-y-3">
                  {event.schedule.map((item: any, i: number) => (
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
            )}
          </div>

          {/* RIGHT — Booking */}
          <div className="lg:col-span-2">
            <div id="booking" className="sticky top-24 bg-white rounded-2xl border border-[#f0ede6] shadow-lg shadow-[#243d91]/5 overflow-hidden">
              <div className="bg-gradient-to-r from-[#243d91] to-[#243d91]/80 text-white p-5">
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">{lng === 'vi' ? 'Giá vé' : 'Ticket price'}</p>
                <p className="font-display font-bold text-3xl">{fmt(event.price)}<span className="text-lg font-sans font-normal text-white/60">/{lng === 'vi' ? 'người' : 'person'}</span></p>
              </div>

              {/* TERMS MODAL */}
              <AnimatePresence>
                {showTermsModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setShowTermsModal(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl max-h-[85vh] flex flex-col"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between mb-4 shrink-0">
                        <h3 className="font-display font-bold text-[#243d91] text-lg">
                          {lng === 'vi' ? 'Hợp đồng sử dụng hình ảnh cá nhân' : 'Personal Image Use Contract'}
                        </h3>
                        <button onClick={() => setShowTermsModal(false)} className="w-8 h-8 rounded-full bg-[#f0ede6] flex items-center justify-center text-[#243d91]/60 hover:text-red-500 transition-all">
                          <X size={14} />
                        </button>
                      </div>
                      
                      <div className="overflow-y-auto flex-1 pr-2 space-y-3 text-sm text-[#243d91]/80 custom-scrollbar">
                        {processedContractText.split('\n').map((line, idx) => {
                          if (line.trim() === '') return <div key={idx} className="h-1" />;
                          const isHeader = line.includes('CỘNG HOÀ') || line.includes('Độc lập') || line.includes('HỢP ĐỒNG') || line.includes('Ngày') && line.includes('....');
                          const isBold = line.includes('Điều ') || line.includes('Bên A') || line.includes('Bên B') || line.includes('Hôm nay, ngày') || line.includes('Căn cứ:') || isHeader;
                          
                          return (
                            <p 
                              key={idx} 
                              className={`${isHeader ? 'text-center' : ''} ${isBold ? 'font-bold' : ''} ${line.includes('HỢP ĐỒNG ĐỘC QUYỀN') ? 'text-lg mt-4 mb-2' : ''}`}
                            >
                              {line}
                            </p>
                          );
                        })}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-[#f0ede6] shrink-0">
                        <button 
                          onClick={() => {
                            setAgreedToTerms(true);
                            setShowTermsModal(false);
                          }}
                          className="w-full py-3 bg-[#e8539e] text-white font-bold rounded-xl hover:bg-[#e8539e]/90 transition-all"
                        >
                          {lng === 'vi' ? 'Tôi đã đọc và đồng ý' : 'I have read and agree'}
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* QR PAYMENT MODAL */}
              <AnimatePresence>
                {step === 'qr' && qrData && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => {}}
                  >
                    <motion.div
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display font-bold text-[#243d91] text-lg flex items-center gap-2">
                          <CreditCard size={18} className="text-[#243d91]" />
                          {lng === 'vi' ? 'Thanh toán' : 'Payment'}
                        </h3>
                        <button onClick={() => setStep('done')} className="w-8 h-8 rounded-full bg-[#f0ede6] flex items-center justify-center text-[#243d91]/60 hover:text-red-500 transition-all">
                          <X size={14} />
                        </button>
                      </div>

                      <div className="text-center">
                        <img
                          src={qrData.qrUrl}
                          alt="QR Code"
                          className="w-48 h-48 mx-auto rounded-xl border-4 border-[#f0ede6] mb-4"
                        />
                        <p className="font-bold text-[#243d91] text-xl mb-1">{fmt(qrData.amount)}</p>
                        <p className="text-xs text-[#243d91]/50 mb-3">
                          {qrData.bank.bankName} · {qrData.bank.accountNumber}
                        </p>

                        <div className="bg-[#f0ede6] rounded-xl p-3 mb-4">
                          <p className="text-xs text-[#243d91]/50 mb-1">{lng === 'vi' ? 'Nội dung chuyển khoản' : 'Transfer note'}</p>
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-bold text-[#243d91] font-mono text-sm">{qrData.ref}</p>
                            <button onClick={copyRef} className="flex items-center gap-1 text-xs font-bold text-[#e8539e] hover:opacity-80 transition-all">
                              <Copy size={12} /> {copied ? (lng === 'vi' ? 'Đã copy!' : 'Copied!') : 'Copy'}
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-[#243d91]/40 mb-4 flex items-center justify-center gap-1">
                          <Clock size={11} /> {lng === 'vi' ? 'Chuyển khoản đúng nội dung để xác nhận nhanh hơn' : 'Include transfer note for faster confirmation'}
                        </p>

                        <button
                          onClick={() => setStep('done')}
                          className="w-full py-3 bg-[#e8539e] text-white font-bold rounded-xl hover:bg-[#e8539e]/90 transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 size={18} />
                          {lng === 'vi' ? 'Đã chuyển tiền' : 'I have transferred'}
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {step === 'info' && (
                <div className="p-5 space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#243d91]/60 mb-2">{t('numPeople')}</label>
                    <div className="flex items-center justify-between bg-[#f0ede6]/50 rounded-xl p-2 mb-2">
                      <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-[#e8539e] hover:text-white transition-all"><Minus size={16} /></button>
                      <input 
                        type="number" 
                        value={qty || ''} 
                        onChange={(e) => {
                          if (e.target.value === '') {
                             setQty('' as any);
                             return;
                          }
                          let val = parseInt(e.target.value);
                          if (isNaN(val)) return;
                          const maxQty = (event.maxAttendees || 20) - (event.attendees || 0);
                          setQty(Math.min(val, maxQty));
                        }}
                        onBlur={() => {
                          if (!qty || qty < 1) setQty(1);
                        }}
                        className="font-display font-bold text-2xl text-[#243d91] bg-transparent text-center w-20 outline-none"
                      />
                      <button onClick={() => setQty(Math.min((event.maxAttendees || 20) - (event.attendees || 0), qty + 1))} className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-[#4ecef5] hover:text-white transition-all"><Plus size={16} /></button>
                    </div>
                    <div className="flex gap-2 mb-2">
                      {[5, 10, 20].map(n => (
                        <button 
                          key={n} 
                          onClick={() => {
                            const current = parseInt(qty as any) || 0;
                            const maxQty = (event.maxAttendees || 20) - (event.attendees || 0);
                            setQty(Math.min(current + n, maxQty));
                          }}
                          className="flex-1 py-1.5 bg-white border border-[#f0ede6] rounded-lg text-xs font-bold text-[#243d91] hover:border-[#e8539e] hover:text-[#e8539e] transition-all shadow-sm"
                        >
                          +{n}
                        </button>
                      ))}
                    </div>
                    {comboDiscounts.length > 0 && !applicableTier && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs font-bold text-[#243d91]/60 uppercase tracking-widest mb-1">{lng === 'vi' ? 'Các mức ưu đãi Combo:' : 'Combo Deals:'}</p>
                        {sortedAscDiscounts.map((tier: any, idx: number) => (
                          <p key={idx} className="text-xs font-bold text-[#243d91]/80 bg-[#f0ede6]/50 px-3 py-2 rounded-lg flex items-center gap-1.5 border border-[#f0ede6]">
                            <Sparkles size={12} className="text-[#4ecef5]" /> {lng === 'vi' ? `Mua từ ${tier.minTickets} vé — ${tier.fixedPrice > 0 ? `giá ${fmt(tier.fixedPrice)}` : `giảm ${tier.discountPercent}%`}` : `Buy ${tier.minTickets}+ tickets — ${tier.fixedPrice > 0 ? `${fmt(tier.fixedPrice)}` : `${tier.discountPercent}% off`}`}
                          </p>
                        ))}
                      </div>
                    )}
                    {applicableTier && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs font-bold text-[#e8539e] bg-[#e8539e]/10 px-3 py-2 rounded-lg flex items-center gap-1.5">
                          <Sparkles size={12} /> {lng === 'vi' ? `Áp dụng Combo ${applicableTier.minTickets} vé — ${applicableTier.fixedPrice > 0 ? `chỉ ${fmt(applicableTier.fixedPrice)}` : `giảm ${applicableTier.discountPercent}%`}!` : `${applicableTier.minTickets}-ticket combo applied — ${applicableTier.fixedPrice > 0 ? `only ${fmt(applicableTier.fixedPrice)}` : `${applicableTier.discountPercent}% off`}!`}
                        </p>
                        {nextTier && (
                          <p className="text-xs font-bold text-[#243d91]/60 bg-[#f0ede6]/50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-dashed border-[#f0ede6]">
                            <Sparkles size={12} className="text-[#4ecef5]" /> {lng === 'vi' ? `Mua thêm ${nextTier.minTickets - qty} vé nữa để được ${nextTier.fixedPrice > 0 ? `giá ${fmt(nextTier.fixedPrice)}` : `giảm ${nextTier.discountPercent}%`}!` : `Buy ${nextTier.minTickets - qty} more tickets for ${nextTier.fixedPrice > 0 ? `${fmt(nextTier.fixedPrice)}` : `${nextTier.discountPercent}% off`}!`}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {dbAddons.length > 0 && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-[#243d91]/60 mb-2">{t('addons')}</label>
                      <div className="space-y-2">
                        {dbAddons.map((a) => {
                          const isSelected = selectedAddons.has(a.id);
                          return (
                            <label key={a.id} className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-[#e8539e] bg-[#e8539e]/5' : 'border-[#f0ede6] hover:border-[#4ecef5]'}`}>
                              <div className="flex items-center gap-3">
                                <input type="checkbox" className="accent-[#e8539e] w-4 h-4" checked={isSelected} onChange={() => handleAddonToggle(a.id)} />
                                {a.imageUrl && <img src={a.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />}
                                <span className="text-sm font-bold text-[#243d91]">{lng === 'vi' ? a.name : a.nameEn}</span>
                              </div>
                              <span className="text-xs font-bold text-[#243d91]/50">+{fmt(a.price)}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-[#f0ede6] pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-[#243d91]/60"><span>{lng === 'vi' ? `Tạm tính (${qty} vé)` : `Subtotal (${qty} ticket${qty > 1 ? 's' : ''})`}</span><span>{fmt(basePrice)}</span></div>
                    {discount > 0 && <div className="flex justify-between text-[#e8539e]"><span>{lng === 'vi' ? 'Ưu đãi combo' : 'Combo discount'}</span><span>-{fmt(discount)}</span></div>}
                    {addonCost > 0 && <div className="flex justify-between text-[#4ecef5]"><span>{lng === 'vi' ? 'Dịch vụ thêm' : 'Add-ons'}</span><span>+{fmt(addonCost)}</span></div>}
                    <div className="flex justify-between font-display font-bold text-lg text-[#243d91] border-t border-dashed border-[#f0ede6] pt-2">
                      <span>{lng === 'vi' ? 'Tổng cộng' : 'Total'}</span>
                      <span className="text-[#e8539e]">{fmt(total)}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-2 bg-[#f0ede6]/30 p-3 rounded-xl border border-[#f0ede6]">
                    <input 
                      type="checkbox" 
                      id="terms" 
                      checked={agreedToTerms} 
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 accent-[#e8539e] w-4 h-4 shrink-0 cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-sm text-[#243d91]/80 cursor-pointer select-none">
                      {lng === 'vi' ? 'Tôi đã đọc và đồng ý với ' : 'I have read and agree to the '}
                      <button 
                        type="button" 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowTermsModal(true); }}
                        className="text-[#e8539e] font-bold underline hover:text-[#243d91] transition-colors"
                      >
                        {lng === 'vi' ? 'Hợp đồng sử dụng hình ảnh cá nhân' : 'Personal Image Use Contract'}
                      </button>
                    </label>
                  </div>

                  {!user ? (
                    <button 
                      onClick={() => navigate('/login')} 
                      disabled={!agreedToTerms}
                      className="w-full py-3.5 bg-[#243d91] text-white font-bold rounded-xl hover:bg-[#243d91]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                      <Lock size={16} /> {lng === 'vi' ? 'Đăng nhập để đặt vé' : 'Log in to book'}
                    </button>
                  ) : (
                    <button
                      onClick={handleBook}
                      disabled={event.status === 'Sold Out' || bookingLoading || !agreedToTerms}
                      className="w-full py-3.5 bg-[#e8539e] text-white font-bold rounded-xl hover:bg-[#e8539e]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#e8539e]/30 flex items-center justify-center gap-2"
                    >
                      {bookingLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : event.status === 'Sold Out' ? (
                        lng === 'vi' ? 'Hết vé' : 'Sold Out'
                      ) : (
                        <><span>{t('getTickets')}</span><ChevronRight size={18} /></>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
