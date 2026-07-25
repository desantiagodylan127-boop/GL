import React from 'react';
import { ShieldAlert, X } from 'lucide-react';

interface InfoDialogProps {
  title: string;
  content: string | React.ReactNode;
  onClose: () => void;
}

export const InfoDialog: React.FC<InfoDialogProps> = ({ title, content, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-black/90 border border-cyan-500/40 w-full max-w-lg p-6 rounded-2xl shadow-glow relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition">
           <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-4">
           <ShieldAlert className="w-6 h-6 text-cyan-400" />
           <h3 className="font-display font-black text-white text-xl uppercase tracking-widest">{title}</h3>
        </div>
        <div className="text-zinc-300 font-mono text-sm leading-relaxed space-y-4">
           {content}
        </div>
        <button onClick={onClose} className="mt-6 w-full py-3 bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded-xl hover:bg-cyan-500/30 transition uppercase font-black tracking-widest text-[11px] glow-neon">
           Acknowledge
        </button>
      </div>
    </div>
  );
};
