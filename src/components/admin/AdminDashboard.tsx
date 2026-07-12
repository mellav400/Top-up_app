import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  ChevronRight,
  Flame
} from 'lucide-react';
import { Order } from '../../types';

interface DashboardProps {
  orders: Order[];
}

const chartData = [
  { name: '14 Apr', sales: 4000 },
  { name: '15 Apr', sales: 3000 },
  { name: '16 Apr', sales: 2000 },
  { name: '17 Apr', sales: 2780 },
  { name: '18 Apr', sales: 1890 },
  { name: '19 Apr', sales: 2390 },
  { name: '20 Apr', sales: 3490 },
];

export default function AdminDashboard({ orders }: DashboardProps) {
  const totalRevenue = orders
    .filter(o => o.status === 'Success')
    .reduce((sum, o) => sum + (o.price || o.amount), 0);
  
  const todayOrders = orders.filter(o => {
    const today = new Date().toLocaleDateString('id-ID');
    return o.date.includes(today);
  }).length;

  const activeUsers = new Set(orders.map(o => o.name)).size;

  // Simple logic to find the top game
const gameCounts: Record<string, number> = {};
orders.forEach(o => {
  if (o.gameName) {
    gameCounts[o.gameName] = (gameCounts[o.gameName] || 0) + 1;
  }
});
  const topGame = Object.entries(gameCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const stats = [
    { 
      label: 'Total Transaksi Hari Ini', 
      value: todayOrders, 
      icon: ShoppingBag, 
      color: 'text-jade-glow',
      bg: 'bg-jade-glow/10'
    },
    { 
      label: 'Total Pendapatan', 
      value: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalRevenue), 
      icon: DollarSign, 
      color: 'text-amber-400',
      bg: 'bg-amber-400/10' 
    },
    { 
      label: 'User Aktif', 
      value: activeUsers, 
      icon: Users, 
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    },
    { 
      label: 'Game Terpopuler', 
      value: topGame, 
      icon: Flame, 
      color: 'text-red-400',
      bg: 'bg-red-400/10'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-jade-dark/50 border border-jade-mid p-6 rounded-3xl hover:border-jade-glow transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-black text-jade-accent bg-jade-accent/10 px-2 py-1 rounded-full uppercase tracking-widest">Live</span>
            </div>
            <p className="text-text-dim text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-text-main tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-jade-dark/50 border border-jade-mid p-8 rounded-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-text-main font-serif italic">Grafik Penjualan</h3>
            <p className="text-text-dim text-xs uppercase tracking-widest mt-1">7 Hari Terakhir</p>
          </div>
          <div className="flex items-center gap-2 text-jade-accent font-bold text-xs uppercase tracking-widest">
            <TrendingUp className="w-4 h-4" /> 
            <span>+14.5% Growth</span>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#76e1c9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#76e1c9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1b4d44" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#8ba8a3" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tick={{ fontWeight: 600 }}
              />
              <YAxis 
                stroke="#8ba8a3" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `Rp${value/1000}k`}
                tick={{ fontWeight: 600 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0d2622', 
                  border: '1px solid #1b4d44',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#e6f2f0'
                }}
                itemStyle={{ color: '#76e1c9' }}
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#76e1c9" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorSales)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions / Recent Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-jade-dark/50 border border-jade-mid p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-text-main font-serif italic">Aktivitas Terkini</h3>
            <button className="text-xs font-bold text-jade-accent hover:text-jade-glow flex items-center gap-1 transition-colors">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {orders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-jade-bg/50 rounded-2xl border border-jade-mid/50 hover:border-jade-accent/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-jade-mid/20 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-jade-glow" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-main">{order.name} memesan {order.item}</p>
                    <p className="text-[10px] text-text-dim uppercase font-black tracking-widest">{order.date}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${
                  order.status === 'Success' ? 'bg-jade-accent/10 text-jade-accent' : 'bg-red-400/10 text-red-400'
                }`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-jade-accent rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-700" />
          <h3 className="text-2xl font-black text-jade-bg mb-4 font-serif italic leading-tight">Siap Untuk<br />Update Katalog?</h3>
          <p className="text-jade-bg/70 text-sm mb-6 font-medium">Tambahkan game baru atau atur nominal promo hari ini untuk meningkatkan penjualan.</p>
          <button className="w-full py-4 bg-jade-bg text-jade-accent rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/20">
            Kelola Game
          </button>
        </div>
      </div>
    </div>
  );
}
