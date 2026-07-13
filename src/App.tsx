/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { supabase } from './lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { QRCodeCanvas } from 'qrcode.react';

import WeeklyRewards from './components/WeeklyRewards';

const APP_LOGO_URL = 'logo giok up-1.jpg';

function CountdownTimer({ expiryDate }: { expiryDate: string }) {
  const [timeLeft, setTimeLeft] = React.useState<{d: number, h: number, m: number, s: number} | null>(null);

  React.useEffect(() => {
    const calculate = () => {
      const difference = +new Date(expiryDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          d: Math.floor(difference / (1000 * 60 * 60 * 24)),
          h: Math.floor((difference / (1000 * 60 * 60)) % 24),
          m: Math.floor((difference / 1000 / 60) % 60),
          s: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft(null);
      }
    };
    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [expiryDate]);

  if (!timeLeft) return <span className="text-red-400 font-black">EXPIRED</span>;

  return (
    <div className="flex gap-2 font-mono text-[10px]">
      <div className="bg-jade-bg px-2 py-1 rounded border border-jade-mid flex flex-col items-center min-w-[30px]">
        <span className="text-jade-glow font-black">{timeLeft.d}</span>
        <span className="text-[8px] text-text-dim/60">D</span>
      </div>
      <div className="bg-jade-bg px-2 py-1 rounded border border-jade-mid flex flex-col items-center min-w-[30px]">
        <span className="text-jade-glow font-black">{timeLeft.h}</span>
        <span className="text-[8px] text-text-dim/60">H</span>
      </div>
      <div className="bg-jade-bg px-2 py-1 rounded border border-jade-mid flex flex-col items-center min-w-[30px]">
        <span className="text-jade-glow font-black">{timeLeft.m}</span>
        <span className="text-[8px] text-text-dim/60">M</span>
      </div>
      <div className="bg-jade-bg px-2 py-1 rounded border border-jade-mid flex flex-col items-center min-w-[30px]">
        <span className="text-jade-glow font-black text-amber-400">{timeLeft.s}</span>
        <span className="text-[8px] text-text-dim/60">S</span>
      </div>
    </div>
  );
}

function RewardModal({ reward, onClose, onUse }: { reward: Reward, onClose: () => void, onUse: (r: Reward) => void }) {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const claimButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    claimButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Basic focus trap - prevent focus from leaving modal while open
    const handleFocus = (e: FocusEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        claimButtonRef.current?.focus();
      }
    };
    document.addEventListener('focus', handleFocus, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focus', handleFocus, true);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reward-modal-title"
    >
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-jade-bg/80 backdrop-blur-sm"
        aria-hidden="true"
      />
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-jade-dark border-2 border-jade-glow w-full max-w-md rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(118,225,201,0.3)]"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-jade-glow/10 rounded-full -mr-16 -mt-16 blur-3xl animate-pulse" />
        
        <div className="p-8 text-center space-y-6">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
            className="w-20 h-20 bg-jade-glow rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-jade-glow/20 transform rotate-6 hover:rotate-0 transition-transform"
          >
            <Sparkles className="w-10 h-10 text-jade-bg" />
          </motion.div>

          <div className="space-y-2">
            <h2 id="reward-modal-title" className="text-3xl font-black text-white font-serif italic uppercase tracking-tighter">HADIAH SPESIAL!</h2>
            <p className="text-jade-glow font-bold text-sm tracking-widest uppercase">PENGGUNA BARU GIOKUP</p>
          </div>

          <div className="bg-jade-bg p-6 rounded-2xl border-2 border-dashed border-jade-mid flex flex-col items-center gap-4 relative group">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-jade-dark px-3 text-[10px] font-black text-jade-accent uppercase tracking-widest">Gunakan Kode</div>
            <div className="text-2xl font-mono font-black text-white tracking-widest bg-jade-mid/20 px-6 py-2 rounded-lg border border-jade-mid group-hover:border-jade-glow transition-colors">
              {reward.kode_redeem}
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-jade-glow mb-1">Diskon {reward.potongan}{reward.tipe === 'persen' ? '%' : ''}</p>
              <p className="text-[10px] text-text-dim italic">{reward.keterangan}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">Reward Berakhir Dalam:</p>
              <CountdownTimer expiryDate={reward.expires_at} />
            </div>

            <motion.button
              ref={claimButtonRef}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 0 20px rgba(118, 225, 201, 0.4)"
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onUse(reward)}
              className="w-full bg-jade-accent text-jade-bg py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-jade-accent/20 hover:bg-jade-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
              aria-label={`Klaim diskon ${reward.potongan}${reward.tipe === 'persen' ? ' persen' : ''} dan belanja sekarang`}
            >
              Klaim & Belanja Sekarang <Zap className="w-4 h-4 fill-current" />
            </motion.button>
            <button
              onClick={onClose}
              className="w-full text-text-dim hover:text-white text-xs font-bold transition-colors focus:underline focus:outline-none"
              aria-label="Tutup modal dan simpan reward untuk nanti"
            >
              Nanti saja, simpan di My Rewards
            </button>
          </div>
        </div>

        {/* Bottom Serrated Decor */}
        <div className="flex justify-between px-2 -mb-2" aria-hidden="true">
          {Array.from({length: 12}).map((_, i) => (
            <div key={i} className="w-4 h-4 bg-jade-bg rounded-full border border-jade-mid/50 -mt-2 shadow-inner" />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

import { 
  Gamepad2, 
  Home,
  LayoutDashboard, 
  Search, 
  User, 
  Menu, 
  X, 
  ArrowRight,
  ShieldCheck,
  Zap,
  CreditCard,
  ShoppingBag,
  History,
  Settings,
  ShoppingCart,
  Gift,
  Trash2,
  Check,
  Plus,
  Minus,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Sparkles,
  Flame,
  Lock,
  KeyRound,
  AlertCircle,
  Coins,
  FileText,
  Clock
} from 'lucide-react';
import { GAMES, PAYMENT_METHODS, GAME_PRODUCTS, PROMOS } from './constants';
import { Game, GameCategory, CartItem, Promo, Reward } from './types';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminOrders from './components/admin/AdminOrders';
import AdminGames from './components/admin/AdminGames';
import AdminPayments from './components/admin/AdminPayments';
import AdminLogs from './components/admin/AdminLogs';
import AdminSettings from './components/admin/AdminSettings';
import AdminRewards from './components/admin/AdminRewards';

function ProductCard({ item, selectedGame, selectedProduct, onSelect }: any) {
  const discount = item.promoPrice ? Math.round(((item.price - item.promoPrice) / item.price) * 100) : 0;
  const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.promoPrice || item.price).replace('Rp', 'Rp.');
  const formattedOriginal = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.price).replace('Rp', 'Rp.');
  const isSelected = selectedProduct?.id === item.id;

  return (
    <motion.button
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(item)}
      className={`rounded-2xl border-2 transition-all relative overflow-hidden group flex flex-col h-full text-left font-sans ${
        isSelected 
          ? 'border-jade-accent bg-jade-accent/5 ring-4 ring-jade-accent/10 shadow-xl shadow-jade-accent/10' 
          : 'border-jade-mid bg-jade-dark/50 hover:border-jade-glow/50'
      }`}
    >
      <div className={`h-24 flex items-center justify-center relative p-4 transition-colors overflow-hidden ${
        isSelected ? 'bg-jade-accent/10' : 'bg-jade-bg group-hover:bg-jade-bg/60'
      }`}>
        {/* Decorative Background Elements */}
        <div className={`absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-20 -mr-6 -mt-6 transition-colors ${isSelected ? 'bg-jade-accent' : 'bg-jade-glow'}`} />
        
        <div className="relative w-14 h-14 flex items-center justify-center">
          <img 
            src={selectedGame.image} 
            className="h-full w-full object-contain filter drop-shadow-xl transform group-hover:scale-110 transition-transform duration-500" 
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {item.isBestSeller && (
            <div className="bg-amber-500 text-white text-[7px] font-black px-2 py-0.5 rounded-md shadow-lg flex items-center gap-1 backdrop-blur-sm bg-opacity-90 uppercase tracking-tighter">
              <Sparkles className="w-2.5 h-2.5" /> Best
            </div>
          )}
          {item.promoPrice && (
            <div className="bg-rose-500 text-white text-[7px] font-black px-2 py-0.5 rounded-md shadow-lg flex items-center gap-1 animate-pulse backdrop-blur-sm bg-opacity-90 uppercase tracking-tighter">
              <Flame className="w-2.5 h-2.5" /> Promo
            </div>
          )}
        </div>

        <div className={`absolute top-0 right-0 w-10 h-10 rounded-bl-[20px] flex items-start justify-end p-2 transition-all ${
          isSelected ? 'bg-jade-accent/30' : 'bg-transparent'
        }`}>
          <div className={`w-5 h-5 rounded-lg flex items-center justify-center shadow-md transition-colors ${
            isSelected ? 'bg-jade-accent text-jade-bg' : 'bg-jade-dark text-jade-glow group-hover:bg-jade-accent group-hover:text-jade-bg'
          }`}>
            <Coins className="w-2.5 h-2.5" />
          </div>
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col justify-between gap-3">
        <div className="space-y-2">
          <p className={`text-[11px] font-black uppercase tracking-wider line-clamp-1 transition-colors ${
            isSelected ? 'text-jade-glow' : 'text-text-main'
          }`}>
            {item.name}
          </p>
          <div className="space-y-1">
            <div className="flex flex-col">
              <span className={`text-[10px] font-bold uppercase tracking-widest opacity-50 ${isSelected ? 'text-jade-glow' : 'text-text-dim'}`}>Harga:</span>
              <span className={`text-sm font-black tracking-tight ${isSelected ? 'text-white' : 'text-jade-accent group-hover:text-jade-glow'}`}>
                {formattedPrice}
              </span>
            </div>
            {item.promoPrice && (
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-text-dim/50 line-through font-bold">{formattedOriginal}</span>
                <span className="text-[8px] bg-rose-500/10 text-rose-500 px-1.5 py-0.5 rounded-md font-black">-{discount}%</span>
              </div>
            )}
          </div>
        </div>

        {isSelected ? (
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            className="flex items-center gap-2"
          >
            <div className="h-0.5 flex-grow bg-jade-accent rounded-full" />
            <Check className="w-3 h-3 text-jade-accent" />
          </motion.div>
        ) : (
          <div className="h-0.5 w-0 group-hover:w-full bg-jade-glow/30 transition-all duration-300 rounded-full" />
        )}
      </div>
    </motion.button>
  );
}

