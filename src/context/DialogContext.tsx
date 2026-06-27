import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, HelpCircle } from 'lucide-react';
import { useLanguage } from '../i18n';

type DialogType = 'confirm' | 'prompt';

interface DialogOptions {
  type: DialogType;
  message: string;
  placeholder?: string;
  resolve: (value: any) => void;
}

interface DialogContextType {
  confirm: (message: string) => Promise<boolean>;
  prompt: (message: string, placeholder?: string) => Promise<string | null>;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) throw new Error('useDialog must be used within DialogProvider');
  return context;
};

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const { lng } = useLanguage();
  const [dialog, setDialog] = useState<DialogOptions | null>(null);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const confirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialog({ type: 'confirm', message, resolve });
    });
  };

  const prompt = (message: string, placeholder?: string): Promise<string | null> => {
    return new Promise((resolve) => {
      setInputValue('');
      setDialog({ type: 'prompt', message, placeholder, resolve });
    });
  };

  const handleClose = (value: any) => {
    if (dialog) {
      dialog.resolve(value);
      setDialog(null);
    }
  };

  useEffect(() => {
    if (dialog?.type === 'prompt' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [dialog]);

  return (
    <DialogContext.Provider value={{ confirm, prompt }}>
      {children}

      <AnimatePresence>
        {dialog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => handleClose(dialog.type === 'confirm' ? false : null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${dialog.type === 'confirm' ? 'bg-amber-100 text-amber-500' : 'bg-blue-100 text-blue-500'}`}>
                    {dialog.type === 'confirm' ? <AlertTriangle size={28} /> : <HelpCircle size={28} />}
                  </div>
                  <h3 className="text-xl font-display font-bold text-[#243d91] mb-2">
                    {dialog.type === 'confirm' ? (lng === 'vi' ? 'Xác nhận' : 'Confirm') : (lng === 'vi' ? 'Nhập thông tin' : 'Input required')}
                  </h3>
                  <p className="text-[#243d91]/70 mb-6">{dialog.message}</p>

                  {dialog.type === 'prompt' && (
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={dialog.placeholder || ''}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#f0ede6] bg-white text-[#243d91] font-medium outline-none focus:border-[#243d91] transition-all mb-6 text-center"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleClose(inputValue);
                        if (e.key === 'Escape') handleClose(null);
                      }}
                    />
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleClose(dialog.type === 'confirm' ? false : null)}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-[#243d91]/60 bg-[#f0ede6] hover:bg-[#e4e1db] transition-all"
                  >
                    {lng === 'vi' ? 'Hủy' : 'Cancel'}
                  </button>
                  <button
                    onClick={() => handleClose(dialog.type === 'confirm' ? true : inputValue)}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-[#243d91] hover:bg-[#1a2d6b] transition-all"
                  >
                    {lng === 'vi' ? 'Đồng ý' : 'Confirm'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DialogContext.Provider>
  );
};
