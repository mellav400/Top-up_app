import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Store,
  CheckCircle2,
  XCircle,
  X,
  Upload,
  Search,
  Filter,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PAYMENT_METHODS } from '../../constants';

// Payment Type Categories
type PaymentType = 'E-Wallet' | 'Virtual Account' | 'Retail' | 'QRIS' | 'Bank Transfer';

// Modal Component for Add/Edit Payment Method
function PaymentFormModal({ 
  method, 
  onClose, 
  onSave 
}: { 
  method?: any | null, 
  onClose: () => void, 
  onSave: (paymentData: any) => void 
}) {
  const [formData, setFormData] = useState({
    name: method?.name || '',
    group: method?.group || 'E-Wallet' as PaymentType,
    fee: method?.fee || 0,
    logo: method?.logo || '',
    active: method?.active ?? true
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      fee: Number(formData.fee)
    });
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
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
        className="relative bg-jade-dark border border-jade-mid w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col font-sans"
      >
        <div className="p-6 border-b border-jade-mid flex items-center justify-between bg-jade-mid/10">
          <div>
            <h3 className="text-xl font-bold text-text-main">{method ? 'Edit Payment' : 'Add Payment Method'}</h3>
            <p className="text-text-dim text-xs">Configure how users will pay for top-ups</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-jade-mid/20 rounded-xl transition-colors cursor-pointer text-text-dim">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-dim px-1">Logo / Icon</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group relative h-24 w-full rounded-2xl border-2 border-dashed border-jade-mid hover:border-jade-accent bg-jade-bg/50 transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden"
              >
                {formData.logo ? (
                  <>
                    <img src={formData.logo} className="h-16 object-contain group-hover:opacity-40 transition-opacity" alt="Logo" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-black text-jade-accent uppercase bg-jade-bg/80 px-3 py-1 rounded-lg">Change Logo</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-text-dim group-hover:text-jade-accent">
                    <Upload className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Upload PNG</span>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/png,image/svg+xml,image/jpeg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setFormData({...formData, logo: URL.createObjectURL(file)});
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-dim px-1">Payment Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-jade-bg border border-jade-mid rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-jade-accent/50 text-text-main"
                  placeholder="e.g. ShopeePay, OVO"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-dim px-1">Category</label>
                <div className="relative">
                  <select 
                    className="w-full bg-jade-bg border border-jade-mid rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-jade-accent/50 text-text-main appearance-none"
                    value={formData.group}
                    onChange={e => setFormData({...formData, group: e.target.value as PaymentType})}
                  >
                    <option value="E-Wallet">E-Wallet</option>
                    <option value="Virtual Account">Virtual Account</option>
                    <option value="Retail">Retail Store</option>
                    <option value="QRIS">QRIS</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-dim px-1">Admin Fee (IDR)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim text-xs">Rp</span>
                  <input 
                    required
                    type="number" 
                    className="w-full bg-jade-bg border border-jade-mid rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-jade-accent/50 text-text-main"
                    placeholder="0"
                    value={formData.fee}
                    onChange={e => setFormData({...formData, fee: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-jade-bg border border-jade-mid text-text-dim rounded-xl font-black text-xs uppercase tracking-widest hover:bg-jade-mid/10 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-4 bg-jade-accent text-jade-bg rounded-xl font-black text-xs uppercase tracking-widest hover:bg-jade-glow transition-all shadow-xl shadow-jade-accent/20 cursor-pointer"
            >
              {method ? 'Update Configuration' : 'Add Method'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// Confirmation Modal for Payment Deletion
function ConfirmDeletePaymentModal({ 
  paymentName, 
  onClose, 
  onConfirm 
}: { 
  paymentName: string, 
  onClose: () => void, 
  onConfirm: () => void 
}) {
  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
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
        className="relative bg-jade-dark border border-red-500/30 w-full max-w-sm rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(239,68,68,0.1)] font-sans"
      >
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
          <Trash2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Delete Payment?</h3>
        <p className="text-text-dim text-sm mb-8">
          Are you sure you want to remove <span className="text-red-400 font-bold">"{paymentName}"</span>? This payment method will no longer be available to users.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-jade-bg border border-jade-mid text-text-dim rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jade-mid/10 transition-all cursor-pointer">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all cursor-pointer shadow-xl shadow-red-500/20">
            Confirm Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminPayments() {
  const [methods, setMethods] = useState<any[]>(() => 
    PAYMENT_METHODS.map(m => ({ ...m, active: true }))
  );
  
  const [search, setSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('All');
  
  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState<any | null>(null);
  const [deletingMethod, setDeletingMethod] = useState<any | null>(null);

  const toggleStatus = (id: string, currentStatus: boolean) => {
    if (currentStatus) {
      if (confirm(`Deactivating this payment method will hide it from users. Continue?`)) {
        setMethods(prev => prev.map(m => m.id === id ? { ...m, active: false } : m));
      }
    } else {
      setMethods(prev => prev.map(m => m.id === id ? { ...m, active: true } : m));
    }
  };

  const handleAddPayment = (paymentData: any) => {
    const newMethod = {
      ...paymentData,
      id: paymentData.name.toLowerCase().replace(/\s+/g, '-'),
    };
    setMethods([newMethod, ...methods]);
    setShowFormModal(false);
  };

  const handleUpdatePayment = (paymentData: any) => {
    if (!editingMethod) return;
    setMethods(prev => prev.map(m => m.id === editingMethod.id ? { ...m, ...paymentData } : m));
    setEditingMethod(null);
  };

  const handleDeletePayment = () => {
    if (!deletingMethod) return;
    setMethods(prev => prev.filter(m => m.id !== deletingMethod.id));
    setDeletingMethod(null);
  };

  const filteredMethods = methods.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterGroup === 'All' || m.group === filterGroup;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-text-main font-serif italic uppercase tracking-tight">Payment Configuration</h2>
          <p className="text-jade-accent text-xs font-black uppercase tracking-[2px] mt-1">Manage e-wallets, banks, and retail payments</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-jade-accent w-4 h-4 group-focus-within:scale-110 transition-transform" />
            <input 
              type="text" 
              placeholder="Search payments..."
              className="pl-12 pr-6 py-4 rounded-2xl bg-jade-dark border border-jade-mid text-text-main placeholder-text-dim/50 focus:outline-none focus:ring-2 focus:ring-jade-accent/50 transition-all font-medium min-w-[300px] shadow-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <select 
              className="appearance-none pl-12 pr-10 py-4 rounded-2xl bg-jade-dark border border-jade-mid text-text-main focus:outline-none focus:ring-2 focus:ring-jade-accent/50 transition-all font-bold text-xs uppercase tracking-widest min-w-[180px] shadow-xl cursor-pointer"
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="E-Wallet">E-Wallets</option>
              <option value="Virtual Account">VA / Banks</option>
              <option value="Retail">Retail</option>
              <option value="QRIS">QRIS</option>
            </select>
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-jade-accent w-4 h-4 pointer-events-none" />
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim w-4 h-4 pointer-events-none" />
          </div>
          <button 
            onClick={() => setShowFormModal(true)}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-jade-accent hover:bg-jade-glow text-jade-bg rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-jade-accent/20 cursor-pointer"
          >
            <Plus className="w-5 h-5" /> Add Payment Method
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMethods.map((method) => (
          <div 
            key={method.id} 
            className={`relative bg-jade-dark/50 border rounded-[32px] p-8 transition-all group overflow-hidden ${
              method.active 
              ? 'border-jade-mid hover:border-jade-accent shadow-lg' 
              : 'border-red-900/30 grayscale opacity-60 bg-red-950/5'
            }`}
          >
            {/* Background pattern */}
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-jade-glow/5 rounded-full blur-3xl pointer-events-none group-hover:bg-jade-glow/10 transition-all" />
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className={`p-5 rounded-[24px] ${
                method.active 
                ? 'bg-jade-bg border border-jade-mid group-hover:border-jade-accent flex items-center justify-center' 
                : 'bg-jade-bg border border-red-900/50'
              }`}>
                {method.logo ? (
                  <img src={method.logo} alt={method.name} className="h-10 w-auto object-contain" />
                ) : (
                  <CreditCard className={`w-10 h-10 ${method.active ? 'text-jade-accent' : 'text-red-400'}`} />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setEditingMethod(method)}
                  className="p-3 text-text-dim hover:text-jade-glow hover:bg-jade-mid/20 rounded-xl transition-all cursor-pointer bg-jade-bg/50 border border-jade-mid/30"
                  title="Edit Configuration"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setDeletingMethod(method)}
                  className="p-3 text-text-dim hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all cursor-pointer bg-jade-bg/50 border border-jade-mid/30"
                  title="Delete Method"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
                    method.active ? 'bg-jade-accent/10 text-jade-accent' : 'bg-red-900/20 text-red-400'
                  }`}>
                    {method.group}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-text-main leading-none uppercase tracking-tight">{method.name}</h3>
              </div>

              <div 
                onClick={() => setEditingMethod(method)}
                className="flex justify-between items-center p-4 bg-jade-bg/80 rounded-2xl border border-jade-mid/50 cursor-pointer hover:border-jade-accent transition-colors group/fee shadow-inner"
              >
                <div>
                  <p className="text-[8px] font-black text-text-dim uppercase tracking-widest">Admin Fee</p>
                  <p className="text-lg font-black text-jade-glow">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(method.fee)}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-jade-mid/10 text-jade-accent opacity-0 group-hover/fee:opacity-100 transition-opacity">
                  <Edit2 className="w-3 h-3" />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => !method.active && toggleStatus(method.id, false)}
                  className={`flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[2px] transition-all cursor-pointer ${
                    method.active 
                    ? 'bg-jade-accent text-jade-bg shadow-lg shadow-jade-accent/20' 
                    : 'bg-jade-bg border border-jade-mid text-text-dim hover:border-jade-glow hover:text-white'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => method.active && toggleStatus(method.id, true)}
                  className={`flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[2px] transition-all cursor-pointer ${
                    !method.active 
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
                    : 'bg-jade-bg border border-red-500/30 text-red-500/60 hover:text-red-500 hover:border-red-500 hover:bg-red-500/5'
                  }`}
                >
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredMethods.length === 0 && (
          <div className="col-span-full py-24 text-center flex flex-col items-center justify-center bg-jade-dark/20 rounded-[40px] border border-dashed border-jade-mid">
            <div className="w-20 h-20 bg-jade-mid/10 rounded-3xl flex items-center justify-center mb-6 text-jade-mid">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-text-main">No Payment Methods Found</h3>
            <p className="text-text-dim text-sm mt-1 max-w-xs">Adjust your search or filters to find what you're looking for.</p>
            <button 
              onClick={() => { setSearch(''); setFilterGroup('All'); }}
              className="mt-6 text-jade-accent hover:text-jade-glow text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              Clear Filters <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showFormModal && (
          <PaymentFormModal 
            onClose={() => setShowFormModal(false)}
            onSave={handleAddPayment}
          />
        )}
        {editingMethod && (
          <PaymentFormModal 
            method={editingMethod}
            onClose={() => setEditingMethod(null)}
            onSave={handleUpdatePayment}
          />
        )}
        {deletingMethod && (
          <ConfirmDeletePaymentModal 
            paymentName={deletingMethod.name}
            onClose={() => setDeletingMethod(null)}
            onConfirm={handleDeletePayment}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

