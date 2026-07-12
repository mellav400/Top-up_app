import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Eye, 
  Download,
  Calendar,
  X,
  CreditCard,
  User,
  Gamepad2,
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order } from '../../types';

interface OrdersProps {
  orders: Order[];
}

export default function AdminOrders({ orders }: OrdersProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Success' | 'Pending' | 'Failed'>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
  (o.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
  (o.id?.toLowerCase() || '').includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-jade-dark/50 border border-jade-mid p-6 rounded-3xl">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-jade-accent w-4 h-4" />
          <input 
            type="text" 
            placeholder="Cari ID Order atau Username..."
            className="w-full pl-12 pr-6 py-3 rounded-2xl bg-jade-bg border border-jade-mid text-text-main placeholder-text-dim/50 focus:outline-none focus:ring-2 focus:ring-jade-accent/50 transition-all text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-jade-bg p-1 rounded-xl border border-jade-mid">
            {['All', 'Success', 'Pending', 'Failed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as any)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  statusFilter === status 
                    ? 'bg-jade-accent text-jade-bg shadow-md' 
                    : 'text-text-dim hover:text-text-main'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <button className="p-3 rounded-xl bg-jade-mid/20 text-jade-accent border border-jade-mid hover:bg-jade-mid/40 transition-all">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-jade-dark/50 border border-jade-mid rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-jade-bg text-text-dim text-[10px] uppercase font-black tracking-widest border-b border-jade-mid/30">
                <th className="px-6 py-5">Order ID</th>
                <th className="px-6 py-5">User & Game</th>
                <th className="px-6 py-5">Nominal</th>
                <th className="px-6 py-5">Metode</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Tanggal</th>
                <th className="px-6 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-jade-mid/10">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-jade-mid/5 transition-colors group">
                    <td className="px-6 py-5">
                      <span className="text-xs font-black text-jade-accent font-mono tracking-tighter">{order.id}</span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-text-main leading-tight">{order.name}</p>
                      <p className="text-[10px] text-text-dim font-black uppercase tracking-widest mt-0.5">{order.gameName}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-jade-glow">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.price || order.amount)}
                      </p>
                      <p className="text-[10px] text-text-dim font-medium">{order.item}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {order.paymentLogo && (
                          <img src={order.paymentLogo} className="h-4 w-auto object-contain bg-white rounded px-1" referrerPolicy="no-referrer" />
                        )}
                        <span className="text-[10px] font-black text-text-dim uppercase tracking-widest">{order.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase border flex items-center justify-center gap-1.5 w-fit ${
                        order.status === 'Success' ? 'bg-jade-accent/10 text-jade-accent border-jade-accent/20' :
                        order.status === 'Pending' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' :
                        'bg-red-400/10 text-red-400 border-red-400/20'
                      }`}>
                        {order.status === 'Success' && <CheckCircle2 className="w-3 h-3" />}
                        {order.status === 'Pending' && <Clock className="w-3 h-3" />}
                        {order.status === 'Failed' && <AlertCircle className="w-3 h-3" />}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-text-dim">
                        <Calendar className="w-3 h-3" />
                        <span className="text-[10px] font-bold">{order.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 rounded-lg bg-jade-mid/10 text-jade-accent hover:bg-jade-accent hover:text-jade-bg transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-10 h-10 text-jade-mid/40" />
                      <p className="text-text-dim font-bold uppercase text-xs tracking-widest">Pesanan tidak ditemukan</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-jade-bg/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-jade-dark border border-jade-mid rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-text-main flex items-center gap-3">
                      Detail Pesanan 
                      <span className="text-jade-accent font-mono text-lg opacity-50">#{selectedOrder.id}</span>
                    </h2>
                    <p className="text-xs font-bold text-text-dim uppercase tracking-[0.2em]">Informasi Lengkap Transaksi</p>
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="p-3 rounded-full bg-jade-mid/10 text-text-dim hover:bg-red-400 hover:text-white transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column: User & Game */}
                  <div className="space-y-6">
                    <div className="bg-jade-bg/50 p-6 rounded-3xl border border-jade-mid/30 space-y-4">
                      <div className="flex items-center gap-3 text-jade-accent mb-2">
                        <User className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Informasi Pengguna</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-text-dim">Username</span>
                          <span className="text-sm font-bold text-text-main">{selectedOrder.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-text-dim">ID Game</span>
                          <span className="text-sm font-black text-jade-glow">{selectedOrder.user_id_game || 'Unknown'}</span>
                        </div>
                        {selectedOrder.id_server && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-text-dim">Server</span>
                            <span className="text-sm font-bold text-text-main">{selectedOrder.id_server}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-jade-bg/50 p-6 rounded-3xl border border-jade-mid/30 space-y-4">
                      <div className="flex items-center gap-3 text-jade-accent mb-2">
                        <Gamepad2 className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Detail Item</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-text-dim">Game</span>
                          <span className="text-sm font-bold text-text-main">{selectedOrder.gameName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-text-dim">Produk</span>
                          <span className="text-sm font-bold text-jade-glow">{selectedOrder.productName || selectedOrder.item}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Payment & Promo */}
                  <div className="space-y-6">
                    <div className="bg-jade-bg/50 p-6 rounded-3xl border border-jade-mid/30 space-y-4">
                      <div className="flex items-center gap-3 text-jade-accent mb-2">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Pembayaran</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-text-dim">Metode</span>
                          <div className="flex items-center gap-2">
                            {selectedOrder.paymentLogo && (
                              <img src={selectedOrder.paymentLogo} className="h-4 w-auto object-contain bg-white rounded px-1" />
                            )}
                            <span className="text-sm font-bold text-text-main">{selectedOrder.paymentMethod}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-text-dim">Total Bayar</span>
                          <span className="text-lg font-black text-jade-accent">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(selectedOrder.amount)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-text-dim">Status</span>
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                            selectedOrder.status === 'Success' ? 'bg-jade-accent/10 text-jade-accent border-jade-accent/20' :
                            selectedOrder.status === 'Pending' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' :
                            'bg-red-400/10 text-red-400 border-red-400/20'
                          }`}>
                            {selectedOrder.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedOrder.promoDetails && (
                      <div className="bg-amber-500/5 p-6 rounded-3xl border border-amber-500/20 space-y-4">
                        <div className="flex items-center gap-3 text-amber-500 mb-2">
                          <Tag className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Detail Promo</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-text-dim">Kode Promo</span>
                            <span className="text-xs font-black text-amber-500 bg-amber-500/10 px-2 py-1 rounded tracking-widest">{selectedOrder.promoDetails.code}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-text-dim">Potongan</span>
                            <span className="text-sm font-bold text-amber-500">
                              - {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(selectedOrder.promoDetails.discount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-jade-bg/50 p-6 rounded-3xl border border-jade-mid/30 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-text-dim">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs font-bold">{selectedOrder.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedOrder.status === 'Success' ? (
                          <CheckCircle2 className="w-4 h-4 text-jade-accent" />
                        ) : selectedOrder.status === 'Pending' ? (
                          <Clock className="w-4 h-4 text-amber-400" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span className="text-[10px] font-black uppercase text-text-dim">{selectedOrder.status}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button className="flex-grow py-4 rounded-2xl bg-jade-accent text-jade-bg font-black text-xs uppercase tracking-widest shadow-xl shadow-jade-accent/20 hover:bg-jade-glow transition-all">
                    Update Status
                  </button>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="px-8 py-4 rounded-2xl bg-jade-mid/10 text-text-dim font-black text-xs uppercase tracking-widest border border-jade-mid hover:bg-jade-mid/20 transition-all"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
