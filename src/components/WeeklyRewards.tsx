import React, { useState, useEffect, useCallback } from 'react';
import { 
  Gift, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Zap, 
  Clock, 
  ChevronRight,
  RefreshCcw,
  Star,
  Copy,
  Check,
  AlertCircle,
  Trophy,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WEEKLY_REWARD_CYCLE } from '../constants';
import { WeeklyRewardProgress, ClaimedRedeemCode } from '../types';

interface WeeklyRewardsProps {
  currentUser: { username: string };
  onBack: () => void;
  onNavigateToShop: () => void;
}

export default function WeeklyRewards({ currentUser, onBack, onNavigateToShop }: WeeklyRewardsProps) {
  const [progress, setProgress] = useState<WeeklyRewardProgress | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimedPopup, setClaimedPopup] = useState<ClaimedRedeemCode | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [surpriseValue, setSurpriseValue] = useState<number | null>(null);

  const STORAGE_KEY = `giokup_weekly_rewards_${currentUser.username}`;

  const loadProgress = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: WeeklyRewardProgress = JSON.parse(saved);
      
      // Check for streak break
      if (parsed.lastClaimDate) {
        const lastClaim = new Date(parsed.lastClaimDate);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffInDays >= 2) {
          // Missed a day, reset to day 1
          const resetProgress: WeeklyRewardProgress = {
            currentDay: 1,
            lastClaimDate: null,
            streak: 0,
            claimedCodes: parsed.claimedCodes // Keep old codes for history? User said reset to day 1.
          };
          setProgress(resetProgress);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(resetProgress));
          return;
        } else if (diffInDays === 1 && parsed.currentDay === 7) {
            // Finished cycle, reset to day 1 after 24 hours of day 7 claim
            const resetProgress: WeeklyRewardProgress = {
              currentDay: 1,
              lastClaimDate: null,
              streak: 0,
              claimedCodes: parsed.claimedCodes
            };
            setProgress(resetProgress);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(resetProgress));
            return;
        }
      }
      setProgress(parsed);
    } else {
      const initial: WeeklyRewardProgress = {
        currentDay: 1,
        lastClaimDate: null,
        streak: 0,
        claimedCodes: []
      };
      setProgress(initial);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
  }, [STORAGE_KEY]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Daily Reset Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${h}j ${m}m ${s}d`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const generateCode = (username: string, day: number) => {
    const random = Math.random().toString(36).substring(7).toUpperCase();
    return `RWD7-${username.toUpperCase()}-D${day}-${random}`;
  };

  const getRandomSurprise = () => {
    const options = [2, 4, 6, 8];
    return options[Math.floor(Math.random() * options.length)];
  };

  const handleClaim = () => {
    if (!progress) return;

    // Check if already claimed today
    if (progress.lastClaimDate) {
      const lastClaim = new Date(progress.lastClaimDate);
      const now = new Date();
      if (lastClaim.toDateString() === now.toDateString()) {
        alert('Anda sudah mengklaim reward hari ini. Silakan kembali besok!');
        return;
      }
    }

    setIsClaiming(true);
    
    // Day 4 Surprise Animation logic
    if (progress.currentDay === 4) {
      const val = getRandomSurprise();
      setSurpriseValue(val);
      setTimeout(() => finalizeClaim(val), 2000);
    } else {
      setTimeout(() => finalizeClaim(), 1500);
    }
  };

  const finalizeClaim = (surpriseVal?: number) => {
    if (!progress) return;
    
    const config = WEEKLY_REWARD_CYCLE.find(c => c.day === progress.currentDay)!;
    const finalDiscount = config.isSurprise ? surpriseVal! : config.discount;
    const newCode = generateCode(currentUser.username, progress.currentDay);
    
    const now = new Date();
    const expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const newClaim: ClaimedRedeemCode = {
      code: newCode,
      discount: finalDiscount,
      maxDiscount: config.maxDiscount || 0,
      minTransaction: config.minTopUp,
      expiresAt: expiry.toISOString(),
      isUsed: false,
      day: progress.currentDay
    };

    const nextDay = progress.currentDay === 7 ? 1 : progress.currentDay + 1;
    const updatedProgress: WeeklyRewardProgress = {
      currentDay: nextDay,
      lastClaimDate: now.toISOString(),
      streak: progress.streak + 1,
      claimedCodes: [newClaim, ...progress.claimedCodes]
    };

    setProgress(updatedProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProgress));
    setClaimedPopup(newClaim);
    setIsClaiming(false);
    setSurpriseValue(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canClaim = !progress?.lastClaimDate || new Date(progress.lastClaimDate).toDateString() !== new Date().toDateString();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-[3rem] bg-jade-dark p-8 md:p-12 border-2 border-jade-mid shadow-[0_0_50px_rgba(16,185,129,0.1)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-jade-accent/10 blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-jade-glow/5 blur-[100px] -ml-32 -mb-32" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jade-accent/10 border border-jade-accent/20">
                 <Sparkles className="w-4 h-4 text-jade-accent" />
                 <span className="text-[10px] font-black text-jade-accent uppercase tracking-[0.3em]">Exclusive Member Event</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white font-serif italic tracking-tighter uppercase leading-none">
                 Weekly Reward <br />
                 <span className="text-jade-glow">Cycle Journey</span>
              </h2>
              <p className="text-text-dim max-w-md text-sm md:text-base">
                 Top-up setiap hari berturut-turut untuk membuka diskon spektakuler. <br />
                 Jangan lewatkan 1 hari pun atau perjalanan Anda akan terhenti!
              </p>
           </div>

           <div className="flex flex-col items-center gap-4 bg-jade-bg/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-jade-mid shadow-inner min-w-[240px]">
              <div className="text-center">
                 <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-1">Reset Harian Dalam</p>
                 <div className="flex items-center gap-2 text-2xl font-black text-white font-mono">
                    <Clock className="w-5 h-5 text-amber-500" />
                    {timeLeft}
                 </div>
              </div>
              <div className="w-full h-[1px] bg-jade-mid" />
              <div className="text-center">
                 <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-1">Total Streak</p>
                 <div className="text-3xl font-black text-jade-accent flex items-center justify-center gap-2">
                    <Zap className="w-6 h-6 fill-current" />
                    {progress?.streak || 0} Hari
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Progress & Grid */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-4">
           <div>
              <h3 className="text-xl font-black text-white italic font-serif">Journey Map</h3>
              <p className="text-[10px] text-text-dim uppercase tracking-widest font-black">Progress: Day {progress ? (canClaim ? progress.currentDay : progress.currentDay - 1 === 0 ? 7 : progress.currentDay - 1) : 0}/7</p>
           </div>
           {!canClaim && (
             <div className="flex items-center gap-2 text-jade-accent bg-jade-accent/10 px-4 py-2 rounded-xl border border-jade-accent/30">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Klaim Berhasil</span>
             </div>
           )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
           {WEEKLY_REWARD_CYCLE.map((dayReward) => {
             const isCurrent = progress?.currentDay === dayReward.day && canClaim;
             const isClaimed = (progress?.currentDay || 1) > dayReward.day || (!canClaim && progress?.currentDay === dayReward.day % 7 + 1); 
             // Logic refinement for claimed status: 
             const actualClaimed = progress?.claimedCodes.some(c => c.day === dayReward.day && new Date(c.expiresAt).getTime() > new Date().getTime() - 24*60*60*1000);
             
             // Simplier logic for UI:
             const isLocked = !isCurrent && !actualClaimed;
             const isSpecial = dayReward.day === 7;
             const isSurprise = dayReward.isSurprise;

             return (
               <motion.div
                 key={dayReward.day}
                 whileHover={{ y: -5 }}
                 className={`relative h-48 rounded-[2rem] border-2 flex flex-col items-center justify-center gap-4 transition-all overflow-hidden group ${
                    isCurrent ? 'bg-jade-accent border-jade-glow shadow-[0_0_30px_rgba(16,185,129,0.3)]' :
                    actualClaimed ? 'bg-jade-bg border-jade-accent/30 opacity-80' :
                    'bg-jade-dark border-jade-mid opacity-40'
                 }`}
               >
                 {isSpecial && <Star className="absolute top-3 right-3 w-5 h-5 text-amber-500 animate-spin-slow" />}
                 
                 <span className={`text-[10px] font-black uppercase tracking-widest ${isCurrent ? 'text-jade-bg' : 'text-text-dim'}`}>
                   Day {dayReward.day}
                 </span>

                 <div className="relative">
                    {actualClaimed ? (
                      <CheckCircle2 className="w-12 h-12 text-jade-accent" />
                    ) : isSurprise ? (
                      <div className="relative">
                        <Package className={`w-12 h-12 ${isCurrent ? 'text-jade-bg' : 'text-jade-accent'}`} />
                        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-500 animate-pulse" />
                      </div>
                    ) : isSpecial ? (
                      <Trophy className={`w-12 h-12 ${isCurrent ? 'text-jade-bg text-amber-500 fill-amber-500' : 'text-jade-accent'}`} />
                    ) : (
                      <div className={`text-2xl font-black ${isCurrent ? 'text-jade-bg' : 'text-jade-accent'}`}>
                        {dayReward.discount}%
                      </div>
                    )}
                 </div>

                 <div className="text-center px-4">
                    <p className={`text-[9px] font-bold italic leading-tight ${isCurrent ? 'text-jade-bg/80' : 'text-text-dim'}`}>
                      {isSurprise ? 'Surprise Reward' : `Potongan s/d Rp ${dayReward.maxDiscount?.toLocaleString('id-ID')}`}
                    </p>
                 </div>

                 {isLocked && <Lock className="absolute inset-0 m-auto w-8 h-8 text-white/5" />}
                 
                 {isCurrent && (
                   <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
                 )}
               </motion.div>
             );
           })}
        </div>

        <div className="flex flex-col items-center pt-8">
           <button
             onClick={handleClaim}
             disabled={!canClaim || isClaiming}
             className={`group relative overflow-hidden px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center gap-3 ${
                canClaim && !isClaiming
                ? 'bg-jade-accent text-jade-bg shadow-[0_15px_40px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95' 
                : 'bg-jade-mid/20 text-text-dim cursor-not-allowed border border-jade-mid'
             }`}
           >
              {isClaiming ? (
                <>
                  <RefreshCcw className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : canClaim ? (
                <>
                  Claim Hari Ke-{progress?.currentDay} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              ) : (
                'Kembali Besok Untuk Reward Selanjutnya'
              )}
              {canClaim && !isClaiming && (
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}
           </button>
           <p className="mt-4 text-[10px] text-text-dim font-black uppercase tracking-widest">
              {canClaim ? 'Klik untuk mendapatkan kode redeem harian Anda' : 'Anda telah mengklaim jatah hari ini.'}
           </p>
        </div>
      </div>

      {/* Claim History */}
      {progress && progress.claimedCodes.length > 0 && (
        <div className="space-y-6">
           <div className="flex items-center gap-3 px-4">
              <Gift className="w-5 h-5 text-jade-accent" />
              <h3 className="text-xl font-black text-white italic font-serif">Redeem History</h3>
           </div>

           <div className="grid md:grid-cols-2 gap-4">
              {progress.claimedCodes.map((claim, idx) => (
                <div key={idx} className="bg-jade-dark border border-jade-mid rounded-3xl p-6 flex flex-col gap-4 relative group">
                   <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-jade-bg border border-jade-mid flex items-center justify-center font-black text-jade-accent">
                            {claim.day}
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">Rewad Day {claim.day}</p>
                            <h4 className="text-lg font-bold text-white">Diskon {claim.discount}%</h4>
                         </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${claim.isUsed ? 'bg-jade-bg text-text-dim border border-jade-mid' : 'bg-jade-accent/20 text-jade-accent border border-jade-accent/30'}`}>
                         {claim.isUsed ? 'Digunakan' : 'Siap Pakai'}
                      </div>
                   </div>
                   
                   <div className="bg-jade-bg border border-jade-mid p-3 rounded-xl flex items-center justify-between">
                      <code className="text-xs font-black text-jade-accent font-mono tracking-wider">{claim.code}</code>
                      <button 
                        onClick={() => copyToClipboard(claim.code)}
                        className="p-2 text-text-dim hover:text-white transition-all bg-jade-dark rounded-lg"
                      >
                         {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                   </div>

                   <div className="flex items-center justify-between text-[9px] font-bold text-text-dim px-1">
                      <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Min: Rp {claim.minTransaction.toLocaleString('id-ID')}</span>
                      <span>Expires: {new Date(claim.expiresAt).toLocaleDateString('id-ID')}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Claimed Modal */}
      <AnimatePresence>
        {claimedPopup && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setClaimedPopup(null)}
              className="absolute inset-0 bg-jade-bg/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-jade-dark border-2 border-jade-glow rounded-[3rem] p-10 text-center shadow-[0_0_100px_rgba(16,185,129,0.3)]"
            >
              <div className="flex flex-col items-center gap-6">
                 <div className="w-24 h-24 bg-jade-accent text-jade-bg rounded-[2rem] flex items-center justify-center shadow-2xl shadow-jade-accent/20 transform rotate-6 scale-110">
                    <Trophy className="w-12 h-12" />
                 </div>

                 <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white italic font-serif uppercase tracking-tight">Selamat!</h3>
                    <p className="text-text-dim text-sm">Reward Hari ke-{claimedPopup.day} telah berhasil diklaim!</p>
                 </div>

                 <div className="w-full bg-jade-bg border-2 border-dashed border-jade-mid p-8 rounded-[2rem] space-y-4">
                    <p className="text-[10px] font-black text-jade-accent uppercase tracking-[0.3em]">Kode Redeem Anda</p>
                    <div className="text-2xl font-black text-white font-mono tracking-widest break-all">
                       {claimedPopup.code}
                    </div>
                    <button 
                      onClick={() => copyToClipboard(claimedPopup.code)}
                      className="inline-flex items-center gap-2 text-jade-accent hover:text-jade-glow transition-all"
                    >
                       <Copy className="w-4 h-4" /> 
                       <span className="text-[10px] font-black uppercase tracking-widest">{copied ? 'Berhasil Salin' : 'Salin Kode'}</span>
                    </button>
                 </div>

                 <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="bg-jade-accent/10 border border-jade-accent/20 p-4 rounded-2xl">
                       <p className="text-[8px] font-black text-text-dim uppercase tracking-widest mb-1">Potongan</p>
                       <p className="text-xl font-black text-jade-accent">{claimedPopup.discount}%</p>
                    </div>
                    <div className="bg-jade-accent/10 border border-jade-accent/20 p-4 rounded-2xl">
                       <p className="text-[8px] font-black text-text-dim uppercase tracking-widest mb-1">Maksimal</p>
                       <p className="text-xl font-black text-jade-accent">Rp {claimedPopup.maxDiscount.toLocaleString('id-ID')}</p>
                    </div>
                 </div>

                 <button 
                   onClick={() => { setClaimedPopup(null); onNavigateToShop(); }}
                   className="w-full py-5 bg-jade-accent text-jade-bg rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-jade-accent/20 hover:scale-[1.02] transition-all"
                 >
                    Gunakan Sekarang & Belanja
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Surprise Animation Overlay */}
      <AnimatePresence>
        {surpriseValue && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-jade-bg/40 backdrop-blur-sm">
             <motion.div
               initial={{ scale: 0.5, opacity: 0 }}
               animate={{ scale: 1, opacity: 1, rotate: [0, -10, 10, -5, 5, 0] }}
               transition={{ duration: 1 }}
               className="flex flex-col items-center gap-8"
             >
                <div className="relative">
                   <Package className="w-40 h-40 text-jade-accent animate-bounce" />
                   <Sparkles className="absolute -top-4 -right-4 w-12 h-12 text-amber-500 animate-pulse" />
                </div>
                <h3 className="text-4xl font-black text-white font-serif italic uppercase tracking-tighter text-center">
                   Revealing Your <br />
                   <span className="text-amber-500">Surprise Reward...</span>
                </h3>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
