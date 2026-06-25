import React from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n';

export default function ComingSoon({ title }: { title?: string }) {
  const navigate = useNavigate();
  const { lng } = useLanguage();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 w-full">
      <div className="w-20 h-20 bg-current/10 rounded-full flex items-center justify-center mb-6">
        <Sparkles size={36} className="text-current opacity-80" />
      </div>
      <h2 className="font-display font-bold text-3xl mb-4 text-current">
        {title || (lng === 'vi' ? 'Sắp ra mắt' : 'Coming Soon')}
      </h2>
      <p className="max-w-md mb-8 opacity-70 text-current text-sm">
        {lng === 'vi' 
          ? 'Tính năng này đang được chúng mình hoàn thiện và sẽ sớm ra mắt trong thời gian tới. Mong bạn thông cảm nhé!' 
          : 'This feature is currently under development and will be available soon.'}
      </p>
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 px-6 py-3 bg-current/10 font-bold rounded-xl hover:bg-current/20 transition-all text-current"
      >
        <ArrowLeft size={16} /> {lng === 'vi' ? 'Quay lại' : 'Go back'}
      </button>
    </div>
  );
}
