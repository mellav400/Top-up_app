import React, { useState } from 'react';
import { 
  Globe, 
  Image as ImageIcon, 
  Link2, 
  Key, 
  Bell, 
  ShieldCheck, 
  Lock,
  Save,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { AppSettings } from '../../types';

export default function AdminSettings() {
  const [settings, setSettings] = useState<AppSettings>({
    siteName: 'GiokUp Premium',
    logoUrl: 'https://ais-dev-62hiyd7nxtf2g6qtcoil3w-185134013309.asia-southeast1.run.app/favicon.ico',
      contactWhatsapp: '628123456789',
  maintenanceMode: false,
    apiProviderUrl: 'https://api.gameprovider.com/v1',
    apiSecret: 'sk_live_51P2u8f7G9X...',
    notificationsEnabled: true
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="bg-jade-dark/50 border border-jade-mid rounded-3xl p-8 space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-jade-accent/10 rounded-lg">
              <Globe className="w-5 h-5 text-jade-accent" />
            </div>
            <h3 className="text-xl font-bold text-text-main font-serif italic">Website Settings</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-dim uppercase tracking-widest flex items-center gap-2">
                 Web Name
              </label>
              <input 
                type="text" 
                className="w-full px-5 py-4 rounded-xl bg-jade-bg border border-jade-mid text-text-main focus:ring-1 focus:ring-jade-glow transition-all font-bold"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-dim uppercase tracking-widest flex items-center gap-2">
                Logo URL
              </label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  className="flex-grow px-5 py-4 rounded-xl bg-jade-bg border border-jade-mid text-text-main focus:ring-1 focus:ring-jade-glow transition-all font-medium text-sm"
                  value={settings.logoUrl}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                />
                <button type="button" className="p-4 rounded-xl bg-jade-mid/20 border border-jade-mid text-text-dim hover:text-jade-glow transition-all">
                  <ImageIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 bg-jade-bg rounded-2xl border border-jade-mid shadow-inner">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${settings.notificationsEnabled ? 'bg-jade-accent/20 text-jade-accent' : 'bg-red-400/10 text-red-400'}`}>
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-main">Aktivasi Notifikasi</p>
                  <p className="text-[10px] text-text-dim uppercase font-black">Email & WhatsApp Transaction</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setSettings({ ...settings, notificationsEnabled: !settings.notificationsEnabled })}
                className={`w-12 h-6 rounded-full relative transition-colors ${settings.notificationsEnabled ? 'bg-jade-accent' : 'bg-jade-mid'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.notificationsEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* API Settings */}
        <div className="bg-jade-dark/50 border border-jade-mid rounded-3xl p-8 space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-jade-accent/10 rounded-lg">
              <Link2 className="w-5 h-5 text-jade-accent" />
            </div>
            <h3 className="text-xl font-bold text-text-main font-serif italic">API Provider Configuration</h3>
          </div>

          <div className="space-y-6">
             <div className="space-y-2">
              <label className="text-[10px] font-black text-text-dim uppercase tracking-widest">
                API Endpoint URL
              </label>
              <input 
                type="text" 
                className="w-full px-5 py-4 rounded-xl bg-jade-bg border border-jade-mid text-text-main focus:ring-1 focus:ring-jade-glow transition-all font-medium text-sm"
                value={settings.apiProviderUrl}
                onChange={(e) => setSettings({ ...settings, apiProviderUrl: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-dim uppercase tracking-widest">
                API Secret / Key
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim w-4 h-4" />
                <input 
                  type="password" 
                  className="w-full pl-12 pr-6 py-4 rounded-xl bg-jade-bg border border-jade-mid text-text-main focus:ring-1 focus:ring-jade-glow transition-all font-medium text-sm"
                  value={settings.apiSecret}
                  onChange={(e) => setSettings({ ...settings, apiSecret: e.target.value })}
                />
              </div>
            </div>

            <button type="button" className="w-full py-4 border border-jade-mid border-dashed rounded-xl text-[10px] font-black uppercase tracking-[3px] text-jade-accent hover:bg-jade-accent/10 transition-all flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" /> Test Connection
            </button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-jade-dark/50 border border-jade-mid rounded-3xl p-8 space-y-8">
           <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-jade-accent/10 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-jade-accent" />
            </div>
            <h3 className="text-xl font-bold text-text-main font-serif italic">Security & Auth</h3>
          </div>

          <div className="space-y-6">
             <div className="space-y-1">
              <label className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-1 block">Current Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-xl bg-jade-bg border border-jade-mid text-text-main focus:ring-1 focus:ring-jade-glow transition-all"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-1 block">New Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full px-5 py-4 rounded-xl bg-jade-bg border border-jade-mid text-text-main focus:ring-1 focus:ring-jade-glow transition-all"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-1 block">Confirm New</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full px-5 py-4 rounded-xl bg-jade-bg border border-jade-mid text-text-main focus:ring-1 focus:ring-jade-glow transition-all"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                />
              </div>
            </div>
            <button type="button" className="text-xs font-bold text-jade-accent hover:text-jade-glow transition-colors underline underline-offset-4">Lupa password?</button>
          </div>
        </div>

        {/* Form Actions */}
         <div className="lg:col-span-2 flex justify-end gap-4">
            <button type="button" className="px-8 py-4 bg-jade-dark border border-jade-mid rounded-2xl text-text-dim font-black text-xs uppercase tracking-widest hover:text-red-400 hover:border-red-400/30 transition-all flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Reset Settings
            </button>
            <button type="submit" className="px-12 py-4 bg-jade-accent hover:bg-jade-glow text-jade-bg rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-jade-accent/20 flex items-center gap-2">
              <Save className="w-4 h-4" /> Save All Changes
            </button>
         </div>
      </form>
    </div>
  );
}
