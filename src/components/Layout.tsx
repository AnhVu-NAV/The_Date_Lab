import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { User, Lock, Menu, X, LogIn, LogOut, Shield, Sparkles, Compass, MapPin, Mail } from 'lucide-react';
import Chatbot from './Chatbot';
import TarotModal from './TarotModal';
import Logo from '../assets/Logo/2.png';
import { useLanguage } from '../i18n';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lng, setLng, t } = useLanguage();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tarotOpen, setTarotOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navItems = [
    { label: t('navEvents'), path: '/', icon: <Compass size={14} /> },
    { label: t('navFindVibe'), path: '/quiz', icon: <Sparkles size={14} /> },
    { label: t('navVault'), path: '/vault', icon: <Lock size={14} /> },
  ];

  const isAdminDashboard = location.pathname === '/dashboard' && user?.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-[#f0ede6]">
      {/* NAVBAR */}
      {!isAdminDashboard && (
        <header className="sticky top-0 z-50 px-4 pt-3 pb-1">
        <nav className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg shadow-[#243d91]/5 border border-white px-4 md:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border-2 border-[#f0ede6] flex items-center justify-center">
              <img src={Logo} alt="TDL Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-display font-bold text-lg text-[#e8539e]">The Date Lab</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 text-sm font-bold px-3.5 py-2 rounded-xl transition-all ${
                  location.pathname === item.path
                    ? 'bg-[#e8539e]/10 text-[#e8539e]'
                    : 'text-[#243d91]/60 hover:text-[#243d91] hover:bg-[#f0ede6]/80'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            <button
              onClick={() => setTarotOpen(true)}
              className="flex items-center gap-1.5 text-sm font-bold px-3.5 py-2 rounded-xl text-[#243d91]/60 hover:text-[#243d91] hover:bg-[#f0ede6]/80 transition-all"
            >
              <span className="text-base leading-none">✦</span>
              <span>{t('navTarot')}</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={() => setLng(lng === 'vi' ? 'en' : 'vi')}
              className="hidden md:flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border-2 border-[#f0ede6] text-[#243d91]/60 hover:border-[#e8539e]/30 hover:text-[#243d91] transition-all bg-white/60"
            >
              <span className="text-base leading-none">{lng === 'vi' ? '🇻🇳' : '🇺🇸'}</span>
              <span>{lng === 'vi' ? 'VI' : 'EN'}</span>
            </button>

            {user ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`hidden md:flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition-all ${
                    location.pathname === '/dashboard'
                      ? 'bg-[#243d91] text-white'
                      : 'bg-[#f0ede6] text-[#243d91] hover:bg-[#243d91]/10'
                  }`}
                >
                  {user.role === 'admin' ? <Shield size={16} /> : <User size={16} />}
                  <span className="hidden lg:inline">{user.role === 'admin' ? 'Admin' : t('navDashboard')}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-xl text-[#243d91]/40 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl bg-[#e8539e] text-white hover:bg-[#e8539e]/90 transition-all shadow-md shadow-[#e8539e]/25"
              >
                <LogIn size={15} /> {t('login')}
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-[#f0ede6] flex items-center justify-center text-[#243d91]"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="md:hidden max-w-7xl mx-auto mt-2 bg-white rounded-2xl shadow-xl border border-[#f0ede6] p-3 flex flex-col gap-1"
            >
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    location.pathname === item.path
                      ? 'bg-[#e8539e]/10 text-[#e8539e]'
                      : 'text-[#243d91] hover:bg-[#f0ede6]'
                  }`}
                >
                  {item.icon}{item.label}
                </Link>
              ))}
              <button
                onClick={() => { setTarotOpen(true); setMobileMenuOpen(false); }}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold text-sm text-[#243d91] hover:bg-[#f0ede6] transition-all"
              >
                <span className="text-base leading-none">✦</span> {t('navTarot')}
              </button>
              <button
                onClick={() => setLng(lng === 'vi' ? 'en' : 'vi')}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold text-sm text-[#243d91] hover:bg-[#f0ede6] transition-all"
              >
                <span className="text-lg">{lng === 'vi' ? '🇻🇳' : '🇺🇸'}</span>
                {lng === 'vi' ? 'Chuyển sang English' : 'Switch to Tiếng Việt'}
              </button>
              <div className="border-t border-[#f0ede6] my-1" />
              {user ? (
                <>
                  <button
                    onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold text-sm text-[#243d91] hover:bg-[#f0ede6] transition-all"
                  >
                    {user.role === 'admin' ? <Shield size={16} /> : <User size={16} />}
                    {user.role === 'admin' ? 'Admin Panel' : t('navDashboard')}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold text-sm text-red-400 hover:bg-red-50 transition-all"
                  >
                    <LogOut size={16} /> {lng === 'vi' ? 'Đăng xuất' : 'Log out'}
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 justify-center px-4 py-3 rounded-xl font-bold text-sm bg-[#e8539e] text-white"
                >
                  <LogIn size={15} /> {t('login')} / {t('signup')}
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      )}

      {/* Page Content */}
      <main className={`flex-1 w-full ${isAdminDashboard ? '' : 'max-w-7xl mx-auto px-4 py-6'}`}>
        <Outlet />
      </main>

      {/* FOOTER */}
      {!isAdminDashboard && (
        <footer className="bg-[#243d91] text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-white rounded-lg overflow-hidden">
                <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-display font-bold text-xl text-[#e8539e]">The Date Lab</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              {lng === 'vi'
                ? 'Khơi nguồn cảm hứng, lưu giữ kỷ niệm. Nơi mỗi buổi hẹn đều trở thành tác phẩm.'
                : 'Spark creativity, preserve memories. Where every date becomes a masterpiece.'}
            </p>
          </div>
          <div>
            <h4 className="font-bold uppercase text-xs tracking-widest text-[#4ecef5] mb-4">
              {lng === 'vi' ? 'Khám phá' : 'Explore'}
            </h4>
            <div className="flex flex-col gap-2.5 text-sm text-white/50">
              <Link to="/" className="hover:text-white transition-colors">{t('navEvents')}</Link>
              <Link to="/quiz" className="hover:text-white transition-colors">{t('navFindVibe')}</Link>
              <Link to="/vault" className="hover:text-white transition-colors">{t('navVault')}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold uppercase text-xs tracking-widest text-[#4ecef5] mb-4">
              {lng === 'vi' ? 'Liên hệ' : 'Contact'}
            </h4>
            <div className="flex flex-col gap-2.5 text-sm text-white/50">
              <span className="flex items-center gap-2"><MapPin size={13} className="text-[#4ecef5]" /> ĐH FPT Hoà Lạc, Hà Nội</span>
              <span className="flex items-center gap-2"><Mail size={13} className="text-[#4ecef5]" /> hello@thedatelab.vn</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 text-center py-4 text-xs text-white/30">
          © 2026 The Date Lab. All rights reserved.
        </div>
      </footer>
      )}

      <TarotModal isOpen={tarotOpen} onClose={() => setTarotOpen(false)} />
      <Chatbot />
    </div>
  );
}
