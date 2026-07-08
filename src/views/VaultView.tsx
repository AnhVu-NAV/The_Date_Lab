import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, Plus, Trash2, ImagePlus, Lock, Upload, Users, User as UserIcon, Globe, Shield, LayoutGrid, Folder, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import toast from 'react-hot-toast';
import { useDialog } from '../context/DialogContext';
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
  const { confirm } = useDialog();
  
  const [memories, setMemories] = useState<Memory[]>([]);
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  
  // Filter state
  const [filter, setFilter] = useState<'all' | 'personal' | 'community'>('all');
  
  // View mode state
  const [viewMode, setViewMode] = useState<'grid' | 'folders'>('folders');
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  // Upload Modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{current: number, total: number} | null>(null);
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
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadFiles(files);
    
    const urls: string[] = [];
    let loaded = 0;
    
    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        urls[index] = reader.result as string;
        loaded++;
        if (loaded === files.length) {
          setPreviewUrls([...urls]);
        }
      };
      reader.readAsDataURL(file);
    });

    setShowUploadModal(true);
    setForm({ caption: '', eventId: '', eventTitle: '', isPublic: true });
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleUploadSubmit = async () => {
    if (uploadFiles.length === 0 || !token) return;
    setUploading(true);
    setUploadProgress({ current: 0, total: uploadFiles.length });
    try {
      const newMemories: Memory[] = [];
      for (let i = 0; i < uploadFiles.length; i++) {
        setUploadProgress({ current: i + 1, total: uploadFiles.length });
        const uploaded = await api.uploadImage(previewUrls[i], 'vault', token);
        const memory = await api.createMemory({
          imageUrl: uploaded.url,
          cloudinaryPublicId: uploaded.publicId,
          caption: form.caption,
          eventId: form.eventId || null,
          eventTitle: form.eventTitle,
          isPublic: form.isPublic
        }, token);
        newMemories.push(memory);
      }
      setMemories(prev => [...newMemories, ...prev]);
      setShowUploadModal(false);
      setUploadFiles([]);
      setPreviewUrls([]);
      setUploadProgress(null);
      toast.success(lng === 'vi' ? 'Upload thành công!' : 'Upload successful!');
    } catch (err: any) {
      toast.error(err.message || 'Upload thất bại');
      setUploadProgress(null);
    } finally {
      setUploading(false);
    }
  };

  const handleTogglePublic = async () => {
    if (!selectedMemory || !token) return;
    try {
      const updated = await api.updateMemory(selectedMemory.id, { isPublic: !selectedMemory.isPublic }, token);
      setMemories(prev => prev.map(m => m.id === updated.id ? { ...m, isPublic: updated.isPublic } : m));
      setSelectedMemory(prev => prev ? { ...prev, isPublic: updated.isPublic } : null);
      toast.success(updated.isPublic ? 'Đã đổi thành Công khai' : 'Đã đổi thành Riêng tư');
    } catch (err: any) {
      toast.error(err.message || 'Error updating memory');
    }
  };

  const handleDeleteMemory = async () => {
    if (!selectedMemory || !token) return;
    if (!(await confirm(lng === 'vi' ? 'Bạn có chắc muốn xóa ảnh này không?' : 'Are you sure you want to delete this photo?'))) return;
    try {
      await api.deleteMemory(selectedMemory.id, token);
      setMemories(prev => prev.filter(m => m.id !== selectedMemory.id));
      setSelectedMemory(null);
      toast.success('Đã xóa ảnh');
    } catch (err: any) {
      toast.error(err.message || 'Error deleting memory');
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

  const filteredMemories = useMemo(() => memories.filter(mem => {
    if (filter === 'personal') return mem.userId === user.id;
    if (filter === 'community') return mem.userId !== user.id;
    return true;
  }), [memories, filter, user.id]);

  const groupedMemories = useMemo(() => {
    const groups = new Map<string, { eventId: string | null; eventTitle: string; memories: Memory[] }>();
    
    filteredMemories.forEach(mem => {
      const key = mem.eventId || 'personal';
      if (!groups.has(key)) {
        groups.set(key, { 
          eventId: mem.eventId, 
          eventTitle: mem.eventTitle || (lng === 'vi' ? 'Ảnh cá nhân' : 'Personal Photos'),
          memories: [] 
        });
      }
      groups.get(key)!.memories.push(mem);
    });
    
    return Array.from(groups.values());
  }, [filteredMemories, lng]);

  const displayedMemories = useMemo(() => {
    if (viewMode === 'grid') return filteredMemories;
    if (activeFolder) {
      return groupedMemories.find(g => (g.eventId || 'personal') === activeFolder)?.memories || [];
    }
    return [];
  }, [viewMode, activeFolder, filteredMemories, groupedMemories]);

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
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
        </div>
      </div>

      {/* Filters & Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-2 pb-2 md:pb-0 overflow-x-auto hide-scrollbar">
          {[
            { id: 'all', label: lng === 'vi' ? 'Tất cả' : 'All', icon: <Globe size={14} /> },
            { id: 'personal', label: lng === 'vi' ? 'Của tôi' : 'My Photos', icon: <UserIcon size={14} /> },
            { id: 'community', label: lng === 'vi' ? 'Cộng đồng & Sự kiện' : 'Community', icon: <Users size={14} /> },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => { setFilter(f.id as any); setActiveFolder(null); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                filter === f.id ? 'bg-[#243d91] text-white shadow-md' : 'bg-white border border-[#f0ede6] text-[#243d91]/60 hover:text-[#243d91]'
              }`}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-[#f0ede6] p-1 rounded-full shadow-sm">
          <button 
            onClick={() => { setViewMode('folders'); setActiveFolder(null); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${viewMode === 'folders' ? 'bg-[#f0ede6] text-[#243d91]' : 'text-[#243d91]/40 hover:text-[#243d91]/80'}`}
          >
            <Folder size={14}/> {lng === 'vi' ? 'Thư mục' : 'Folders'}
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${viewMode === 'grid' ? 'bg-[#f0ede6] text-[#243d91]' : 'text-[#243d91]/40 hover:text-[#243d91]/80'}`}
          >
            <LayoutGrid size={14}/> {lng === 'vi' ? 'Lưới ảnh' : 'Grid'}
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-[#f0ede6] rounded-2xl animate-pulse break-inside-avoid" />
          ))}
        </div>
      ) : viewMode === 'folders' && !activeFolder ? (
        groupedMemories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#f0ede6]">
            <div className="w-16 h-16 bg-[#e8539e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Folder size={28} className="text-[#e8539e]" />
            </div>
            <h3 className="font-display font-bold text-xl text-[#243d91] mb-2">{lng === 'vi' ? 'Chưa có thư mục nào' : 'No folders yet'}</h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {groupedMemories.map(group => {
              const coverImg = group.memories[0]?.imageUrl;
              return (
                <motion.div
                  key={group.eventId || 'personal'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveFolder(group.eventId || 'personal')}
                  className="bg-white border border-[#f0ede6] rounded-3xl p-3 cursor-pointer shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden mb-3 relative bg-[#f0ede6]">
                    {coverImg ? (
                      <img src={coverImg} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#243d91]/20">
                        <Camera size={40} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#243d91]/80 to-transparent flex items-end p-3">
                      <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg">
                        {group.memories.length} {lng === 'vi' ? 'ảnh' : 'photos'}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-[#243d91] line-clamp-1 px-1">{group.eventTitle}</h3>
                </motion.div>
              );
            })}
          </div>
        )
      ) : displayedMemories.length === 0 ? (
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
        <div className="space-y-6">
          {viewMode === 'folders' && activeFolder && (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveFolder(null)}
                className="w-10 h-10 rounded-full bg-white border border-[#f0ede6] flex items-center justify-center text-[#243d91] hover:bg-[#f0ede6] transition-all"
              >
                <ArrowLeft size={18}/>
              </button>
              <h2 className="font-display font-bold text-xl text-[#243d91]">
                {groupedMemories.find(g => (g.eventId || 'personal') === activeFolder)?.eventTitle}
              </h2>
            </div>
          )}
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {displayedMemories.map((mem) => {
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
                  {(selectedMemory.userId === user?.id || user?.role === 'admin') ? (
                    <>
                      <button 
                        onClick={handleTogglePublic}
                        className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${selectedMemory.isPublic ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'}`}
                      >
                        {selectedMemory.isPublic ? <Globe size={12}/> : <Lock size={12}/>}
                        {selectedMemory.isPublic ? 'Public' : 'Private'}
                      </button>
                      <button 
                        onClick={handleDeleteMemory}
                        className="text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all ml-auto"
                      >
                        <Trash2 size={12}/> {lng === 'vi' ? 'Xóa' : 'Delete'}
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-white/40 flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg">
                      {selectedMemory.isPublic ? <Globe size={12}/> : <Lock size={12}/>}
                      {selectedMemory.isPublic ? 'Public' : 'Private'}
                    </span>
                  )}
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
                <div className={`grid gap-2 overflow-y-auto max-h-60 rounded-2xl border border-[#f0ede6] ${previewUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1 aspect-[4/3]'}`}>
                  {previewUrls.map((url, i) => {
                    const status = !uploading ? 'idle' : (!uploadProgress ? 'idle' : (i + 1 < uploadProgress.current ? 'done' : (i + 1 === uploadProgress.current ? 'uploading' : 'pending')));
                    return (
                      <div key={i} className={`bg-gray-100 ${previewUrls.length === 1 ? 'aspect-[4/3]' : 'aspect-square'} overflow-hidden relative`}>
                        <img src={url} alt="Preview" className={`w-full h-full object-cover transition-all ${status === 'pending' || status === 'done' ? 'opacity-50' : ''}`} />
                        {status === 'done' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/20 backdrop-blur-sm">
                            <CheckCircle2 size={32} className="text-emerald-500 bg-white rounded-full" />
                          </div>
                        )}
                        {status === 'uploading' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                            <div className="w-8 h-8 border-4 border-[#e8539e] border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                        {previewUrls.length > 1 && (
                          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-full z-10">{i + 1}/{previewUrls.length}</div>
                        )}
                      </div>
                    );
                  })}
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
                  {uploading 
                    ? (uploadProgress ? (lng === 'vi' ? `Đang tải ${uploadProgress.current}/${uploadProgress.total}...` : `Uploading ${uploadProgress.current}/${uploadProgress.total}...`) : (lng === 'vi' ? 'Đang đăng...' : 'Uploading...')) 
                    : (lng === 'vi' ? `Đăng ${uploadFiles.length > 1 ? uploadFiles.length + ' ảnh' : 'ảnh'}` : `Post ${uploadFiles.length > 1 ? uploadFiles.length + ' photos' : 'Photo'}`)
                  }
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
