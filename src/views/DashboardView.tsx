import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Ticket, Lock, Shield, Camera, MapPin,
  TrendingUp, Calendar, Users, DollarSign, Plus,
  MoreHorizontal, Edit2, Trash2, Eye, Upload,
  Bell, ChevronDown, CheckCircle, Clock, XCircle,
  BarChart3, Settings, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardViewProps {
  isAuthenticated: boolean;
  userRole: 'user' | 'admin';
}

const MOCK_TICKETS = [
  {
    id: 'TKT-001', name: 'Workshop Làm Gốm Pastel', date: '15/07/2026', time: '14:00 - 16:30',
    location: 'The Date Lab Studio, Q.1', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=TKT-001',
    daysLeft: 27,
  },
];

const ADMIN_EVENTS = [
  { id: 1, name: 'Workshop Làm Gốm Pastel', date: '15/07', slots: '12/15', revenue: '5,880,000đ', status: 'active' },
  { id: 2, name: 'Chế Tác Nước Hoa Cá Nhân', date: '16/07', slots: '18/20', revenue: '11,700,000đ', status: 'almost' },
  { id: 3, name: 'Đổ Nến Thơm Nghệ Thuật', date: '18/07', slots: '20/20', revenue: '7,000,000đ', status: 'full' },
  { id: 4, name: 'Baking: Bánh Kem Bento', date: '20/07', slots: '8/12', revenue: '3,200,000đ', status: 'active' },
];

const ADMIN_USERS = [
  { id: 1, name: 'Nguyễn Thị An', email: 'an@example.com', tickets: 3, joined: '01/2026', status: 'active' },
  { id: 2, name: 'Trần Minh Khoa', email: 'khoa@example.com', tickets: 1, joined: '03/2026', status: 'active' },
  { id: 3, name: 'Lê Thị Bình', email: 'binh@example.com', tickets: 5, joined: '12/2025', status: 'active' },
  { id: 4, name: 'Phạm Quốc Hùng', email: 'hung@example.com', tickets: 2, joined: '04/2026', status: 'inactive' },
];

const ADMIN_STATS = [
  { label: 'Tổng thành viên', value: '1,204', change: '+12%', icon: Users, color: 'from-[#4ecef5] to-[#243d91]' },
  { label: 'Vé đã bán', value: '892', change: '+8%', icon: Ticket, color: 'from-[#e8539e] to-rose-600' },
  { label: 'Sự kiện tháng', value: '45', change: '+3', icon: Calendar, color: 'from-amber-400 to-orange-500' },
  { label: 'Doanh thu', value: '27.8M', change: '+15%', icon: TrendingUp, color: 'from-emerald-400 to-teal-600' },
];

