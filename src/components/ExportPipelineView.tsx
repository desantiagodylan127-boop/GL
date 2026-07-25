import React, { useState } from 'react';
import { Download, Cpu, ShieldCheck, Box, Terminal, FileText, Smartphone, Laptop, Globe } from 'lucide-react';
import JSZip from 'jszip';

export const ExportPipelineView: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  return (
    <div className="holo-panel border border-indigo-500/30 p-8 rounded-3xl space-y-7 max-w-4xl mx-auto text-sm animate-fadeIn relative overflow-hidden box-glow" id="export_pipeline_page">
      <div className="absolute inset-0 scan-overlay pointer-events-none opacity-[0.03]"></div>
      
      <div className="relative z-10">
        <span className="bg-indigo-500/20 border border-indigo-400 text-indigo-300 text-[10px] shadow-glow px-3 py-1.5 rounded-md font-mono font-black uppercase tracking-widest leading-none block w-fit">
          INTEGRATED EXPORT & NATIVE INSTALLATION
        </span>
        <h2 className="font-display text-3xl font-black text-white tracking-widest mt-4 drop-shadow-md">Native Install <span className="text-indigo-400 font-mono text-xl">(No APK / EXE Needed)</span></h2>
        <p className="text-indigo-200/70 font-mono text-sm mt-3 leading-relaxed max-w-3xl">
          Because this game runs locally via a Progressive Web Engine, <strong className="text-white drop-shadow-md pb-0.5 border-b border-indigo-500/50">you do not need an APK, IPA, or EXE file.</strong> You can install this game directly to your device right now. It will appear on your home screen or desktop, launch completely offline, and behave exactly like a natively downloaded application.
        </p>
      </div>

      <div className="bg-black/60 border border-indigo-500/30 p-8 rounded-3xl relative overflow-hidden shadow-inner group">
        <div className="absolute top-0 right-0 bg-emerald-500/10 w-96 h-96 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
        
        <h3 className="font-display font-black text-emerald-400 tracking-widest text-xl mb-6 flex items-center gap-3 relative z-10 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)] glow-neon">
          <Smartphone className="w-6 h-6" /> HOW TO INSTALL IMMEDIATELY:
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-2 relative z-10">
          <div className="bg-gradient-to-b from-indigo-950/40 to-black/60 border border-indigo-500/20 rounded-2xl p-6 shadow-inner hover:border-indigo-400 transition-colors duration-300">
            <h4 className="text-white font-black font-display tracking-wide mb-3 flex items-center gap-2 text-base">
              <Laptop className="w-5 h-5 text-sky-400 drop-shadow-[0_0_5px_currentColor]" /> Windows / PC
            </h4>
            <ol className="list-decimal pl-5 text-xs text-indigo-300/70 space-y-3 font-mono font-bold">
              <li>Open this game page in <strong className="text-indigo-200">Google Chrome</strong> or <strong className="text-indigo-200">Edge</strong>.</li>
              <li>Look at the far right of the web address bar at the top of the browser.</li>
              <li>Click the <strong className="text-indigo-200">"Install App"</strong> icon (looks like a monitor with a down arrow).</li>
              <li>The game will be installed as a Desktop App!</li>
            </ol>
          </div>

          <div className="bg-gradient-to-b from-indigo-950/40 to-black/60 border border-indigo-500/20 rounded-2xl p-6 shadow-inner hover:border-indigo-400 transition-colors duration-300">
            <h4 className="text-white font-black font-display tracking-wide mb-3 flex items-center gap-2 text-base">
              <Smartphone className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_5px_currentColor]" /> Android
            </h4>
            <ol className="list-decimal pl-5 text-xs text-indigo-300/70 space-y-3 font-mono font-bold">
              <li>Open this game page in <strong className="text-indigo-200">Chrome for Android</strong>.</li>
              <li>Tap the <strong className="text-indigo-200">three dots menu</strong> (⋮) in the top-right corner.</li>
              <li>Select <strong className="text-indigo-200">"Add to Home screen"</strong> or <strong className="text-indigo-200">"Install app"</strong>.</li>
              <li>The game will be added directly to your app drawer!</li>
            </ol>
          </div>

          <div className="bg-gradient-to-b from-indigo-950/40 to-black/60 border border-indigo-500/20 rounded-2xl p-6 shadow-inner hover:border-indigo-400 transition-colors duration-300">
            <h4 className="text-white font-black font-display tracking-wide mb-3 flex items-center gap-2 text-base">
              <Smartphone className="w-5 h-5 text-blue-400 drop-shadow-[0_0_5px_currentColor]" /> iPhone / iPad
            </h4>
            <ol className="list-decimal pl-5 text-xs text-indigo-300/70 space-y-3 font-mono font-bold">
              <li>Open this game page in <strong className="text-indigo-200">Safari</strong>.</li>
              <li>Tap the <strong className="text-indigo-200">Share</strong> button at the bottom.</li>
              <li>Scroll down and tap <strong className="text-indigo-200">"Add to Home Screen"</strong>.</li>
              <li>The game will be installed directly to your iPhone!</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="bg-black/60 border border-amber-500/20 p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 shadow-inner group">
         <div className="absolute top-0 left-0 bg-amber-500/5 w-64 h-64 blur-[100px] rounded-full pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
         <div className="relative z-10">
            <h3 className="font-display font-black text-white tracking-widest text-lg mb-2 flex items-center gap-3 drop-shadow-md">
              <Terminal className="w-6 h-6 text-amber-500 glow-neon" /> JSON Save Exporter
            </h3>
            <p className="text-xs font-mono font-bold text-amber-200/50 max-w-md">Download your raw offline player data file for modding or backup purposes.</p>
         </div>
         <button 
           onClick={() => {
             const strSave = localStorage.getItem('swgoh_clone_save_v4') || localStorage.getItem('swgoh_clone_save_v3');
             if(strSave) {
                const blob = new Blob([strSave], {type: "application/json"});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `GL_PlayerSave_Backup_${Date.now()}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
             } else {
                alert('No save state found!');
             }
           }}
           className="bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 rounded-xl px-8 py-4 flex items-center justify-center gap-3 transition-all duration-300 text-amber-400 font-black text-xs uppercase tracking-widest shrink-0 w-full sm:w-auto shadow-glow box-glow hover:-translate-y-1 relative z-10"
         >
           <Download className="w-5 h-5 drop-shadow-[0_0_5px_currentColor]" /> Download Save Data
         </button>
      </div>
    </div>
  );
};

