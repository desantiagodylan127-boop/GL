const fs = require('fs');
let content = fs.readFileSync('src/components/CampaignView.tsx', 'utf8');

// 1. Update ERAs
content = content.replace(
  /const ERAs = \['CLONE WARS', 'GALACTIC CIVIL WAR', 'NEW REPUBLIC'\] as const;/,
  "const ERAs = ['CLONE WARS', 'IMPERIAL', 'NEW REPUBLIC', 'OUTLAWS'] as const;"
);
content = content.replace(
  /n => \(n.era \|\| 'GALACTIC CIVIL WAR'\) === selectedEra/g,
  "n => (n.era || 'IMPERIAL') === selectedEra"
);

// 2. Add difficulty state
content = content.replace(
  /const \[selectedSector, setSelectedSector\] = useState<string \| null>\(null\);/,
  "const [selectedSector, setSelectedSector] = useState<string | null>(null);\n  const [selectedDifficulty, setSelectedDifficulty] = useState<'Normal' | 'Hard'>('Normal');"
);

// 3. Update activeNodes filter
content = content.replace(
  /const activeNodes = nodesToUse\.filter\(\s*n => n\.planet === selectedPlanet && n\.sector === currentSector\s*\);/,
  `const activeNodes = nodesToUse.filter(
    n => n.planet === selectedPlanet && n.sector === currentSector && (selectedDifficulty === 'Hard' ? (n.difficulty === 'Hard' || n.difficulty === 'Legend') : n.difficulty === 'Normal')
  );`
);

// 4. Add difficulty tabs above the activeNodes map
content = content.replace(
  /{activeNodes\.length === 0 \? \(/,
  `{/* Difficulty Tabs */}
          <div className="flex justify-center gap-4 mb-4 mt-2">
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

          {activeNodes.length === 0 ? (`
);

fs.writeFileSync('src/components/CampaignView.tsx', content, 'utf8');
console.log("Patched CampaignView.tsx!");