function FloatingSideNav({ currentView, hasGameSelected, handleHome, handleHistory }: { 
  currentView: string, 
  hasGameSelected: boolean, 
  handleHome: () => void, 
  handleHistory: () => void 
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      initial={false}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed left-0 top-1/2 -translate-y-1/2 z-[100] hidden md:flex items-center"
    >
      <motion.div 
        animate={{ 
          width: isHovered ? "180px" : "64px",
          paddingLeft: isHovered ? "16px" : "0px",
          paddingRight: isHovered ? "16px" : "0px",
        }}
        className="bg-jade-dark/80 backdrop-blur-xl border-y border-r border-jade-mid rounded-r-[32px] overflow-hidden flex flex-col gap-4 py-8 shadow-2xl shadow-black/50"
      >
        <button 
          onClick={handleHome}
          className={`relative group flex items-center h-12 w-full transition-all ${!isHovered ? 'justify-center' : 'gap-4'}`}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
            currentView === 'user' && !hasGameSelected ? 'bg-jade-accent text-jade-bg shadow-lg shadow-jade-accent/20' : 'bg-jade-bg text-text-dim group-hover:bg-jade-mid/30'
          }`}>
            <Home className="w-5 h-5" />
          </div>
          <AnimatePresence>
            {isHovered && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={`font-black text-xs uppercase tracking-widest ${
                  currentView === 'user' && !hasGameSelected ? 'text-jade-glow' : 'text-text-main'
                }`}
              >
                Home
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button 
          onClick={handleHistory}
          className={`relative group flex items-center h-12 w-full transition-all ${!isHovered ? 'justify-center' : 'gap-4'}`}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
            currentView === 'history' ? 'bg-jade-accent text-jade-bg shadow-lg shadow-jade-accent/20' : 'bg-jade-bg text-text-dim group-hover:bg-jade-mid/30'
          }`}>
            <History className="w-5 h-5" />
          </div>
          <AnimatePresence>
            {isHovered && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={`font-black text-xs uppercase tracking-widest ${
                  currentView === 'history' ? 'text-jade-glow' : 'text-text-main'
                }`}
              >
                Riwayat
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </motion.div>
    </motion.div>
  );
}
const PaymentSuccessPage = ({
  summary,
  onFinish
}: {
  summary: any;
  onFinish: () => void;
}) => {
  console.log(summary);

  return (
    <div className="min-h-screen bg-[#031b1b] text-white px-4 py-8">

      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-8">

          <div className="w-24 h-24 bg-[#58d6c3] rounded-3xl mx-auto flex items-center justify-center text-5xl text-black mb-6">
            ✓
          </div>

          <h1 className="text-5xl font-black uppercase mb-2">
            Pembayaran Berhasil!
          </h1>

          <p className="text-[#8cb9b4]">
            Transaksi berhasil diproses
          </p>

        </div>

        <div className="bg-white text-black rounded-3xl overflow-hidden shadow-2xl">

          <div className="bg-[#58d6c3] p-6">

            <h2 className="text-2xl font-black">
              GIOKUP DIGITAL
            </h2>

            <p className="opacity-70">
              Official Receipt
            </p>

          </div>

          <div className="p-6 space-y-5">

            <div className="flex justify-between">
              <span>Order ID</span>
              <span className="font-bold">
                {summary?.orderId}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Metode Pembayaran</span>
              <span className="font-bold">
                {summary?.paymentMethod}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Pembayaran</span>
              <span className="font-black text-3xl text-[#0a8f7a]">
                Rp {(summary?.total || summary?.totalAmount || 0).toLocaleString('id-ID')}
              </span>
            </div>

          </div>

        </div>

        <button
          onClick={onFinish}
          className="w-full mt-8 bg-[#58d6c3] hover:opacity-90 transition-all text-black font-black py-5 rounded-2xl text-xl"
        >
          SELESAI
        </button>

      </div>

    </div>
  );
};
export default function App() {
 const [users, setUsers] = useState<any[]>([]);
 const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
React.useEffect(() => {

  testConnection();

  const savedOrders = localStorage.getItem('giokup_orders');

  if (savedOrders) {
    setUserOrders(JSON.parse(savedOrders));
  }

}, []);
async function testConnection() {
  const { data, error } = await supabase
    .from('user')
    .select('*');

  if (data) {
  setUsers(data);
}

console.log('DATA:', data);
console.log('ERROR:', error);
}

async function addUser() {
  const { data, error } = await supabase
    .from('user')
    .insert([
      {
        id_user: 'USR-' + Date.now(),
        username: username,
        password: password
      }
    ]);

  console.log('INSERT DATA:', data);
  console.log('INSERT ERROR:', error);

  if (!error) {
    alert('User berhasil ditambahkan!');
  }
}
  const [view, setView] = useState<'user' | 'admin' | 'login' | 'history' | 'cart' | 'checkout' | 'rewards' | 'games' | 'qris-payment' | 'payment-success'>('user');
  const [qrisPaymentData, setQrisPaymentData] = useState<any>(null);
  const [adminActiveSubView, setAdminActiveSubView] = useState<'overview' | 'orders' | 'games' | 'payments' | 'rewards' | 'logs' | 'settings'>('overview');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{username: string, role: 'user' | 'admin'} | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCartIds, setSelectedCartIds] = useState<string[]>([]);
  const [justAdded, setJustAdded] = useState(false);

  const [userOrders, setUserOrders] = useState<any[]>(() => {
    const saved = localStorage.getItem('giokup_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [allOrders, setAllOrders] = useState<any[]>(() => {
    // Admin orders from "database"
    const saved = localStorage.getItem('giokup_orders_database');
    const dbOrders = saved ? JSON.parse(saved) : [];
    
    // Initial dummy data if empty
    if (dbOrders.length === 0) {
      const initial = [
        { id: 'GK-9021', name: 'Alif K.', username: 'alif', item: '86 Diamonds (MLBB)', price: 20000, status: 'Success', date: '19/04/2026, 12:45:00', paymentMethod: 'QRIS' },
        { id: 'GK-9022', name: 'Sarah W.', username: 'sarah', item: '300 Genesis (GI)', price: 75000, status: 'Success', date: '19/04/2026, 13:10:00', paymentMethod: 'DANA' },
        { id: 'GK-9023', name: 'Budi S.', username: 'budi', item: '1,000 VP (Valorant)', price: 145000, status: 'Pending', date: '19/04/2026, 13:30:00', paymentMethod: 'BCA' },
        { id: 'GK-9024', name: 'Rina T.', username: 'rina', item: '86 Diamonds (MLBB)', price: 20000, status: 'Failed', date: '19/04/2026, 13:55:00', paymentMethod: 'GoPay' },
      ];
      return initial;
    }
    return dbOrders;
  });

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<GameCategory | 'All'>('All');
  const [filterType, setFilterType] = useState<'All' | 'Popular' | 'Latest' | 'OnSale'>('All');
  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [inputErrors, setInputErrors] = useState<{userId?: string, zoneId?: string, whatsapp?: string, product?: string}>({});
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [lastPurchaseSummary, setLastPurchaseSummary] = useState<any>(() => {
    const saved = localStorage.getItem('giokup_last_receipt');
    return saved ? JSON.parse(saved) : null;
  });
  
  const receiptRef = useRef<HTMLDivElement>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', description: '', type: 'success' as 'success' | 'error' });

  const [recommendedIndex, setRecommendedIndex] = useState(0);

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<Promo | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  
  // Reward Cycle State
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [activeReward, setActiveReward] = useState<Reward | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const filteredGames = GAMES.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'All' || game.category === category;
    
    let matchesFilterType = true;
    if (filterType === 'Popular') matchesFilterType = !!game.popular;
    else if (filterType === 'Latest') matchesFilterType = !!game.latest;
    else if (filterType === 'OnSale') matchesFilterType = !!GAME_PRODUCTS[game.id]?.some(p => p.promoPrice);
    
    return matchesSearch && matchesCategory && matchesFilterType;
  });

  // Recommended Games: Popular + Promo Games
  const recommendedGames = React.useMemo(() => {
    return GAMES.filter(game => {
      const isPopular = game.popular;
      const hasPromo = GAME_PRODUCTS[game.id]?.some(p => p.promoPrice);
      return isPopular || hasPromo;
    });
  }, []);

  // Rolling effect: 5 seconds
  React.useEffect(() => {
    if (recommendedGames.length === 0) return;
    const interval = setInterval(() => {
      setRecommendedIndex((prev) => (prev + 1) % recommendedGames.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [recommendedGames]);

  // Check Reward Expiry
  React.useEffect(() => {
    const checkExpiry = () => {
      const now = new Date();
      let changed = false;
      const updatedRewards = rewards.map(r => {
        if (r.status === 'Available' || r.status === 'Claimed') {
          if (now > new Date(r.expires_at)) {
            changed = true;
            return { ...r, status: 'Expired' as const };
          }
        }
        return r;
      });
      if (changed) {
        setRewards(updatedRewards);
        localStorage.setItem('giokup_rewards', JSON.stringify(updatedRewards));
      }
    };
    checkExpiry();
    const interval = setInterval(checkExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [rewards]);

  const featuredGame = recommendedGames[recommendedIndex] || GAMES[0];
  const promoGames = GAMES.filter(g => g.latest).slice(0, 3);
  const popularGames = GAMES.filter(g => g.popular).slice(0, 5);
  const trendingGames = GAMES.slice().reverse().slice(0, 4);

  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
    setView('user');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoginError('');

  // Login admin
  if (
    loginForm.username === 'admin' &&
    loginForm.password === 'admin123'
  ) {
    setIsLoggedIn(true);
    setCurrentUser({
      username: 'admin',
      role: 'admin'
    });

    setView('admin');
    return;
  }

  // Cek user di Supabase
  const { data, error } = await supabase
    .from('user')
    .select('*')
    .eq('username', loginForm.username)
    .eq('password', loginForm.password)
    .single();

  console.log('LOGIN DATA:', data);
  console.log('LOGIN ERROR:', error);

  // Kalau tidak ditemukan
  if (error || !data) {
    setLoginError('Username atau password salah.');
    return;
  }

  // Login berhasil
  setIsLoggedIn(true);

  const user = {
    username: data.username,
    role: 'user' as const
  };

  setCurrentUser(user);

  // Load orders user
  const savedOrders = localStorage.getItem(
    'giokup_orders_database'
  );

  const allDbOrders = savedOrders
    ? JSON.parse(savedOrders)
    : [];

  const myOrders = allDbOrders.filter(
    (o: any) => o.username === user.username
  );

  setUserOrders(myOrders);

  // Load rewards user
  const savedRewards = localStorage.getItem(
    'giokup_rewards_database'
  );

  const allDbRewards = savedRewards
    ? JSON.parse(savedRewards)
    : [];

  const myRewards = allDbRewards.filter(
    (r: any) => r.id_user === user.username
  );

  setRewards(myRewards);

  setView('user');
};

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoginError('');

  // Validasi input
  if (!loginForm.username || !loginForm.password) {
    setLoginError('Username dan password wajib diisi');
    return;
  }

  // Simpan user ke Supabase
  const { data, error } = await supabase
    .from('user')
    .insert([
      {
        id_user: 'USR-' + Date.now(),
        username: loginForm.username,
        password: loginForm.password,
      }
    ]);

  console.log('REGISTER DATA:', data);
  console.log('REGISTER ERROR:', error);

  // Jika error
  if (error) {
    setLoginError(error.message);
    return;
  }

  // Login otomatis setelah register
  const newUser = {
    username: loginForm.username,
    role: 'user' as const
  };

  setIsLoggedIn(true);
  setCurrentUser(newUser);
  setUserOrders([]);
  setCart([]);

  // Reward tetap dibuat
  const now = new Date();
  const expiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const newReward: Reward = {
    id: `RW-${Math.floor(Math.random() * 100000)}`,
    id_user: newUser.username,
    kode_redeem: `NEWBIE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    potongan: 25,
    tipe: 'persen',
    created_at: now.toISOString(),
    expires_at: expiry.toISOString(),
    status: 'Available',
    keterangan: 'Selamat datang! Gunakan kode ini untuk diskon 25% pada transaksi pertamamu.'
  };

  const { error: rewardError } = await supabase
  .from('rewards')
  .insert([
    {
      id: newReward.id,
      id_user: newReward.id_user,
      kode_redeem: newReward.kode_redeem,
      potongan: newReward.potongan,
      tipe: newReward.tipe,
      created_at: newReward.created_at,
      expires_at: newReward.expires_at,
      status: newReward.status,
      keterangan: newReward.keterangan
    }
  ]);

console.log('REWARD ERROR:', rewardError);
  setRewards([newReward]);
  setActiveReward(newReward);
  setShowRewardModal(true);

  alert('Register berhasil!');
  setView('user');

  // Refresh data user dari Supabase
  testConnection();
};

  const claimReward = (rewardId: string) => {
    const updated = rewards.map(r => {
      if (r.id === rewardId) return { ...r, status: 'Claimed' as const, claimed_at: new Date().toISOString() };
      return r;
    });
    setRewards(updated);
    
    // Update Rewards Database
    const savedRewards = localStorage.getItem('giokup_rewards_database');
    if (savedRewards) {
      const allDbRewards = JSON.parse(savedRewards);
      const updatedDb = allDbRewards.map((r: any) => {
        if (r.id === rewardId) return { ...r, status: 'Claimed', claimed_at: new Date().toISOString() };
        return r;
      });
      localStorage.setItem('giokup_rewards_database', JSON.stringify(updatedDb));
    }

    setPromoSuccess('Reward diklaim! Silakan gunakan di checkout.');
  };

  const useReward = (reward: Reward) => {
    setPromoCode(reward.kode_redeem);
    setPromoSuccess('Reward siap digunakan!');
    setView('checkout');
    if (showRewardModal) setShowRewardModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    const savedGuestOrders = localStorage.getItem('giokup_orders');
    setUserOrders(savedGuestOrders ? JSON.parse(savedGuestOrders) : []);
    setRewards([]); // Clear local rewards
    setCart([]); // Clear shopping cart
    setView('user');
    setLoginForm({ username: '', password: '' });
    
    // Also clear certain temporary session states
    setSelectedGame(null);
    setSelectedProduct(null);
    setSelectedPayment(null);
    setIsSuccess(false);
    setAppliedPromo(null);
    localStorage.removeItem('giokup_last_receipt');
  };

  const handleBackToHome = () => {
    if (currentUser?.role === 'admin') {
      setView('admin');
      return;
    }
    setSelectedGame(null);
    setSelectedProduct(null);
    setSelectedPayment(null);
    setUserId('');
    setZoneId('');
    setWhatsapp('');
    setInputErrors({});
    setView('user');
    setIsSuccess(false);
    setIsProcessing(false);
    setSearchQuery('');
    
    // Reset Promo
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
    setPromoSuccess('');
  };

  const handleSaveReceipt = async () => {
    if (!receiptRef.current || !lastPurchaseSummary) return;
    
    setIsGeneratingPDF(true);
    try {
      const element = receiptRef.current;
      const canvas = await html2canvas(element, {
        scale: 3, // High quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 800,
        onclone: (clonedDoc) => {
          // Fix for html2canvas unsupported oklab/oklch colors in Tailwind v4
          // We sanitize all style tags in the cloned document
          const styles = clonedDoc.getElementsByTagName('style');
          for (let i = 0; i < styles.length; i++) {
            const style = styles[i];
            if (style.innerHTML.includes('oklab') || style.innerHTML.includes('oklch')) {
              // Replace color-mix in oklab with a safe fallback
              // This prevents html2canvas from crashing on the CSS parser
              style.innerHTML = style.innerHTML
                .replace(/color-mix\(in oklab, ([^,]+), ([^)]+)\)/g, 'rgba(0,0,0,0.1)')
                .replace(/oklch\([^)]+\)/g, '#000000');
            }
          }
          
          // Force some standard styles for the receipt in the clone
          const overrideStyle = clonedDoc.createElement('style');
          overrideStyle.innerHTML = `
            .text-jade-bg { color: #091a18 !important; }
            .bg-jade-accent { background-color: #3ea891 !important; }
            .text-jade-accent { color: #3ea891 !important; }
            .bg-white { background-color: #ffffff !important; }
            .border-jade-bg\\/10 { border-color: rgba(9, 26, 24, 0.1) !important; }
            .text-jade-bg\\/70 { color: rgba(9, 26, 24, 0.7) !important; }
            .text-jade-bg\\/60 { color: rgba(9, 26, 24, 0.6) !important; }
          `;
          clonedDoc.head.appendChild(overrideStyle);
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      const yPos = pdfHeight < pdf.internal.pageSize.getHeight() ? 10 : 0;
      
      pdf.addImage(imgData, 'PNG', 0, yPos, pdfWidth, pdfHeight);
      
      // Filename
      const filename = `giokup-receipt-${lastPurchaseSummary.orderId || 'SUCCESS'}.pdf`;
      
      // Robust direct download trigger
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Success Toast
      setToastMessage({
        title: 'Berhasil!',
        description: 'Struk berhasil diunduh',
        type: 'success'
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

    } catch (error) {
      console.error('Error generating PDF:', error);
      // Error Toast
      setToastMessage({
        title: 'Gagal!',
        description: 'Tidak dapat mengunduh PDF',
        type: 'error'
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const validateInputs = () => {
    const errors: {userId?: string, zoneId?: string, whatsapp?: string, product?: string} = {};
    
    if (!userId.trim()) {
      errors.userId = 'User ID tidak boleh kosong';
    } else if (selectedGame?.id === 'valorant' && !userId.includes('#')) {
      errors.userId = 'Format Riot ID harus username#tagline';
    }

    const needsZoneId = selectedGame && !['valorant', 'codm', 'genshin', 'zenless', 'pubgm'].includes(selectedGame.id);
    if (needsZoneId && !zoneId.trim()) {
      errors.zoneId = 'Zone ID tidak boleh kosong';
    }

    if (!whatsapp.trim()) {
      errors.whatsapp = 'Nomor WhatsApp wajib diisi';
    } else {
      const waRegex = /^(08|62|\+62)[0-9]{7,15}$/;
      if (!waRegex.test(whatsapp.replace(/\s/g, ''))) {
        errors.whatsapp = 'Format nomor WhatsApp tidak valid (contoh: 08123456789)';
      }
    }

    if (!selectedProduct) {
      errors.product = 'Silakan pilih nominal top up';
    }

    setInputErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    
    if (!promoCode.trim()) {
      setPromoError('Masukkan kode promo terlebih dahulu');
      return;
    }
    
    const promo = PROMOS.find(p => p.kode_promo.toUpperCase() === promoCode.toUpperCase());
    const reward = rewards.find(r => r.kode_redeem.toUpperCase() === promoCode.toUpperCase() && (r.status === 'Available' || r.status === 'Claimed'));
    
    // Check Weekly Rewards
    let weeklyReward: any = null;
    if (isLoggedIn && currentUser) {
      const weeklySaved = localStorage.getItem(`giokup_weekly_rewards_${currentUser.username}`);
      if (weeklySaved) {
        const parsed = JSON.parse(weeklySaved);
        weeklyReward = parsed.claimedCodes.find((c: any) => c.code.toUpperCase() === promoCode.toUpperCase() && !c.isUsed);
      }
    }

    if (!promo && !reward && !weeklyReward) {
      setPromoError('Kode promo atau reward tidak valid');
      return;
    }

    let activePromo: any = null;

    if (weeklyReward) {
      activePromo = {
        id_promo: `weekly-${weeklyReward.code}`,
        kode_promo: weeklyReward.code,
        potongan_harga: weeklyReward.discount,
        tipe_potongan: 'persen',
        tanggal_berlaku: weeklyReward.expiresAt,
        syarat_penggunaan: `Reward Hari ke-${weeklyReward.day}`,
        min_transaksi: weeklyReward.minTransaction,
        max_potongan: weeklyReward.maxDiscount,
        created_at: new Date().toISOString(),
        isWeekly: true
      };
    } else if (reward) {
      activePromo = {
        id_promo: reward.id,
        kode_promo: reward.kode_redeem,
        potongan_harga: reward.potongan,
        tipe_potongan: reward.tipe,
        tanggal_berlaku: reward.expires_at,
        syarat_penggunaan: reward.keterangan,
        min_transaksi: 0,
        created_at: reward.created_at
      };
    } else {
      activePromo = promo;
    }
    
    if (!activePromo) return;

    // Validation
    const now = new Date();
    const expiryDate = new Date(activePromo.tanggal_berlaku);
    if (now > expiryDate) {
      setPromoError('Kode ini telah kedaluwarsa');
      return;
    }

    const selectedItems = cart.filter(item => selectedCartIds.includes(item.cartId));
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.promoPrice || item.price), 0);

    if (activePromo.min_transaksi && subtotal < activePromo.min_transaksi) {
      setPromoError(`Minimal transaksi Rp ${activePromo.min_transaksi.toLocaleString('id-ID')} untuk menggunakan promo ini`);
      return;
    }

    if (activePromo.kode_promo === 'NEWUSER' && userOrders.length > 0) {
      setPromoError('Promo ini hanya berlaku untuk pengguna baru');
      return;
    }

    setAppliedPromo(activePromo);
    setPromoSuccess(reward || weeklyReward ? 'Reward berhasil digunakan!' : 'Promo berhasil digunakan!');
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoSuccess('');
  };

  const handleAddToCart = () => {
    if (!validateInputs()) return;

    const newCartItem: CartItem = {
      cartId: `CRT-${Math.floor(Math.random() * 1000000)}`,
      gameId: selectedGame!.id,
      gameName: selectedGame!.name,
      gameImage: selectedGame!.image,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      price: selectedProduct.price,
      promoPrice: selectedProduct.promoPrice,
      userId: userId,
      id_server: zoneId,
      whatsapp: whatsapp
    };

    setCart(prev => [...prev, newCartItem]);
    setSelectedCartIds(prev => [...prev, newCartItem.cartId]);
    setJustAdded(true);
    setToastMessage({
      title: 'Berhasil!',
      description: 'Produk ditambahkan ke keranjang',
      type: 'success'
    });
    setShowToast(true);
    
    // Animation feedback
    setTimeout(() => {
      setJustAdded(false);
    }, 1000);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
    setSelectedCartIds(prev => prev.filter(id => id !== cartId));
  };

  const toggleSelectCartItem = (cartId: string) => {
    setSelectedCartIds(prev => 
      prev.includes(cartId) ? prev.filter(id => id !== cartId) : [...prev, cartId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCartIds.length === cart.length) {
      setSelectedCartIds([]);
    } else {
      setSelectedCartIds(cart.map(item => item.cartId));
    }
  };

  const completeOrder = (newOrders: any[], summary: any) => {
    // Update Database
    const savedDb = localStorage.getItem('giokup_orders_database');
    const currentDb = savedDb ? JSON.parse(savedDb) : [];
    const updatedDb = [...newOrders, ...currentDb];
    localStorage.setItem('giokup_orders_database', JSON.stringify(updatedDb));

    // Update Admin View
    setAllOrders(updatedDb);

    // Update Current User State
 setUserOrders(prev => {

  const updatedOrders = [...newOrders, ...prev];

  console.log('UPDATED USER ORDERS:', updatedOrders);

  localStorage.setItem(
    'giokup_orders',
    JSON.stringify(updatedOrders)
  );

  return updatedOrders;

});
setCart([]);
localStorage.removeItem('giokup_cart');

    setLastPurchaseSummary(summary);
    localStorage.setItem('giokup_last_receipt', JSON.stringify(summary));

    // Clear from cart the processed items
    if (view === 'checkout' || view === 'qris-payment') {
      // Mark Reward as Used if applicable
      if (appliedPromo) {
        const rewardIndex = rewards.findIndex(r => r.kode_redeem === appliedPromo.kode_promo);
        if (rewardIndex !== -1) {
          const updatedRewards = [...rewards];
          updatedRewards[rewardIndex] = { 
            ...updatedRewards[rewardIndex], 
            status: 'Used', 
            used_at: new Date().toISOString() 
          };
          setRewards(updatedRewards);
          
          // Update Rewards Database
          const savedDbRewards = localStorage.getItem('giokup_rewards_database');
          if (savedDbRewards) {
            const allDbRewards = JSON.parse(savedDbRewards);
            const updatedDbRewards = allDbRewards.map((r: any) => {
              if (r.kode_redeem === appliedPromo.kode_promo && r.id_user === currentUser?.username) {
                return { ...r, status: 'Used', used_at: new Date().toISOString() };
              }
              return r;
            });
            localStorage.setItem('giokup_rewards_database', JSON.stringify(updatedDbRewards));
          }
        }

        // Mark Weekly Reward as used
        if ((appliedPromo as any).isWeekly && isLoggedIn && currentUser) {
          const weeklyKey = `giokup_weekly_rewards_${currentUser.username}`;
          const weeklySaved = localStorage.getItem(weeklyKey);
          if (weeklySaved) {
            const parsed = JSON.parse(weeklySaved);
            const codeIdx = parsed.claimedCodes?.findIndex((c: any) => c.code === appliedPromo.kode_promo);
            if (codeIdx !== -1) {
              parsed.claimedCodes[codeIdx].isUsed = true;
              localStorage.setItem(weeklyKey, JSON.stringify(parsed));
            }
          }
        }
      }
      
      setCart(prev => prev.filter(item => !selectedCartIds.includes(item.cartId)));
      setSelectedCartIds([]);
    }
  };

  const handlePurchase = async () => {
    if (currentUser?.role === 'admin') {
      alert('Admin tidak diperbolehkan melakukan transaksi.');
      return;
    }

    setIsProcessing(true);
    // Simulate API call
    setTimeout(async () => {
const selectedItems = view === 'checkout' 
  ? cart.filter(item => selectedCartIds.includes(item.cartId))
  : [{ 
      productName: selectedProduct?.name || '',
      gameName: selectedGame?.name || '',
      price: selectedProduct?.price || 0,
      promoPrice: selectedProduct?.promoPrice || 0 // ✅ TAMBAHAN INI
    }];

      const subtotal = selectedItems.reduce((sum, item) => sum + (item.promoPrice || item.price), 0);
      let totalDiscount = 0;
      if (appliedPromo) {
        totalDiscount = appliedPromo.tipe_potongan === 'persen' 
          ? (subtotal * appliedPromo.potongan_harga / 100)
          : appliedPromo.potongan_harga;
      }

      const newOrders = selectedItems.map(item => {
        const orderId = `GK-${Math.floor(10000 + Math.random() * 90000)}`;
        const itemSubtotal = (item.promoPrice || item.price);
        const itemDiscount = subtotal > 0 ? (itemSubtotal / subtotal) * totalDiscount : 0;
        const itemFee = (selectedPayment?.fee / selectedItems.length || 0);

        return {
          id: orderId,
          name: currentUser?.username || 'Guest',
          username: currentUser?.username || 'Guest User', // Track by account
          item: `${item.productName} (${item.gameName})`,
          gameName: item.gameName,
          productName: item.productName,
          amount: Math.max(0, itemSubtotal + itemFee - itemDiscount),
          price: Math.max(0, itemSubtotal + itemFee - itemDiscount),
          status: 'Success' as const,
          date: new Date().toLocaleString('id-ID'),
          paymentMethod: selectedPayment?.name,
          paymentLogo: selectedPayment?.logo,
          promoDetails: appliedPromo ? {
            code: appliedPromo.kode_promo,
            discount: itemDiscount
          } : undefined
        };
      });
      console.log('NEW ORDERS FINAL:', newOrders);

      const summary = {
        orderId: `GK-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
        orders: newOrders,
        totalAmount: newOrders.reduce((sum, o) => sum + o.amount, 0),
        paymentMethod: selectedPayment?.name,
        paymentLogo: selectedPayment?.logo
      };
      const { error: transactionError } = await supabase
  .from('transactions')
  .insert([
    {
      id_transaksi: summary.orderId,
      id_user: currentUser?.username || 'guest',
      id_produk: selectedProduct?.id || 'unknown',
      user_id_game: 'TEMP_USER',
id_server: 'EMPTY'
    }
  ]);

console.log('TRANSACTION ERROR:', transactionError);
      const { error: paymentError } = await supabase
  .from('payments')
  .insert([
    {
      id_pembayaran: `PAY-${Date.now()}`,
      id_transaksi: summary.orderId,
      metode: selectedPayment?.id || 'unknown',
      nama_metode: selectedPayment?.name || 'Unknown',
      status_pembayaran: 'Success'
    }
  ]);

console.log('PAYMENT ERROR:', paymentError);
const { error: logError } = await supabase
  .from('transaction_logs')
  .insert([
    {
      id_log: `LOG-${Date.now()}`,
      id_transaksi: summary.orderId,
      perubahan_status: 'SUCCESS',
      keterangan: 'Transaksi berhasil dibuat',
      timestamp: new Date().toISOString()
    }
  ]);

console.log('LOG ERROR:', logError);

if (selectedPayment?.id === 'qris') {

  setIsProcessing(false);

  setQrisPaymentData({
    orders: newOrders,
    summary
  });

  setView('qris-payment');

  return;

} else {

  setIsProcessing(false);

  setQrisPaymentData({
    orders: newOrders,
    summary
  });

  setView('payment-success');

  return;
}

      completeOrder(newOrders, summary);
      setIsProcessing(false);
      setIsSuccess(true);
      setOrderNumber(newOrders.map(o => o.id).join(', '));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  function QrisPaymentPage({ data, onConfirm, onCancel }: { data: any, onConfirm: () => void, onCancel: () => void }) {
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
    const [isVerifying, setIsVerifying] = useState(false);
    
    if (!data || !data.summary) return null;
    
    React.useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleVerify = () => {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        onConfirm();
      }, 2500);
    };

    const qrValue = `GIOKUP-DEMO-${data.summary.orderId}-${data.summary.totalAmount}`;

    if (timeLeft === 0) {
      return (
        <div className="max-w-md mx-auto py-20 px-4 text-center space-y-6">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
            <X className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-text-main">QRIS Telah Kedaluwarsa</h2>
          <p className="text-text-dim">Silakan buat pesanan baru untuk melanjutkan pembayaran.</p>
          <button 
            onClick={onCancel}
            className="w-full bg-jade-accent text-jade-bg py-4 rounded-xl font-black uppercase tracking-widest"
          >
            Kembali ke Beranda
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto py-12 px-4 space-y-8">
        <div className="text-center space-y-2">
          <img src={APP_LOGO_URL} alt="GiokUp" className="h-12 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-black text-text-main font-sans uppercase tracking-tighter">Scan QRIS untuk Menyelesaikan Pembayaran</h2>
          <div className="flex items-center justify-center gap-2 text-rose-500 font-mono font-bold animate-pulse">
            <Clock className="w-4 h-4" />
            <span>Selesaikan dalam {formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="relative w-full max-w-[360px] mx-auto rounded-3xl overflow-hidden shadow-2xl border border-[#091a18]/10 bg-white">
              <img 
                src="../qris-static.png" 
                alt="QRIS Payment Poster" 
                className="w-full h-auto block"
                referrerPolicy="no-referrer"
              />
            </div>

          <div className="space-y-6">
            <div className="bg-jade-dark border border-jade-mid rounded-2xl p-6 space-y-4">
              <h3 className="text-jade-glow text-xs font-black uppercase tracking-widest border-b border-jade-mid pb-3">Informasi Transaksi</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-dim">ID Transaksi</span>
                  <span className="text-text-main font-bold font-mono">{data.summary.orderId}</span>
                </div>
                {data.summary.orders.map((order: any, idx: number) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-dim">Nama Game</span>
                      <span className="text-text-main font-bold">{order.gameName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-dim">Produk</span>
                      <span className="text-text-main font-bold">{order.productName}</span>
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t border-jade-mid flex justify-between items-center">
                  <span className="text-text-main font-black uppercase text-xs">Total Pembayaran</span>
                  <span className="text-jade-glow text-xl font-black">Rp {data.summary.totalAmount.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full bg-jade-accent text-jade-bg py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-jade-accent/20 hover:bg-jade-glow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isVerifying ? (
                  <>Memverifikasi Pembayaran... <div className="w-4 h-4 border-2 border-jade-bg border-t-transparent rounded-full animate-spin" /></>
                ) : (
                  <>Saya Sudah Bayar <Check className="w-4 h-4" /></>
                )}
              </button>
              <button 
                onClick={onCancel}
                className="w-full bg-jade-dark border border-jade-mid text-text-dim hover:text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
              >
                Batalkan Pembayaran
              </button>
            </div>
            
            <p className="text-[10px] text-text-dim text-center leading-relaxed">
              *Tangkapan layar struk ini jika diperlukan. Pembayaran akan terverifikasi otomatis dalam beberapa saat setelah Anda menekan tombol di atas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {view !== 'admin' && currentUser?.role !== 'admin' && (
        <FloatingSideNav 
          currentView={view} 
          hasGameSelected={!!selectedGame}
          handleHome={handleBackToHome}
          handleHistory={() => setView('history')}
        />
      )}
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`fixed top-24 right-4 z-[100] bg-jade-dark border shadow-[0_0_30px_rgba(118,225,201,0.2)] rounded-2xl p-4 flex items-center gap-4 min-w-[320px] backdrop-blur-md ${
              toastMessage.type === 'error' ? 'border-red-500/50 shadow-red-500/20' : 'border-jade-glow shadow-jade-glow/20'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
              toastMessage.type === 'error' ? 'bg-red-500 text-white' : 'bg-jade-accent text-jade-bg shadow-jade-accent/20'
            }`}>
              {toastMessage.type === 'error' ? <X className="w-7 h-7" /> : <Check className="w-7 h-7" />}
            </div>
            <div>
              <p className={`text-sm font-black uppercase tracking-widest leading-none mb-1 ${
                toastMessage.type === 'error' ? 'text-red-500' : 'text-text-main'
              }`}>{toastMessage.title}</p>
              <p className="text-[11px] text-text-dim font-bold">{toastMessage.description}</p>
            </div>
            <div className="ml-auto">
              <motion.div 
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 3, ease: 'linear' }}
                className={`h-1 rounded-full absolute bottom-0 left-0 ${
                  toastMessage.type === 'error' ? 'bg-red-500' : 'bg-jade-accent'
                }`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRewardModal && activeReward && (
          <RewardModal 
            reward={activeReward} 
            onClose={() => setShowRewardModal(false)} 
            onUse={useReward}
          />
        )}
      </AnimatePresence>

      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-jade-bg/95 backdrop-blur-md text-text-main shadow-lg border-b border-jade-mid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 cursor-pointer" onClick={handleBackToHome}>
                <div className="w-10 h-10 bg-jade-accent rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform overflow-hidden">
                  <img src={APP_LOGO_URL} alt="GiokUp Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <span className="text-2xl font-extrabold tracking-tighter text-text-main">
                  Giok<span className="text-jade-glow">Up</span>
                </span>
              </div>
            </div>

            {/* Navbar Search - Desktop */}
            {!selectedGame && view === 'user' && currentUser?.role !== 'admin' && (
              <div className="hidden lg:flex items-center flex-grow max-w-md mx-8 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-jade-accent w-4 h-4 transition-colors group-focus-within:text-jade-glow" />
                <input 
                  type="text" 
                  placeholder="Cari game favoritmu..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-jade-dark border border-jade-mid text-text-main text-xs font-bold placeholder:text-text-dim/50 focus:outline-none focus:ring-2 focus:ring-jade-glow/20 focus:border-jade-glow transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}

            <div className="hidden md:flex items-center gap-8">
              {isLoggedIn && currentUser?.role !== 'admin' && (
                <button 
                  onClick={() => setView('rewards')}
                  className={`text-sm font-medium transition-colors hover:text-jade-glow ${view === 'rewards' ? 'text-jade-glow' : 'text-text-dim'} flex items-center gap-1`}
                >
                  Rewards {rewards.filter(r => r.status === 'Available' || r.status === 'Claimed').length > 0 && (
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                  )}
                </button>
              )}
              {isLoggedIn && currentUser?.role === 'admin' && (
                <div className="px-4 py-1.5 rounded-full bg-jade-accent/10 border border-jade-glow/20">
                  <span className="text-xs font-black uppercase text-jade-glow tracking-widest">Admin Panel</span>
                </div>
              )}
              <div className="flex items-center gap-4 border-l border-jade-mid pl-8">
                {/* Cart Icon Desktop */}
                {currentUser?.role !== 'admin' && (
                  <button 
                    onClick={() => setView('cart')}
                    className="relative p-2 text-text-dim hover:text-jade-glow transition-all mr-2"
                  >
                    <motion.div
                      animate={justAdded ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </motion.div>
                    {cart.length > 0 && (
                      <motion.span 
                        key={cart.length}
                        initial={{ scale: 0.5, opacity: 0, backgroundColor: '#10b981' }}
                        animate={{ scale: 1, opacity: 1, backgroundColor: '#ef4444' }}
                        transition={{ type: 'spring', damping: 10, stiffness: 400 }}
                        className="absolute -top-1 -right-1 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg"
                      >
                        {cart.length}
                      </motion.span>
                    )}
                  </button>
                )}

                {isLoggedIn ? (
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-text-main leading-none">{currentUser?.username}</span>
                      <span className="text-[10px] text-jade-accent font-black uppercase tracking-tighter">{currentUser?.role}</span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="p-2 rounded-lg bg-jade-mid/20 text-text-dim hover:text-red-400 transition-colors"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setView('login')}
                    className="bg-jade-accent px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-jade-accent/20 hover:scale-105 transition-all flex items-center gap-2 text-jade-bg"
                  >
                    <User className="w-4 h-4" />
                    Sign In
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
              {currentUser?.role !== 'admin' && (
                <button 
                  onClick={() => setView('cart')}
                  className="relative p-2 text-jade-accent hover:text-jade-glow transition-all"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cart.length > 0 && (
                    <motion.span 
                      key={cart.length}
                      initial={{ scale: 0.5, opacity: 0, backgroundColor: '#10b981' }}
                      animate={{ scale: 1, opacity: 1, backgroundColor: '#ef4444' }}
                      transition={{ type: 'spring', damping: 10, stiffness: 400 }}
                      className="absolute -top-1 -right-1 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg"
                    >
                      {cart.length}
                    </motion.span>
                  )}
                </button>
              )}
              <button 
                className="p-2 text-jade-accent hover:text-jade-glow transition-colors"
                onClick={() => setSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-jade-dark border-t border-jade-mid overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {/* Mobile Search */}
                {!selectedGame && view === 'user' && currentUser?.role !== 'admin' && (
                  <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-jade-accent w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Cari game..."
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-jade-bg border border-jade-mid text-text-main text-sm font-bold"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                )}
                
                {view !== 'admin' && currentUser?.role !== 'admin' && (
                  <>
                    <button 
                      onClick={() => { handleBackToHome(); setSidebarOpen(false); }}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-3 ${view === 'user' && !selectedGame ? 'bg-jade-accent text-jade-bg' : 'text-text-dim'}`}
                    >
                      <Home className="w-5 h-5" /> Home
                    </button>
                    <button 
                      onClick={() => { setView('history'); setSidebarOpen(false); }}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-3 ${view === 'history' ? 'bg-jade-accent text-jade-bg' : 'text-text-dim'}`}
                    >
                      <History className="w-5 h-5" /> Riwayat Belanja
                    </button>
                  </>
                )}
                {isLoggedIn && currentUser?.role !== 'admin' && (
                  <button 
                    onClick={() => { setView('rewards'); setSidebarOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-3 ${view === 'rewards' ? 'bg-jade-accent text-jade-bg' : 'text-text-dim'}`}
                  >
                    <Sparkles className="w-5 h-5" /> My Rewards
                  </button>
                )}
                {isLoggedIn && currentUser?.role === 'admin' && (
                  <button 
                    onClick={() => { setView('admin'); setSidebarOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-3 ${view === 'admin' ? 'bg-jade-accent text-jade-bg' : 'text-text-dim'}`}
                  >
                    <LayoutDashboard className="w-5 h-5" /> Admin Panel
                  </button>
                )}
                <div className="pt-4 border-t border-jade-mid">
                  {isLoggedIn ? (
                    <div className="space-y-4">
                      <div className="px-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-jade-accent flex items-center justify-center text-jade-bg font-black">
                          {currentUser?.username[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-main">{currentUser?.username}</p>
                          <p className="text-[10px] text-jade-accent font-black uppercase tracking-widest">{currentUser?.role}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => { handleLogout(); setSidebarOpen(false); }}
                        className="w-full text-left px-4 py-3 rounded-xl font-bold text-red-400 flex items-center gap-3"
                      >
                        <LogOut className="w-5 h-5" /> Logout
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => { setView('login'); setSidebarOpen(false); }}
                      className="w-full bg-jade-accent text-jade-bg px-4 py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      <User className="w-5 h-5" /> Sign In
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-grow bg-jade-bg">
        <AnimatePresence mode="wait">
          {currentUser?.role === 'admin' ? (
            <motion.div
              key="admin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex bg-jade-bg min-h-[calc(100vh-64px)] flex-col lg:flex-row"
            >
              {/* Admin Sidebar */}
              <aside className="w-full lg:w-64 bg-jade-dark border-r border-jade-mid border-b lg:border-b-0">
                <div className="p-4 lg:p-6 overflow-x-auto lg:overflow-x-visible scrollbar-hide">
                  <span className="text-[10px] font-black text-text-dim uppercase tracking-[3px] hidden lg:block mb-6">Menu Dashboard</span>
                  <nav className="flex lg:flex-col gap-2">
                    {[
                      { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                      { id: 'orders', icon: ShoppingBag, label: 'Order List' },
                      { id: 'games', icon: Gamepad2, label: 'Manage Games' },
                      { id: 'payments', icon: CreditCard, label: 'Payment Config' },
                      { id: 'rewards', icon: Gift, label: 'Manage Rewards' },
                      { id: 'logs', icon: FileText, label: 'Logs' },
                      { id: 'settings', icon: Settings, label: 'Settings' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setAdminActiveSubView(item.id as any)}
                        className={`group flex flex-shrink-0 lg:flex-shrink items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                          adminActiveSubView === item.id 
                            ? 'bg-jade-accent text-jade-bg shadow-lg shadow-jade-accent/20' 
                            : 'text-text-dim hover:bg-jade-mid/20 hover:text-jade-glow border border-transparent lg:border-none'
                        }`}
                      >
                        <item.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${adminActiveSubView === item.id ? 'text-jade-bg' : 'text-jade-accent'}`} />
                        <span className="whitespace-nowrap">{item.label}</span>
                      </button>
                    ))}
                  </nav>

                  <div className="hidden lg:block mt-20 pt-10 border-t border-jade-mid">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 bg-red-500/5 hover:bg-red-500/10 transition-all group"
                    >
                      <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                      Logout
                    </button>
                  </div>
                </div>
              </aside>

              {/* Admin Content Area */}
              <section className="flex-grow p-4 lg:p-10 lg:overflow-y-auto max-h-[calc(100vh-64px)] scrollbar-hide">
                <div className="max-w-6xl mx-auto">
                  <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="relative">
                        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-jade-accent rounded-full hidden md:block" />
                        <h2 className="text-3xl font-black text-text-main tracking-tight font-serif italic capitalize">
                          {adminActiveSubView === 'overview' ? 'System Overview' : adminActiveSubView.replace('-', ' ')}
                        </h2>
                        <p className="text-jade-accent font-black uppercase text-[10px] tracking-[3px] mt-1">Management Portal v2.0</p>
                      </div>
                    </div>
                    <div className="flex bg-jade-dark/50 p-1 rounded-2xl border border-jade-mid backdrop-blur-sm self-start md:self-auto">
                      <button className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-jade-accent text-jade-bg shadow-lg">Realtime</button>
                      <button className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-text-main">Historical</button>
                    </div>
                  </header>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={adminActiveSubView}
                      initial={{ opacity: 0, scale: 0.98, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {adminActiveSubView === 'overview' && <AdminDashboard orders={allOrders} />}
                      {adminActiveSubView === 'orders' && <AdminOrders orders={allOrders} />}
                      {adminActiveSubView === 'games' && <AdminGames />}
                      {adminActiveSubView === 'payments' && <AdminPayments />}
                      {adminActiveSubView === 'rewards' && <AdminRewards />}
                      {adminActiveSubView === 'logs' && <AdminLogs />}
                      {adminActiveSubView === 'settings' && <AdminSettings />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </section>
            </motion.div>
          ) : view === 'login' ? (
            <motion.div
              key="login-page"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md bg-jade-dark border border-jade-mid rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-jade-accent/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-jade-mid/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-jade-mid">
                    <Lock className="w-8 h-8 text-jade-accent" />
                  </div>
                  <h2 className="text-2xl font-black text-text-main font-serif italic tracking-tight uppercase">
                    {isRegistering ? 'Daftar Akun Baru' : 'Selamat Datang'}
                  </h2>
                  <p className="text-text-dim text-sm mt-1">
                    {isRegistering ? 'Isi data di bawah untuk mendapatkan Reward Baru' : 'Masuk untuk melanjutkan ke GiokUp'}
                  </p>
                </div>

                <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-6">
                  {loginError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-400/10 border border-red-400/20 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm font-bold"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      {loginError}
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-black text-text-dim uppercase tracking-widest flex items-center gap-2">
                      <User className="w-3 h-3 text-jade-accent" /> Username {isRegistering && '(Minimal 4 karakter)'}
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Masukkan username"
                      className="w-full px-4 py-4 rounded-xl bg-jade-bg border border-jade-mid text-text-main focus:outline-none focus:ring-1 focus:ring-jade-glow focus:border-jade-glow transition-all font-bold placeholder:text-text-dim/30"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-text-dim uppercase tracking-widest flex items-center gap-2">
                      <KeyRound className="w-3 h-3 text-jade-accent" /> Password
                    </label>
                    <input 
                      type="password" 
                      required
                      placeholder="Masukkan password"
                      className="w-full px-4 py-4 rounded-xl bg-jade-bg border border-jade-mid text-text-main focus:outline-none focus:ring-1 focus:ring-jade-glow focus:border-jade-glow transition-all font-bold placeholder:text-text-dim/30"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    />
                  </div>

                  {isRegistering && (
                    <div className="bg-jade-accent/5 border border-jade-accent/20 p-4 rounded-xl flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-jade-glow flex-shrink-0" />
                      <p className="text-[10px] text-jade-glow/80 font-bold leading-relaxed">
                        Daftar sekarang dan dapatkan <span className="text-white">REWARD DISKON 25%</span> khusus untuk transaksi pertama Anda!
                      </p>
                    </div>
                  )}

                  <button 
                    type="submit"
                    className="w-full py-4 bg-jade-accent hover:bg-jade-glow text-jade-bg rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-jade-accent/20"
                  >
                    {isRegistering ? 'Daftar Sekarang' : 'Masuk Sekarang'}
                  </button>
                </form>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-grow bg-jade-mid/50" />
                    <span className="text-[10px] font-black text-text-dim uppercase">Atau</span>
                    <div className="h-px flex-grow bg-jade-mid/50" />
                  </div>
                  
                  <button 
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="w-full py-4 border border-jade-mid hover:border-jade-glow text-text-main rounded-xl font-black text-xs uppercase tracking-widest transition-all"
                  >
                    {isRegistering ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar Baru'}
                  </button>

                  <div className="text-center">
                    <button 
                      onClick={() => setView('user')}
                      className="text-xs font-bold text-text-dim hover:text-jade-accent transition-colors underline underline-offset-4"
                    >
                      Kembali ke Beranda
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : view === 'cart' ? (
            <motion.div
              key="cart-page"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto px-4 py-12"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-text-main font-serif italic uppercase tracking-tight">Keranjang Belanja</h2>
                <button 
                  onClick={handleBackToHome}
                  className="text-xs font-bold text-text-dim hover:text-jade-glow transition-colors underline underline-offset-4"
                >
                  Tambah Game Lain
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="bg-jade-dark border border-jade-mid rounded-3xl p-20 text-center">
                  <div className="w-20 h-20 bg-jade-mid/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingCart className="w-10 h-10 text-text-dim" />
                  </div>
                  <h3 className="text-xl font-bold text-text-main mb-2">Keranjang Kosong</h3>
                  <p className="text-text-dim mb-8">Wah, keranjangmu masih kosong nih. Yuk, cek katalog game kami!</p>
                  <button 
                    onClick={handleBackToHome}
                    className="bg-jade-accent text-jade-bg px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all cursor-pointer"
                  >
                    Mulai Belanja
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Select All */}
                  <div className="bg-jade-dark border border-jade-mid rounded-2xl p-4 flex items-center justify-between">
                    <button 
                      onClick={toggleSelectAll}
                      className="flex items-center gap-3 group"
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                        selectedCartIds.length === cart.length && cart.length > 0
                          ? 'bg-jade-accent border-jade-accent text-jade-bg' 
                          : 'border-jade-mid bg-jade-bg group-hover:border-jade-accent'
                      }`}>
                        {selectedCartIds.length === cart.length && cart.length > 0 && <Check className="w-3 h-3 font-bold" />}
                      </div>
                      <span className="text-sm font-bold text-text-main">Pilih Semua ({cart.length})</span>
                    </button>
                    {selectedCartIds.length > 0 && (
                      <button 
                        onClick={() => {
                          setCart(prev => prev.filter(item => !selectedCartIds.includes(item.cartId)));
                          setSelectedCartIds([]);
                        }}
                        className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
                      >
                        Hapus Terpilih
                      </button>
                    )}
                  </div>

                  {/* Cart Items */}
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <motion.div
                        key={item.cartId}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`bg-jade-dark border rounded-2xl p-3 sm:p-5 flex items-center gap-3 sm:gap-6 group transition-all ${
                          selectedCartIds.includes(item.cartId) ? 'border-jade-accent bg-jade-accent/5' : 'border-jade-mid'
                        }`}
                      >
                        <button 
                          onClick={() => toggleSelectCartItem(item.cartId)}
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                            selectedCartIds.includes(item.cartId)
                              ? 'bg-jade-accent border-jade-accent text-jade-bg shadow-lg shadow-jade-accent/20' 
                              : 'border-jade-mid bg-jade-bg group-hover:border-jade-accent'
                          }`}
                        >
                          {selectedCartIds.includes(item.cartId) && <Check className="w-4 h-4 font-black" />}
                        </button>

                        <div className="w-14 h-18 sm:w-16 sm:h-20 rounded-xl overflow-hidden border border-jade-mid flex-shrink-0">
                          <img src={item.gameImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>

                        <div className="flex-grow min-w-0">
                          <p className="text-[9px] font-black text-jade-accent uppercase tracking-[0.2em] truncate mb-0.5">{item.gameName}</p>
                          <h4 className="text-sm sm:text-base font-bold text-text-main leading-tight truncate uppercase tracking-tight">{item.productName}</h4>
                          <p className="text-[10px] text-text-dim font-bold mt-1">ID: <span className="text-text-main font-mono">{item.userId}</span></p>
                          <div className="sm:hidden mt-2">
                            <span className="text-jade-glow font-black text-sm">
                              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.promoPrice || item.price)}
                            </span>
                          </div>
                        </div>

                        <div className="hidden sm:flex flex-col items-end gap-1">
                          <span className="text-lg font-black text-jade-glow">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.promoPrice || item.price)}
                          </span>
                        </div>

                        <button 
                          onClick={() => removeFromCart(item.cartId)}
                          className="p-2 text-text-dim hover:text-red-400 transition-colors bg-red-400/5 rounded-lg flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Summary Bar */}
                  <div className="sticky bottom-6 mt-12 bg-jade-dark border border-jade-accent/20 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="text-center sm:text-left">
                      <p className="text-xs font-black text-text-dim uppercase tracking-widest mb-1">Total ( {selectedCartIds.length} Produk )</p>
                      <p className="text-3xl font-black text-jade-glow">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
                          cart.filter(item => selectedCartIds.includes(item.cartId)).reduce((sum, item) => sum + (item.promoPrice || item.price), 0)
                        )}
                      </p>
                    </div>
                    <button 
                      onClick={() => setView('checkout')}
                      disabled={selectedCartIds.length === 0}
                      className={`px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center gap-3 ${
                        selectedCartIds.length > 0 
                          ? 'bg-jade-accent hover:bg-jade-glow text-jade-bg shadow-xl shadow-jade-accent/20' 
                          : 'bg-jade-mid/20 text-text-dim/30 cursor-not-allowed border border-jade-mid'
                      }`}
                    >
                      Lanjut ke Pembayaran <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ) : view === 'checkout' ? (
            <motion.div
              key="checkout-page"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto px-4 py-12"
            >
              <button 
                onClick={() => setView('cart')}
                className="mb-8 flex items-center gap-2 text-text-dim hover:text-jade-glow transition-colors group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-jade-dark border border-jade-mid flex items-center justify-center group-hover:border-jade-accent transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase tracking-[2px]">Kembali ke Keranjang</span>
              </button>

              <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-8">
                  {/* Guest Warning / Info */}
                  {!isLoggedIn && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-jade-accent/10 border border-jade-accent/20 rounded-2xl p-4 flex items-center gap-4"
                    >
                      <div className="w-10 h-10 rounded-full bg-jade-accent flex items-center justify-center text-jade-bg shadow-lg">
                        <Zap className="w-5 h-5 fill-current" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-main">Transaksi sebagai Guest</p>
                        <p className="text-[10px] text-text-dim/80 font-medium">Jangan khawatir! Pesanan kamu tetap aman & akan tercatat di menu "Riwayat" pada perangkat ini.</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Payment */}
                  <div className="bg-jade-dark rounded-3xl p-8 shadow-sm border border-jade-mid">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 bg-jade-accent text-jade-bg rounded-lg flex items-center justify-center font-black">1</div>
                      <h3 className="text-xl font-bold text-text-main tracking-tight">Pilih Pembayaran</h3>
                    </div>
                    <div className="space-y-6">
                      {Array.from(new Set(PAYMENT_METHODS.map(p => p.group))).map(group => (
                        <div key={group} className="space-y-4">
                          <h4 className="text-[10px] font-black text-text-dim uppercase tracking-[4px]">{group}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                            {PAYMENT_METHODS.filter(p => p.group === group).map(method => (
                              <button
                                key={method.id}
                                onClick={() => setSelectedPayment(method)}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                                  selectedPayment?.id === method.id 
                                    ? 'border-jade-glow bg-jade-mid/20 shadow-lg shadow-jade-glow/5' 
                                    : 'border-jade-mid bg-jade-bg hover:border-jade-accent'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-8 bg-white rounded-md flex items-center justify-center p-1.5 transition-colors">
                                    <img 
                                      src={method.logo} 
                                      alt={method.name} 
                                      className="w-full h-full object-contain" 
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <span className="font-bold text-text-main text-sm truncate max-w-[120px] sm:max-w-none">{method.name}</span>
                                </div>
                                <span className="text-[10px] font-black text-jade-accent bg-jade-accent/10 px-2 py-1 rounded-lg">
                                  + {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(method.fee)}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-8">
                  {/* Order Summary */}
                  <div className="bg-jade-dark rounded-3xl p-8 shadow-2xl text-text-main border border-jade-accent/20 sticky top-24">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-10 h-10 bg-jade-accent text-jade-bg rounded-lg flex items-center justify-center font-black">2</div>
                      <h3 className="text-xl font-extrabold tracking-tight font-serif italic uppercase">Ringkasan</h3>
                    </div>
                    
                    <div className="space-y-4 mb-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-hide">
                      {cart.filter(item => selectedCartIds.includes(item.cartId)).map(item => (
                        <div key={item.cartId} className="pb-4 border-b border-jade-mid/50 last:border-0">
                          <p className="text-xs font-black text-jade-accent uppercase tracking-widest mb-1">{item.gameName}</p>
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-xs font-bold text-text-main">{item.productName}</span>
                            <span className="text-xs font-black text-jade-glow whitespace-nowrap">
                              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.promoPrice || item.price)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Promo Input Section */}
                    <div className="mb-8 pt-4 border-t border-jade-mid">
                      <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-3">Punya Kode Promo?</p>
                      {!appliedPromo ? (
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            placeholder="Contoh: DISKON20"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                            className="w-full bg-jade-bg border border-jade-mid rounded-xl px-4 py-3.5 text-sm font-bold text-text-main focus:outline-none focus:border-jade-glow transition-all placeholder:text-text-dim/30"
                          />
                          <button
                            onClick={handleApplyPromo}
                            className="w-full bg-jade-accent text-jade-bg py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-jade-glow hover:shadow-lg hover:shadow-jade-accent/20 transition-all active:scale-[0.98]"
                          >
                            Gunakan Promo
                          </button>
                        </div>
                      ) : (
                        <div className="bg-jade-glow/10 border border-jade-glow rounded-xl p-4 flex items-center justify-between shadow-inner shadow-jade-glow/5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-jade-glow/20 flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-jade-glow" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-text-main">{appliedPromo.kode_promo}</p>
                              <p className="text-[9px] text-jade-glow font-black uppercase tracking-wider">{appliedPromo.syarat_penggunaan}</p>
                            </div>
                          </div>
                          <button 
                            onClick={removePromo} 
                            className="p-2 text-text-dim hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                            title="Hapus Promo"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      <AnimatePresence>
                        {promoError && (
                          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[10px] text-red-400 font-bold mt-2 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {promoError}
                          </motion.p>
                        )}
                        {promoSuccess && (
                          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[10px] text-jade-glow font-bold mt-2 flex items-center gap-1">
                            <Check className="w-3 h-3" /> {promoSuccess}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="space-y-2 mb-8">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-text-dim font-bold uppercase tracking-widest">Subtotal</span>
                        <span className="text-text-main font-bold">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
                            cart.filter(item => selectedCartIds.includes(item.cartId)).reduce((sum, item) => sum + (item.promoPrice || item.price), 0)
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-text-dim font-bold uppercase tracking-widest">Fee Pembayaran</span>
                        <span className="text-text-main font-bold">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(selectedPayment?.fee || 0)}
                        </span>
                      </div>
                      
                      {appliedPromo && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-jade-glow font-bold uppercase tracking-widest">Diskon ({appliedPromo.kode_promo})</span>
                          <span className="text-jade-glow font-bold">
                            -{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
                              (() => {
                                const subtotal = cart.filter(item => selectedCartIds.includes(item.cartId)).reduce((sum, item) => sum + (item.promoPrice || item.price), 0);
                                let dist = appliedPromo.tipe_potongan === 'persen' 
                                  ? (subtotal * appliedPromo.potongan_harga / 100)
                                  : appliedPromo.potongan_harga;
                                
                                const maxPot = (appliedPromo as any).max_potongan;
                                if (maxPot && dist > maxPot) dist = maxPot;
                                
                                return dist;
                              })()
                            )}
                          </span>
                        </div>
                      )}

                      <div className="pt-4 border-t border-jade-mid flex justify-between items-center">
                        <span className="text-jade-accent text-sm font-black uppercase tracking-widest italic">Total Bayar</span>
                        <span className="text-jade-glow text-3xl font-black italic drop-shadow-[0_0_100px_rgba(118,225,201,0.3)]">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
                            (() => {
                              const subtotal = cart.filter(item => selectedCartIds.includes(item.cartId)).reduce((sum, item) => sum + (item.promoPrice || item.price), 0);
                              const fee = selectedPayment?.fee || 0;
                              let discount = 0;
                              if (appliedPromo) {
                                discount = appliedPromo.tipe_potongan === 'persen' 
                                  ? (subtotal * appliedPromo.potongan_harga / 100)
                                  : appliedPromo.potongan_harga;
                                
                                const maxPot = (appliedPromo as any).max_potongan;
                                if (maxPot && discount > maxPot) discount = maxPot;
                              }
                              return Math.max(0, subtotal + fee - discount);
                            })()
                          )}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={handlePurchase}
                      disabled={!selectedPayment || isProcessing}
                      className={`w-full py-5 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${
                        selectedPayment && !isProcessing
                          ? 'bg-jade-accent hover:bg-jade-glow shadow-xl shadow-jade-accent/20 text-jade-bg' 
                          : 'bg-jade-mid/20 text-text-dim/30 cursor-not-allowed border border-jade-mid'
                      }`}
                    >
                      {isProcessing ? 'Memproses...' : 'Bayar Sekarang'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : view === 'qris-payment' ? (
            <motion.div
              key="qris-payment-page"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-4 py-6"
            >
              <QrisPaymentPage 
                data={qrisPaymentData} 
                onConfirm={() => {
                  completeOrder(qrisPaymentData.orders, qrisPaymentData.summary);
                  setIsSuccess(true);
                  setSelectedGame(null);
                  setView('user');
                  setQrisPaymentData(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  alert('Pembayaran Berhasil! Pesanan Anda sedang diproses dan akan muncul di riwayat.');
                }} 
                onCancel={() => {
                  setQrisPaymentData(null);
                  setView('checkout');
                }}
              />
            </motion.div>
           ) : view === 'payment-success' ? (

  <PaymentSuccessPage
    summary={qrisPaymentData?.summary}
    onFinish={() => {

      setView('history');

      setQrisPaymentData(null);

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    }}
  />
 
          ) : view === 'history' ? (
            <motion.div
              key="history-page"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-4 py-12"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <h2 className="text-3xl font-black text-text-main font-serif italic uppercase tracking-tight">Riwayat Transaksi</h2>
                  <p className="text-text-dim mt-2">Pantau semua pesanan dan total belanja Anda di GiokUp</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="bg-jade-dark border border-jade-mid p-4 rounded-2xl flex flex-col items-end shadow-xl min-w-[180px]">
                    <span className="text-[10px] font-black text-jade-accent uppercase tracking-widest mb-1">Total Belanja</span>
                    <span className="text-xl font-black text-white">
                      {userOrders.length} Pesanan
                    </span>
                  </div>
                  <div className="bg-jade-dark border border-jade-mid p-4 rounded-2xl flex flex-col items-end shadow-xl min-w-[200px] border-jade-accent/20">
                    <span className="text-[10px] font-black text-jade-accent uppercase tracking-widest mb-1">Total Pengeluaran</span>
                    <span className="text-xl font-black text-jade-glow tracking-tighter">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
                        userOrders.reduce((sum, order) => sum + order.amount, 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Guest Search Order Section */}
              <div className="mb-12 bg-jade-dark border border-jade-mid rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-jade-accent/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-jade-accent/10 transition-colors" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="max-w-md">
                    <h3 className="text-lg font-bold text-text-main flex items-center gap-2 mb-2">
                      <Search className="w-5 h-5 text-jade-accent" /> Lacak Pesanan Kamu
                    </h3>
                    <p className="text-xs text-text-dim">Kehilangan riwayat pesanan? Masukkan nomor WhatsApp atau Order ID kamu untuk mencari transaksi terakhir.</p>
                  </div>
                  <div className="flex-grow max-w-lg flex flex-col sm:flex-row gap-3">
                    <input 
                      type="text" 
                      placeholder="Order ID / No. WhatsApp" 
                      className="flex-grow bg-jade-bg border border-jade-mid rounded-xl px-4 py-3.5 text-sm font-bold text-text-main focus:outline-none focus:border-jade-glow transition-all placeholder:text-text-dim/30"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = (e.target as HTMLInputElement).value;
                          if (!val) return;
                          const found = allOrders.filter(o => 
                            o.id.toLowerCase().includes(val.toLowerCase()) || 
                            o.whatsapp?.includes(val) ||
                            (o.name && o.name.toLowerCase().includes(val.toLowerCase()))
                          );
                          if (found.length > 0) {
                            // Merge found items that aren't already in userOrders
                            const newItems = found.filter(f => !userOrders.find(u => u.id === f.id));
                            if (newItems.length > 0) {
                              const updated = [...newItems, ...userOrders];
                              setUserOrders(updated);
                              if (!currentUser) {
                                localStorage.setItem('giokup_orders', JSON.stringify(updated));
                              }
                              alert(`Berhasil menemukan ${newItems.length} pesanan baru!`);
                            } else {
                              alert('Pesanan sudah ada di riwayat Anda.');
                            }
                          } else {
                            alert('Pesanan tidak ditemukan. Mohon cek kembali data Anda.');
                          }
                        }
                      }}
                    />
                    <button className="bg-jade-accent text-jade-bg px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-jade-glow transition-all shadow-lg shadow-jade-accent/20">
                      Cari Pesanan
                    </button>
                  </div>
                </div>
              </div>

              {userOrders.length === 0 ? (
                <div className="bg-jade-dark border border-jade-mid rounded-3xl p-20 text-center">
                  <div className="w-20 h-20 bg-jade-mid/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="w-10 h-10 text-text-dim" />
                  </div>
                  <h3 className="text-xl font-bold text-text-main mb-2">Belum ada transaksi</h3>
                  <p className="text-text-dim mb-8">Anda belum pernah melakukan pembelian. Mulai belanja sekarang!</p>
                  <button 
                    onClick={handleBackToHome}
                    className="bg-jade-accent text-jade-bg px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all cursor-pointer"
                  >
                    Lihat Katalog Game
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {userOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-jade-dark border border-jade-mid rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-jade-accent transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-jade-mid/10 rounded-xl flex items-center justify-center text-jade-accent group-hover:bg-jade-accent group-hover:text-jade-bg transition-all">
                          <Zap className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-jade-accent uppercase tracking-widest">{order.id}</p>
                          <h4 className="text-lg font-bold text-text-main leading-tight">{order.gameName}</h4>
                          <p className="text-xs text-text-dim font-medium">{order.productName}</p>
                        </div>
                      </div>
                      <div className="flex flex-col md:items-end gap-1">
                        <span className="text-xl font-black text-jade-glow">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.amount)}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-text-dim font-bold">{order.date}</span>
                          <span className="w-1 h-1 bg-jade-mid rounded-full" />
                          <div className="flex items-center gap-1.5 bg-jade-mid/20 px-2 py-0.5 rounded border border-jade-mid/30">
                            {order.paymentLogo && <img src={order.paymentLogo} className="h-3 w-auto object-contain bg-white rounded-[2px] px-0.5" referrerPolicy="no-referrer" />}
                            <span className="text-[10px] font-black text-jade-accent uppercase tracking-tighter">{order.paymentMethod}</span>
                          </div>
                        </div>
                      </div>
                      <div className="md:border-l md:border-jade-mid md:pl-6 flex flex-col gap-2">
                        <span className="inline-block px-3 py-1 bg-jade-accent/10 text-jade-accent text-[10px] font-black uppercase rounded-full border border-jade-accent/20 text-center">
                          {order.status}
                        </span>
                        <button 
                          onClick={() => {
                            const summary = {
                              totalAmount: order.amount,
                              paymentMethod: order.paymentMethod,
                              paymentLogo: order.paymentLogo,
                              orders: [{
                                id: order.id,
                                gameName: order.gameName,
                                productName: order.productName,
                                amount: order.amount
                              }]
                            };
                            setLastPurchaseSummary(summary);
                            setIsSuccess(true);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-4 py-2 bg-jade-accent/5 hover:bg-jade-accent text-jade-glow hover:text-jade-bg border border-jade-accent/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                        >
                          <FileText className="w-3 h-3" /> Receipt
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : view === 'rewards' ? (
            <motion.div
              key="rewards-page"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto px-4 py-12"
            >
              {(!isLoggedIn || !currentUser) ? (
                <div className="bg-jade-dark border border-jade-mid rounded-3xl p-16 text-center">
                  <div className="w-20 h-20 bg-jade-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 text-jade-accent">
                    <User className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-text-main mb-2 tracking-tight">Login Diperlukan</h3>
                  <p className="text-text-dim mb-8 max-w-sm mx-auto">Hanya pengguna terdaftar yang dapat melihat dan mengklaim reward harian. Silakan login terlebih dahulu.</p>
                  <button 
                    onClick={() => setView('login')}
                    className="bg-jade-accent text-jade-bg px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all cursor-pointer shadow-lg shadow-jade-accent/20"
                  >
                    Login Sekarang
                  </button>
                </div>
              ) : currentUser && (currentUser.role as string) === 'admin' ? (
                <div className="bg-jade-dark border border-jade-mid rounded-3xl p-16 text-center">
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                    <AlertCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-text-main mb-2 tracking-tight">Akses Terbatas</h3>
                  <p className="text-text-dim mb-8 max-w-sm mx-auto">Admin tidak diperbolehkan mengakses fitur Reward atau melakukan transaksi.</p>
                  <button 
                    onClick={() => setView('admin')}
                    className="bg-jade-mid text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all cursor-pointer border border-jade-mid"
                  >
                    Kembali ke Admin Panel
                  </button>
                </div>
              ) : (
                <WeeklyRewards 
                  currentUser={{ username: currentUser.username }} 
                  onBack={handleBackToHome}
                  onNavigateToShop={handleBackToHome}
                />
              )}
            </motion.div>
          ) : view === 'games' ? (
            <motion.div
              key="all-games-page"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-4 py-12"
            >
              <div className="flex items-center justify-between mb-8 sm:mb-12">
                <div>
                  <button 
                    onClick={handleBackToHome}
                    className="mb-6 flex items-center gap-2 text-text-dim hover:text-jade-glow transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-jade-dark border border-jade-mid flex items-center justify-center group-hover:border-jade-accent transition-all">
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[2px]">Kembali</span>
                  </button>
                  <h2 className="text-3xl sm:text-4xl font-black text-text-main font-sans uppercase tracking-tighter">Semua Game</h2>
                  <p className="text-jade-accent font-bold mt-1 text-xs sm:text-sm">Jelajahi seluruh koleksi game di GiokUp</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8 font-sans">
                {GAMES.map((game, idx) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx % 6) * 0.05 }}
                    whileHover={{ y: -10 }}
                    className="group relative cursor-pointer"
                    onClick={() => handleGameClick(game)}
                  >
                    <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl mb-4 border border-jade-mid group-hover:border-jade-glow transition-all ring-offset-4 ring-offset-jade-bg group-hover:ring-2 ring-jade-glow/30 bg-jade-dark/50 p-1">
                      <img 
                        src={game.image} 
                        alt={game.name} 
                        className="w-full h-full object-cover rounded-[1.4rem] transform scale-100 group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-jade-dark/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-3xl">
                        <span className="text-jade-glow text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                          Top Up <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                    <h3 className="font-black text-text-main text-sm leading-tight text-center group-hover:text-jade-glow transition-colors">{game.name}</h3>
                    <p className="text-jade-accent text-[10px] font-black text-center uppercase tracking-widest mt-1">{game.developer}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : view === 'user' ? (
            <motion.div
              key={isSuccess ? 'success' : selectedGame ? 'game-detail' : 'home'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              {isSuccess ? (
                <div className="max-w-xl mx-auto px-4 py-12 text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -15, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                    className="w-20 h-20 bg-jade-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_15px_40px_rgba(62,168,145,0.4)] transform rotate-3"
                  >
                    <Check className="w-12 h-12 text-jade-bg" strokeWidth={3} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-2xl md:text-3xl font-black text-text-main mb-1 font-sans uppercase tracking-tighter">Pembayaran Berhasil!</h2>
                  </motion.div>
                  
                  <motion.div 
                    ref={receiptRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, type: 'spring', damping: 15 }}
                    className="bg-white text-jade-bg rounded-t-3xl overflow-hidden shadow-2xl relative max-w-full sm:max-w-md mx-auto"
                  >
                    {/* Professional Receipt Header */}
                    <div className="bg-jade-accent py-4 px-8 flex justify-between items-center">
                       <div className="text-left">
                          <p className="text-[10px] font-black uppercase tracking-widest text-jade-bg/70">Official Receipt</p>
                          <h4 className="text-sm font-black uppercase font-sans">GIOKUP DIGITAL</h4>
                       </div>
                       <div className="w-10 h-10 bg-jade-bg/10 rounded-lg flex items-center justify-center">
                          <img src={APP_LOGO_URL} alt="Logo" className="w-7 h-7" referrerPolicy="no-referrer" />
                       </div>
                    </div>
                    
                    <div className="p-8 space-y-6 text-left relative">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-[10px] text-jade-bg/60 font-mono italic">Trans ID: <span className="font-bold text-jade-bg uppercase font-sans not-italic">#{lastPurchaseSummary?.orderId || 'GUEST-'+Math.random().toString(36).substr(2, 6).toUpperCase()}</span></p>
                          <p className="text-[10px] text-jade-bg/60 font-mono">{new Date().toLocaleString('id-ID')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-jade-accent uppercase tracking-tighter">Pembayaran Via</p>
                          <span className="text-xs font-black text-jade-bg uppercase">{lastPurchaseSummary?.paymentMethod || 'QRIS'}</span>
                        </div>
                      </div>

                      {/* Info User Guest */}
                      <div className="bg-jade-bg/5 p-4 rounded-xl border border-jade-bg/10">
                         <p className="text-[9px] font-black text-jade-bg/40 uppercase tracking-widest mb-2">Tujuan Pengiriman</p>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <p className="text-[9px] font-bold text-jade-bg/60 uppercase">User ID/Target</p>
                               <p className="text-xs font-black text-jade-bg">{userId || '-'}</p>
                            </div>
                            <div>
                               <p className="text-[9px] font-bold text-jade-bg/60 uppercase">No. WhatsApp</p>
                               <p className="text-xs font-black text-jade-bg">{whatsapp || '-'}</p>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                           <span className="text-[9px] font-black text-jade-bg/40 uppercase tracking-[0.2em]">Detail Produk</span>
                           {lastPurchaseSummary?.orders.map((order: any) => (
                             <div key={order.id} className="flex justify-between items-center border-b border-jade-bg/5 py-2">
                               <div>
                                 <p className="text-[10px] font-black text-jade-accent mb-0.5">{order.gameName}</p>
                                 <p className="text-sm font-black text-jade-bg leading-tight">{order.productName}</p>
                               </div>
                               <div className="text-right">
                                 <span className="text-sm font-black text-jade-bg">
                                   {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.amount)}
                                 </span>
                               </div>
                             </div>
                           ))}
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[11px] font-bold text-jade-bg/60">
                             <span>Biaya Admin</span>
                             <span>Rp. 0</span>
                          </div>
                          {appliedPromo && (
                            <div className="flex justify-between items-center text-[11px] font-bold text-jade-accent">
                              <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Diskon Promo</span>
                              <span>
                                - {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
                                  lastPurchaseSummary?.orders.reduce((sum: number, o: any) => sum + (o.promoDetails?.discount || 0), 0) || 0
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-jade-bg p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center sm:items-end text-white gap-2">
                        <div className="text-center sm:text-left">
                          <p className="text-[10px] font-black text-jade-glow uppercase tracking-[0.3em] mb-1">TOTAL BAYAR</p>
                          <p className="text-[10px] text-white/60 font-bold italic">Lunas - Terbayar</p>
                        </div>
                        <div className="text-center sm:text-right">
                          <span className="text-2xl sm:text-3xl font-black text-jade-glow">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(lastPurchaseSummary?.totalAmount || 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Receipt Serrated Edge Bottom */}
                    <div className="flex justify-between px-2 h-4 w-full overflow-hidden">
                       {Array.from({length: 15}).map((_, i) => (
                         <div key={i} className="w-6 h-6 bg-jade-bg rounded-full -mt-3 shadow-inner" />
                       ))}
                    </div>
                  </motion.div>

                  <div className="mt-8 bg-jade-accent/5 border border-jade-accent/10 p-5 rounded-2xl mb-8 text-left flex items-start gap-4">
                    <div className="w-10 h-10 bg-jade-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                       <Zap className="w-5 h-5 text-jade-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-jade-glow uppercase tracking-widest mb-1">Informasi Pengiriman</p>
                      <p className="text-[10px] text-text-dim leading-relaxed font-bold">
                        Top-up sedang dalam antrian sistem. Estimasi masuk: <span className="text-white">1 - 3 Menit</span>. 
                        Silakan cek akun game Anda secara berkala.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={handleBackToHome}
                      className="flex-1 bg-jade-accent text-jade-bg px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-jade-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                    >
                      Selesai <Check className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleSaveReceipt}
                      disabled={isGeneratingPDF || !lastPurchaseSummary}
                      className={`flex-1 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest border border-jade-mid transition-all flex items-center justify-center gap-2 ${
                        isGeneratingPDF 
                        ? 'bg-jade-mid/50 text-text-dim cursor-not-allowed' 
                        : 'bg-jade-dark text-text-main hover:border-jade-accent'
                      }`}
                    >
                      {isGeneratingPDF ? (
                        <>Sedang membuat PDF...</>
                      ) : (
                        <>
                          <FileText className="w-4 h-4" /> Simpan Struk
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : searchQuery ? (
                <div className="max-w-7xl mx-auto px-4 py-20 min-h-[60vh]">
                  <div className="mb-12 flex items-center justify-between">
                    <div>
                      <h2 className="text-4xl font-black text-text-main font-serif italic uppercase tracking-tight">Hasil Pencarian</h2>
                      <p className="text-jade-accent font-bold mt-1">Ditemukan {filteredGames.length} game untuk "{searchQuery}"</p>
                    </div>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-xs font-black text-text-dim hover:text-jade-glow border-b border-jade-mid pb-1 transition-colors uppercase tracking-widest"
                    >
                      Hapus Pencarian
                    </button>
                  </div>

                  {filteredGames.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 font-sans">
                      {filteredGames.map((game, idx) => (
                        <motion.div
                          key={game.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ y: -10 }}
                          className="group relative cursor-pointer"
                          onClick={() => handleGameClick(game)}
                        >
                          <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl mb-4 border border-jade-mid group-hover:border-jade-glow transition-all ring-offset-4 ring-offset-jade-bg group-hover:ring-2 ring-jade-glow/30 bg-jade-dark/50">
                            <img 
                              src={game.image} 
                              alt={game.name} 
                              className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-jade-dark/80 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity"></div>
                          </div>
                          <h3 className="font-black text-text-main text-sm leading-tight text-center group-hover:text-jade-glow transition-colors">{game.name}</h3>
                          <p className="text-jade-accent text-[10px] font-black text-center uppercase tracking-widest mt-1">{game.developer}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center bg-jade-dark/50 border border-jade-mid border-dashed rounded-[3rem]">
                      <Search className="w-16 h-16 text-jade-mid/30 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-text-dim mb-2 uppercase tracking-widest">Tidak Ada Hasil</h3>
                      <p className="text-text-dim/60">Maaf, kami tidak dapat menemukan game yang Anda cari.</p>
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="mt-8 px-8 py-3 bg-jade-mid/20 text-jade-accent rounded-xl font-black text-xs uppercase tracking-widest hover:bg-jade-mid/40 transition-all"
                      >
                        Lihat Semua Game
                      </button>
                    </div>
                  )}
                </div>
              ) : !selectedGame ? (
                <>
                  {/* Hero Section - Featured Games */}
                  <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center overflow-hidden bg-jade-bg pt-20 md:pt-24 pb-12">
                    <div className="absolute inset-0 z-0">
                      <img 
                        src={featuredGame.image} 
                        className="w-full h-full object-cover opacity-10 md:opacity-20 blur-xl scale-110" 
                        alt="bg"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-jade-bg/50 to-jade-bg"></div>
                    </div>
                    
                    <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
                      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 text-center lg:text-left">
                        <motion.div 
                          key={`featured-${featuredGame.id}`}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: 20, opacity: 0 }}
                          className="lg:w-1/2 space-y-4 md:space-y-6"
                        >
                          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 md:gap-4">
                            <span className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-jade-accent text-jade-bg text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-jade-accent/20 flex items-center gap-2">
                              <Sparkles className="w-3 h-3" /> Recommended
                            </span>
                            {GAME_PRODUCTS[featuredGame.id]?.some(p => p.promoPrice) && (
                              <span className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-amber-500 text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-2">
                                <Flame className="w-3 h-3" /> Promo Today
                              </span>
                            )}
                          </div>
                          
                          <div className="min-h-[100px] md:min-h-[180px]">
                            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-text-main leading-[0.9] tracking-tighter">
                              {featuredGame.name.split(' ').map((word, i) => (
                                <React.Fragment key={i}>
                                  {word === 'Legends' || word === 'Impact' || word === 'Mobile' || word === 'Valorant' ? <span className="text-jade-glow">{word}</span> : word}{' '}
                                </React.Fragment>
                              ))}
                            </h1>
                          </div>
                          
                          <div className="flex items-center justify-center lg:justify-start gap-4 md:gap-6">
                            <div className="space-y-0.5">
                              <p className="text-[9px] md:text-[10px] text-text-dim font-black uppercase tracking-widest">Publisher</p>
                              <p className="text-base md:text-lg font-serif italic text-text-main">{featuredGame.developer}</p>
                            </div>
                            <div className="h-8 md:h-10 w-px bg-jade-mid/50"></div>
                            <div className="space-y-0.5">
                              <p className="text-[9px] md:text-[10px] text-text-dim font-black uppercase tracking-widest">Starting from</p>
                              <p className="text-base md:text-lg font-black text-jade-accent">Rp 15.000</p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button 
                              onClick={() => handleGameClick(featuredGame)}
                              className="px-8 py-5 bg-jade-accent hover:bg-jade-glow text-jade-bg rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-jade-accent/20 flex items-center justify-center gap-3 group"
                            >
                              Top Up Now <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </button>
                          </div>
                        </motion.div>

                        <motion.div 
                          key={`featured-img-${featuredGame.id}`}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 1.1, opacity: 0 }}
                          transition={{ delay: 0.2 }}
                          className="lg:w-1/2 relative"
                        >
                          <div className="relative aspect-[4/5] w-full max-w-sm mx-auto group">
                            <div className="absolute -inset-4 bg-jade-accent/20 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative rounded-[2rem] overflow-hidden border-4 border-jade-mid shadow-[0_0_50px_rgba(62,168,145,0.3)]">
                              <img 
                                src={featuredGame.image} 
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                                alt={featuredGame.name}
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          {/* Floating Card Detail */}
                          <div className="absolute -bottom-6 -right-6 bg-jade-dark/90 backdrop-blur-xl border border-jade-mid p-6 rounded-3xl shadow-2xl hidden lg:block">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-jade-accent flex items-center justify-center text-jade-bg">
                                <Zap className="w-6 h-6 fill-current" />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-jade-accent uppercase tracking-widest">Instant Delivery</p>
                                <p className="text-sm font-bold text-text-main">Automatic process in 2s</p>
                              </div>
                            </div>
                          </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </section>

                  {/* List Receipts Banner for Guest/User */}
                  {!isSuccess && userOrders.length > 0 && (
                    <section className="mt-8">
                       <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => { setView('history'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="bg-jade-accent/10 border border-jade-accent/30 p-4 rounded-2xl flex items-center justify-between cursor-pointer group hover:bg-jade-accent/20 transition-all shadow-lg"
                       >
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-jade-accent/20 rounded-xl flex items-center justify-center text-jade-accent">
                             <History className="w-5 h-5" />
                           </div>
                           <div>
                             <p className="text-jade-glow text-xs font-black uppercase tracking-widest">Lihat Riwayat Struk Transaksi</p>
                             <p className="text-text-dim text-[10px] font-bold">Akses semua struk pembelian Anda yang tersimpan di perangkat ini.</p>
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black text-jade-accent uppercase hidden sm:inline">Buka Riwayat</span>
                           <ChevronRight className="w-5 h-5 text-jade-accent group-hover:translate-x-1 transition-transform" />
                         </div>
                       </motion.div>
                    </section>
                  )}

                  {/* Featured Reward Banner if exists */}
                  {isLoggedIn && rewards.some(r => r.status === 'Available' || r.status === 'Claimed') && (
                    <section className="mt-8">
                       <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => setView('rewards')}
                        className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 p-4 rounded-2xl flex items-center justify-between cursor-pointer group hover:scale-[1.01] transition-all shadow-xl shadow-amber-500/20"
                       >
                         <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                             <Sparkles className="w-7 h-7" />
                           </div>
                           <div>
                             <p className="text-white text-xs font-black uppercase tracking-widest">Klaim Reward Kamu!</p>
                             <p className="text-white/80 text-[10px] font-bold">Kamu punya reward diskon yang akan segera hangus.</p>
                           </div>
                         </div>
                         <div className="flex items-center gap-4">
                           <CountdownTimer expiryDate={rewards.find(r => r.status === 'Available' || r.status === 'Claimed')!.expires_at} />
                           <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                         </div>
                       </motion.div>
                    </section>
                  )}

                  {/* Popular Games Section - Horizontal Scroll */}
                  <section className="py-16 bg-jade-bg overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4">
                      <div className="flex items-end justify-between mb-8">
                        <div>
                          <span className="text-jade-accent text-[10px] font-black uppercase tracking-[0.3em] block mb-2">Editor's Choice</span>
                          <h2 className="text-3xl font-black text-text-main font-sans uppercase">Popular Games</h2>
                        </div>
                        <button 
                          onClick={() => setView('games')}
                          className="text-xs font-black text-jade-accent hover:text-jade-glow uppercase tracking-widest flex items-center gap-2 group transition-colors"
                        >
                          See All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>

                      <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide px-2 -mx-2">
                        {popularGames.map((game, idx) => (
                          <motion.div
                            key={game.id}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            onClick={() => handleGameClick(game)}
                            className="flex-shrink-0 w-48 group cursor-pointer"
                          >
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-jade-mid group-hover:border-jade-glow shadow-xl transition-all relative">
                              <img 
                                src={game.image} 
                                className="w-full h-full object-cover" 
                                alt={game.name}
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-jade-dark/80 to-transparent flex items-end p-4">
                                <span className="bg-jade-accent/20 backdrop-blur-md text-jade-glow text-[8px] font-black px-2 py-1 rounded uppercase border border-jade-glow/20">
                                  Popular
                                </span>
                              </div>
                            </div>
                            <h3 className="mt-4 font-bold text-text-main text-sm truncate group-hover:text-jade-glow transition-colors">{game.name}</h3>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Promo Hari Ini Section - High Impact */}
                  <section className="py-20 bg-jade-dark relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-jade-glow/5 blur-[120px] rounded-full pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto px-4 relative z-10">
                      <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-jade-glow/10 rounded-2xl border border-jade-glow/20">
                          <Flame className="w-6 h-6 text-jade-glow animate-pulse" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-black text-text-main font-sans uppercase tracking-wider">Promo Hari Ini</h2>
                          <p className="text-text-dim text-xs">Don't miss out on these exclusive limited deals!</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-8">
                        {promoGames.map((game, idx) => (
                          <motion.div
                            key={game.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="relative group h-full"
                          >
                            <div className="bg-jade-bg border-2 border-jade-glow/30 rounded-3xl overflow-hidden flex flex-col h-full shadow-2xl shadow-jade-glow/5 hover:border-jade-glow transition-all">
                              <div className="h-48 relative overflow-hidden">
                                <img 
                                  src={game.image} 
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                  alt={game.name}
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute top-4 right-4 bg-jade-accent text-jade-bg font-black text-xs px-3 py-1.5 rounded-xl shadow-lg ring-4 ring-jade-accent/20">
                                  DISC 20%
                                </div>
                              </div>
                              <div className="p-6 flex-grow flex flex-col justify-between">
                                <div>
                                  <h3 className="text-xl font-black text-text-main mb-2 truncate">{game.name}</h3>
                                  <div className="flex items-center gap-3 mb-6">
                                    <span className="text-lg font-black text-jade-accent">Rp 38.000</span>
                                    <span className="text-xs text-text-dim line-through">Rp 48.000</span>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => handleGameClick(game)}
                                  className="w-full py-4 bg-jade-accent hover:bg-jade-glow text-jade-bg rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-jade-accent/20 transition-all flex items-center justify-center gap-2"
                                >
                                  Top Up <Zap className="w-4 h-4 fill-current" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Trending Section - Varied Layout */}
                  <section className="py-24 bg-jade-bg">
                    <div className="max-w-7xl mx-auto px-4">
                      <div className="text-center mb-16">
                        <span className="text-jade-glow text-[10px] font-black uppercase tracking-[0.5em] block mb-4">Hot Buzz</span>
                        <h2 className="text-4xl md:text-6xl font-black text-text-main font-sans uppercase tracking-tighter">Trending Now</h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {trendingGames.map((game, idx) => (
                          <motion.div
                            key={game.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => handleGameClick(game)}
                            className={`group relative cursor-pointer overflow-hidden rounded-3xl border border-jade-mid hover:border-jade-glow transition-all ${
                              idx === 0 ? 'sm:col-span-2 sm:row-span-2 aspect-square sm:aspect-auto h-full' : 'aspect-[4/3] sm:aspect-auto sm:h-64'
                            }`}
                          >
                            <img 
                              src={game.image} 
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" 
                              alt={game.name}
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-jade-bg via-transparent to-transparent opacity-90"></div>
                            
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                              <div className="flex items-center gap-2 mb-3">
                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                  idx === 0 ? 'bg-jade-glow text-jade-bg' : 'bg-jade-accent/20 text-jade-glow border border-jade-glow/20'
                                }`}>
                                  {idx === 0 ? 'Best Seller' : idx % 2 === 0 ? 'Trending' : 'Hot'}
                                </span>
                                <span className="text-[10px] font-bold text-text-dim">Instan</span>
                              </div>
                              <h3 className={`${idx === 0 ? 'text-3xl' : 'text-xl'} font-black text-text-main mb-2 tracking-tight group-hover:text-jade-glow transition-colors`}>
                                {game.name}
                              </h3>
                              <p className="text-jade-accent font-black text-sm">Starts from Rp 10.000</p>
                              
                              <div className="mt-4 transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <button className="w-full py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                                  Select Item
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Standard Catalog Grid - The "Everything Else" section */}
                  <section className="max-w-7xl mx-auto px-4 relative z-20 mb-20">
                    <div className="bg-jade-dark rounded-3xl shadow-2xl p-8 border border-jade-mid">
                      <div className="flex flex-col gap-8 mb-12">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                          <div className="flex items-center gap-4">
                            <div className="w-2 h-8 bg-jade-accent rounded-full shadow-[0_0_15px_rgba(118,225,201,0.5)]"></div>
                            <h2 className="text-2xl md:text-3xl font-black text-text-main font-sans uppercase tracking-tighter">Katalog Game</h2>
                          </div>
                          
                          {/* Category Filters */}
                          <div className="flex gap-2 p-1.5 bg-jade-bg rounded-2xl border border-jade-mid overflow-x-auto scrollbar-hide w-full lg:w-auto">
                            {['All', 'Mobile', 'PC', 'Console', 'Voucher'].map((cat) => (
                              <button
                                key={cat}
                                onClick={() => setCategory(cat as any)}
                                className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all whitespace-nowrap flex-shrink-0 ${
                                  category === cat 
                                    ? 'bg-jade-accent text-jade-bg shadow-lg shadow-jade-accent/20' 
                                    : 'text-text-dim hover:text-white hover:bg-jade-mid/30'
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Status/Status Filters - New Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 bg-jade-bg/30 p-4 rounded-3xl border border-jade-mid/50">
                          <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.3em] flex items-center gap-2">
                            <Search className="w-3 h-3 text-jade-accent" /> Filter Spesial:
                          </span>
                          <div className="flex flex-wrap gap-3">
                            {[
                              { id: 'All', label: 'Default', icon: Gamepad2 },
                              { id: 'Popular', label: 'Popularitas', icon: Sparkles },
                              { id: 'Latest', label: 'Terbaru', icon: Plus },
                              { id: 'OnSale', label: 'Sedang Promo', icon: Flame },
                            ].map((filter) => (
                              <button
                                key={filter.id}
                                onClick={() => setFilterType(filter.id as any)}
                                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl font-bold text-[11px] transition-all border-2 ${
                                  filterType === filter.id 
                                    ? 'bg-jade-accent border-jade-accent text-jade-bg shadow-lg shadow-jade-accent/20' 
                                    : 'bg-jade-dark border-jade-mid text-text-dim hover:border-jade-glow hover:text-white'
                                }`}
                              >
                                <filter.icon className={`w-3.5 h-3.5 ${filterType === filter.id ? 'text-jade-bg' : 'text-jade-accent'}`} />
                                {filter.label}
                                {filter.id === 'OnSale' && (
                                  <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                          
                          {/* Search count/indicator */}
                          <div className="sm:ml-auto">
                            <p className="text-[10px] font-bold text-text-dim">
                              Menampilkan <span className="text-jade-accent">{filteredGames.length}</span> Game
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Games Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 font-sans">
                        {filteredGames.map((game, idx) => {
                          const hasPromo = GAME_PRODUCTS[game.id]?.some(p => p.promoPrice);
                          return (
                            <motion.div
                              key={game.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              whileHover={{ y: -8 }}
                              className="group relative cursor-pointer"
                              onClick={() => handleGameClick(game)}
                            >
                              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-md mb-3 border border-jade-mid group-hover:border-jade-glow transition-all relative">
                                <img 
                                  src={game.image} 
                                  alt={game.name} 
                                  className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                                  referrerPolicy="no-referrer"
                                />
                                
                                {/* Badges */}
                                <div className="absolute inset-0 p-2 flex flex-col justify-between pointer-events-none">
                                  <div className="flex flex-col gap-1.5 items-start">
                                    {game.popular && (
                                      <div className="px-2 py-0.5 bg-jade-accent text-jade-bg text-[9px] font-black uppercase rounded-md shadow-lg flex items-center gap-1 backdrop-blur-sm bg-opacity-90">
                                        <Sparkles className="w-2.5 h-2.5" /> Popular
                                      </div>
                                    )}
                                    {game.latest && (
                                      <div className="px-2 py-0.5 bg-sky-500 text-white text-[9px] font-black uppercase rounded-md shadow-lg flex items-center gap-1 backdrop-blur-sm bg-opacity-90">
                                        <Plus className="w-2.5 h-2.5" /> Baru
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex justify-start">
                                    {hasPromo && (
                                      <div className="px-2 py-0.5 bg-rose-500 text-white text-[9px] font-black uppercase rounded-md shadow-lg flex items-center gap-1 animate-pulse backdrop-blur-sm bg-opacity-90">
                                        <Flame className="w-2.5 h-2.5" /> Promo
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-jade-bg/95 to-transparent h-1/2 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="text-jade-glow text-xs font-black flex items-center gap-1 uppercase tracking-widest">
                                    Top Up <ArrowRight className="w-3 h-3" />
                                  </span>
                                </div>
                              </div>
                              <h3 className="font-bold text-text-main text-sm leading-tight text-center transition-colors group-hover:text-jade-glow">{game.name}</h3>
                              <p className="text-text-dim/60 text-[9px] font-black text-center uppercase tracking-widest mt-1">{game.developer}</p>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                </>
              ) : (
                <div className="max-w-7xl mx-auto px-4 py-8">
                  {/* Back Button */}
                  <motion.button 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={handleBackToHome}
                    className="mb-8 flex items-center gap-2 text-text-dim hover:text-jade-glow transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-jade-dark border border-jade-mid flex items-center justify-center group-hover:border-jade-accent transition-all">
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[2px]">Kembali ke Beranda</span>
                  </motion.button>

                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Game Header Mobile */}
                    <div className="lg:hidden flex items-center gap-4 mb-8">
                      <img src={selectedGame.image} alt={selectedGame.name} className="w-24 h-32 rounded-2xl object-cover shadow-lg" referrerPolicy="no-referrer" />
                      <div>
                        <h2 className="text-2xl font-black text-jade-950">{selectedGame.name}</h2>
                        <p className="text-jade-500 font-bold uppercase text-xs tracking-widest">{selectedGame.developer}</p>
                      </div>
                    </div>

                    {/* Sidebar / Info */}
                    <aside className="lg:w-1/3 space-y-6">
                      <div className="hidden lg:block bg-jade-dark rounded-3xl p-8 shadow-sm border border-jade-mid text-center sticky top-24">
                        <img src={selectedGame.image} alt={selectedGame.name} className="w-48 h-64 rounded-2xl object-cover mx-auto mb-6 shadow-2xl opacity-90" referrerPolicy="no-referrer" />
                        <h2 className="text-3xl font-black text-text-main mb-2 font-serif italic">{selectedGame.name}</h2>
                        <p className="text-jade-accent font-bold uppercase text-xs tracking-widest mb-6">{selectedGame.developer}</p>
                        <div className="text-left space-y-4 text-sm text-text-dim font-medium leading-relaxed">
                          <p className="border-l-2 border-jade-accent pl-3">1. Masukkan User ID & Zone ID Anda.</p>
                          <p className="border-l-2 border-jade-accent pl-3">2. Pilih nominal item yang ingin di top up.</p>
                          <p className="border-l-2 border-jade-accent pl-3">3. Pilih metode pembayaran.</p>
                          <p className="border-l-2 border-jade-accent pl-3">4. Masukkan nomor WhatsApp untuk notifikasi.</p>
                          <p className="border-l-2 border-jade-accent pl-3">5. Klik Beli Sekarang dan selesaikan pembayaran.</p>
                        </div>
                      </div>
                    </aside>

                    {/* Main Selection Area */}
                    <div className="lg:w-2/3 space-y-8">
                      {/* Step 1: Account Info */}
                      <div className="bg-jade-dark rounded-3xl p-8 shadow-sm border border-jade-mid">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-10 h-10 bg-jade-accent text-jade-bg rounded-lg flex items-center justify-center font-black">1</div>
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-jade-mid shadow-md bg-jade-bg">
                            <img src={selectedGame.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <h3 className="text-xl font-bold text-text-main tracking-tight">Masukkan Akun</h3>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-black text-text-dim uppercase tracking-widest flex items-center gap-2">
                              <img src={selectedGame.image} className="w-4 h-4 rounded-full object-cover border border-jade-mid" referrerPolicy="no-referrer" />
                              {selectedGame.id === 'valorant' ? 'Riot ID' : 'User ID'}
                            </label>
                            <input 
                              type="text" 
                              placeholder={selectedGame.id === 'valorant' ? 'username#tagline' : 'Masukkan User ID'} 
                              className={`w-full px-4 py-4 rounded-xl bg-jade-bg border text-text-main focus:outline-none focus:ring-1 focus:ring-jade-glow focus:border-jade-glow transition-all font-bold placeholder:text-text-dim/30 ${
                                inputErrors.userId ? 'border-red-500' : 'border-jade-mid'
                              }`}
                              value={userId}
                              onChange={(e) => {
                                setUserId(e.target.value);
                                if (inputErrors.userId) setInputErrors(prev => ({...prev, userId: undefined}));
                              }}
                            />
                            {inputErrors.userId && (
                              <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {inputErrors.userId}
                              </p>
                            )}
                            {selectedGame.id === 'valorant' && !inputErrors.userId && (
                              <p className="text-[10px] text-jade-accent/60 font-medium">*Contoh: GiokUp#ID1</p>
                            )}
                          </div>
                          {selectedGame.id !== 'valorant' && selectedGame.id !== 'codm' && selectedGame.id !== 'genshin' && selectedGame.id !== 'zenless' && selectedGame.id !== 'pubgm' && (
                            <div className="space-y-2">
                              <label className="text-xs font-black text-text-dim uppercase tracking-widest">Zone ID</label>
                              <input 
                                type="text" 
                                placeholder="(Zone ID)" 
                                className={`w-full px-4 py-4 rounded-xl bg-jade-bg border text-text-main focus:outline-none focus:ring-1 focus:ring-jade-glow focus:border-jade-glow transition-all font-bold placeholder:text-text-dim/30 ${
                                  inputErrors.zoneId ? 'border-red-500' : 'border-jade-mid'
                                }`}
                                value={zoneId}
                                onChange={(e) => {
                                  setZoneId(e.target.value);
                                  if (inputErrors.zoneId) setInputErrors(prev => ({...prev, zoneId: undefined}));
                                }}
                              />
                              {inputErrors.zoneId && (
                                <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" /> {inputErrors.zoneId}
                                </p>
                              )}
                            </div>
                          )}
                          {(selectedGame.id === 'genshin' || selectedGame.id === 'zenless') && (
                            <div className="space-y-2">
                              <label className="text-xs font-black text-text-dim uppercase tracking-widest">Server</label>
                              <select 
                                className="w-full px-4 py-4 rounded-xl bg-jade-bg border border-jade-mid text-text-main focus:outline-none focus:ring-1 focus:ring-jade-glow focus:border-jade-glow transition-all font-bold"
                                value={zoneId}
                                onChange={(e) => setZoneId(e.target.value)}
                              >
                                <option value="">Pilih Server</option>
                                <option>Asia</option>
                                <option>America</option>
                                <option>Europe</option>
                                <option>TW/HK/MO</option>
                              </select>
                            </div>
                          )}
                          <div className="space-y-2 sm:col-span-2">
                            <label className="text-xs font-black text-text-dim uppercase tracking-widest">Nomor WhatsApp (Untuk Notifikasi)</label>
                            <input 
                              type="text" 
                              placeholder="Contoh: 08123456789" 
                              className={`w-full px-4 py-4 rounded-xl bg-jade-bg border text-text-main focus:outline-none focus:ring-1 focus:ring-jade-glow focus:border-jade-glow transition-all font-bold placeholder:text-text-dim/30 ${
                                inputErrors.whatsapp ? 'border-red-500' : 'border-jade-mid'
                              }`}
                              value={whatsapp}
                              onChange={(e) => {
                                setWhatsapp(e.target.value);
                                if (inputErrors.whatsapp) setInputErrors(prev => ({...prev, whatsapp: undefined}));
                              }}
                            />
                            {inputErrors.whatsapp ? (
                              <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {inputErrors.whatsapp}
                              </p>
                            ) : (
                              <p className="text-[10px] text-jade-accent/60 font-medium">*Bukti pembayaran akan dikirim ke nomor ini.</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Step 2: Product Item */}
                      <div className="bg-jade-dark rounded-3xl p-8 shadow-sm border border-jade-mid">
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-10 h-10 bg-jade-accent text-jade-bg rounded-lg flex items-center justify-center font-black">2</div>
                          <h3 className="text-xl font-bold text-text-main tracking-tight">Pilih Nominal</h3>
                        </div>

                        {/* Best Sellers Section */}
                        {((GAME_PRODUCTS[selectedGame.id] || []).some(p => p.isBestSeller)) && (
                          <div className="mb-10">
                            <div className="flex items-center gap-3 mb-6">
                              <span className="p-1.5 bg-amber-500/10 rounded-lg">
                                <Flame className="w-4 h-4 text-amber-500" />
                              </span>
                              <h4 className="text-sm font-black text-text-main uppercase tracking-widest">Best Seller</h4>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              {(GAME_PRODUCTS[selectedGame.id] || []).filter(p => p.isBestSeller).map((item) => (
                                <ProductCard 
                                  key={`best-${item.id}`} 
                                  item={item} 
                                  selectedGame={selectedGame} 
                                  selectedProduct={selectedProduct} 
                                  onSelect={setSelectedProduct} 
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Regular Products Section */}
                        <div>
                          <div className="flex items-center gap-3 mb-6">
                            <span className="p-1.5 bg-jade-accent/10 rounded-lg">
                              <ShoppingBag className="w-4 h-4 text-jade-accent" />
                            </span>
                            <h4 className="text-sm font-black text-text-main uppercase tracking-widest">Daftar Produk lainnya</h4>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
{(GAME_PRODUCTS[selectedGame.id] || GAME_PRODUCTS['mlbb']).map((item) => (
                              <ProductCard 
                                key={item.id} 
                                item={item} 
                                selectedGame={selectedGame} 
                                selectedProduct={selectedProduct} 
                                onSelect={setSelectedProduct} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Cart Action */}
                      <div className="bg-jade-dark rounded-3xl p-8 shadow-2xl text-text-main border border-jade-accent/20">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 bg-jade-accent text-jade-bg rounded-lg flex items-center justify-center font-black">3</div>
                          <h3 className="text-xl font-bold tracking-tight">Siap untuk Top Up?</h3>
                        </div>

                        {inputErrors.product && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-400/10 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-500"
                          >
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-xs font-bold uppercase tracking-widest">{inputErrors.product}</p>
                          </motion.div>
                        )}
                        
                        <div className="space-y-4 mb-8 p-6 bg-jade-bg rounded-2xl border border-jade-mid">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-text-dim font-bold uppercase tracking-widest text-[10px]">Game</span>
                            <div className="flex items-center gap-2">
                              <img src={selectedGame.image} className="w-5 h-5 rounded object-cover" referrerPolicy="no-referrer" />
                              <span className="text-jade-glow font-black">{selectedGame.name}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-text-dim font-bold uppercase tracking-widest text-[10px]">Product</span>
                            <span className="text-text-main font-black">{selectedProduct?.name || '-'}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-text-dim font-bold uppercase tracking-widest text-[10px]">Harga</span>
                            <span className="text-jade-glow font-black">
                              {selectedProduct ? 
                                new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(selectedProduct.promoPrice || selectedProduct.price)
                                : 'Rp 0'
                              }
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button 
                              onClick={handleAddToCart}
                              className={`w-full py-5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${
                                !isProcessing
                                  ? 'bg-jade-dark border border-jade-mid text-jade-accent hover:border-jade-glow shadow-lg' 
                                  : 'bg-jade-mid/20 text-text-dim/30 cursor-not-allowed border border-jade-mid'
                              }`}
                              disabled={isProcessing}
                            >
                              <ShoppingCart className="w-5 h-5" />
                              Ke Keranjang
                            </button>

                            <button 
                              onClick={() => {
                                if (!validateInputs()) {
                                  return;
                                }
                                
                                // Create a temporary checkout with just this item
                                const tempCartId = `TMP-${Date.now()}`;
                                const tempItem: CartItem = {
                                  cartId: tempCartId,
                                  gameId: selectedGame!.id,
                                  gameName: selectedGame!.name,
                                  gameImage: selectedGame!.image,
                                  productId: selectedProduct.id,
                                  productName: selectedProduct.name,
                                  price: selectedProduct.price,
                                  promoPrice: selectedProduct.promoPrice,
                                  userId: userId,
                                  id_server: zoneId,
                                  whatsapp: whatsapp
                                };
                                
                                setCart(prev => [...prev, tempItem]);
                                setSelectedCartIds([tempCartId]);
                                setView('checkout');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className={`w-full py-5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${
                                !isProcessing
                                  ? 'bg-jade-accent hover:bg-jade-glow shadow-xl shadow-jade-accent/20 text-jade-bg' 
                                  : 'bg-jade-mid/20 text-text-dim/30 cursor-not-allowed border border-jade-mid'
                              }`}
                              disabled={isProcessing}
                            >
                              <Zap className="w-5 h-5 fill-current" />
                              Beli Sekarang
                            </button>
                          </div>

                          <button 
                            onClick={handleBackToHome}
                            className="w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest text-text-dim hover:text-jade-accent transition-colors border border-jade-mid hover:border-jade-accent text-center cursor-pointer flex items-center justify-center gap-2"
                          >
                            <ChevronLeft className="w-4 h-4" /> Kembali ke Katalog
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Benefits Section */}
              <section className="max-w-7xl mx-auto px-4 py-24 bg-jade-bg">
                <div className="grid md:grid-cols-3 gap-12">
                  <div className="text-center group">
                    <div className="w-16 h-16 bg-jade-dark border border-jade-mid rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-jade-accent transform transition-all group-hover:rotate-6">
                      <Zap className="w-8 h-8 text-jade-accent group-hover:text-jade-bg transition-colors" />
                    </div>
                    <h4 className="text-xl font-black text-text-main mb-3 font-sans uppercase tracking-tight">Proses Instant</h4>
                    <p className="text-text-dim text-sm">Pesanan diproses secara otomatis dalam hitungan detik setelah pembayaran dikonfirmasi.</p>
                  </div>
                  <div className="text-center group">
                    <div className="w-16 h-16 bg-jade-dark border border-jade-mid rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-jade-accent transform transition-all group-hover:-rotate-6">
                      <ShieldCheck className="w-8 h-8 text-jade-accent group-hover:text-jade-bg transition-colors" />
                    </div>
                    <h4 className="text-xl font-black text-text-main mb-3 font-sans uppercase tracking-tight">100% Aman & Legal</h4>
                    <p className="text-text-dim text-sm">Semua produk yang kami jual legal dan aman untuk akun game Anda. Garansi uang kembali.</p>
                  </div>
                  <div className="text-center group">
                    <div className="w-16 h-16 bg-jade-dark border border-jade-mid rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-jade-accent transform transition-all group-hover:rotate-6">
                      <CreditCard className="w-8 h-8 text-jade-accent group-hover:text-jade-bg transition-colors" />
                    </div>
                    <h4 className="text-xl font-black text-text-main mb-3 font-sans uppercase tracking-tight">Metode Lengkap</h4>
                    <p className="text-text-dim text-sm">Mendukung berbagai macam pilihan metode pembayaran populer di Indonesia.</p>
                  </div>
                </div>
              </section>
            </motion.div>
          ) : (
            null
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-jade-dark text-text-main pt-20 pb-10 border-t border-jade-mid">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={handleBackToHome}>
                <div className="w-10 h-10 bg-jade-accent rounded-lg flex items-center justify-center overflow-hidden shadow-lg">
                  <img src={APP_LOGO_URL} alt="GiokUp" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <span className="text-xl font-extrabold tracking-tighter">
                  Giok<span className="text-jade-glow">Up</span>
                </span>
              </div>
              <p className="text-text-dim text-sm leading-relaxed">
                GiokUp adalah platform penyedia layanan top up game dan voucher digital termurah, tercepat dan terpercaya di Indonesia.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-jade-glow uppercase text-xs tracking-widest font-sans">Pilihan Populer</h5>
              <ul className="space-y-3 text-sm text-text-dim font-medium">
                <li className="hover:text-jade-accent cursor-pointer transition-colors">Mobile Legends</li>
                <li className="hover:text-jade-accent cursor-pointer transition-colors">Genshin Impact</li>
                <li className="hover:text-jade-accent cursor-pointer transition-colors">Free Fire</li>
                <li className="hover:text-jade-accent cursor-pointer transition-colors">PUBG Mobile</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-jade-glow uppercase text-xs tracking-widest font-sans">Bantuan</h5>
              <ul className="space-y-3 text-sm text-text-dim font-medium">
                <li className="hover:text-jade-accent cursor-pointer transition-colors">Syarat & Ketentuan</li>
                <li className="hover:text-jade-accent cursor-pointer transition-colors">Kebijakan Privasi</li>
                <li className="hover:text-jade-accent cursor-pointer transition-colors">Hubungi Kami</li>
                <li className="hover:text-jade-accent cursor-pointer transition-colors">Metode Pembayaran</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-jade-glow uppercase text-xs tracking-widest font-sans">Follow Us</h5>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-jade-bg border border-jade-mid flex items-center justify-center hover:bg-jade-accent hover:text-jade-bg transition-all cursor-pointer group">
                  <span className="text-xs font-black">IG</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-jade-bg border border-jade-mid flex items-center justify-center hover:bg-jade-accent hover:text-jade-bg transition-all cursor-pointer group">
                  <span className="text-xs font-black">TIK</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-jade-bg border border-jade-mid flex items-center justify-center hover:bg-jade-accent hover:text-jade-bg transition-all cursor-pointer group">
                  <span className="text-xs font-black">FB</span>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-10 border-t border-jade-mid text-center">
            <p className="text-text-dim text-[10px] font-bold uppercase tracking-widest">
              © 2026 GiokUp. Premium Game Credits Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

