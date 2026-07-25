import React, { useState, useEffect } from 'react';
import { NetworkManager, Announcement } from '../utils/networkManager';
import { Newspaper, Bell, RefreshCw, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

export function AnnouncementsTab() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'news' | 'update' | 'maintenance' | 'event' | 'developer_post' | 'emergency_notice'>('all');

  const loadAnnouncements = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await NetworkManager.getAnnouncements();
      setAnnouncements(list);
    } catch (e) {
      setError('Failed to establish contact with the remote news node.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const filteredAnnouncements = announcements.filter(ann => {
    if (activeCategory === 'all') return true;
    return ann.category === activeCategory;
  });

  const categories: { value: typeof activeCategory; label: string }[] = [
    { value: 'all', label: 'ALL CHANNELS' },
    { value: 'news', label: 'NEWS' },
    { value: 'update', label: 'UPDATES' },
    { value: 'maintenance', label: 'MAINTENANCE' },
    { value: 'event', label: 'SECTOR EVENTS' },
    { value: 'developer_post', label: 'DEV LOGS' },
    { value: 'emergency_notice', label: 'EMERGENCY' },
  ];

  return (
    <div className="space-y-6 font-mono text-xs" id="announcements_tab_view">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-zinc-950/60 p-5 rounded-2xl border border-cyan-500/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/15 border border-cyan-500/20 rounded-xl">
            <Newspaper className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="font-display font-black text-sm text-white uppercase tracking-wider">Holonet Transmission Logs</h2>
            <p className="text-[10px] text-zinc-500">Live bulletin broadcasts directly from High Command</p>
          </div>
        </div>
        <button 
          onClick={loadAnnouncements}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-zinc-800 rounded-xl hover:bg-zinc-900 text-zinc-400 hover:text-white transition whitespace-nowrap self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'SYNCING...' : 'SYNC TRANSMISSION'}
        </button>
      </div>

      {/* Categories Bar */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-zinc-950 border border-zinc-900 rounded-xl overflow-x-auto">
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-wider uppercase transition whitespace-nowrap ${
              activeCategory === cat.value
                ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400'
                : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-950/20 border border-red-500/25 rounded-2xl text-red-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {loading && filteredAnnouncements.length === 0 ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-5 bg-zinc-950/20 border border-zinc-900 rounded-2xl animate-pulse space-y-2">
              <div className="h-4 bg-zinc-900 rounded w-1/3"></div>
              <div className="h-3 bg-zinc-900 rounded w-2/3"></div>
              <div className="h-3 bg-zinc-900 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="p-12 border border-zinc-900 rounded-3xl bg-zinc-900/5 text-center space-y-3">
          <Bell className="w-8 h-8 text-zinc-600 mx-auto" />
          <p className="text-zinc-400 text-sm">No transmissions broadcasted in this category.</p>
          <p className="text-zinc-600 text-xs">All sectors report complete protocol harmony.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map(ann => (
            <div 
              key={ann.id} 
              className={`p-6 border rounded-2xl transition bg-zinc-950/40 relative overflow-hidden ${
                ann.priority === 'high' 
                  ? 'border-red-500/30 hover:border-red-500/40' 
                  : ann.priority === 'medium' 
                  ? 'border-amber-500/20 hover:border-amber-500/30' 
                  : 'border-cyan-500/10 hover:border-cyan-500/20'
              }`}
            >
              {/* Highlight ribbon for High priority alert */}
              {ann.priority === 'high' && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-red-500 text-black text-[8px] font-black tracking-widest uppercase rounded-bl-xl">
                  RED ALERT
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                    ann.priority === 'high' 
                      ? 'bg-red-950 border border-red-500/30 text-red-400' 
                      : ann.priority === 'medium' 
                      ? 'bg-amber-950 border border-amber-500/30 text-amber-400' 
                      : 'bg-emerald-950 border border-emerald-500/30 text-emerald-400'
                  }`}>
                    {ann.priority} priority
                  </span>
                  
                  {ann.category && (
                    <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-cyan-950 border border-cyan-500/30 text-cyan-400">
                      {ann.category.replace('_', ' ')}
                    </span>
                  )}
                  
                  <span className="text-zinc-500 text-[10px]">Transmission ID: {ann.id}</span>
                </div>
                <div className="text-[10px] text-zinc-500">
                  Broadcast Date: {new Date(ann.date).toLocaleString()}
                </div>
              </div>

              <h3 className="text-base font-black font-display text-white tracking-wide uppercase mb-2">
                {ann.title}
              </h3>

              <p className="text-zinc-400 text-xs leading-relaxed max-w-3xl whitespace-pre-line">
                {ann.body}
              </p>

              <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center gap-2 text-[10px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-500/60" />
                <span>Authorized Signatory: <span className="text-cyan-400/80 font-bold uppercase">{ann.createdBy}</span></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
