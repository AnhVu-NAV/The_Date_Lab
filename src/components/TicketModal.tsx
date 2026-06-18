import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../i18n';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function TicketModal({ isOpen, onClose }: Props) {
  const { t } = useLanguage();
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/50 backdrop-blur-sm" onClick={onClose}>
        <motion.div 
          onClick={e => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="glass-card p-10 max-w-md w-full relative"
        >
          {success ? (
            <div className="text-center py-12 flex flex-col items-center">
              <div className="w-20 h-20 bg-brand-cyan/20 text-brand-cyan border-4 border-brand-cyan rounded-full flex items-center justify-center mb-6 text-4xl font-bold">✓</div>
              <h2 className="font-display text-4xl text-brand-navy mb-4 tracking-wide">{t('ticketSecured')}</h2>
              <p className="text-brand-navy/70 text-lg font-bold">{t('ticketSent')}</p>
            </div>
          ) : (
            <>
              <h2 className="font-display text-3xl text-brand-navy mb-8 text-center uppercase tracking-wider">{t('checkout')}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-brand-navy/80 mb-2 uppercase tracking-wide">{t('fullName')}</label>
                  <input required type="text" className="w-full px-5 py-3 border-4 border-brand-beige rounded-[1.5rem] focus:border-brand-pink focus:outline-none bg-brand-beige/30 font-bold text-brand-navy text-lg" placeholder="Nguyễn Văn A" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-navy/80 mb-2 uppercase tracking-wide">{t('email')}</label>
                  <input required type="email" className="w-full px-5 py-3 border-4 border-brand-beige rounded-[1.5rem] focus:border-brand-cyan focus:outline-none bg-brand-beige/30 font-bold text-brand-navy text-lg" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-navy/80 mb-2 uppercase tracking-wide">{t('cardNumber')}</label>
                  <input required type="text" className="w-full px-5 py-3 border-4 border-brand-beige rounded-[1.5rem] focus:border-brand-navy focus:outline-none bg-brand-beige/30 font-bold text-brand-navy text-lg tracking-widest" placeholder="**** **** **** ****" />
                </div>
                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={onClose} className="flex-1 py-4 rounded-full font-bold text-brand-navy/60 bg-brand-beige hover:bg-brand-beige/80 transition-colors uppercase tracking-wider">{t('cancel')}</button>
                  <button type="submit" className="btn-pink flex-1 py-4 rounded-full font-display text-lg tracking-wider uppercase">{t('payNow')}</button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
