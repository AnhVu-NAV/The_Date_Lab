import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, Plus, Trash2, ImagePlus, Lock, Upload, Users, User as UserIcon, Globe, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import ComingSoon from '../components/ComingSoon';

interface Memory {
  id: string;
  userId: string;
  eventId: string | null;
  eventTitle: string;
  imageUrl: string;
  caption: string;
  isPublic: boolean;
  createdAt: string;
  userName: string;
  userRole: string;
}

export default function VaultView() {
  const navigate = useNavigate();
  const { lng, t } = useLanguage();
  const { user, token } = useAuth();
  
  const [memories, setMemories] = useState<Memory[]>([]);
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  
  // Filter state
  const [filter, setFilter] = useState<'all' | 'personal' | 'community'>('all');

  // Upload Modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [form, setForm] = useState({ caption: '', eventId: '', eventTitle: '', isPublic: true });
  const fileRef = useRef<HTMLInputElement>(null);
  const [features, setFeatures] = useState<any>(null);

  useEffect(() => {
    api.getSettings().then(data => setFeatures(data.features || {})).catch(console.error);
    if (!token) return;
    Promise.all([
      api.getVault(token).then(setMemories),
      api.getTickets(token).then(setMyTickets)
    ])
    .catch(console.error)
    .finally(() => setLoading(false));
  }, [token]);

  const uniqueEvents = Array.from(new Map(myTickets.filter(t => t.paymentStatus === 'paid').map(t => [t.eventId, t])).values()) as any[];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
    setShowUploadModal(true);
    setForm({ caption: '', eventId: '', eventTitle: '', isPublic: true });
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile || !token) return;
    setUploading(true);
    try {
      const uploaded = await api.uploadImage(previewUrl, 'vault', token);
      const memory = await api.createMemory({
        imageUrl: uploaded.url,
        cloudinaryPublicId: uploaded.publicId,
        caption: form.caption,
        eventId: form.eventId || null,
        eventTitle: form.eventTitle,
        isPublic: form.isPublic
      }, token);
      setMemories(prev => [memory, ...prev]);
      setShowUploadModal(false);
      setUploadFile(null);
      setPreviewUrl('');
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

  if (features && features.vault === false) {
    return <ComingSoon />;
  }

  const filteredMemories = memories.filter(mem => {
    if (filter === 'personal') return mem.userId === user.id;
    if (filter === 'community') return mem.userId !== user.id;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#f0ede6] shadow-sm">
        <div>
          <h1 className="font-display font-bold text-3xl text-[#243d91]">{t('vaultTitle')}</h1>
          <p className="text-[#243d91]/50 text-sm mt-1">{lng === 'vi' ? 'Nơi lưu giữ những khoảnh khắc đẹp nhất' : 'Where your best moments live'}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => fileRef.current?.click()} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#e8539e] text-white font-bold rounded-xl hover:bg-[#e8539e]/90 transition-all shadow-md shadow-[#e8539e]/20">
            <Plus size={18} /> {lng === 'vi' ? 'Thêm kỷ niệm' : 'Add Memory'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 pb-2 overflow-x-auto hide-scrollbar">
        {[
          { id: 'all', label: lng === 'vi' ? 'Tất cả' : 'All', icon: <Globe size={14} /> },
          { id: 'personal', label: lng === 'vi' ? 'Của tôi' : 'My Photos', icon: <UserIcon size={14} /> },
          { id: 'community', label: lng === 'vi' ? 'Cộng đồng & Sự kiện' : 'Community', icon: <Users size={14} /> },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              filter === f.id ? 'bg-[#243d91] text-white shadow-md' : 'bg-white border border-[#f0ede6] text-[#243d91]/60 hover:text-[#243d91]'
            }`}
          >
            {f.icon} {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-[#f0ede6] rounded-2xl animate-pulse break-inside-avoid" />
          ))}
        </div>
      ) : filteredMemories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#f0ede6]">
          <div className="w-16 h-16 bg-[#e8539e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera size={28} className="text-[#e8539e]" />
          </div>
          <h3 className="font-display font-bold text-xl text-[#243d91] mb-2">
            {lng === 'vi' ? 'Chưa có ảnh nào' : 'No photos yet'}
          </h3>
          <p className="text-[#243d91]/50 text-sm mb-6">
            {lng === 'vi' ? 'Hãy chia sẻ khoảnh khắc của bạn!' : 'Share your moments!'}
          </p>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filteredMemories.map((mem) => {
            const isMine = mem.userId === user.id;
            const isAdmin = mem.userRole === 'admin';
            return (
              <motion.div
                key={mem.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedMemory(mem)}
                className="break-inside-avoid rounded-2xl overflow-hidden cursor-pointer relative group border border-[#f0ede6] bg-white shadow-sm"
              >
                <img src={mem.imageUrl} alt="" className="w-full block" />
                
                {/* Overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex justify-between items-start">
                    {isAdmin && <span className="bg-[#e8539e] text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-md"><Shield size={10}/> Admin</span>}
                    {!isAdmin && !isMine && <span className="bg-white/90 text-[#243d91] text-[10px] font-bold px-2 py-1 rounded-md">{mem.userName}</span>}
                    {isMine && !mem.isPublic && <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md ml-auto"><Lock size={10} className="inline"/> Private</span>}
                  </div>
                  <div>
                    {mem.eventTitle && <p className="text-white text-xs font-bold mb-1">{mem.eventTitle}</p>}
                    {mem.caption && <p className="text-white/80 text-[10px] line-clamp-2">{mem.caption}</p>}
                  </div>
                </div>
              </motion.div>
            );
          })}
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
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <button onClick={() => setSelectedMemory(null)} className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all">
              <X size={24} />
            </button>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-4xl w-full flex flex-col md:flex-row bg-white/5 rounded-3xl overflow-hidden border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex-1 bg-black/50 flex items-center justify-center p-4">
                <img src={selectedMemory.imageUrl} alt="" className="max-h-[80vh] w-auto object-contain rounded-xl" />
              </div>
              <div className="w-full md:w-80 bg-[#243d91] p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-lg">
                    {selectedMemory.userName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm flex items-center gap-1.5">
                      {selectedMemory.userName || 'User'}
                      {selectedMemory.userRole === 'admin' && <Shield size={12} className="text-[#e8539e]"/>}
                    </p>
                    <p className="text-white/50 text-[10px] uppercase tracking-widest">{new Date(selectedMemory.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
                
                {selectedMemory.eventTitle && (
                  <div className="mb-4">
                    <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest mb-1">{lng === 'vi' ? 'Sự kiện' : 'Event'}</p>
                    <p className="text-white text-sm font-bold bg-white/5 px-3 py-2 rounded-lg border border-white/10">{selectedMemory.eventTitle}</p>
                  </div>
                )}
                
                {selectedMemory.caption && (
                  <div className="mb-4">
                    <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest mb-1">{lng === 'vi' ? 'Ghi chú' : 'Caption'}</p>
                    <p className="text-white/90 text-sm leading-relaxed">{selectedMemory.caption}</p>
                  </div>
                )}

                <div className="mt-auto pt-6 flex gap-2">
                  <span className="text-xs font-bold text-white/40 flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg">
                    {selectedMemory.isPublic ? <Globe size={12}/> : <Lock size={12}/>}
                    {selectedMemory.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-[#f0ede6] flex justify-between items-center">
                <h3 className="font-display font-bold text-xl text-[#243d91]">{lng === 'vi' ? 'Đăng ảnh kỷ niệm' : 'Upload Memory'}</h3>
                <button onClick={() => setShowUploadModal(false)} className="w-8 h-8 rounded-full bg-[#f0ede6] flex items-center justify-center text-[#243d91]/60 hover:text-red-500"><X size={16} /></button>
              </div>
              <div className="p-6 space-y-5">
                <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden border border-[#f0ede6]">
                  {previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#243d91]/60 mb-2">{lng === 'vi' ? 'Gắn với sự kiện (Tùy chọn)' : 'Link to Event'}</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#f0ede6] text-sm font-semibold text-[#243d91] outline-none focus:border-[#e8539e] bg-[#f0ede6]/20 transition-all"
                    value={form.eventId}
                    onChange={e => {
                      const id = e.target.value;
                      const ev = uniqueEvents.find(x => x.eventId === id);
                      setForm(f => ({ ...f, eventId: id, eventTitle: ev ? ev.eventTitle : '' }));
                    }}
                  >
                    <option value="">-- {lng === 'vi' ? 'Ảnh cá nhân / Không chọn' : 'Personal Photo'} --</option>
                    {uniqueEvents.map(ev => <option key={ev.eventId} value={ev.eventId}>{ev.eventTitle}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#243d91]/60 mb-2">{lng === 'vi' ? 'Ghi chú' : 'Caption'}</label>
                  <textarea 
                    rows={2} 
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#f0ede6] text-sm font-semibold text-[#243d91] outline-none focus:border-[#e8539e] bg-[#f0ede6]/20 transition-all resize-none"
                    placeholder={lng === 'vi' ? "Kể gì đó về khoảnh khắc này..." : "Say something..."}
                    value={form.caption}
                    onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
                  />
                </div>

                <label className="flex items-center gap-3 p-4 border-2 border-[#f0ede6] rounded-xl cursor-pointer hover:border-[#e8539e]/30 transition-all">
                  <div className={`w-6 h-6 rounded flex items-center justify-center transition-all ${form.isPublic ? 'bg-[#e8539e] text-white' : 'bg-[#f0ede6] text-[#243d91]/40'}`}>
                    {form.isPublic ? <Globe size={14} /> : <Lock size={14} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#243d91] text-sm">{lng === 'vi' ? 'Công khai ảnh này' : 'Make Public'}</p>
                    <p className="text-xs text-[#243d91]/50 leading-tight">
                      {lng === 'vi' ? 'Người khác có thể thấy ảnh này nếu bạn gắn nó vào một sự kiện chung.' : 'Others can see this if linked to a community event.'}
                    </p>
                  </div>
                  <input type="checkbox" className="hidden" checked={form.isPublic} onChange={e => setForm(f => ({ ...f, isPublic: e.target.checked }))} />
                </label>

                <button 
                  onClick={handleUploadSubmit} 
                  disabled={uploading} 
                  className="w-full py-4 bg-[#e8539e] text-white font-bold rounded-2xl hover:bg-[#e8539e]/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#e8539e]/20"
                >
                  {uploading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload size={18} />}
                  {uploading ? (lng === 'vi' ? 'Đang đăng...' : 'Uploading...') : (lng === 'vi' ? 'Đăng ảnh' : 'Post Photo')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
