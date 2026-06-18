import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Ticket, Camera, Shield, BarChart3, CalendarDays, Users,
  CreditCard, Layers, Plus, Pencil, Trash2, Check, X, ChevronDown,
  Upload, Star, LogOut, Bell, TrendingUp, Clock, CircleCheck, AlertCircle, MapPin, Download,
  LayoutDashboard, Landmark, ShoppingBag, Sparkles, Home, Lightbulb, CheckCircle2, Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// ─── Shared Form Modal ───────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#f0ede6]">
          <h3 className="font-display font-bold text-xl text-[#243d91]">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#f0ede6] flex items-center justify-center text-[#243d91]/60 hover:text-red-500 transition-all"><X size={15} /></button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-[#243d91]/60 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-4 py-2.5 rounded-xl border-2 border-[#f0ede6] text-sm font-semibold text-[#243d91] outline-none focus:border-[#e8539e] transition-all bg-[#f0ede6]/20";

// ─── Admin: Overview ─────────────────────────────────────────────────────────
function AdminOverview({ token }: { token: string }) {
  const { lng } = useLanguage();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.getStats(token).then(setStats).catch(console.error);
  }, [token]);

  const fmt = (n: number) => n?.toLocaleString('vi-VN') + 'đ';

  const cards = stats ? [
    { label: lng === 'vi' ? 'Tổng doanh thu' : 'Total Revenue', value: fmt(stats.totalRevenue), icon: <TrendingUp size={20} />, color: 'text-[#e8539e] bg-[#e8539e]/10' },
    { label: lng === 'vi' ? 'Vé đã bán' : 'Tickets Sold', value: stats.paidTickets, icon: <Ticket size={20} />, color: 'text-[#4ecef5] bg-[#4ecef5]/10' },
    { label: lng === 'vi' ? 'Chờ xác nhận' : 'Pending', value: stats.pendingPayments, icon: <Clock size={20} />, color: 'text-amber-500 bg-amber-50' },
    { label: lng === 'vi' ? 'Người dùng' : 'Users', value: stats.totalUsers, icon: <Users size={20} />, color: 'text-[#243d91] bg-[#243d91]/10' },
    { label: lng === 'vi' ? 'Sự kiện' : 'Events', value: stats.totalEvents, icon: <CalendarDays size={20} />, color: 'text-emerald-500 bg-emerald-50' },
  ] : [];

  const revenueData = stats?.revenueData?.length > 0 ? stats.revenueData : [{ name: 'Hôm nay', value: 0 }];
  const ticketData = stats?.ticketData?.length > 0 ? stats.ticketData : [{ name: 'Chưa có', sold: 0 }];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {!stats ? (
          [...Array(5)].map((_, i) => <div key={i} className="h-28 bg-[#f0ede6] rounded-2xl animate-pulse" />)
        ) : cards.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-[#f0ede6] shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}>{c.icon}</div>
            <p className="font-display font-bold text-xl text-[#243d91]">{c.value}</p>
            <p className="text-xs text-[#243d91]/50 mt-0.5 font-bold uppercase tracking-wider">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#f0ede6] p-6 shadow-sm">
          <h4 className="font-bold text-[#243d91] mb-6">{lng === 'vi' ? 'Biểu đồ doanh thu 7 ngày qua' : 'Revenue Last 7 Days'}</h4>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e8539e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#e8539e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ede6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#243d91', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#243d91', fontSize: 12}} tickFormatter={(val) => `${val/1000000}M`} dx={-10} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}} formatter={(val: number) => [`${val.toLocaleString('vi-VN')}đ`, 'Doanh thu']} />
                <Area type="monotone" dataKey="value" stroke="#e8539e" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#f0ede6] p-6 shadow-sm">
          <h4 className="font-bold text-[#243d91] mb-6">{lng === 'vi' ? 'Vé bán theo loại sự kiện' : 'Tickets by Event Type'}</h4>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ticketData} layout="vertical" margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0ede6" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#243d91', fontSize: 12, fontWeight: 'bold'}} width={70} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}} formatter={(val: number) => [val, 'Vé']} />
                <Bar dataKey="sold" fill="#4ecef5" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Admin: Events ────────────────────────────────────────────────────────────
function AdminEvents({ token }: { token: string }) {
  const { lng } = useLanguage();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editEvent, setEditEvent] = useState<any>(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const emptyForm = { title: '', type: 'Gốm', date: '', time: '', location: '', locationType: 'Fixed', price: '', maxAttendees: '20', imageUrl: '', status: 'Available', description: '', forWho: 'Couple', addonIds: [] as string[] };
  const [form, setForm] = useState(emptyForm);
  const [addons, setAddons] = useState<any[]>([]);

  useEffect(() => {
    api.getEvents().then(setEvents).finally(() => setLoading(false));
    api.getAddons().then(setAddons).catch(console.error);
  }, []);

  const refresh = () => api.getEvents().then(setEvents);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await api.uploadImage(reader.result as string, 'events', token);
        setForm(f => ({ ...f, imageUrl: res.url }));
      } catch { alert('Upload failed'); }
      finally { setUploadingImg(false); }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const data = { ...form, price: Number(form.price), maxAttendees: Number(form.maxAttendees), forWho: [form.forWho], schedule: [] };
      if (editEvent) await api.updateEvent(editEvent.id, data, token);
      else await api.createEvent(data, token);
      setShowForm(false); setEditEvent(null); setForm(emptyForm);
      refresh();
    } catch (err: any) { alert(err.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(lng === 'vi' ? 'Xóa sự kiện này?' : 'Delete this event?')) return;
    await api.deleteEvent(id, token);
    refresh();
  };

  const openEdit = (ev: any) => {
    setEditEvent(ev);
    setForm({ title: ev.title, type: ev.type || '', date: ev.date || '', time: ev.time || '', location: ev.location || '', locationType: ev.locationType || 'Fixed', price: String(ev.price || ''), maxAttendees: String(ev.maxAttendees || 20), imageUrl: ev.imageUrl || '', status: ev.status || 'Available', description: ev.description || '', forWho: (ev.forWho || ['Couple'])[0], addonIds: ev.addonIds || [] });
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-[#243d91]">{lng === 'vi' ? 'Quản lý sự kiện' : 'Manage Events'}</h3>
        <button onClick={() => { setEditEvent(null); setForm(emptyForm); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-[#e8539e] text-white text-sm font-bold rounded-xl hover:bg-[#e8539e]/90 transition-all">
          <Plus size={15} /> {lng === 'vi' ? 'Thêm sự kiện' : 'Add Event'}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#f0ede6] overflow-hidden">
        {loading ? <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-[#e8539e] border-t-transparent rounded-full animate-spin mx-auto" /></div> : (
          <table className="w-full text-sm">
            <thead className="bg-[#f0ede6]/60">
              <tr>
                {['Sự kiện', 'Loại', 'Ngày', 'Giá', 'Trạng thái', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#243d91]/60">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr key={ev.id} className="border-t border-[#f0ede6] hover:bg-[#f0ede6]/30 transition-colors">
                  <td className="px-4 py-3 font-semibold text-[#243d91]">
                    <div className="flex items-center gap-2">
                      {ev.imageUrl && <img src={ev.imageUrl} className="w-8 h-8 rounded-lg object-cover" alt="" />}
                      {ev.title}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#243d91]/60">{ev.type}</td>
                  <td className="px-4 py-3 text-[#243d91]/60">{ev.date}</td>
                  <td className="px-4 py-3 font-bold text-[#e8539e]">{(ev.price || 0).toLocaleString('vi-VN')}đ</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${ev.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : ev.status === 'Almost Sold Out' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>{ev.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => openEdit(ev)} className="w-8 h-8 rounded-lg bg-[#4ecef5]/10 text-[#4ecef5] hover:bg-[#4ecef5]/20 flex items-center justify-center transition-all"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(ev.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <Modal title={editEvent ? (lng === 'vi' ? 'Sửa sự kiện' : 'Edit Event') : (lng === 'vi' ? 'Thêm sự kiện' : 'Add Event')} onClose={() => { setShowForm(false); setEditEvent(null); }}>
            <div className="space-y-4">
              <FormField label="Tên sự kiện">
                <input className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Workshop Làm Gốm..." />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Loại">
                  <select className={inputCls} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    {['Gốm', 'Nến', 'Nước hoa', 'Baking', 'Vẽ', 'Khác'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </FormField>
                <FormField label="Trạng thái">
                  <select className={inputCls} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    {['Available', 'Almost Sold Out', 'Sold Out'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Ngày"><input className={inputCls} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} placeholder="15/07/2026" /></FormField>
                <FormField label="Giờ"><input className={inputCls} value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} placeholder="14:00 - 17:00" /></FormField>
              </div>
              <FormField label="Địa điểm"><input className={inputCls} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="TDL Studio..." /></FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Giá vé (đ)"><input className={inputCls} type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="350000" /></FormField>
                <FormField label="Tối đa người"><input className={inputCls} type="number" value={form.maxAttendees} onChange={e => setForm(f => ({ ...f, maxAttendees: e.target.value }))} /></FormField>
              </div>
              <FormField label="Phù hợp với">
                <select className={inputCls} value={form.forWho} onChange={e => setForm(f => ({ ...f, forWho: e.target.value }))}>
                  {['Solo', 'Couple', 'Group', 'Family'].map(fw => <option key={fw}>{fw}</option>)}
                </select>
              </FormField>
              <FormField label="Mô tả">
                <textarea className={`${inputCls} resize-none`} rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </FormField>
              <FormField label="Add-ons bán kèm (Tùy chọn)">
                <div className="flex flex-col gap-2 p-3 border-2 border-[#f0ede6] rounded-xl bg-[#f0ede6]/10">
                  {addons.length === 0 ? <p className="text-xs text-[#243d91]/50 italic">Chưa có Add-on nào trong hệ thống</p> : addons.map(a => (
                    <label key={a.id} className="flex items-center gap-3 cursor-pointer">
                      <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${form.addonIds.includes(a.id) ? 'bg-[#e8539e] text-white' : 'bg-white border-2 border-[#f0ede6]'}`}>
                        {form.addonIds.includes(a.id) && <Check size={12} strokeWidth={4} />}
                      </div>
                      <span className="text-sm font-semibold text-[#243d91]">{a.name} <span className="text-[#e8539e]">{(a.price || 0).toLocaleString()}đ</span></span>
                      <input 
                        type="checkbox" className="hidden" 
                        checked={form.addonIds.includes(a.id)}
                        onChange={(e) => {
                          const next = new Set(form.addonIds);
                          if (e.target.checked) next.add(a.id); else next.delete(a.id);
                          setForm(f => ({ ...f, addonIds: Array.from(next) }));
                        }}
                      />
                    </label>
                  ))}
                </div>
              </FormField>
              <FormField label="Ảnh sự kiện">
                <div className="space-y-2">
                  {form.imageUrl && <img src={form.imageUrl} className="w-full h-32 object-cover rounded-xl" alt="preview" />}
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploadingImg} className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#f0ede6] text-sm font-bold text-[#243d91]/60 hover:border-[#e8539e]/30 transition-all flex items-center justify-center gap-2">
                    {uploadingImg ? <div className="w-4 h-4 border-2 border-[#e8539e] border-t-transparent rounded-full animate-spin" /> : <Upload size={14} />}
                    {uploadingImg ? 'Uploading...' : 'Upload ảnh'}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <input className={inputCls} value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="hoặc nhập URL ảnh" />
                </div>
              </FormField>
              <button onClick={handleSave} className="w-full py-3 bg-[#e8539e] text-white font-bold rounded-xl hover:bg-[#e8539e]/90 transition-all">
                {editEvent ? (lng === 'vi' ? 'Lưu thay đổi' : 'Save Changes') : (lng === 'vi' ? 'Tạo sự kiện' : 'Create Event')}
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Admin: Tickets ───────────────────────────────────────────────────────────
function AdminTickets({ token }: { token: string }) {
  const { lng } = useLanguage();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTickets(token).then(setTickets).finally(() => setLoading(false));
  }, [token]);

  const confirmPayment = async (id: string) => {
    await api.updateTicket(id, { paymentStatus: 'paid' }, token);
    setTickets(prev => prev.map(t => t.id === id ? { ...t, paymentStatus: 'paid' } : t));
  };

  const pendingTickets = tickets.filter(t => t.paymentStatus === 'pending');
  const paidTickets = tickets.filter(t => t.paymentStatus === 'paid');

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg text-[#243d91]">{lng === 'vi' ? 'Quản lý vé & Thanh toán' : 'Tickets & Payments'}</h3>

      {/* Pending */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock size={16} className="text-amber-500" />
          <h4 className="font-bold text-sm text-[#243d91]">{lng === 'vi' ? 'Chờ xác nhận' : 'Pending Payment'} ({pendingTickets.length})</h4>
        </div>
        <div className="bg-white rounded-2xl border border-[#f0ede6] overflow-hidden">
          {loading ? <div className="p-8 text-center"><div className="w-5 h-5 border-2 border-[#e8539e] border-t-transparent rounded-full animate-spin mx-auto" /></div> : pendingTickets.length === 0 ? (
            <p className="text-center text-[#243d91]/40 text-sm py-6">{lng === 'vi' ? 'Không có vé chờ xác nhận' : 'No pending tickets'}</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-amber-50"><tr>
                {['Sự kiện', 'Người đặt', 'Số lượng', 'Tổng tiền', 'Mã CK', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-amber-600/70">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {pendingTickets.map(tk => (
                  <tr key={tk.id} className="border-t border-[#f0ede6] hover:bg-amber-50/30">
                    <td className="px-4 py-3 font-semibold text-[#243d91]">{tk.eventTitle}</td>
                    <td className="px-4 py-3 text-[#243d91]/60 text-xs">{tk.userId?.slice(0, 8)}...</td>
                    <td className="px-4 py-3 font-bold text-center">{tk.quantity}</td>
                    <td className="px-4 py-3 font-bold text-[#e8539e]">{(tk.totalPrice || 0).toLocaleString('vi-VN')}đ</td>
                    <td className="px-4 py-3 font-mono text-xs font-bold text-[#243d91]">{tk.paymentRef}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => confirmPayment(tk.id)} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-200 transition-all">
                        <CircleCheck size={12} /> {lng === 'vi' ? 'Xác nhận' : 'Confirm'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Paid */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CircleCheck size={16} className="text-emerald-500" />
          <h4 className="font-bold text-sm text-[#243d91]">{lng === 'vi' ? 'Đã xác nhận' : 'Paid'} ({paidTickets.length})</h4>
        </div>
        <div className="bg-white rounded-2xl border border-[#f0ede6] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50"><tr>
              {['Sự kiện', 'Mã CK', 'Số lượng', 'Tổng tiền', 'Ngày đặt'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-emerald-700/60">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {paidTickets.map(tk => (
                <tr key={tk.id} className="border-t border-[#f0ede6] hover:bg-emerald-50/20">
                  <td className="px-4 py-3 font-semibold text-[#243d91]">{tk.eventTitle}</td>
                  <td className="px-4 py-3 font-mono text-xs">{tk.paymentRef}</td>
                  <td className="px-4 py-3 font-bold text-center">{tk.quantity}</td>
                  <td className="px-4 py-3 font-bold text-[#e8539e]">{(tk.totalPrice || 0).toLocaleString('vi-VN')}đ</td>
                  <td className="px-4 py-3 text-xs text-[#243d91]/50">{tk.createdAt ? new Date(tk.createdAt).toLocaleDateString('vi-VN') : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Admin: Tarot Cards ───────────────────────────────────────────────────────
function AdminTarot({ token }: { token: string }) {
  const { lng } = useLanguage();
  const [cards, setCards] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editCard, setEditCard] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const emptyForm = { name: '', nameVi: '', symbol: '✦', colorClass: 'from-[#243d91] to-[#4ecef5]', imageUrl: '', messageVi: '', messageEn: '', vibeVi: '', vibeEn: '', eventSuggestionVi: '', eventSuggestionEn: '', eventDescVi: '', eventDescEn: '' };
  const [form, setForm] = useState(emptyForm);

  const refresh = () => api.getTarotCards().then(setCards);
  useEffect(() => { refresh(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await api.uploadImage(reader.result as string, 'tarot', token);
        setForm(f => ({ ...f, imageUrl: res.url }));
      } catch { alert('Upload failed'); }
      finally { setUploading(false); }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      if (editCard) await api.updateTarotCard(editCard.id, form, token);
      else await api.createTarotCard(form, token);
      setShowForm(false); setEditCard(null); setForm(emptyForm);
      refresh();
    } catch (err: any) { alert(err.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa lá bài này?')) return;
    await api.deleteTarotCard(id, token);
    refresh();
  };

  const COLOR_OPTIONS = [
    'from-[#243d91] to-[#4ecef5]', 'from-purple-900 to-[#243d91]', 'from-amber-400 to-[#e8539e]',
    'from-[#4ecef5] to-emerald-500', 'from-[#e8539e] to-rose-600', 'from-slate-700 to-[#243d91]',
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-[#243d91]">{lng === 'vi' ? 'Quản lý lá bài Tarot' : 'Manage Tarot Cards'}</h3>
        <button onClick={() => { setEditCard(null); setForm(emptyForm); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-[#243d91] text-white text-sm font-bold rounded-xl hover:bg-[#243d91]/90 transition-all">
          <Plus size={15} /> {lng === 'vi' ? 'Thêm lá bài' : 'Add Card'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map(card => (
          <div key={card.id} className="bg-white rounded-2xl border border-[#f0ede6] overflow-hidden hover:shadow-md transition-all">
            <div className={`h-28 bg-gradient-to-br ${card.colorClass || 'from-[#243d91] to-[#4ecef5]'} flex items-center justify-center relative`}>
              {card.imageUrl ? <img src={card.imageUrl} alt="" className="h-full w-full object-cover absolute inset-0" /> : <span className="text-4xl text-white/80 relative">{card.symbol}</span>}
            </div>
            <div className="p-3">
              <p className="font-bold text-[#243d91] text-sm">{card.nameVi || card.name}</p>
              <p className="text-xs text-[#243d91]/50">{card.name}</p>
              <div className="flex gap-1 mt-2">
                <button onClick={() => { setEditCard(card); setForm({ ...emptyForm, ...card }); setShowForm(true); }} className="flex-1 py-1.5 rounded-lg bg-[#4ecef5]/10 text-[#4ecef5] text-xs font-bold hover:bg-[#4ecef5]/20 transition-all flex items-center justify-center gap-1">
                  <Pencil size={11} /> {lng === 'vi' ? 'Sửa' : 'Edit'}
                </button>
                <button onClick={() => handleDelete(card.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition-all">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <Modal title={editCard ? 'Sửa lá bài' : 'Thêm lá bài'} onClose={() => { setShowForm(false); setEditCard(null); }}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Tên (EN)"><input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="The Star" /></FormField>
                <FormField label="Tên (VI)"><input className={inputCls} value={form.nameVi} onChange={e => setForm(f => ({ ...f, nameVi: e.target.value }))} placeholder="Ngôi Sao" /></FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Ký hiệu"><input className={inputCls} value={form.symbol} onChange={e => setForm(f => ({ ...f, symbol: e.target.value }))} placeholder="✦" /></FormField>
                <FormField label="Màu gradient">
                  <div className="flex gap-1 flex-wrap">
                    {COLOR_OPTIONS.map(c => (
                      <button key={c} type="button" onClick={() => setForm(f => ({ ...f, colorClass: c }))} className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c} border-2 transition-all ${form.colorClass === c ? 'border-[#243d91] scale-110' : 'border-transparent'}`} />
                    ))}
                  </div>
                </FormField>
              </div>
              <FormField label="Ảnh lá bài (Cloudinary)">
                {form.imageUrl && <img src={form.imageUrl} alt="" className="w-full h-28 object-cover rounded-xl mb-2" />}
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#f0ede6] text-sm font-bold text-[#243d91]/60 hover:border-[#e8539e]/30 transition-all flex items-center justify-center gap-2">
                  {uploading ? <div className="w-4 h-4 border-2 border-[#e8539e] border-t-transparent rounded-full animate-spin" /> : <Upload size={14} />}
                  {uploading ? 'Uploading...' : 'Upload ảnh lá bài'}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </FormField>
              <div className="grid grid-cols-1 gap-3">
                <FormField label="Thông điệp (VI)"><textarea className={`${inputCls} resize-none`} rows={2} value={form.messageVi} onChange={e => setForm(f => ({ ...f, messageVi: e.target.value }))} /></FormField>
                <FormField label="Thông điệp (EN)"><textarea className={`${inputCls} resize-none`} rows={2} value={form.messageEn} onChange={e => setForm(f => ({ ...f, messageEn: e.target.value }))} /></FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Vibe (VI)"><input className={inputCls} value={form.vibeVi} onChange={e => setForm(f => ({ ...f, vibeVi: e.target.value }))} /></FormField>
                <FormField label="Vibe (EN)"><input className={inputCls} value={form.vibeEn} onChange={e => setForm(f => ({ ...f, vibeEn: e.target.value }))} /></FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Gợi ý sự kiện (VI)"><input className={inputCls} value={form.eventSuggestionVi} onChange={e => setForm(f => ({ ...f, eventSuggestionVi: e.target.value }))} /></FormField>
                <FormField label="Gợi ý sự kiện (EN)"><input className={inputCls} value={form.eventSuggestionEn} onChange={e => setForm(f => ({ ...f, eventSuggestionEn: e.target.value }))} /></FormField>
              </div>
              <button onClick={handleSave} className="w-full py-3 bg-[#243d91] text-white font-bold rounded-xl hover:bg-[#243d91]/90 transition-all">
                {editCard ? 'Lưu thay đổi' : 'Tạo lá bài'}
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Admin: Bank Accounts ────────────────────────────────────────────────────
function AdminBank({ token }: { token: string }) {
  const { lng } = useLanguage();
  const [banks, setBanks] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editBank, setEditBank] = useState<any>(null);
  const [form, setForm] = useState({ bankName: '', bankCode: '', accountNumber: '', accountName: '' });

  const refresh = () => api.getBanks(token).then(setBanks);
  useEffect(() => { refresh(); }, [token]);

  const handleSave = async () => {
    try {
      if (editBank) await api.updateBank(editBank.id, form, token);
      else await api.createBank(form, token);
      setShowForm(false); setEditBank(null);
      setForm({ bankName: '', bankCode: '', accountNumber: '', accountName: '' });
      refresh();
    } catch (err: any) { alert(err.message); }
  };

  const handleActivate = async (id: string) => {
    await api.activateBank(id, token);
    refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(lng === 'vi' ? 'Xóa tài khoản này?' : 'Delete this account?')) return;
    await api.deleteBank(id, token);
    refresh();
  };

  const BANK_CODES = ['MB', 'VCB', 'TCB', 'ACB', 'BIDV', 'VTB', 'TPB', 'OCB', 'VPB', 'SHB'];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-[#243d91]">
          {lng === 'vi' ? 'Tài khoản ngân hàng nhận tiền' : 'Payment Bank Accounts'}
        </h3>
        <button onClick={() => { setEditBank(null); setForm({ bankName: '', bankCode: '', accountNumber: '', accountName: '' }); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-[#243d91] text-white text-sm font-bold rounded-xl hover:bg-[#243d91]/90 transition-all">
          <Plus size={15} /> {lng === 'vi' ? 'Thêm tài khoản' : 'Add Account'}
        </button>
      </div>

      <p className="text-xs text-[#243d91]/50 bg-[#4ecef5]/10 px-4 py-2 rounded-xl">
        <Lightbulb size={16} className="inline-block shrink-0 mr-1" /> {lng === 'vi' ? 'Tài khoản đang Active sẽ được dùng để tạo QR thanh toán tự động.' : 'The Active account is used for automatic QR payment generation.'}
      </p>

      <div className="space-y-3">
        {banks.map(bank => (
          <div key={bank.id} className={`bg-white rounded-2xl border-2 p-4 flex items-center justify-between transition-all ${bank.isActive ? 'border-emerald-300 shadow-md shadow-emerald-100' : 'border-[#f0ede6]'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${bank.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-[#f0ede6] text-[#243d91]/60'}`}>
                {bank.bankCode}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-[#243d91]">{bank.bankName}</p>
                  {bank.isActive && <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Check size={10} /> Active</span>}
                </div>
                <p className="text-sm text-[#243d91]/60 font-mono">{bank.accountNumber}</p>
                <p className="text-xs text-[#243d91]/40">{bank.accountName}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {!bank.isActive && (
                <button onClick={() => handleActivate(bank.id)} className="px-3 py-1.5 text-xs font-bold bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-all">
                  {lng === 'vi' ? 'Đặt Active' : 'Set Active'}
                </button>
              )}
              <button onClick={() => { setEditBank(bank); setForm({ bankName: bank.bankName, bankCode: bank.bankCode, accountNumber: bank.accountNumber, accountName: bank.accountName }); setShowForm(true); }} className="w-8 h-8 rounded-lg bg-[#4ecef5]/10 text-[#4ecef5] hover:bg-[#4ecef5]/20 flex items-center justify-center transition-all">
                <Pencil size={13} />
              </button>
              <button onClick={() => handleDelete(bank.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition-all">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
        {banks.length === 0 && (
          <div className="text-center py-12 text-[#243d91]/40 text-sm">
            {lng === 'vi' ? 'Chưa có tài khoản nào. Thêm tài khoản ngân hàng để nhận thanh toán QR.' : 'No accounts yet. Add a bank account to enable QR payments.'}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <Modal title={editBank ? 'Sửa tài khoản' : 'Thêm tài khoản ngân hàng'} onClose={() => { setShowForm(false); setEditBank(null); }}>
            <div className="space-y-4">
              <FormField label="Tên ngân hàng">
                <input className={inputCls} value={form.bankName} onChange={e => setForm(f => ({ ...f, bankName: e.target.value }))} placeholder="MB Bank" />
              </FormField>
              <FormField label="Mã ngân hàng (VietQR)">
                <select className={inputCls} value={form.bankCode} onChange={e => setForm(f => ({ ...f, bankCode: e.target.value }))}>
                  <option value="">-- Chọn ngân hàng --</option>
                  {BANK_CODES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </FormField>
              <FormField label="Số tài khoản">
                <input className={inputCls} value={form.accountNumber} onChange={e => setForm(f => ({ ...f, accountNumber: e.target.value }))} placeholder="0123456789" />
              </FormField>
              <FormField label="Tên chủ tài khoản (IN HOA)">
                <input className={inputCls} value={form.accountName} onChange={e => setForm(f => ({ ...f, accountName: e.target.value.toUpperCase() }))} placeholder="THE DATE LAB" />
              </FormField>
              <button onClick={handleSave} className="w-full py-3 bg-[#243d91] text-white font-bold rounded-xl hover:bg-[#243d91]/90 transition-all">
                {editBank ? 'Lưu thay đổi' : 'Thêm tài khoản'}
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Admin: Users ────────────────────────────────────────────────────────────
function AdminUsers({ token }: { token: string }) {
  const { lng } = useLanguage();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getUsers(token).then(setUsers).finally(() => setLoading(false));
  }, [token]);

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    await api.updateUserRole(userId, newRole, token);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg text-[#243d91]">{lng === 'vi' ? 'Quản lý người dùng' : 'User Management'}</h3>
      <div className="bg-white rounded-2xl border border-[#f0ede6] overflow-hidden">
        {loading ? <div className="p-8 text-center"><div className="w-5 h-5 border-2 border-[#e8539e] border-t-transparent rounded-full animate-spin mx-auto" /></div> : (
          <table className="w-full text-sm">
            <thead className="bg-[#f0ede6]/60"><tr>
              {['Tên', 'Email', 'Điện thoại', 'Role', 'Ngày tạo', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#243d91]/60">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t border-[#f0ede6] hover:bg-[#f0ede6]/30">
                  <td className="px-4 py-3 font-semibold text-[#243d91]">{u.name}</td>
                  <td className="px-4 py-3 text-[#243d91]/60 text-xs">{u.email}</td>
                  <td className="px-4 py-3 text-[#243d91]/60">{u.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${u.role === 'admin' ? 'bg-[#e8539e]/10 text-[#e8539e]' : 'bg-[#4ecef5]/10 text-[#4ecef5]'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#243d91]/40">{u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : ''}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleRole(u.id, u.role)} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#f0ede6] text-[#243d91]/60 hover:bg-[#243d91]/10 hover:text-[#243d91] transition-all">
                      {u.role === 'admin' ? (lng === 'vi' ? '→ User' : '→ User') : (lng === 'vi' ? '→ Admin' : '→ Admin')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── User: My Tickets ────────────────────────────────────────────────────────
import { QRCodeSVG } from 'qrcode.react';

function UserTickets({ token }: { token: string }) {
  const { lng } = useLanguage();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');

  useEffect(() => {
    api.getTickets(token).then(setTickets).finally(() => setLoading(false));
  }, [token]);

  const handleDownload = async (ticketId: string) => {
    const el = document.getElementById(`ticket-${ticketId}`);
    if (!el) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#faf9f7' });
      const link = document.createElement('a');
      link.download = `TDL-Ticket-${ticketId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-[#e8539e] border-t-transparent rounded-full animate-spin" /></div>;
  if (tickets.length === 0) return (
    <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-[#f0ede6] shadow-sm">
      <Ticket size={48} className="text-[#243d91]/20 mx-auto mb-4" />
      <p className="text-[#243d91]/50 font-bold">{lng === 'vi' ? 'Bạn chưa có vé nào' : 'No tickets yet'}</p>
      <button className="mt-4 px-6 py-2.5 bg-[#243d91] text-white font-bold rounded-xl hover:bg-[#243d91]/90 transition-all shadow-md">
        {lng === 'vi' ? 'Khám phá sự kiện' : 'Explore Events'}
      </button>
    </div>
  );

  const filteredTickets = tickets.filter(tk => {
    if (filter === 'paid') return tk.paymentStatus === 'paid';
    if (filter === 'pending') return tk.paymentStatus !== 'paid';
    return true;
  });

  const isVertical = filteredTickets.length >= 5;
  const isCompact = filteredTickets.length >= 3 && filteredTickets.length <= 4;
  let gridCls = "grid grid-cols-1 gap-8 pb-10";
  if (isCompact) {
    gridCls = "grid grid-cols-1 xl:grid-cols-2 gap-6 pb-10";
  } else if (isVertical) {
    gridCls = "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10";
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === 'all' ? 'bg-[#243d91] text-white shadow-md' : 'bg-white border border-[#f0ede6] text-[#243d91]/60 hover:text-[#243d91] hover:border-[#243d91]/30'}`}>
          {lng === 'vi' ? 'Tất cả' : 'All'}
        </button>
        <button onClick={() => setFilter('paid')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === 'paid' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white border border-[#f0ede6] text-[#243d91]/60 hover:text-emerald-600 hover:border-emerald-200'}`}>
          {lng === 'vi' ? 'Đã thanh toán' : 'Paid'}
        </button>
        <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === 'pending' ? 'bg-amber-500 text-white shadow-md' : 'bg-white border border-[#f0ede6] text-[#243d91]/60 hover:text-amber-600 hover:border-amber-200'}`}>
          {lng === 'vi' ? 'Chờ thanh toán' : 'Pending'}
        </button>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="text-center py-20 bg-white/50 rounded-[2rem] border-2 border-dashed border-[#f0ede6] shadow-sm">
          <Ticket size={48} className="text-[#243d91]/20 mx-auto mb-4" />
          <p className="text-[#243d91]/50 font-bold">{lng === 'vi' ? 'Không có vé nào phù hợp' : 'No matching tickets'}</p>
        </div>
      ) : (
        <div className={gridCls}>
          {filteredTickets.map(tk => {
        const isPaid = tk.paymentStatus === 'paid';
        return (
          <div key={tk.id} className="group relative w-full max-w-4xl mx-auto h-full">
            {/* The Ticket Container to be downloaded */}
            <div id={`ticket-${tk.id}`} className={`bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_40px_rgba(36,61,145,0.05)] border border-[#f0ede6] flex flex-col h-full ${!isVertical ? 'md:flex-row' : ''}`}>
              
              {/* LEFT SIDE: Image + Details */}
              <div className={`flex-1 relative flex flex-col ${!isVertical ? 'md:flex-row' : ''}`}>
                <div className={`shrink-0 bg-gray-100 relative overflow-hidden w-full h-56 ${!isVertical ? (isCompact ? 'md:w-32 md:h-auto' : 'md:w-56 md:h-auto') : ''}`}>
                  {tk.eventImageUrl ? (
                    <img src={tk.eventImageUrl} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#243d91]/20 to-[#e8539e]/20" />
                  )}
                  {/* Subtle vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                
                <div className={`flex-1 flex flex-col justify-between relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat opacity-[0.98] ${isCompact ? 'p-5' : 'p-6 md:p-8'}`}>
                  <div>
                    <div className={`flex items-center gap-2 ${isCompact ? 'mb-2' : 'mb-4'}`}>
                      <span className={`text-xs font-bold px-4 py-1.5 rounded-full border shadow-sm ${isPaid ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                        {isPaid ? <span className="flex items-center gap-1.5"><CheckCircle2 size={14}/> {lng === 'vi' ? 'Đã thanh toán' : 'Paid'}</span> : <span className="flex items-center gap-1.5"><Clock size={14}/> {lng === 'vi' ? 'Chờ thanh toán' : 'Pending'}</span>}
                      </span>
                    </div>
                    <h4 className={`font-display font-bold text-[#243d91] mb-1 leading-tight ${isCompact ? 'text-lg line-clamp-2' : 'text-2xl md:text-3xl'}`}>
                      {tk.eventTitle}
                    </h4>
                    
                    <div className={`grid ${isCompact ? 'grid-cols-1 gap-2 mt-3' : 'grid-cols-2 gap-4 md:gap-6 mt-8'}`}>
                      <div>
                        <p className="text-[10px] font-bold text-[#243d91]/40 uppercase tracking-widest mb-1.5">{lng === 'vi' ? 'Thời gian' : 'Time'}</p>
                        <p className="text-sm font-bold text-[#243d91] flex items-center gap-1.5"><CalendarDays size={16} className="text-[#e8539e]"/> {tk.eventDate}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#243d91]/40 uppercase tracking-widest mb-1.5">{lng === 'vi' ? 'Địa điểm' : 'Location'}</p>
                        <p className="text-sm font-bold text-[#243d91] flex items-center gap-1.5"><MapPin size={16} className="text-[#e8539e]"/> {tk.eventLocation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TICKET DIVIDER (Perforated line with cutouts) */}
              <div className={`relative flex items-center justify-center bg-white z-10 w-full h-12 ${!isVertical ? 'md:w-12 md:h-auto' : ''}`}>
                {/* Top/Left Cutout */}
                <div className={`absolute rounded-full bg-[#faf9f7] shadow-inner w-10 h-10 top-0 left-1/2 -translate-x-1/2 ${!isVertical ? 'md:-top-5 md:-left-5 md:translate-x-0' : '-top-5'}`} />
                {/* Bottom/Right Cutout */}
                <div className={`absolute rounded-full bg-[#faf9f7] shadow-inner w-10 h-10 bottom-0 left-1/2 -translate-x-1/2 ${!isVertical ? 'md:-bottom-5 md:-left-5 md:translate-x-0' : '-bottom-5'}`} />
                {/* Dashed Line */}
                <div className={`border-dashed border-[#f0ede6] w-full h-0 border-t-[3px] ${!isVertical ? 'md:w-0 md:h-full md:border-t-0 md:border-l-[3px]' : ''}`} />
              </div>

              {/* RIGHT SIDE: Stub / QR Code */}
              <div className={`bg-gradient-to-br from-white to-[#fcfbf9] shrink-0 flex flex-col items-center justify-center relative w-full ${!isVertical ? (isCompact ? 'md:w-44 p-4' : 'md:w-72 p-6 md:p-8') : 'p-6 md:p-8'}`}>
                <p className={`text-[10px] font-mono font-bold text-[#243d91]/40 tracking-widest uppercase text-center w-full ${isCompact ? 'mb-3' : 'mb-6'}`}>
                  NO. {tk.id.split('-')[0]}
                </p>
                
                {isPaid ? (
                  <div className={`bg-white p-3 rounded-2xl shadow-md border border-[#f0ede6] transform group-hover:scale-[1.02] transition-transform ${isCompact ? 'mb-3' : 'mb-6'}`}>
                    <QRCodeSVG value={tk.id} size={isCompact ? 70 : 120} fgColor="#243d91" />
                  </div>
                ) : (
                  <div className={`bg-white rounded-2xl border border-[#f0ede6] flex items-center justify-center text-amber-500 opacity-50 shadow-sm ${isCompact ? 'w-[70px] h-[70px] mb-3' : 'w-[120px] h-[120px] mb-6'}`}>
                    <Clock size={isCompact ? 24 : 40} />
                  </div>
                )}
                
                <div className="w-full pt-4 border-t border-[#f0ede6]/80 text-center">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] font-bold tracking-widest text-[#243d91]/50 uppercase">{lng === 'vi' ? 'Số lượng' : 'Qty'}</p>
                    <p className={`font-bold text-[#243d91] ${isCompact ? 'text-xs' : 'text-sm'}`}>{tk.quantity}x</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold tracking-widest text-[#243d91]/50 uppercase">{lng === 'vi' ? 'Tổng' : 'Total'}</p>
                    <p className={`font-display font-bold text-[#e8539e] ${isCompact ? 'text-lg' : 'text-xl'}`}>{(tk.totalPrice || 0).toLocaleString('vi-VN')}đ</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Download Button */}
            <div className="absolute top-4 right-4 z-20 transition-opacity opacity-100 md:opacity-0 group-hover:opacity-100">
              <button 
                onClick={() => handleDownload(tk.id)}
                className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-[#f0ede6] text-[#243d91] font-bold text-sm hover:text-[#e8539e] hover:bg-white hover:scale-105 transition-all p-2.5 md:p-3"
                title={lng === 'vi' ? 'Tải vé' : 'Download'}
              >
                <Download size={20} /> <span className={!isVertical ? "md:hidden" : "hidden"}>{lng === 'vi' ? 'Tải vé' : 'Download'}</span>
              </button>
            </div>
          </div>
        );
      })}
        </div>
      )}
    </div>
  );
}

// ─── User: Profile ───────────────────────────────────────────────────────────
function UserProfile({ token }: { token: string }) {
  const { lng } = useLanguage();
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ 
    name: user?.name || '', 
    phone: user?.phone || '', 
    bio: user?.bio || '', 
    dob: user?.dob || '',
    gender: user?.gender || '',
    address: user?.address || '' 
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const updated = await api.updateProfile(form, token);
      updateUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) { alert(err.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
      <div className="md:col-span-1">
        <div className="relative rounded-[2rem] overflow-hidden p-8 text-center shadow-2xl h-full flex flex-col justify-center min-h-[320px]">
          {/* Glass background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#243d91] to-[#e8539e]" />
          <div className="absolute inset-0 bg-white opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-md p-2 mb-6 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              <div className="w-full h-full rounded-full bg-white/90 flex items-center justify-center text-[#e8539e] text-4xl font-display font-bold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
            <h3 className="font-display font-bold text-2xl text-white tracking-wide mb-1">{user?.name}</h3>
            <p className="text-white/80 text-sm mb-8 font-medium">{user?.email}</p>
            
            <div className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-xs tracking-widest shadow-xl">
              <Sparkles size={14} className="text-[#4ecef5]" />
              {lng === 'vi' ? 'THẺ THÀNH VIÊN TDL' : 'TDL MEMBER'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="md:col-span-2">
        <div className="bg-white rounded-[2rem] border-2 border-[#f0ede6]/60 p-6 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] h-full">
          <h3 className="font-display font-bold text-2xl text-[#243d91] mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#243d91]/5 flex items-center justify-center text-[#243d91]">
              <User size={20}/>
            </div>
            {lng === 'vi' ? 'Hồ sơ của bạn' : 'Your Profile'}
          </h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label={lng === 'vi' ? 'Họ và tên' : 'Full name'}>
                <input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={lng === 'vi' ? 'Nhập họ và tên...' : 'Enter your name...'} />
              </FormField>
              <FormField label={lng === 'vi' ? 'Số điện thoại' : 'Phone'}>
                <input className={inputCls} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="09xx xxx xxx" />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label={lng === 'vi' ? 'Ngày sinh' : 'Date of birth'}>
                <input className={inputCls} type="date" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
              </FormField>
              <FormField label={lng === 'vi' ? 'Giới tính' : 'Gender'}>
                <select className={inputCls} value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                  <option value="">{lng === 'vi' ? 'Chọn giới tính' : 'Select gender'}</option>
                  <option value="male">{lng === 'vi' ? 'Nam' : 'Male'}</option>
                  <option value="female">{lng === 'vi' ? 'Nữ' : 'Female'}</option>
                  <option value="other">{lng === 'vi' ? 'Khác' : 'Other'}</option>
                </select>
              </FormField>
            </div>

            <FormField label={lng === 'vi' ? 'Địa chỉ' : 'Address'}>
              <input className={inputCls} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder={lng === 'vi' ? 'Nhập địa chỉ của bạn...' : 'Enter your address...'} />
            </FormField>

            <FormField label="Bio (Sở thích/Tính cách)">
              <textarea className={`${inputCls} resize-none min-h-[100px]`} placeholder={lng === 'vi' ? "Ví dụ: Thích nến thơm, làm gốm, nghe nhạc Indie..." : "E.g: Love candles, pottery, indie music..."} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
            </FormField>
            
            <div className="pt-4 border-t border-[#f0ede6]/60">
              <button onClick={handleSave} disabled={saving} className="w-full md:w-auto md:min-w-[220px] py-4 bg-[#e8539e] text-white font-bold rounded-2xl hover:bg-[#e8539e]/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(232,83,158,0.25)] hover:shadow-[0_8px_25px_rgba(232,83,158,0.4)] hover:-translate-y-0.5">
                {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : saved ? <Check size={18} /> : null}
                {saved ? (lng === 'vi' ? 'Đã lưu thành công!' : 'Saved successfully!') : (lng === 'vi' ? 'Lưu thay đổi' : 'Save Changes')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Admin: Add-ons ────────────────────────────────────────────────────────────
function AdminAddons({ token }: { token: string }) {
  const { lng } = useLanguage();
  const [addons, setAddons] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editAddon, setEditAddon] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const emptyForm = { name: '', nameEn: '', description: '', descriptionEn: '', price: '', imageUrl: '', isActive: true };
  const [form, setForm] = useState(emptyForm);

  const refresh = () => api.getAddons().then(setAddons);
  useEffect(() => { refresh(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await api.uploadImage(reader.result as string, 'addons', token);
        setForm(f => ({ ...f, imageUrl: res.url }));
      } catch { alert('Upload failed'); }
      finally { setUploading(false); }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      if (editAddon) await api.updateAddon(editAddon.id, form, token);
      else await api.createAddon(form, token);
      setShowForm(false); setEditAddon(null); setForm(emptyForm);
      refresh();
    } catch (err: any) { alert(err.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa Add-on này?')) return;
    await api.deleteAddon(id, token);
    refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-[#243d91]">{lng === 'vi' ? 'Quản lý Add-ons' : 'Manage Add-ons'}</h3>
        <button onClick={() => { setEditAddon(null); setForm(emptyForm); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-[#243d91] text-white text-sm font-bold rounded-xl hover:bg-[#243d91]/90 transition-all">
          <Plus size={15} /> {lng === 'vi' ? 'Thêm Add-on' : 'Add Item'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {addons.map(item => (
          <div key={item.id} className={`bg-white rounded-2xl border ${item.isActive ? 'border-emerald-300 shadow-sm' : 'border-[#f0ede6] opacity-60'} overflow-hidden transition-all`}>
            <div className="h-32 bg-[#f0ede6] flex items-center justify-center relative">
              {item.imageUrl ? <img src={item.imageUrl} alt="" className="h-full w-full object-cover absolute inset-0" /> : <ShoppingBag size={32} className="text-[#243d91]/20 relative" />}
              {!item.isActive && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="text-white font-bold text-xs bg-black/60 px-2 py-1 rounded-full">Ngừng bán</span></div>}
            </div>
            <div className="p-3">
              <p className="font-bold text-[#243d91] text-sm truncate">{item.name}</p>
              <p className="font-bold text-[#e8539e] text-sm mt-1">{(item.price || 0).toLocaleString('vi-VN')}đ</p>
              <div className="flex gap-1 mt-3">
                <button onClick={() => { setEditAddon(item); setForm({ ...emptyForm, ...item }); setShowForm(true); }} className="flex-1 py-1.5 rounded-lg bg-[#4ecef5]/10 text-[#4ecef5] text-xs font-bold hover:bg-[#4ecef5]/20 transition-all flex items-center justify-center gap-1">
                  <Pencil size={11} /> {lng === 'vi' ? 'Sửa' : 'Edit'}
                </button>
                <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition-all">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <Modal title={editAddon ? 'Sửa Add-on' : 'Thêm Add-on'} onClose={() => { setShowForm(false); setEditAddon(null); }}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Tên (VI)"><input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="In ảnh Instax" /></FormField>
                <FormField label="Tên (EN)"><input className={inputCls} value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))} placeholder="Instax Photo" /></FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Giá bán (đ)"><input type="number" className={inputCls} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="50000" /></FormField>
                <FormField label="Trạng thái">
                  <select className={inputCls} value={form.isActive ? '1' : '0'} onChange={e => setForm(f => ({ ...f, isActive: e.target.value === '1' }))}>
                    <option value="1">Đang bán</option>
                    <option value="0">Ngừng bán</option>
                  </select>
                </FormField>
              </div>
              <FormField label="Ảnh minh họa">
                {form.imageUrl && <img src={form.imageUrl} alt="" className="w-full h-28 object-cover rounded-xl mb-2" />}
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#f0ede6] text-sm font-bold text-[#243d91]/60 hover:border-[#e8539e]/30 transition-all flex items-center justify-center gap-2">
                  {uploading ? <div className="w-4 h-4 border-2 border-[#e8539e] border-t-transparent rounded-full animate-spin" /> : <Upload size={14} />}
                  {uploading ? 'Uploading...' : 'Upload ảnh'}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </FormField>
              <div className="grid grid-cols-1 gap-3">
                <FormField label="Mô tả (VI)"><textarea className={`${inputCls} resize-none`} rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></FormField>
                <FormField label="Mô tả (EN)"><textarea className={`${inputCls} resize-none`} rows={2} value={form.descriptionEn} onChange={e => setForm(f => ({ ...f, descriptionEn: e.target.value }))} /></FormField>
              </div>
              <button onClick={handleSave} className="w-full py-3 bg-[#243d91] text-white font-bold rounded-xl hover:bg-[#243d91]/90 transition-all">
                {editAddon ? 'Lưu thay đổi' : 'Tạo Add-on'}
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Admin: Settings ──────────────────────────────────────────────────────────
function AdminSettings({ token }: { token: string }) {
  const { lng } = useLanguage();
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.getSettings().then(data => setSettings(data.contact_info || {})).catch(console.error);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      await api.updateSettings({ contact_info: settings }, token);
      setMessage(lng === 'vi' ? 'Đã lưu cài đặt' : 'Settings saved');
    } catch (e: any) {
      setMessage(e.message || 'Lỗi lưu cài đặt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#f0ede6]">
        <h3 className="font-display font-bold text-xl text-[#243d91] mb-6">Thông tin liên hệ (Footer)</h3>
        
        <div className="space-y-4 max-w-xl">
          <FormField label="Địa chỉ">
            <input value={settings.address || ''} onChange={e => setSettings({...settings, address: e.target.value})} className={inputCls} placeholder="ĐH FPT Hoà Lạc, Hà Nội" />
          </FormField>
          <FormField label="Email">
            <input value={settings.email || ''} onChange={e => setSettings({...settings, email: e.target.value})} className={inputCls} placeholder="hello@thedatelab.vn" />
          </FormField>
          <FormField label="Điện thoại">
            <input value={settings.phone || ''} onChange={e => setSettings({...settings, phone: e.target.value})} className={inputCls} placeholder="0912345678" />
          </FormField>
          <FormField label="Facebook Link">
            <input value={settings.facebook || ''} onChange={e => setSettings({...settings, facebook: e.target.value})} className={inputCls} placeholder="https://facebook.com/..." />
          </FormField>
          <FormField label="Instagram Link">
            <input value={settings.instagram || ''} onChange={e => setSettings({...settings, instagram: e.target.value})} className={inputCls} placeholder="https://instagram.com/..." />
          </FormField>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#243d91] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#243d91]/90 transition-all shadow-lg flex items-center gap-2"
          >
            {loading ? <span className="animate-spin text-xl">⏳</span> : <Check size={18} />} Lưu cài đặt
          </button>
          {message && <span className="text-sm font-bold text-[#e8539e]">{message}</span>}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────
export default function DashboardView() {
  const { lng } = useLanguage();
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';

  const userTabs = [
    { id: 'tickets', label: lng === 'vi' ? 'Vé của tôi' : 'My Tickets', icon: <Ticket size={16} /> },
    { id: 'profile', label: lng === 'vi' ? 'Hồ sơ' : 'Profile', icon: <User size={16} /> },
  ];

  const adminTabs = [
    { id: 'overview', label: lng === 'vi' ? 'Tổng quan' : 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'events', label: lng === 'vi' ? 'Sự kiện' : 'Events', icon: <CalendarDays size={18} /> },
    { id: 'tickets', label: lng === 'vi' ? 'Vé & Thanh toán' : 'Tickets & Pay', icon: <Ticket size={18} /> },
    { id: 'tarot', label: 'Tarot', icon: <Sparkles size={18} /> },
    { id: 'bank', label: lng === 'vi' ? 'Ngân hàng' : 'Bank', icon: <Landmark size={18} /> },
    { id: 'addons', label: lng === 'vi' ? 'Add-ons' : 'Add-ons', icon: <ShoppingBag size={18} /> },
    { id: 'users', label: lng === 'vi' ? 'Người dùng' : 'Users', icon: <Users size={18} /> },
    { id: 'settings', label: lng === 'vi' ? 'Cài đặt' : 'Settings', icon: <Settings size={18} /> },
  ];

  const tabs = isAdmin ? adminTabs : userTabs;
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  if (!user || !token) {
    navigate('/login');
    return null;
  }

  // Standalone Layout for Admin
  if (isAdmin) {
    return (
      <div className="flex h-screen w-full bg-[#f0ede6] overflow-hidden">
        {/* SIDEBAR */}
        <div className="w-64 bg-[#243d91] text-white flex flex-col shrink-0">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-display font-bold text-xl text-[#e8539e]">
                TDL
              </div>
              <div>
                <h1 className="font-display font-bold text-lg leading-tight">Admin<br/><span className="text-[#4ecef5]">Panel</span></h1>
              </div>
            </div>
            
            <div className="space-y-1">
              {adminTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#e8539e] text-white shadow-lg shadow-[#e8539e]/20'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-auto p-6 border-t border-white/10">
            <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white/60 hover:text-white hover:bg-white/10 transition-all mb-2">
              <Home size={18} /> {lng === 'vi' ? 'Về trang chủ' : 'Back to Home'}
            </button>
            <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all">
              <LogOut size={18} /> {lng === 'vi' ? 'Đăng xuất' : 'Logout'}
            </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#faf9f7] rounded-l-3xl shadow-[-10px_0_30px_rgba(0,0,0,0.05)]">
          {/* Header */}
          <div className="h-20 bg-white border-b border-[#f0ede6] flex items-center px-8 shrink-0">
            <h2 className="font-display font-bold text-2xl text-[#243d91]">
              {adminTabs.find(t => t.id === activeTab)?.label}
            </h2>
            <div className="ml-auto flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f0ede6] flex items-center justify-center font-bold text-[#243d91]">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-[#243d91]">{user.name}</p>
                <p className="text-xs text-[#243d91]/50">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-6xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}>
                  {activeTab === 'overview' && <AdminOverview token={token} />}
                  {activeTab === 'events' && <AdminEvents token={token} />}
                  {activeTab === 'tickets' && <AdminTickets token={token} />}
                  {activeTab === 'tarot' && <AdminTarot token={token} />}
                  {activeTab === 'bank' && <AdminBank token={token} />}
                  {activeTab === 'addons' && <AdminAddons token={token} />}
                  {activeTab === 'users' && <AdminUsers token={token} />}
                  {activeTab === 'settings' && <AdminSettings token={token} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Layout for User
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isAdmin && <span className="text-xs font-bold bg-[#e8539e]/10 text-[#e8539e] px-2.5 py-1 rounded-full flex items-center gap-1"><Shield size={10} /> Admin</span>}
          </div>
          <h1 className="font-display font-bold text-2xl text-[#243d91]">
            {isAdmin ? (lng === 'vi' ? 'Bảng điều khiển' : 'Admin Dashboard') : (lng === 'vi' ? `Xin chào, ${user.name}!` : `Hello, ${user.name}!`)}
          </h1>
          <p className="text-[#243d91]/50 text-sm">{user.email}</p>
        </div>
        <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-1.5 text-sm font-bold text-[#243d91]/40 hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl transition-all">
          <LogOut size={15} /> {lng === 'vi' ? 'Đăng xuất' : 'Logout'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-8 border-b-2 border-[#f0ede6]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative pb-4 flex items-center gap-2 text-sm font-bold transition-all ${activeTab === tab.id ? 'text-[#e8539e]' : 'text-[#243d91]/50 hover:text-[#243d91]'}`}
          >
            {tab.icon} {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="userTabIndicator" className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-[#e8539e]" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
          {activeTab === 'tickets' && <UserTickets token={token} />}
          {activeTab === 'profile' && <UserProfile token={token} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
