import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

interface AuthViewProps {
  setIsAuthenticated: (v: boolean) => void;
  setUserRole: (v: 'user' | 'admin') => void;
}

export default function AuthView({ setIsAuthenticated, setUserRole }: AuthViewProps) {
  const navigate = useNavigate();
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

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-[#243d91]/10 border border-[#ebe8dd] overflow-hidden">
          {/* Tabs */}
          <div className="grid grid-cols-2">
            <button
              onClick={() => setTab('login')}
              className={`py-4 text-sm font-bold transition-all ${tab === 'login' ? 'bg-[#e8539e] text-white' : 'bg-[#ebe8dd]/50 text-[#243d91]/60 hover:bg-[#ebe8dd]'}`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => setTab('register')}
              className={`py-4 text-sm font-bold transition-all ${tab === 'register' ? 'bg-[#e8539e] text-white' : 'bg-[#ebe8dd]/50 text-[#243d91]/60 hover:bg-[#ebe8dd]'}`}
            >
              Đăng ký
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            <div className="text-center mb-6">
              <h2 className="font-display font-bold text-2xl text-[#243d91]">
                {tab === 'login' ? 'Chào mừng trở lại! 👋' : 'Tạo tài khoản mới ✨'}
              </h2>
              <p className="text-sm text-[#243d91]/50 mt-1">
                {tab === 'login' ? 'Đăng nhập để xem vé và kỷ niệm của bạn' : 'Bắt đầu hành trình sáng tạo cùng TDL'}
              </p>
            </div>

            {tab === 'register' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#243d91]/60 mb-1">Họ và tên</label>
                <input
                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#ebe8dd] text-sm font-semibold text-[#243d91] outline-none focus:border-[#e8539e] transition-all bg-[#ebe8dd]/20"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#243d91]/60 mb-1">Email</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-[#ebe8dd] text-sm font-semibold text-[#243d91] outline-none focus:border-[#e8539e] transition-all bg-[#ebe8dd]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#243d91]/60 mb-1">Mật khẩu</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border-2 border-[#ebe8dd] text-sm font-semibold text-[#243d91] outline-none focus:border-[#e8539e] transition-all bg-[#ebe8dd]/20"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#e8539e] text-white font-bold rounded-xl hover:bg-[#e8539e]/90 transition-all shadow-lg shadow-[#e8539e]/30 flex items-center justify-center gap-2 mt-2"
            >
              <LogIn size={18} /> {tab === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
            </button>

            {/* Demo hint */}
            <div className="mt-4 p-3 bg-[#4ecef5]/10 rounded-xl text-xs text-[#243d91]/70">
              <p className="font-bold mb-1">💡 Demo accounts:</p>
              <p>Admin: <code className="text-[#e8539e]">admin@thedatelab.com</code></p>
              <p>User: <code className="text-[#4ecef5]">bất kỳ email nào</code></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