export default function DashboardView({ isAuthenticated, userRole }: DashboardViewProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(userRole === 'admin' ? 'overview' : 'tickets');
  const [ticketTab, setTicketTab] = useState<'upcoming' | 'past'>('upcoming');

  if (!isAuthenticated) {
    return (
      <div className="text-center py-24">
        <div className="w-16 h-16 bg-[#e8539e]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Lock size={24} className="text-[#e8539e]" />
        </div>
        <p className="font-bold text-[#243d91] mb-1">Bạn chưa đăng nhập</p>
        <p className="text-sm text-[#243d91]/50 mb-6">Đăng nhập để xem tài khoản và vé của bạn</p>
        <button onClick={() => navigate('/login')} className="bg-[#e8539e] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#e8539e]/25">
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  /* ============ ADMIN MENUS ============ */
  const adminMenu = [
    { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
    { id: 'events', label: 'Sự kiện', icon: Calendar },
    { id: 'users', label: 'Người dùng', icon: Users },
    { id: 'vault-admin', label: 'Kho ảnh', icon: Upload },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  const userMenu = [
    { id: 'tickets', label: 'Vé của tôi', icon: Ticket },
    { id: 'profile', label: 'Hồ sơ', icon: User },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
  ];

  const menuItems = userRole === 'admin' ? adminMenu : userMenu;

  return (
    <div className="flex flex-col lg:flex-row gap-5 min-h-[70vh]">
      {/* ===== SIDEBAR ===== */}
      <aside className="lg:w-60 shrink-0 space-y-3">
        {/* Avatar */}
        <div className="bg-white rounded-2xl border border-[#ebe8dd] p-5 text-center shadow-sm">
          <div className="relative inline-block mb-3">
            <div className={`w-18 h-18 rounded-2xl flex items-center justify-center mx-auto ${userRole === 'admin' ? 'bg-[#243d91]' : 'bg-gradient-to-br from-[#e8539e]/20 to-[#4ecef5]/20'}`}
              style={{ width: '4.5rem', height: '4.5rem' }}>
              {userRole === 'admin'
                ? <Shield size={28} className="text-white" />
                : <User size={28} className="text-[#e8539e]" />
              }
            </div>
            {userRole !== 'admin' && (
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#e8539e] text-white rounded-full flex items-center justify-center shadow border-2 border-white">
                <Camera size={10} />
              </button>
            )}
          </div>
          <p className="font-display font-bold text-[#243d91] text-base">{userRole === 'admin' ? 'Admin TDL' : 'Nguyễn An'}</p>
          <p className="text-xs text-[#243d91]/40 mt-0.5">{userRole === 'admin' ? 'Quản trị viên' : 'Member 2026'}</p>

          {userRole === 'user' && (
            <div className="flex gap-1.5 justify-center mt-3 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#e8539e]/10 text-[#e8539e]">Lively</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#4ecef5]/10 text-[#4ecef5]">Crafts</span>
            </div>
          )}
          {userRole === 'admin' && (
            <span className="inline-block mt-3 text-xs font-bold px-3 py-1.5 rounded-full bg-[#243d91] text-white">Quản trị viên</span>
          )}
        </div>

        {/* Nav */}
        <nav className="bg-white rounded-2xl border border-[#ebe8dd] p-2 shadow-sm">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all mb-0.5 last:mb-0 ${
                activeTab === item.id
                  ? 'bg-[#243d91] text-white shadow-sm'
                  : 'text-[#243d91]/60 hover:bg-[#ebe8dd]/60 hover:text-[#243d91]'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
          {userRole === 'user' && (
            <button
              onClick={() => navigate('/vault')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#243d91] to-[#243d91]/80 mt-2"
            >
              <Lock size={16} /> Kho kỷ niệm
            </button>
          )}
        </nav>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">

          {/* ─── ADMIN: OVERVIEW ─── */}
          {activeTab === 'overview' && userRole === 'admin' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display font-bold text-2xl text-[#243d91]">Tổng quan</h2>
                  <p className="text-xs text-[#243d91]/40 mt-0.5">Cập nhật: 18/06/2026 · 12:00</p>
                </div>
                <button className="flex items-center gap-2 text-sm font-bold px-4 py-2 bg-[#e8539e] text-white rounded-xl shadow-md shadow-[#e8539e]/25 hover:bg-[#e8539e]/90 transition-all">
                  <Plus size={15} /> Thêm sự kiện
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {ADMIN_STATS.map((s) => (
                  <div key={s.label} className={`bg-gradient-to-br ${s.color} text-white rounded-2xl p-4`}>
                    <s.icon size={18} className="opacity-70 mb-2" />
                    <p className="font-display font-bold text-2xl">{s.value}</p>
                    <p className="text-xs font-semibold opacity-70 mt-0.5">{s.label}</p>
                    <p className="text-xs font-bold opacity-90 mt-1 bg-white/15 rounded-full px-2 py-0.5 inline-block">{s.change}</p>
                  </div>
                ))}
              </div>

              {/* Revenue chart placeholder */}
              <div className="bg-white rounded-2xl border border-[#ebe8dd] p-5 mb-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#243d91]">Doanh thu theo tuần</h3>
                  <select className="text-xs font-bold text-[#243d91]/50 bg-[#ebe8dd] rounded-lg px-2 py-1 border-none outline-none">
                    <option>Tháng 6/2026</option>
                    <option>Tháng 5/2026</option>
                  </select>
                </div>
                {/* Mock bar chart */}
                <div className="flex items-end gap-2 h-28">
                  {[40, 65, 55, 80, 45, 90, 70].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-[#e8539e] to-[#4ecef5] transition-all"
                        style={{ height: `${h}%` }}
                      />
                      <span className="text-xs text-[#243d91]/30 font-semibold">T{i + 2}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent events */}
              <div className="bg-white rounded-2xl border border-[#ebe8dd] shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#ebe8dd] flex items-center justify-between">
                  <h3 className="font-bold text-[#243d91]">Sự kiện gần đây</h3>
                  <button onClick={() => setActiveTab('events')} className="text-xs font-bold text-[#4ecef5] hover:underline">Xem tất cả</button>
                </div>
                <div className="divide-y divide-[#ebe8dd]">
                  {ADMIN_EVENTS.slice(0, 3).map((ev) => (
                    <div key={ev.id} className="px-5 py-3.5 flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${ev.status === 'full' ? 'bg-red-400' : ev.status === 'almost' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                      <p className="text-sm font-semibold text-[#243d91] flex-1 truncate">{ev.name}</p>
                      <span className="text-xs text-[#243d91]/40 font-medium shrink-0">{ev.slots}</span>
                      <span className="text-xs font-bold text-[#243d91]/60 shrink-0 hidden sm:block">{ev.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── ADMIN: EVENTS MANAGEMENT ─── */}
          {activeTab === 'events' && userRole === 'admin' && (
            <motion.div key="events" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-2xl text-[#243d91]">Quản lý sự kiện</h2>
                <button className="flex items-center gap-2 text-sm font-bold px-4 py-2 bg-[#e8539e] text-white rounded-xl shadow-md shadow-[#e8539e]/25">
                  <Plus size={15} /> Thêm mới
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-[#ebe8dd] shadow-sm overflow-hidden">
                <div className="p-4 border-b border-[#ebe8dd]">
                  <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#243d91]/30" />
                    <input placeholder="Tìm sự kiện..." className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#ebe8dd]/50 text-sm font-semibold text-[#243d91] outline-none placeholder-[#243d91]/30" />
                  </div>
                </div>
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#ebe8dd]/30">
                        <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#243d91]/40">Sự kiện</th>
                        <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#243d91]/40 hidden sm:table-cell">Ngày</th>
                        <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#243d91]/40">Slot</th>
                        <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#243d91]/40 hidden md:table-cell">Doanh thu</th>
                        <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#243d91]/40">Trạng thái</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ebe8dd]">
                      {ADMIN_EVENTS.map((ev) => (
                        <tr key={ev.id} className="hover:bg-[#ebe8dd]/20 transition-colors">
                          <td className="px-5 py-4 font-semibold text-[#243d91] max-w-[180px] truncate">{ev.name}</td>
                          <td className="px-4 py-4 text-[#243d91]/50 hidden sm:table-cell">{ev.date}</td>
                          <td className="px-4 py-4 text-[#243d91]/70 font-mono text-xs">{ev.slots}</td>
                          <td className="px-4 py-4 text-[#243d91]/60 hidden md:table-cell text-xs">{ev.revenue}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                              ev.status === 'full' ? 'bg-red-100 text-red-600'
                              : ev.status === 'almost' ? 'bg-amber-100 text-amber-600'
                              : 'bg-emerald-100 text-emerald-600'
                            }`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {ev.status === 'full' ? 'Hết chỗ' : ev.status === 'almost' ? 'Sắp hết' : 'Còn chỗ'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1">
                              <button className="w-8 h-8 rounded-lg hover:bg-[#4ecef5]/10 text-[#243d91]/40 hover:text-[#4ecef5] flex items-center justify-center transition-all"><Eye size={14} /></button>
                              <button className="w-8 h-8 rounded-lg hover:bg-[#e8539e]/10 text-[#243d91]/40 hover:text-[#e8539e] flex items-center justify-center transition-all"><Edit2 size={14} /></button>
                              <button className="w-8 h-8 rounded-lg hover:bg-red-50 text-[#243d91]/40 hover:text-red-400 flex items-center justify-center transition-all"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── ADMIN: USERS MANAGEMENT ─── */}
          {activeTab === 'users' && userRole === 'admin' && (
            <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-2xl text-[#243d91]">Quản lý người dùng</h2>
                <span className="text-sm text-[#243d91]/50 font-semibold">{ADMIN_USERS.length} người dùng</span>
              </div>
              <div className="bg-white rounded-2xl border border-[#ebe8dd] shadow-sm overflow-hidden">
                <div className="p-4 border-b border-[#ebe8dd]">
                  <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#243d91]/30" />
                    <input placeholder="Tìm người dùng..." className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#ebe8dd]/50 text-sm font-semibold text-[#243d91] outline-none placeholder-[#243d91]/30" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#ebe8dd]/30">
                        <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#243d91]/40">Tên</th>
                        <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#243d91]/40 hidden sm:table-cell">Email</th>
                        <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#243d91]/40">Vé</th>
                        <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#243d91]/40 hidden md:table-cell">Ngày tham gia</th>
                        <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#243d91]/40">Trạng thái</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ebe8dd]">
                      {ADMIN_USERS.map((u) => (
                        <tr key={u.id} className="hover:bg-[#ebe8dd]/20 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#e8539e]/20 to-[#4ecef5]/20 flex items-center justify-center text-xs font-bold text-[#243d91]">
                                {u.name.charAt(0)}
                              </div>
                              <span className="font-semibold text-[#243d91] whitespace-nowrap">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-[#243d91]/50 hidden sm:table-cell text-xs">{u.email}</td>
                          <td className="px-4 py-4 text-[#243d91]/70 font-bold text-center">{u.tickets}</td>
                          <td className="px-4 py-4 text-[#243d91]/40 text-xs hidden md:table-cell">{u.joined}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${u.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-[#ebe8dd] text-[#243d91]/40'}`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {u.status === 'active' ? 'Hoạt động' : 'Không HĐ'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <button className="w-8 h-8 rounded-lg hover:bg-[#ebe8dd] text-[#243d91]/40 hover:text-[#243d91] flex items-center justify-center transition-all"><MoreHorizontal size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── ADMIN: VAULT / PHOTO UPLOAD ─── */}
          {activeTab === 'vault-admin' && userRole === 'admin' && (
            <motion.div key="vault-admin" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="font-display font-bold text-2xl text-[#243d91] mb-5">Kho ảnh sự kiện</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {[
                  { name: 'Workshop Làm Gốm Pastel', count: 12, date: '15/06' },
                  { name: 'Đêm Cà Phê & Chuyện Kể', count: 8, date: '05/05' },
                ].map((vault) => (
                  <div key={vault.name} className="bg-white rounded-2xl border border-[#ebe8dd] p-4 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#ebe8dd] rounded-xl flex items-center justify-center shrink-0">
                      <Upload size={20} className="text-[#243d91]/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-[#243d91] truncate">{vault.name}</p>
                      <p className="text-xs text-[#243d91]/40">{vault.count} ảnh · {vault.date}</p>
                    </div>
                    <button className="shrink-0 text-xs font-bold text-[#4ecef5] hover:underline">Upload thêm</button>
                  </div>
                ))}
              </div>
              <div className="border-2 border-dashed border-[#ebe8dd] rounded-2xl p-10 text-center bg-white">
                <Upload size={24} className="text-[#243d91]/20 mx-auto mb-3" />
                <p className="font-bold text-sm text-[#243d91]/40 mb-1">Kéo thả hoặc chọn ảnh</p>
                <p className="text-xs text-[#243d91]/30 mb-4">PNG, JPG · Tối đa 20MB mỗi file</p>
                <button className="text-sm font-bold px-5 py-2.5 bg-[#243d91] text-white rounded-xl hover:bg-[#243d91]/90 transition-all">Chọn tệp</button>
              </div>
            </motion.div>
          )}

          {/* ─── ADMIN: SETTINGS ─── */}
          {activeTab === 'settings' && userRole === 'admin' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="font-display font-bold text-2xl text-[#243d91] mb-5">Cài đặt hệ thống</h2>
              <div className="bg-white rounded-2xl border border-[#ebe8dd] divide-y divide-[#ebe8dd] shadow-sm">
                {[
                  { label: 'Tên thương hiệu', value: 'The Date Lab', type: 'text' },
                  { label: 'Email liên hệ', value: 'hello@thedatelab.vn', type: 'email' },
                  { label: 'Địa chỉ', value: 'ĐH FPT Hoà Lạc, Hà Nội', type: 'text' },
                ].map((f) => (
                  <div key={f.label} className="px-5 py-4 flex items-center gap-4">
                    <p className="text-sm font-bold text-[#243d91] w-36 shrink-0">{f.label}</p>
                    <input
                      type={f.type}
                      defaultValue={f.value}
                      className="flex-1 text-sm font-semibold text-[#243d91]/70 bg-[#ebe8dd]/30 rounded-xl px-3 py-2 outline-none focus:bg-[#ebe8dd] transition-all min-w-0"
                    />
                  </div>
                ))}
                <div className="px-5 py-4">
                  <button className="text-sm font-bold px-5 py-2.5 bg-[#e8539e] text-white rounded-xl hover:bg-[#e8539e]/90 transition-all shadow-md shadow-[#e8539e]/20">Lưu thay đổi</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── USER: TICKETS ─── */}
          {activeTab === 'tickets' && userRole === 'user' && (
            <motion.div key="tickets" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="font-display font-bold text-2xl text-[#243d91] mb-5">Vé của tôi</h2>
              <div className="flex gap-2 mb-5">
                {(['upcoming', 'past'] as const).map((t) => (
                  <button key={t} onClick={() => setTicketTab(t)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${ticketTab === t ? 'bg-[#243d91] text-white' : 'bg-white border border-[#ebe8dd] text-[#243d91]/50 hover:bg-[#ebe8dd]/60'}`}>
                    {t === 'upcoming' ? 'Sắp diễn ra' : 'Đã tham gia'}
                  </button>
                ))}
              </div>
              {ticketTab === 'upcoming' ? (
                <div className="space-y-4">
                  {MOCK_TICKETS.map((tkt) => (
                    <div key={tkt.id} className="bg-white border border-[#ebe8dd] rounded-2xl overflow-hidden shadow-sm">
                      <div className="flex flex-col sm:flex-row">
                        <div className="flex-1 p-5 relative">
                          <span className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 sm:inline-block mb-2 bg-[#e8539e]/10 text-[#e8539e] text-xs font-bold px-2.5 py-1 rounded-full">
                            <Clock size={10} className="inline mr-1" />{tkt.daysLeft} ngày nữa
                          </span>
                          <h4 className="font-display font-bold text-[#243d91] text-lg mt-1 mb-3 pr-20 sm:pr-0">{tkt.name}</h4>
                          <div className="space-y-1.5">
                            <p className="text-sm text-[#243d91]/60 font-semibold flex items-center gap-1.5"><Calendar size={13} className="text-[#e8539e]" /> {tkt.date} · {tkt.time}</p>
                            <p className="text-sm text-[#243d91]/60 font-semibold flex items-center gap-1.5"><MapPin size={13} className="text-[#4ecef5]" /> {tkt.location}</p>
                          </div>
                        </div>
                        <div className="sm:w-40 flex flex-col items-center justify-center p-4 bg-[#ebe8dd]/20 border-t sm:border-t-0 sm:border-l border-dashed border-[#ebe8dd]">
                          <img src={tkt.qr} alt="QR" className="w-24 h-24 rounded-xl" />
                          <p className="text-xs font-mono text-[#243d91]/30 mt-2">{tkt.id}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border-2 border-dashed border-[#ebe8dd] rounded-2xl bg-white">
                  <Ticket size={28} className="text-[#243d91]/15 mx-auto mb-3" />
                  <p className="font-bold text-sm text-[#243d91]/40">Chưa có sự kiện nào đã tham gia</p>
                  <button onClick={() => navigate('/')} className="mt-4 text-sm font-bold text-[#e8539e] hover:underline">Khám phá sự kiện →</button>
                </div>
              )}
            </motion.div>
          )}

          {/* ─── USER: PROFILE ─── */}
          {activeTab === 'profile' && userRole === 'user' && (
            <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="font-display font-bold text-2xl text-[#243d91] mb-5">Hồ sơ cá nhân</h2>
              <div className="bg-white rounded-2xl border border-[#ebe8dd] p-5 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {[
                    { label: 'Họ và tên', val: 'Nguyễn An', type: 'text' },
                    { label: 'Email', val: 'an@example.com', type: 'email' },
                    { label: 'Ngày sinh', val: '01/01/2000', type: 'text' },
                    { label: 'Số điện thoại', val: '0912 345 678', type: 'tel' },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="block text-xs font-bold uppercase tracking-widest text-[#243d91]/40 mb-1.5">{f.label}</label>
                      <input type={f.type} defaultValue={f.val} className="w-full px-4 py-2.5 rounded-xl border-2 border-[#ebe8dd] text-sm font-semibold text-[#243d91] outline-none focus:border-[#e8539e] transition-all bg-[#ebe8dd]/20" />
                    </div>
                  ))}
                </div>
                <div className="mb-5">
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#243d91]/40 mb-1.5">Bio / Sở thích</label>
                  <textarea rows={3} defaultValue="Thích màu xanh dương và không gian tĩnh lặng." className="w-full px-4 py-2.5 rounded-xl border-2 border-[#ebe8dd] text-sm font-semibold text-[#243d91] outline-none focus:border-[#e8539e] transition-all bg-[#ebe8dd]/20 resize-none" />
                </div>
                <button className="px-6 py-2.5 bg-[#e8539e] text-white font-bold rounded-xl text-sm shadow-md shadow-[#e8539e]/20 hover:bg-[#e8539e]/90 transition-all">Lưu thay đổi</button>
              </div>
            </motion.div>
          )}

          {/* ─── USER: NOTIFICATIONS ─── */}
          {activeTab === 'notifications' && userRole === 'user' && (
            <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="font-display font-bold text-2xl text-[#243d91] mb-5">Thông báo</h2>
              <div className="bg-white rounded-2xl border border-[#ebe8dd] divide-y divide-[#ebe8dd] shadow-sm mb-4">
                {[
                  { title: 'Workshop Làm Gốm Pastel còn 3 ngày nữa', time: '2 giờ trước', read: false, icon: Calendar, color: 'text-[#e8539e]' },
                  { title: 'Bạn đã đặt vé thành công TKT-001', time: 'Hôm qua', read: true, icon: CheckCircle, color: 'text-emerald-500' },
                  { title: 'Workshop Nước Hoa sắp hết slot', time: '2 ngày trước', read: true, icon: Clock, color: 'text-amber-500' },
                ].map((notif, i) => (
                  <div key={i} className={`px-5 py-4 flex items-start gap-3 ${!notif.read ? 'bg-[#e8539e]/2' : ''}`}>
                    <notif.icon size={18} className={`${notif.color} shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${notif.read ? 'text-[#243d91]/60 font-medium' : 'text-[#243d91] font-bold'}`}>{notif.title}</p>
                      <p className="text-xs text-[#243d91]/30 mt-0.5">{notif.time}</p>
                    </div>
                    {!notif.read && <div className="w-2 h-2 bg-[#e8539e] rounded-full shrink-0 mt-1.5" />}
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-[#ebe8dd] p-5 shadow-sm">
                <h3 className="font-bold text-[#243d91] mb-4">Cài đặt thông báo</h3>
                {[
                  { label: 'Email khi có workshop mới phù hợp', checked: true },
                  { label: 'SMS nhắc nhở trước sự kiện 24h', checked: false },
                  { label: 'Thông báo khi có slot hủy (ưu tiên)', checked: true },
                ].map((item) => (
                  <label key={item.label} className="flex items-center justify-between py-2.5 cursor-pointer border-b border-[#ebe8dd] last:border-0">
                    <span className="text-sm font-semibold text-[#243d91]/80">{item.label}</span>
                    <div className="relative shrink-0 ml-4">
                      <input type="checkbox" defaultChecked={item.checked} className="peer sr-only" />
                      <div className="w-10 h-5 bg-[#ebe8dd] peer-checked:bg-[#4ecef5] rounded-full transition-colors" />
                      <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
