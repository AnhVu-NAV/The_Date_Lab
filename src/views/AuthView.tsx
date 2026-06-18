import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, AlertCircle, HandHeart, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n';
import { useAuth } from '../context/AuthContext';

export default function AuthView() {
  const navigate = useNavigate();
  const { lng, t } = useLanguage();
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || (lng === 'vi' ? 'Có lỗi xảy ra' : 'Something went wrong'));
    } finally {
      setLoading(false);
    }
  };

  const labels = {
    loginTab: t('login'),
    registerTab: t('signup'),
    welcomeBack: lng === 'vi' ? <span className="flex items-center justify-center gap-2">Chào mừng trở lại! <HandHeart size={24} className="text-[#e8539e]" /></span> : <span className="flex items-center justify-center gap-2">Welcome back! <HandHeart size={24} className="text-[#e8539e]" /></span>,
    createAccount: lng === 'vi' ? <span className="flex items-center justify-center gap-2">Tạo tài khoản mới <Sparkles size={24} className="text-[#e8539e]" /></span> : <span className="flex items-center justify-center gap-2">Create an account <Sparkles size={24} className="text-[#e8539e]" /></span>,
    loginDesc: lng === 'vi' ? 'Đăng nhập để xem vé và kỷ niệm của bạn' : 'Log in to view your tickets and memories',
    registerDesc: lng === 'vi' ? 'Bắt đầu hành trình sáng tạo cùng TDL' : 'Start your creative journey with TDL',
    password: lng === 'vi' ? 'Mật khẩu' : 'Password',
    submitLogin: lng === 'vi' ? 'Đăng nhập' : 'Log In',
    submitRegister: lng === 'vi' ? 'Tạo tài khoản' : 'Sign Up',
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-[#243d91]/10 border border-[#f0ede6] overflow-hidden">
          {/* Tabs */}
          <div className="grid grid-cols-2">
            <button
              onClick={() => { setTab('login'); setError(''); }}
              className={`py-4 text-sm font-bold transition-all ${tab === 'login' ? 'bg-[#e8539e] text-white' : 'bg-[#f0ede6]/50 text-[#243d91]/60 hover:bg-[#f0ede6]'}`}
            >
              {labels.loginTab}
            </button>
            <button
              onClick={() => { setTab('register'); setError(''); }}
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

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            {tab === 'register' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#243d91]/60 mb-1">{t('fullName')}</label>
                <input
                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  placeholder={lng === 'vi' ? 'Nguyễn Văn A' : 'Your full name'}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#f0ede6] text-sm font-semibold text-[#243d91] outline-none focus:border-[#e8539e] transition-all bg-[#f0ede6]/20"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#243d91]/60 mb-1">{t('email')}</label>
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
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#f0ede6] text-sm font-semibold text-[#243d91] outline-none focus:border-[#e8539e] transition-all bg-[#f0ede6]/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#e8539e] text-white font-bold rounded-xl hover:bg-[#e8539e]/90 disabled:opacity-50 transition-all shadow-lg shadow-[#e8539e]/30 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : tab === 'login' ? (
                <><LogIn size={18} /> {labels.submitLogin}</>
              ) : (
                <><UserPlus size={18} /> {labels.submitRegister}</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
