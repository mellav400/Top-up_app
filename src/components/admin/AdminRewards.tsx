import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  Edit3, 
  Trash2,
  RefreshCcw, 
  Save, 
  CheckCircle2,
  X,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Eye,
  Sparkles,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DailyRewardConfig } from '../../types';
import { DEFAULT_DAILY_REWARDS } from '../../constants';

export default function AdminRewards() {
  const [rewards, setRewards] = useState<DailyRewardConfig[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<DailyRewardConfig | null>(null);
  const [showNotification, setShowNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('giokup_daily_rewards_config');
    if (saved) {
      setRewards(JSON.parse(saved));
    } else {
      setRewards(DEFAULT_DAILY_REWARDS);
    }
  }, []);

  const saveToStorage = (data: DailyRewardConfig[]) => {
    localStorage.setItem('giokup_daily_rewards_config', JSON.stringify(data));
    setRewards(data);
    notify('Berhasil menyimpan perubahan!', 'success');
  };

  const notify = (message: string, type: 'success' | 'error') => {
    setShowNotification({ message, type });
    setTimeout(() => setShowNotification(null), 3000);
  };

  const handleEdit = (reward: DailyRewardConfig) => {
    setEditingReward({ ...reward });
    setIsModalOpen(true);
  };

  const handleDelete = (day: number) => {
    if (window.confirm(`Yakin ingin menghapus konfigurasi reward Hari ke-${day}?`)) {
      const updated = rewards.filter(r => r.day !== day);
      saveToStorage(updated);
    }
  };

  const handleUpdateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReward) return;

    // Validasi
    if (editingReward.discount > 80) {
      notify('Diskon tidak boleh lebih dari 80%', 'error');
      return;
    }
    if (editingReward.minTopUp < 1000) {
      notify('Minimum top-up minimal Rp1.000', 'error');
      return;
    }
    if (editingReward.activeHours < 1 || editingReward.activeHours > 168) {
      notify('Masa aktif minimal 1 jam dan maksimal 168 jam', 'error');
      return;
    }
    if (editingReward.day === 7 && (!editingReward.maxDiscount || editingReward.maxDiscount <= 0)) {
      notify('Hari ke-7 wajib memiliki Maksimal Potongan', 'error');
      return;
    }

    const updatedRewards = rewards.map(r => r.day === editingReward.day ? editingReward : r);
    saveToStorage(updatedRewards);
    setIsModalOpen(false);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan semua pengaturan reward ke default?')) {
      saveToStorage(DEFAULT_DAILY_REWARDS);
    }
  };

  const handleToggleGlobal = (status: 'Active' | 'Inactive') => {
    const updated = rewards.map(r => ({ ...r, status }));
    saveToStorage(updated);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-jade-dark/50 border border-jade-mid p-6 rounded-3xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-jade-accent/10 rounded-2xl border border-jade-accent/20">
            <Gift className="w-6 h-6 text-jade-accent" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-main font-serif italic text-white">Daily Reward Config</h3>
            <p className="text-[10px] text-text-dim font-black uppercase tracking-widest mt-1">Kelola sistem klaim reward 7 hari</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setIsPreviewOpen(true)}
            className="px-6 py-3 bg-jade-mid/20 border border-jade-mid rounded-xl text-[10px] font-black uppercase tracking-widest text-jade-glow hover:bg-jade-mid/40 transition-all flex items-center gap-2"
          >
            <Eye className="w-4 h-4" /> User Preview
          </button>
          
          <button 
            onClick={handleResetToDefault}
            className="px-6 py-3 bg-jade-mid/20 border border-jade-mid rounded-xl text-[10px] font-black uppercase tracking-widest text-amber-500 hover:bg-amber-500/10 transition-all flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" /> Reset Default
          </button>

          <div className="flex bg-jade-bg p-1 rounded-xl border border-jade-mid">
            <button 
              onClick={() => handleToggleGlobal('Active')}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${rewards.every(r => r.status === 'Active') ? 'bg-jade-accent text-jade-bg shadow-lg' : 'text-text-dim'}`}
            >
              Aktifkan Semua
            </button>
            <button 
              onClick={() => handleToggleGlobal('Inactive')}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${rewards.every(r => r.status === 'Inactive') ? 'bg-red-500 text-white shadow-lg' : 'text-text-dim'}`}
            >
              Nonaktifkan Semua
            </button>
          </div>
        </div>
      </div>

      {/* Rewards Table */}
      <div className="bg-jade-dark/50 border border-jade-mid rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-jade-bg/50 border-b border-jade-mid">
                <th className="px-8 py-6 text-[10px] font-black text-text-dim uppercase tracking-[3px]">Hari</th>
                <th className="px-8 py-6 text-[10px] font-black text-text-dim uppercase tracking-[3px]">Reward (Diskon)</th>
                <th className="px-8 py-6 text-[10px] font-black text-text-dim uppercase tracking-[3px]">Min. Top-Up</th>
                <th className="px-8 py-6 text-[10px] font-black text-text-dim uppercase tracking-[3px]">Masa Aktif</th>
                <th className="px-8 py-6 text-[10px] font-black text-text-dim uppercase tracking-[3px]">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-text-dim uppercase tracking-[3px] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-jade-mid/30">
              {rewards.map((reward) => (
                <tr key={reward.day} className="hover:bg-jade-mid/10 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${reward.day === 7 ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-jade-bg border border-jade-mid text-jade-accent group-hover:border-jade-glow transition-all'}`}>
                        {reward.day}
                      </div>
                      <span className="text-sm font-bold text-text-main">Hari ke-{reward.day}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="text-base font-black text-jade-accent">{reward.discount}% OFF</p>
                      {reward.maxDiscount && (
                        <p className="text-[10px] font-bold text-text-dim uppercase">Max: Rp {reward.maxDiscount.toLocaleString('id-ID')}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-mono font-bold text-text-main bg-jade-bg px-3 py-1.5 rounded-lg border border-jade-mid">
                      Rp {reward.minTopUp.toLocaleString('id-ID')}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-text-main">{reward.activeHours} Jam</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${reward.status === 'Active' ? 'bg-jade-accent/10 border-jade-accent/30 text-jade-accent' : 'bg-red-400/10 border-red-400/30 text-red-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${reward.status === 'Active' ? 'bg-jade-accent animate-pulse' : 'bg-red-400'}`} />
                      {reward.status === 'Active' ? 'Aktif' : 'Nonaktif'}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(reward)}
                        className="p-3 bg-jade-bg border border-jade-mid rounded-xl text-text-dim hover:text-jade-glow hover:border-jade-glow transition-all group-hover:shadow-lg"
                        title="Edit Reward"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(reward.day)}
                        className="p-3 bg-jade-bg border border-jade-mid rounded-xl text-text-dim hover:text-red-400 hover:border-red-400/50 transition-all group-hover:shadow-lg"
                        title="Hapus Reward"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && editingReward && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-jade-bg/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-jade-dark border-2 border-jade-mid rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]"
            >
              <div className="p-8 border-b border-jade-mid flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-jade-accent text-jade-bg rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-jade-accent/20">
                    {editingReward.day}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white font-serif italic uppercase">Edit Reward</h3>
                    <p className="text-[10px] text-jade-accent font-black uppercase tracking-[3px]">Pengaturan Hari Ke-{editingReward.day}</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-xl bg-jade-bg border border-jade-mid flex items-center justify-center text-text-dim hover:text-white transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateReward} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest">Persentase Diskon (%)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        min="1" 
                        max="100"
                        className="w-full px-5 py-4 rounded-xl bg-jade-bg border border-jade-mid text-text-main focus:ring-1 focus:ring-jade-glow transition-all font-bold"
                        value={editingReward.discount}
                        onChange={(e) => setEditingReward({ ...editingReward, discount: parseInt(e.target.value) || 0 })}
                        required
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-jade-accent font-bold">%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest">Min. Top-Up (Rp)</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-text-dim font-bold">Rp</span>
                      <input 
                        type="number" 
                        className="w-full pl-12 pr-5 py-4 rounded-xl bg-jade-bg border border-jade-mid text-text-main focus:ring-1 focus:ring-jade-glow transition-all font-bold"
                        value={editingReward.minTopUp}
                        onChange={(e) => setEditingReward({ ...editingReward, minTopUp: parseInt(e.target.value) || 0 })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest">Masa Aktif (Jam)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        className="w-full px-5 py-4 rounded-xl bg-jade-bg border border-jade-mid text-text-main focus:ring-1 focus:ring-jade-glow transition-all font-bold"
                        value={editingReward.activeHours}
                        onChange={(e) => setEditingReward({ ...editingReward, activeHours: parseInt(e.target.value) || 0 })}
                        required
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-text-dim font-bold text-xs">Jam</span>
                    </div>
                  </div>

                  <div className={`space-y-2 ${editingReward.day !== 7 ? 'opacity-40 pointer-events-none' : ''}`}>
                    <label className="text-[10px] font-black text-text-dim uppercase tracking-widest">Maksimal Potongan (Rp)</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-text-dim font-bold">Rp</span>
                      <input 
                        type="number" 
                        disabled={editingReward.day !== 7}
                        className="w-full pl-12 pr-5 py-4 rounded-xl bg-jade-bg border border-jade-mid text-text-main focus:ring-1 focus:ring-jade-glow transition-all font-bold disabled:bg-jade-mid/10"
                        value={editingReward.maxDiscount || ''}
                        onChange={(e) => setEditingReward({ ...editingReward, maxDiscount: parseInt(e.target.value) || 0 })}
                        placeholder="Contoh: 100000"
                        required={editingReward.day === 7}
                      />
                    </div>
                    {editingReward.day !== 7 && <p className="text-[9px] text-text-dim italic font-medium">*Hanya tersedia untuk Hari ke-7</p>}
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between p-6 bg-jade-bg rounded-2xl border border-jade-mid shadow-inner">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${editingReward.status === 'Active' ? 'bg-jade-accent/20 text-jade-accent' : 'bg-red-400/10 text-red-400'}`}>
                      {editingReward.status === 'Active' ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-main uppercase tracking-tight">Status Reward</p>
                      <p className="text-[10px] text-text-dim font-black uppercase tracking-widest">{editingReward.status === 'Active' ? 'User dapat mengklaim' : 'Reward di-nonaktifkan'}</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setEditingReward({ ...editingReward, status: editingReward.status === 'Active' ? 'Inactive' : 'Active' })}
                    className={`w-14 h-7 rounded-full relative transition-all duration-300 ${editingReward.status === 'Active' ? 'bg-jade-accent' : 'bg-jade-mid'}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300 ${editingReward.status === 'Active' ? 'left-8' : 'left-1'}`} />
                  </button>
                </div>

                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border border-jade-mid rounded-2xl text-text-dim font-black text-xs uppercase tracking-widest hover:text-white transition-all">Batal</button>
                  <button type="submit" className="flex-1 py-4 bg-jade-accent hover:bg-jade-glow text-jade-bg rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-jade-accent/20 flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" /> Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPreviewOpen(false)}
              className="absolute inset-0 bg-jade-bg/95 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl bg-jade-dark border-2 border-jade-glow/30 rounded-[3rem] overflow-hidden"
            >
              <div className="p-8 border-b border-jade-mid flex items-center justify-between bg-jade-bg/50">
                <div>
                  <h3 className="text-xl font-black text-white uppercase flex items-center gap-2">
                    <Eye className="w-5 h-5 text-jade-accent" /> User Dashboard Preview
                  </h3>
                  <p className="text-[10px] text-text-dim font-black uppercase tracking-widest mt-1">Estimasi tampilan di panel pengguna</p>
                </div>
                <button onClick={() => setIsPreviewOpen(false)} className="p-3 rounded-xl bg-jade-bg border border-jade-mid text-text-dim hover:text-white transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-10 bg-jade-bg">
                <div className="max-w-2xl mx-auto space-y-8">
                  <div className="text-center space-y-2 mb-12">
                     <span className="text-jade-accent text-[10px] font-black uppercase tracking-[0.5em] block mb-2">Cycle Reward</span>
                     <h2 className="text-4xl font-black text-white font-serif italic uppercase tracking-tighter">Daily Gift Journey</h2>
                     <p className="text-text-dim text-sm max-w-md mx-auto">Top up setiap hari dan menangkan diskon hingga 50% di hari ke-7!</p>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                    {rewards.map((r) => (
                      <div key={r.day} className={`flex flex-col items-center gap-3 ${r.day > 7 ? 'hidden' : ''}`}>
                         <div className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all relative overflow-hidden group ${
                           r.status === 'Inactive' ? 'bg-jade-mid/10 border-jade-mid/30 opacity-40 grayscale' :
                           r.day === 1 ? 'bg-jade-accent border-jade-accent shadow-lg shadow-jade-accent/20' : 
                           'bg-jade-dark border-jade-mid hover:border-jade-glow/50'
                         }`}>
                           <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${r.day === 1 ? 'text-jade-bg' : 'text-text-dim'}`}>D{r.day}</span>
                           <span className={`text-sm font-black ${r.day === 1 ? 'text-jade-bg' : 'text-jade-accent'}`}>{r.discount}%</span>
                           
                           {r.day === 1 && (
                             <div className="absolute inset-0 bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <CheckCircle2 className="w-8 h-8 text-jade-bg" />
                             </div>
                           )}
                           
                           {r.day === 7 && (
                             <div className="absolute -top-1 -right-1">
                               <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                             </div>
                           )}
                         </div>
                         <span className={`text-[8px] font-bold uppercase tracking-widest ${r.day === 1 ? 'text-jade-glow' : 'text-text-dim'}`}>
                           {r.day === 1 ? 'Claimed' : r.status === 'Active' ? `Rp ${r.minTopUp/1000}k` : 'Locked'}
                         </span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-jade-dark/50 border border-jade-mid rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-jade-glow/5 blur-3xl -mr-16 -mt-16" />
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-jade-accent text-jade-bg rounded-3xl flex items-center justify-center shadow-xl shadow-jade-accent/20 transform rotate-3">
                         <Gift className="w-10 h-10" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-jade-accent uppercase tracking-[0.2em]">Next Success Streak</p>
                        <h4 className="text-2xl font-black text-white italic uppercase font-serif tracking-tight">Reward Hari ke-2</h4>
                        <p className="text-text-dim text-xs font-bold italic">Top up min Rp {rewards[1]?.minTopUp.toLocaleString('id-ID')} untuk klaim diskon 10%!</p>
                      </div>
                    </div>
                    <button className="px-10 py-5 bg-jade-accent text-jade-bg rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-jade-accent/40 group overflow-hidden relative">
                      <span className="relative z-10 flex items-center gap-2">Top Up Sekarang <Zap className="w-4 h-4 fill-current group-hover:scale-125 transition-transform" /></span>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-jade-dark text-center">
                 <p className="text-[9px] text-text-dim font-black uppercase tracking-[0.4em]">Preview Sahaja — Tetapan Sebenar Mungkin Berbeza</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notifications */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000] px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 ${showNotification.type === 'success' ? 'bg-jade-accent text-jade-bg' : 'bg-red-500 text-white'}`}
          >
            {showNotification.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            <span className="text-sm font-black uppercase tracking-widest">{showNotification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
