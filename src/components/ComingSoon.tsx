import React from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n';

export default function ComingSoon({ title }: { title?: string }) {
  const navigate = useNavigate();
  const { lng } = useLanguage();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-[#e8539e]/10 rounded-full flex items-center justify-center mb-6">
        <Sparkles size={36} className="text-[#e8539e]" />
      </div>
      <h2 className="font-display font-bold text-3xl text-[#243d91] mb-4">
        {title || (lng === 'vi' ? 'Sắp ra mắt' : 'Coming Soon')}
      </h2>
      <p className="text-[#243d91]/60 max-w-md mb-8">
        {lng === 'vi' 
          ? 'Tính năng này đang được chúng mình hoàn thiện và sẽ sớm ra mắt trong thời gian tới. Mong bạn thông cảm nhé!' 
          : 'This feature is currently under development and will be available soon.'}
      </p>
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 px-6 py-3 bg-[#f0ede6] text-[#243d91] font-bold rounded-xl hover:bg-[#243d91]/10 transition-all"
      >
        <ArrowLeft size={16} /> {lng === 'vi' ? 'Quay lại' : 'Go back'}
      </button>
    </div>
  );
}
