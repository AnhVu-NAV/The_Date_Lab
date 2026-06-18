import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, Plus, Trash2, ImagePlus, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

interface Memory {
  id: string;
  imageUrl: string;
  eventTitle: string;
  caption: string;
  createdAt: string;
}

export default function VaultView() {
  const navigate = useNavigate();
  const { lng, t } = useLanguage();
  const { user, token } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [caption, setCaption] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token) return;
    api.getVault(token)
      .then(setMemories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const uploaded = await api.uploadImage(base64, 'vault', token);
        const memory = await api.createMemory({
          imageUrl: uploaded.url,
          cloudinaryPublicId: uploaded.publicId,
          caption,
        }, token);
        setMemories(prev => [memory, ...prev]);
        setCaption('');
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      alert(err.message || 'Upload thất bại');
    } finally {
      setUploading(false);
    }
  };

  if (!user) return (
    <div className="text-center py-20">
      <div className="w-16 h-16 bg-[#e8539e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Lock size={28} className="text-[#e8539e]" />
      </div>
      <h2 className="font-display font-bold text-2xl text-[#243d91] mb-2">{t('vaultLocked')}</h2>
      <p className="text-[#243d91]/60 text-sm mb-6">{t('vaultLockedDesc')}</p>
      <button onClick={() => navigate('/login')} className="px-6 py-3 bg-[#e8539e] text-white font-bold rounded-xl hover:bg-[#e8539e]/90 transition-all">
        {t('login')}
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-[#243d91]">{t('vaultTitle')}</h1>
          <p className="text-[#243d91]/50 text-sm mt-1">{t('vaultDesc')}</p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#e8539e] text-white font-bold rounded-xl hover:bg-[#e8539e]/90 transition-all shadow-md shadow-[#e8539e]/20 disabled:opacity-50"
        >
          {uploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus size={16} />}
          {lng === 'vi' ? 'Thêm kỷ niệm' : 'Add Memory'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>

      {/* Caption input */}
      <div className="flex gap-2">
        <input
          value={caption}
          onChange={e => setCaption(e.target.value)}
          placeholder={lng === 'vi' ? 'Ghi chú cho ảnh tiếp theo... (tùy chọn)' : 'Caption for next upload... (optional)'}
          className="flex-1 px-4 py-2.5 rounded-xl border-2 border-[#f0ede6] text-sm font-semibold text-[#243d91] outline-none focus:border-[#e8539e] transition-all bg-white"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-[#f0ede6] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : memories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#f0ede6]">
          <div className="w-16 h-16 bg-[#e8539e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera size={28} className="text-[#e8539e]" />
          </div>
          <h3 className="font-display font-bold text-xl text-[#243d91] mb-2">
            {lng === 'vi' ? 'Kho kỷ niệm trống' : 'Your vault is empty'}
          </h3>
          <p className="text-[#243d91]/50 text-sm mb-6">
            {lng === 'vi' ? 'Hãy upload ảnh đầu tiên từ buổi workshop!' : 'Upload your first photo from a workshop!'}
          </p>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 mx-auto px-5 py-3 bg-[#e8539e] text-white font-bold rounded-xl hover:bg-[#e8539e]/90 transition-all"
          >
            <ImagePlus size={16} /> {lng === 'vi' ? 'Upload ngay' : 'Upload now'}
          </button>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {memories.map((mem) => (
            <motion.div
              key={mem.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedMemory(mem)}
              className="break-inside-avoid rounded-2xl overflow-hidden cursor-pointer relative group"
            >
              <img src={mem.imageUrl} alt={mem.caption || 'Memory'} className="w-full block" />
              {mem.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-white text-xs font-semibold">{mem.caption}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMemory(null)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-3xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <img src={selectedMemory.imageUrl} alt="Memory" className="w-full rounded-2xl" />
              {selectedMemory.caption && (
                <p className="text-white/80 text-center mt-3 text-sm">{selectedMemory.caption}</p>
              )}
              <button
                onClick={() => setSelectedMemory(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
