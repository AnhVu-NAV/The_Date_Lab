import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useLanguage } from '../i18n';

interface AuthViewProps {
  setIsAuthenticated: (v: boolean) => void;
  setUserRole: (v: 'user' | 'admin') => void;
}

export default function AuthView({ setIsAuthenticated, setUserRole }: AuthViewProps) {
  const navigate = useNavigate();
  const { lng, t } = useLanguage();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@thedatelab.com') setUserRole('admin');
    else setUserRole('user');
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const labels = {
    loginTab: t('login'),
    registerTab: t('signup'),
    welcomeBack: lng === 'vi' ? 'Chào mừng trở lại! 👋' : 'Welcome back! 👋',
    createAccount: lng === 'vi' ? 'Tạo tài khoản mới ✨' : 'Create an account ✨',
    loginDesc: lng === 'vi' ? 'Đăng nhập để xem vé và kỷ niệm của bạn' : 'Log in to view your tickets and memories',
    registerDesc: lng === 'vi' ? 'Bắt đầu hành trình sáng tạo cùng TDL' : 'Start your creative journey with TDL',
    fullName: t('fullName'),
    emailLabel: t('email'),
    password: lng === 'vi' ? 'Mật khẩu' : 'Password',
    submitLogin: t('login'),
    submitRegister: t('signup'),
    demoTitle: lng === 'vi' ? '💡 Tài khoản demo:' : '💡 Demo accounts:',
    adminHint: lng === 'vi' ? 'Admin: ' : 'Admin: ',
    userHint: lng === 'vi' ? 'User: bất kỳ email nào' : 'User: any email',
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-[#243d91]/10 border border-[#f0ede6] overflow-hidden">
          {/* Tabs */}
          <div className="grid grid-cols-2">
            <button
              onClick={() => setTab('login')}
              className={`py-4 text-sm font-bold transition-all ${tab === 'login' ? 'bg-[#e8539e] text-white' : 'bg-[#f0ede6]/50 text-[#243d91]/60 hover:bg-[#f0ede6]'}`}
            >
              {labels.loginTab}
            </button>
            <button
              onClick={() => setTab('register')}
              className={`py-4 text-sm font-bold transition-all ${tab === 'register' ? 'bg-[#e8539e] text-white' : 'bg-[#f0ede6]/50 text-[#243d91]/60 hover:bg-[#f0ede6]'}`}
            >
              {labels.registerTab}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            <div className="text-center mb-6">
              <h2 className="font-display font-bold text-2xl text-[#243d91]">
                {tab === 'login' ? labels.welcomeBack : labels.createAccount}
              </h2>
              <p className="text-sm text-[#243d91]/50 mt-1">
                {tab === 'login' ? labels.loginDesc : labels.registerDesc}
              </p>
            </div>

            {tab === 'register' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#243d91]/60 mb-1">{labels.fullName}</label>
                <input
                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  placeholder={lng === 'vi' ? 'Nguyễn Văn A' : 'Your full name'}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#f0ede6] text-sm font-semibold text-[#243d91] outline-none focus:border-[#e8539e] transition-all bg-[#f0ede6]/20"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#243d91]/60 mb-1">{labels.emailLabel}</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-[#f0ede6] text-sm font-semibold text-[#243d91] outline-none focus:border-[#e8539e] transition-all bg-[#f0ede6]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#243d91]/60 mb-1">{labels.password}</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border-2 border-[#f0ede6] text-sm font-semibold text-[#243d91] outline-none focus:border-[#e8539e] transition-all bg-[#f0ede6]/20"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#e8539e] text-white font-bold rounded-xl hover:bg-[#e8539e]/90 transition-all shadow-lg shadow-[#e8539e]/30 flex items-center justify-center gap-2 mt-2"
            >
              <LogIn size={18} /> {tab === 'login' ? labels.submitLogin : labels.submitRegister}
            </button>

            <div className="mt-4 p-3 bg-[#4ecef5]/10 rounded-xl text-xs text-[#243d91]/70">
              <p className="font-bold mb-1">{labels.demoTitle}</p>
              <p>{labels.adminHint}<code className="text-[#e8539e]">admin@thedatelab.com</code></p>
              <p>{labels.userHint}</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
