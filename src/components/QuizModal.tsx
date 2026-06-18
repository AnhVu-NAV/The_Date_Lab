import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QuizResult } from '../types';
import { useLanguage } from '../i18n';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (result: QuizResult) => void;
}

export default function QuizModal({ isOpen, onClose, onComplete }: Props) {
  const { t, lng } = useLanguage();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const questions = useMemo(() => [
    { id: 1, text: t('q1'), options: [t('q1o1'), t('q1o2')] },
    { id: 2, text: t('q2'), options: [t('q2o1'), t('q2o2')] },
    { id: 3, text: t('q3'), options: [t('q3o1'), t('q3o2'), t('q3o3')] },
    { id: 4, text: t('q4'), options: [t('q4o1'), t('q4o2'), t('q4o3'), t('q4o4')] }
  ], [t]);

  const handleAnswer = async (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        const response = await fetch('/api/gemini/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: newAnswers, lng })
        });
        const data = await response.json();
        onComplete(data);
      } catch (e) {
        console.error(e);
        onClose();
      } finally {
        setLoading(false);
        setStep(0);
        setAnswers([]);
      }
    }
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
          className="glass-card p-10 max-w-lg w-full relative overflow-hidden text-center"
        >
          {loading ? (
             <div className="py-12">
                <div className="w-16 h-16 border-[6px] border-brand-beige border-t-brand-pink rounded-full animate-spin mx-auto mb-6"></div>
                <h3 className="font-display text-3xl text-brand-navy mb-2">{t('findingVibe')}</h3>
                <p className="text-brand-navy/60 font-bold">{t('analyzingInfo')}</p>
             </div>
          ) : (
             <>
               <div className="w-full bg-brand-beige h-3 rounded-full mb-10 overflow-hidden border-2 border-white">
                 <div className="bg-brand-pink h-full transition-all duration-300 rounded-full" style={{ width: `${((step) / questions.length) * 100}%` }} />
               </div>
               <h2 className="font-display text-3xl text-brand-navy mb-8 text-center leading-tight">{questions[step].text}</h2>
               <div className="space-y-4">
                 {questions[step].options.map((opt, i) => (
                   <button 
                     key={i}
                     onClick={() => handleAnswer(opt)}
                     className="w-full text-center p-5 rounded-[1.5rem] border-4 border-brand-beige hover:border-brand-cyan bg-white hover:bg-brand-cyan/10 transition-all font-bold text-xl text-brand-navy"
                   >
                     {opt}
                   </button>
                 ))}
               </div>
             </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
