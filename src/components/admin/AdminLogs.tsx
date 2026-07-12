import React, { useState } from 'react';
import { 
  Filter, 
  Search, 
  Clock, 
  User, 
  Shield, 
  Activity,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { ActivityLog } from '../../types';

const MOCK_LOGS: ActivityLog[] = [
  { id: '1', timestamp: '2026-04-20 14:20:15', type: 'Login', user: 'admin', details: 'Admin logged in from IP 192.168.1.1' },
  { id: '2', timestamp: '2026-04-20 14:15:22', type: 'Update', user: 'admin', details: 'Updated price for 86 Diamonds (MLBB)' },
  { id: '3', timestamp: '2026-04-20 14:10:05', type: 'Transaction', user: 'system', details: 'Transaction GK-9025 processed successfully' },
  { id: '4', timestamp: '2026-04-20 14:05:40', type: 'Create', user: 'admin', details: 'Added new game: Wuthering Waves' },
  { id: '5', timestamp: '2026-04-20 14:00:12', type: 'Login', user: 'user1', details: 'User logged in' },
  { id: '6', timestamp: '2026-04-20 13:55:30', type: 'Delete', user: 'admin', details: 'Removed old payment method: Pulsa Telkomsel' },
];

export default function AdminLogs() {
  const [filter, setFilter] = useState<'All' | ActivityLog['type']>('All');
  const [search, setSearch] = useState('');

  const filteredLogs = MOCK_LOGS.filter(log => {
    const matchesFilter = filter === 'All' || log.type === filter;
    const matchesSearch = log.details.toLowerCase().includes(search.toLowerCase()) || log.user.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeStyle = (type: ActivityLog['type']) => {
    switch (type) {
      case 'Login': return 'bg-blue-400/10 text-blue-400 border-blue-400/20';
      case 'Transaction': return 'bg-jade-accent/10 text-jade-accent border-jade-accent/20';
      case 'Update': return 'bg-amber-400/10 text-amber-400 border-amber-400/20';
      case 'Create': return 'bg-green-400/10 text-green-400 border-green-400/20';
      case 'Delete': return 'bg-red-400/10 text-red-400 border-red-400/20';
      default: return 'bg-jade-mid/10 text-text-dim border-jade-mid/20';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-jade-dark/50 border border-jade-mid p-6 rounded-3xl">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-jade-accent w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search details or users..."
            className="w-full pl-12 pr-6 py-3 rounded-2xl bg-jade-bg border border-jade-mid text-text-main placeholder-text-dim/50 focus:outline-none focus:ring-2 focus:ring-jade-accent/50 transition-all font-medium text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2 lg:pb-0">
          <Filter className="w-4 h-4 text-jade-accent flex-shrink-0" />
          {['All', 'Login', 'Transaction', 'Update', 'Create', 'Delete'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                filter === type 
                  ? 'bg-jade-accent text-jade-bg shadow-lg' 
                  : 'bg-jade-bg text-text-dim hover:text-text-main hover:bg-jade-mid/20 border border-jade-mid'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-jade-dark/50 border border-jade-mid rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-jade-mid flex items-center justify-between">
          <h3 className="font-bold text-text-main font-serif italic text-lg">System Activity History</h3>
          <div className="flex items-center gap-2 text-text-dim text-[10px] font-black uppercase tracking-widest">
            <Clock className="w-3 h-3 text-jade-accent" /> Live Log Feed
          </div>
        </div>
        
        <div className="divide-y divide-jade-mid/10">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div key={log.id} className="p-6 hover:bg-jade-mid/5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-jade-bg border border-jade-mid flex items-center justify-center flex-shrink-0 group-hover:border-jade-accent transition-colors">
                    {log.type === 'Login' ? <User className="w-5 h-5 text-blue-400" /> :
                     log.type === 'Transaction' ? <Activity className="w-5 h-5 text-jade-accent" /> :
                     log.type === 'Update' ? <AlertCircle className="w-5 h-5 text-amber-400" /> :
                     <Shield className="w-5 h-5 text-text-dim" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${getTypeStyle(log.type)}`}>
                        {log.type}
                      </span>
                      <span className="text-xs font-bold text-text-main">{log.user}</span>
                    </div>
                    <p className="text-sm text-text-dim font-medium leading-relaxed group-hover:text-text-main transition-colors">{log.details}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5 text-text-dim mb-0.5">
                      <Calendar className="w-3 h-3" />
                      <span className="text-[10px] font-bold">{log.timestamp.split(' ')[0]}</span>
                    </div>
                    <span className="text-[10px] font-black text-jade-accent tracking-widest">{log.timestamp.split(' ')[1]}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
             <div className="p-20 text-center flex flex-col items-center gap-4">
              <Activity className="w-12 h-12 text-jade-mid/30" />
              <p className="text-text-dim font-bold uppercase text-xs tracking-widest">No activity found matching filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
