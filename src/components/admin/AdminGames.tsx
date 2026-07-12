import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Image as ImageIcon,
  ChevronRight,
  Package,
  Layers,
  ArrowLeft,
  X,
  Upload,
  AlertTriangle,
  CheckCircle2,
  MoreVertical,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Game, GameCategoryType } from '../../types';
import { GAMES, GAME_PRODUCTS } from '../../constants';

// Modal Component for Add/Edit Game
function GameFormModal({ 
  game, 
  onClose, 
  onSave 
}: { 
  game?: Game | null, 
  onClose: () => void, 
  onSave: (gameData: any) => void 
}) {
  const [formData, setFormData] = useState({
    name: game?.name || '',
    developer: game?.developer || '',
    category: game?.category || 'Mobile' as GameCategoryType,
    image: game?.image || '',
    status: (game as any)?.status || 'Aktif',
    popular: game?.popular || false,
    latest: game?.latest || false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-jade-bg/90 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-jade-dark border border-jade-mid w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-jade-mid flex items-center justify-between bg-jade-mid/10">
          <div>
            <h3 className="text-xl font-bold text-text-main">{game ? 'Edit Game' : 'Tambah Game Baru'}</h3>
            <p className="text-text-dim text-xs">Lengkapi informasi game di bawah ini</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-jade-mid/20 rounded-xl transition-colors cursor-pointer">
            <X className="w-5 h-5 text-text-dim" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6 scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-dim">Logo Game</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group relative h-40 rounded-2xl border-2 border-dashed border-jade-mid hover:border-jade-accent bg-jade-bg/50 transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden"
              >
                {formData.image ? (
                  <>
                    <img src={formData.image} className="w-full h-full object-cover opacity-40 group-hover:opacity-20 transition-opacity" alt="Preview" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-jade-accent">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="text-xs font-bold font-sans">Ganti Logo</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-text-dim group-hover:text-jade-accent transition-colors">
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-xs font-bold font-sans">Upload Logo (PNG/JPG)</span>
                    <span className="text-[9px] mt-1 font-sans">Klik atau seret gambar ke sini</span>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setFormData({...formData, image: URL.createObjectURL(file)});
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-dim">Nama Game</label>
              <input 
                required
                type="text" 
                className="w-full bg-jade-bg border border-jade-mid rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-jade-accent/50 text-text-main font-sans"
                placeholder="Contoh: Mobile Legends"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-dim">Developer / Publisher</label>
              <input 
                required
                type="text" 
                className="w-full bg-jade-bg border border-jade-mid rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-jade-accent/50 text-text-main font-sans"
                placeholder="Contoh: Moonton"
                value={formData.developer}
                onChange={e => setFormData({...formData, developer: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-dim">Kategori</label>
              <select 
                className="w-full bg-jade-bg border border-jade-mid rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-jade-accent/50 text-text-main appearance-none font-sans"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as GameCategoryType})}
              >
                <option value="Mobile">Mobile</option>
                <option value="PC">PC Game</option>
                <option value="Console">Console</option>
                <option value="Voucher">Digital Voucher</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-dim">Status</label>
              <div className="flex gap-2">
                {['Aktif', 'Nonaktif'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({...formData, status: s})}
                    className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                      formData.status === s 
                      ? 'bg-jade-accent/10 border-jade-accent text-jade-accent' 
                      : 'bg-jade-bg border-jade-mid text-text-dim hover:border-text-dim'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 p-4 bg-jade-mid/10 rounded-2xl border border-jade-mid flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-jade-accent" />
                <div>
                  <p className="text-xs font-bold text-text-main font-sans">Badge Spesial</p>
                  <p className="text-[9px] text-text-dim font-sans">Tampilkan label khusus di halaman utama</p>
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-jade-mid bg-jade-bg text-jade-accent focus:ring-jade-accent focus:ring-offset-jade-bg"
                    checked={formData.popular}
                    onChange={e => setFormData({...formData, popular: e.target.checked})}
                  />
                  <span className="text-[10px] font-bold text-text-dim group-hover:text-text-main uppercase">Popular</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-jade-mid bg-jade-bg text-jade-accent focus:ring-jade-accent focus:ring-offset-jade-bg"
                    checked={formData.latest}
                    onChange={e => setFormData({...formData, latest: e.target.checked})}
                  />
                  <span className="text-[10px] font-bold text-text-dim group-hover:text-text-main uppercase">Latest</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-jade-bg border border-jade-mid text-text-dim rounded-xl font-black text-xs uppercase tracking-widest hover:bg-jade-mid/10 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="flex-1 py-4 bg-jade-accent text-jade-bg rounded-xl font-black text-xs uppercase tracking-widest hover:bg-jade-glow transition-all shadow-xl shadow-jade-accent/20 cursor-pointer"
            >
              Simpan Game
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// Confirmation Modal
function ConfirmDeleteModal({ 
  gameName, 
  onClose, 
  onConfirm 
}: { 
  gameName: string, 
  onClose: () => void, 
  onConfirm: () => void 
}) {
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-jade-bg/95 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-jade-dark border border-red-500/30 w-full max-w-md rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(239,68,68,0.1)]"
      >
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 font-sans">Hapus Game?</h3>
        <p className="text-text-dim text-sm mb-8 font-sans">
          Apakah Anda yakin ingin menghapus <span className="text-red-400 font-bold">"{gameName}"</span>? 
          <br />Tindakan ini juga akan menghapus semua produk top-up terkait.
        </p>
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-jade-bg border border-jade-mid text-text-dim rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jade-mid/10 transition-all cursor-pointer"
          >
            Batal
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-3 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 cursor-pointer"
          >
            Ya, Hapus
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Modal Component for Add/Edit Nominal
function NominalFormModal({ 
  item, 
  onClose, 
  onSave 
}: { 
  item?: any | null, 
  onClose: () => void, 
  onSave: (itemData: any) => void 
}) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    price: item?.price || 0,
    promoPrice: item?.promoPrice || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: Number(formData.price),
      promoPrice: formData.promoPrice ? Number(formData.promoPrice) : undefined
    });
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-jade-bg/90 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-jade-dark border border-jade-mid w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-jade-mid flex items-center justify-between bg-jade-mid/10">
          <div>
            <h3 className="text-xl font-bold text-text-main font-sans">{item ? 'Edit Nominal' : 'Tambah Nominal Baru'}</h3>
            <p className="text-text-dim text-xs font-sans">Kelola harga dan item top-up</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-jade-mid/20 rounded-xl transition-colors cursor-pointer text-text-dim">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 font-sans">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-dim">Nama Item / Diamond</label>
              <input 
                required
                type="text" 
                className="w-full bg-jade-bg border border-jade-mid rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-jade-accent/50 text-text-main"
                placeholder="Contoh: 60 Genesis Crystals"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-dim">Harga Normal (IDR)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim text-xs">Rp</span>
                  <input 
                    required
                    type="number" 
                    min="0"
                    className="w-full bg-jade-bg border border-jade-mid rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-jade-accent/50 text-text-main"
                    placeholder="0"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-dim">Harga Promo (Opsional)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-jade-accent text-xs">Rp</span>
                  <input 
                    type="number" 
                    min="0"
                    className="w-full bg-jade-bg border border-jade-mid rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-jade-accent/50 text-teal-400"
                    placeholder="Biarkan kosong jika tidak ada"
                    value={formData.promoPrice}
                    onChange={e => setFormData({...formData, promoPrice: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <p className="text-[9px] text-text-dim italic leading-relaxed">
              * Pastikan harga dalam format angka murni (tanpa titik/koma)
              <br />* Harga promo akan ditampilkan sebagai harga utama jika diisi
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-jade-bg border border-jade-mid text-text-dim rounded-xl font-black text-xs uppercase tracking-widest hover:bg-jade-mid/10 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="flex-1 py-4 bg-jade-accent text-jade-bg rounded-xl font-black text-xs uppercase tracking-widest hover:bg-jade-glow transition-all shadow-xl shadow-jade-accent/20 cursor-pointer"
            >
              {item ? 'Simpan Perubahan' : 'Tambah Nominal'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// Confirmation Modal for Nominal
function ConfirmDeleteNominalModal({ 
  itemName, 
  onClose, 
  onConfirm 
}: { 
  itemName: string, 
  onClose: () => void, 
  onConfirm: () => void 
}) {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-jade-bg/95 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-jade-dark border border-red-500/30 w-full max-w-sm rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(239,68,68,0.1)]"
      >
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
          <Trash2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 font-sans">Hapus Item?</h3>
        <p className="text-text-dim text-sm mb-8 font-sans">
          Yakin ingin menghapus <span className="text-red-400 font-bold">"{itemName}"</span>? Data tidak bisa dikembalikan.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-jade-bg border border-jade-mid text-text-dim rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jade-mid/10 transition-all cursor-pointer">
            Batal
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all cursor-pointer shadow-xl shadow-red-500/20">
            Hapus
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminGames() {
  const [view, setView] = useState<'list' | 'manage-items'>('list');
  const [games, setGames] = useState<Game[]>(GAMES);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [search, setSearch] = useState('');
  
  // Products state (using mock local state initialized from CONSTANTS)
  const [products, setProducts] = useState<Record<string, any[]>>(GAME_PRODUCTS);
  
  // Modal states
  const [showGameForm, setShowGameForm] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [deletingGame, setDeletingGame] = useState<Game | null>(null);

  // Nominal modal states
  const [showNominalForm, setShowNominalForm] = useState(false);
  const [editingNominal, setEditingNominal] = useState<any | null>(null);
  const [deletingNominal, setDeletingNominal] = useState<any | null>(null);

  const filteredGames = games.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));

  const handleManageItems = (game: Game) => {
    setSelectedGame(game);
    setView('manage-items');
  };

  const handleAddGame = (gameData: any) => {
    const newId = gameData.name.toLowerCase().replace(/\s+/g, '-');
    const newGame: Game = {
      ...gameData,
      id: newId,
    };
    GAMES.unshift(newGame);
    GAME_PRODUCTS[newId] = [];
    setGames([...GAMES]);
    setProducts({ ...GAME_PRODUCTS });
    setShowGameForm(false);
  };

  const handleUpdateGame = (gameData: any) => {
    if (!editingGame) return;
    const index = GAMES.findIndex(g => g.id === editingGame.id);
    if (index !== -1) {
      GAMES[index] = { ...GAMES[index], ...gameData };
    }
    setGames([...GAMES]);
    setEditingGame(null);
  };

  const handleDeleteGame = () => {
    if (!deletingGame) return;
    const index = GAMES.findIndex(g => g.id === deletingGame.id);
    if (index !== -1) {
      GAMES.splice(index, 1);
    }
    delete GAME_PRODUCTS[deletingGame.id];
    setGames([...GAMES]);
    setProducts({ ...GAME_PRODUCTS });
    setDeletingGame(null);
  };

  // Nominal handlers
  const handleAddNominal = (itemData: any) => {
    if (!selectedGame) return;
    const newNominal = {
      ...itemData,
      id: Date.now().toString(),
    };
    const gameId = selectedGame.id;
    if (!GAME_PRODUCTS[gameId]) {
      GAME_PRODUCTS[gameId] = [];
    }
    GAME_PRODUCTS[gameId].push(newNominal);
    setProducts({ ...GAME_PRODUCTS });
    setShowNominalForm(false);
  };

  const handleEditNominal = (itemData: any) => {
    if (!selectedGame || !editingNominal) return;
    const gameId = selectedGame.id;
    if (GAME_PRODUCTS[gameId]) {
      const index = GAME_PRODUCTS[gameId].findIndex(item => item.id === editingNominal.id);
      if (index !== -1) {
        GAME_PRODUCTS[gameId][index] = { ...GAME_PRODUCTS[gameId][index], ...itemData };
      }
    }
    setProducts({ ...GAME_PRODUCTS });
    setEditingNominal(null);
  };

  const handleDeleteNominal = () => {
    if (!selectedGame || !deletingNominal) return;
    const gameId = selectedGame.id;
    if (GAME_PRODUCTS[gameId]) {
      const index = GAME_PRODUCTS[gameId].findIndex(item => item.id === deletingNominal.id);
      if (index !== -1) {
        GAME_PRODUCTS[gameId].splice(index, 1);
      }
    }
    setProducts({ ...GAME_PRODUCTS });
    setDeletingNominal(null);
  };

  const currentNominals = selectedGame ? (products[selectedGame.id] || []) : [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {view === 'list' && (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-jade-accent w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari Game Berdasarkan Nama..."
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-jade-dark border border-jade-mid text-text-main placeholder-text-dim/50 focus:outline-none focus:ring-2 focus:ring-jade-accent/50 transition-all font-medium shadow-xl font-sans"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowGameForm(true)}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-jade-accent hover:bg-jade-glow text-jade-bg rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-jade-accent/20 cursor-pointer"
            >
              <Plus className="w-5 h-5" /> Tambah Game
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <div key={game.id} className="bg-jade-dark/50 border border-jade-mid rounded-3xl overflow-hidden group hover:border-jade-accent transition-all flex flex-col shadow-lg">
                <div className="h-40 relative overflow-hidden">
                  <img 
                    src={game.image} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={game.name}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-jade-dark to-transparent opacity-60"></div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-jade-accent text-jade-bg text-[9px] font-black uppercase rounded-lg shadow-lg">
                      {game.category}
                    </span>
                    {(game as any).status === 'Nonaktif' && (
                      <span className="px-3 py-1 bg-red-500 text-white text-[9px] font-black uppercase rounded-lg shadow-lg">
                        Nonaktif
                      </span>
                    )}
                  </div>
                  {(game.popular || game.latest) && (
                    <div className="absolute top-4 right-4 flex gap-1">
                      {game.popular && <div className="p-1.5 bg-amber-400 rounded-lg text-jade-bg shadow-lg"><CheckCircle2 className="w-3 h-3 fill-current" /></div>}
                      {game.latest && <div className="p-1.5 bg-jade-glow rounded-lg text-jade-bg shadow-lg"><Plus className="w-3 h-3" /></div>}
                    </div>
                  )}
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-bold text-text-main font-sans">{game.name}</h3>
                    <button className="text-text-dim hover:text-white transition-colors cursor-pointer">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-text-dim text-[10px] font-black uppercase tracking-widest mb-6 font-sans">{game.developer}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button 
                      onClick={() => handleManageItems(game)}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-jade-mid/20 text-text-main hover:bg-jade-mid/40 transition-all text-[10px] font-black uppercase tracking-widest border border-jade-mid cursor-pointer"
                    >
                      <Package className="w-4 h-4 text-jade-accent" /> Produk
                    </button>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => setEditingGame(game)}
                        className="flex-1 flex items-center justify-center p-3 rounded-xl bg-jade-bg border border-jade-mid text-text-dim hover:text-jade-accent transition-all cursor-pointer"
                        title="Edit Game"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setDeletingGame(game)}
                        className="flex-1 flex items-center justify-center p-3 rounded-xl bg-jade-bg border border-jade-mid text-text-dim hover:text-red-400 transition-all cursor-pointer"
                        title="Hapus Game"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredGames.length === 0 && (
              <div className="col-span-full py-20 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-jade-mid/10 rounded-full flex items-center justify-center mb-6 text-jade-mid">
                  <Search className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-text-main font-sans">Game Tidak Ditemukan</h3>
                <p className="text-text-dim text-sm mt-2 font-sans">Coba gunakan kata kunci pencarian lain.</p>
              </div>
            )}
          </div>
        </>
      )}

      {view === 'manage-items' && selectedGame && (
        <div className="bg-jade-dark/50 border border-jade-mid rounded-3xl p-8 lg:p-10 animate-in fade-in slide-in-from-right-4 duration-500 shadow-2xl">
          <button 
            onClick={() => setView('list')}
            className="flex items-center gap-2 text-text-dim hover:text-jade-glow transition-colors mb-8 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest font-sans">Kembali ke Daftar Game</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-jade-mid shadow-2xl">
                <img src={selectedGame.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-text-main tracking-tight font-serif italic mb-1 uppercase">{selectedGame.name}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-jade-accent text-[10px] font-black uppercase tracking-widest">Daftar Nominal Top Up</p>
                  <span className="px-2 py-0.5 bg-jade-mid/30 rounded-full text-[9px] font-black text-jade-glow uppercase">{currentNominals.length} Item</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowNominalForm(true)}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-jade-accent hover:bg-jade-glow text-jade-bg rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-jade-accent/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Tambah Nominal
            </button>
          </div>

          <div className="bg-jade-bg/50 rounded-2xl border border-jade-mid overflow-hidden shadow-inner font-sans">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-jade-mid/30 text-[10px] uppercase font-black tracking-[2px] text-text-dim">
                    <th className="px-8 py-6">Nama Item</th>
                    <th className="px-8 py-6">Harga (IDR)</th>
                    <th className="px-8 py-6">Promo (IDR)</th>
                    <th className="px-8 py-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-jade-mid/5">
                  {currentNominals.map((item: any) => (
                    <tr key={item.id} className="hover:bg-jade-mid/10 transition-colors">
                      <td className="px-8 py-5">
                        <span className="text-sm font-bold text-text-main">{item.name}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-black text-text-dim">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.price)}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        {item.promoPrice ? (
                          <span className="text-sm font-black text-jade-glow">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.promoPrice)}
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase font-black text-text-dim/30">N/A</span>
                        )}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setEditingNominal(item)}
                            className="p-2.5 rounded-xl bg-jade-bg border border-jade-mid text-text-dim hover:text-jade-accent transition-all cursor-pointer shadow-sm"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setDeletingNominal(item)}
                            className="p-2.5 rounded-xl bg-jade-bg border border-jade-mid text-text-dim hover:text-red-400 transition-all cursor-pointer shadow-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {currentNominals.length === 0 && (
                <div className="py-20 text-center">
                  <div className="w-16 h-16 bg-jade-mid/10 rounded-full flex items-center justify-center mx-auto mb-4 text-jade-mid">
                    <Layers className="w-8 h-8" />
                  </div>
                  <p className="text-text-dim text-sm italic">Belum ada produk/nominal untuk game ini.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {/* Game Modals */}
        {showGameForm && (
          <GameFormModal 
            onClose={() => setShowGameForm(false)} 
            onSave={handleAddGame}
          />
        )}
        {editingGame && (
          <GameFormModal 
            game={editingGame}
            onClose={() => setEditingGame(null)} 
            onSave={handleUpdateGame}
          />
        )}
        {deletingGame && (
          <ConfirmDeleteModal 
            gameName={deletingGame.name}
            onClose={() => setDeletingGame(null)}
            onConfirm={handleDeleteGame}
          />
        )}

        {/* Nominal Modals */}
        {showNominalForm && (
          <NominalFormModal 
            onClose={() => setShowNominalForm(false)} 
            onSave={handleAddNominal}
          />
        )}
        {editingNominal && (
          <NominalFormModal 
            item={editingNominal}
            onClose={() => setEditingNominal(null)} 
            onSave={handleEditNominal}
          />
        )}
        {deletingNominal && (
          <ConfirmDeleteNominalModal 
            itemName={deletingNominal.name}
            onClose={() => setDeletingNominal(null)}
            onConfirm={handleDeleteNominal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

