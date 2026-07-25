const fs = require('fs');
let content = fs.readFileSync('src/components/CampaignView.tsx', 'utf8');

const targetStr = `{/* Nodes Timeline list */}
        <div className="space-y-4 relative z-10">
          <div className="absolute left-[24px] top-[10px] bottom-[10px] w-0.5 bg-gradient-to-b from-emerald-500/50 via-emerald-500/10 to-transparent blur-[1px]"></div>
          {activeNodes.length > 0 ? (`;

const replacementStr = `{/* Nodes Timeline list */}
        <div className="space-y-4 relative z-10">
          {/* Difficulty Tabs */}
          <div className="flex justify-center gap-4 mb-6 relative z-10">
            <button
              onClick={() => setSelectedDifficulty('Normal')}
              className={\`px-6 py-2 rounded-xl font-mono text-xs tracking-widest uppercase transition-all duration-300 shadow-glow \${
                selectedDifficulty === 'Normal' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 glow-neon' : 'bg-black/40 text-zinc-500 border border-zinc-800 hover:border-emerald-500/30 hover:text-zinc-300'
              }\`}
            >
              Normal
            </button>
            <button
              onClick={() => setSelectedDifficulty('Hard')}
              className={\`px-6 py-2 rounded-xl font-mono text-xs tracking-widest uppercase transition-all duration-300 shadow-glow \${
                selectedDifficulty === 'Hard' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-black/40 text-zinc-500 border border-zinc-800 hover:border-rose-500/30 hover:text-zinc-300'
              }\`}
            >
              Hard
            </button>
          </div>
          <div className="absolute left-[24px] top-[70px] bottom-[10px] w-0.5 bg-gradient-to-b from-emerald-500/50 via-emerald-500/10 to-transparent blur-[1px]"></div>
          {activeNodes.length > 0 ? (`

content = content.replace(targetStr, replacementStr);

fs.writeFileSync('src/components/CampaignView.tsx', content, 'utf8');
console.log("Patched Difficulty Tabs!");
