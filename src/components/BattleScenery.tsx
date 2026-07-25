import React, { useMemo } from 'react';
import { BATTLE_BACKGROUNDS } from '../data/battleBackgrounds';

interface BattleSceneryProps {
  planet: string;
  name?: string;
}

// PRNG helper for deterministic generation
class PRNG {
  private seed: number;
  constructor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    this.seed = Math.abs(hash) || 1;
    // advance a few times to mix it up
    this.next();
    this.next();
  }
  next() {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }
  range(min: number, max: number) {
    return min + this.next() * (max - min);
  }
}

const PLANET_PALETTES: Record<string, { sky1: string; sky2: string; bg: string; mid: string; fg: string; accent: string; build: string }> = {
  'Tatooine': { sky1: '#fde047', sky2: '#fdba74', bg: '#fcd34d', mid: '#f59e0b', fg: '#d97706', accent: '#fef08a', build: '#b45309' },
  'Jakku': { sky1: '#ffedd5', sky2: '#fed7aa', bg: '#fdba74', mid: '#f97316', fg: '#c2410c', accent: '#fff7ed', build: '#9a3412' },
  'Jedha': { sky1: '#e5e5e5', sky2: '#d4d4d4', bg: '#a3a3a3', mid: '#737373', fg: '#525252', accent: '#f5f5f5', build: '#404040' },
  'Geonosis': { sky1: '#fca5a5', sky2: '#f87171', bg: '#ef4444', mid: '#b91c1c', fg: '#7f1d1d', accent: '#fecaca', build: '#450a0a' },
  'Hoth': { sky1: '#e0f2fe', sky2: '#bae6fd', bg: '#7dd3fc', mid: '#38bdf8', fg: '#0284c7', accent: '#f0f9ff', build: '#94a3b8' },
  'Mygeeto': { sky1: '#cbd5e1', sky2: '#94a3b8', bg: '#64748b', mid: '#475569', fg: '#1e293b', accent: '#f1f5f9', build: '#0f172a' },
  'Kijimi': { sky1: '#1e293b', sky2: '#0f172a', bg: '#020617', mid: '#1e293b', fg: '#0f172a', accent: '#cbd5e1', build: '#334155' },
  'Ilum': { sky1: '#cffafe', sky2: '#a5f3fc', bg: '#67e8f9', mid: '#22d3ee', fg: '#0891b2', accent: '#ecfeff', build: '#164e63' },
  'Endor': { sky1: '#dcfce7', sky2: '#bbf7d0', bg: '#86efac', mid: '#4ade80', fg: '#16a34a', accent: '#f0fdf4', build: '#14532d' },
  'Kashyyyk': { sky1: '#a7f3d0', sky2: '#6ee7b7', bg: '#34d399', mid: '#10b981', fg: '#047857', accent: '#ecfdf5', build: '#064e3b' },
  'Yavin 4': { sky1: '#fef08a', sky2: '#fde047', bg: '#a3e635', mid: '#65a30d', fg: '#3f6212', accent: '#bef264', build: '#4d7c0f' },
  'Takodana': { sky1: '#bfdbfe', sky2: '#93c5fd', bg: '#4ade80', mid: '#22c55e', fg: '#15803d', accent: '#60a5fa', build: '#1e40af' },
  'Coruscant': { sky1: '#312e81', sky2: '#1e1b4b', bg: '#4c1d95', mid: '#3b0764', fg: '#0f172a', accent: '#fbbf24', build: '#581c87' },
  'Corellia': { sky1: '#7dd3fc', sky2: '#38bdf8', bg: '#94a3b8', mid: '#64748b', fg: '#334155', accent: '#e2e8f0', build: '#475569' },
  'Hosnian Prime': { sky1: '#fecdd3', sky2: '#fda4af', bg: '#fb7185', mid: '#e11d48', fg: '#9f1239', accent: '#ffe4e6', build: '#be123c' },
  'Kamino': { sky1: '#94a3b8', sky2: '#64748b', bg: '#3b82f6', mid: '#2563eb', fg: '#1d4ed8', accent: '#bfdbfe', build: '#1e3a8a' },
  'Mon Cala': { sky1: '#7dd3fc', sky2: '#38bdf8', bg: '#0284c7', mid: '#0369a1', fg: '#075985', accent: '#bae6fd', build: '#0c4a6e' },
  'Ahch-To': { sky1: '#e0f2fe', sky2: '#bae6fd', bg: '#0ea5e9', mid: '#0284c7', fg: '#0369a1', accent: '#f0f9ff', build: '#1e293b' },
  'Mustafar': { sky1: '#f87171', sky2: '#ef4444', bg: '#dc2626', mid: '#991b1b', fg: '#450a0a', accent: '#fca5a5', build: '#262626' },
  'Sullust': { sky1: '#fca5a5', sky2: '#f87171', bg: '#525252', mid: '#404040', fg: '#262626', accent: '#ef4444', build: '#171717' },
  'Nevarro': { sky1: '#fed7aa', sky2: '#fdba74', bg: '#78350f', mid: '#451a03', fg: '#1c1917', accent: '#fb923c', build: '#292524' },
  'Dagobah': { sky1: '#a7f3d0', sky2: '#6ee7b7', bg: '#065f46', mid: '#064e3b', fg: '#022c22', accent: '#34d399', build: '#0f172a' },
  'Naboo': { sky1: '#bfdbfe', sky2: '#93c5fd', bg: '#86efac', mid: '#4ade80', fg: '#16a34a', accent: '#60a5fa', build: '#d97706' },
  'Felucia': { sky1: '#c4b5fd', sky2: '#a78bfa', bg: '#8b5cf6', mid: '#7c3aed', fg: '#5b21b6', accent: '#ddd6fe', build: '#4c1d95' },
  'Exegol': { sky1: '#1e293b', sky2: '#0f172a', bg: '#020617', mid: '#000000', fg: '#000000', accent: '#38bdf8', build: '#0f172a' },
  'Malachor': { sky1: '#fecaca', sky2: '#f87171', bg: '#7f1d1d', mid: '#450a0a', fg: '#000000', accent: '#fca5a5', build: '#262626' },
  'Moraband': { sky1: '#fde047', sky2: '#facc15', bg: '#a16207', mid: '#713f12', fg: '#422006', accent: '#fef08a', build: '#451a03' },
  'Dathomir': { sky1: '#fca5a5', sky2: '#f87171', bg: '#991b1b', mid: '#7f1d1d', fg: '#450a0a', accent: '#fecaca', build: '#262626' },
  'Alderaan': { sky1: '#e0f2fe', sky2: '#bae6fd', bg: '#6ee7b7', mid: '#10b981', fg: '#047857', accent: '#f0f9ff', build: '#f8fafc' },
  'Lothal': { sky1: '#fef08a', sky2: '#fde047', bg: '#d97706', mid: '#b45309', fg: '#78350f', accent: '#fef9c3', build: '#e2e8f0' }
};

const FALLBACK_PALETTE = { sky1: '#fde047', sky2: '#fca5a5', bg: '#fcd34d', mid: '#f59e0b', fg: '#d97706', accent: '#fef08a', build: '#b45309' };

export const BattleScenery: React.FC<BattleSceneryProps> = ({ planet, name = '' }) => {
  const elements = useMemo(() => {
    const bgInfo = BATTLE_BACKGROUNDS.find(b => b.planet === planet && b.name === name);
    const theme = bgInfo?.theme || 'desert';
    const category = bgInfo?.category || 'Landmark';
    const p = PLANET_PALETTES[planet] || FALLBACK_PALETTE;
    
    // Seed ensures the same layout for the same exact location, but different across different ones
    const prng = new PRNG(planet + name + category);
    
    const els = [];
    
    // 1. Render Sky Gradient
    const skyId = `sky-${planet.replace(/\s+/g,'')}-${name.replace(/\s+/g,'')}`;
    els.push(
      <defs key="defs">
        <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.sky1} />
          <stop offset="100%" stopColor={p.sky2} />
        </linearGradient>
      </defs>
    );
    els.push(<rect key="sky" x="0" y="0" width="1000" height="600" fill={`url(#${skyId})`} opacity={0.6} />);

    // 2. Render Theme Specific Ground/Scenery
    if (theme === 'desert') {
      // Background Dunes
      for (let i = 0; i < 3; i++) {
        let color = i === 0 ? p.bg : i === 1 ? p.mid : p.fg;
        let startY = prng.range(300, 500) + (i * 50);
        let d = `M 0 600 L 0 ${startY}`;
        for (let x = 0; x < 1000; x += prng.range(200, 400)) {
          d += ` Q ${x + 100} ${startY - prng.range(50, 150)} ${x + 200} ${startY + prng.range(-50, 50)}`;
        }
        d += ` L 1000 600 Z`;
        els.push(<path key={`dune-${i}`} d={d} fill={color} opacity={0.9} />);
      }
      
      // Architecture
      if (category === 'Settlement' || category === 'Outpost') {
        const count = Math.floor(prng.range(3, 8));
        for(let i=0; i<count; i++) {
           const x = prng.range(100, 800);
           const r = prng.range(40, 100);
           const y = prng.range(450, 550);
           els.push(<path key={`hut-${i}`} d={`M ${x-r} ${y} A ${r} ${r} 0 0 1 ${x+r} ${y} L ${x+r} 600 L ${x-r} 600 Z`} fill={p.build} opacity={0.8} />);
           // Little door
           els.push(<rect key={`door-${i}`} x={x-10} y={y-10} width="20" height="40" fill={p.fg} />);
        }
      } else if (category === 'Landmark') {
        const x = prng.range(200, 600);
        els.push(<polygon key="lmk1" points={`${x},600 ${x+150},150 ${x+300},600`} fill={p.build} opacity={0.9} />);
        els.push(<polygon key="lmk2" points={`${x+100},600 ${x+200},250 ${x+350},600`} fill={p.mid} opacity={0.7} />);
      } else if (category === 'Facility') {
        const x = prng.range(300, 600);
        els.push(<rect key="fac" x={x} y="300" width="200" height="300" fill={p.build} />);
        els.push(<path key="fac-d" d={`M ${x} 300 A 100 50 0 0 1 ${x+200} 300 Z`} fill={p.bg} />);
      }
      
      // Suns
      els.push(<circle key="sun1" cx={prng.range(600, 800)} cy={prng.range(100, 200)} r={prng.range(40, 80)} fill={p.accent} opacity={0.8} />);
      if (prng.next() > 0.5) els.push(<circle key="sun2" cx={prng.range(200, 400)} cy={prng.range(150, 250)} r={prng.range(20, 50)} fill={p.sky1} opacity={0.9} />);
    } 
    else if (theme === 'ice') {
      // Ice mountains
      for (let i = 0; i < 3; i++) {
        let color = i === 0 ? p.bg : i === 1 ? p.mid : p.fg;
        let d = `M 0 600 `;
        let startY = prng.range(100, 400) + (i * 100);
        for (let x = 0; x <= 1000; x += prng.range(100, 200)) {
          d += `L ${x} ${startY + prng.range(-100, 100)} `;
        }
        d += `L 1000 600 Z`;
        els.push(<path key={`ice-${i}`} d={d} fill={color} opacity={0.9} />);
      }
      
      if (category === 'Facility' || category === 'Outpost') {
        els.push(<polygon key="base1" points="200,600 300,400 600,450 700,600" fill={p.build} />);
        els.push(<polygon key="base2" points="350,450 400,300 500,350 550,450" fill={p.fg} />);
        els.push(<circle key="base-dish" cx="450" cy="300" r="30" fill={p.accent} opacity={0.7} />);
      } else if (category === 'Landmark') {
        els.push(<polygon key="crys1" points="400,600 500,100 600,600" fill={p.accent} opacity={0.8} />);
        els.push(<polygon key="crys2" points="450,600 500,150 550,600" fill="#ffffff" opacity={0.5} />);
      }
    }
    else if (theme === 'forest') {
      // Canopy Background
      els.push(<rect key="f-bg" x="0" y="200" width="1000" height="400" fill={p.bg} opacity={0.6} />);
      for (let i = 0; i < 15; i++) {
        els.push(<circle key={`f-c-${i}`} cx={prng.range(0, 1000)} cy={prng.range(100, 300)} r={prng.range(80, 200)} fill={p.bg} opacity={0.8} />);
      }
      // Trunks
      for (let i = 0; i < 20; i++) {
        let x = prng.range(0, 1000);
        let w = prng.range(20, 80);
        els.push(<rect key={`f-t-${i}`} x={x} y={prng.range(-50, 200)} width={w} height="600" fill={p.mid} />);
      }
      // Foreground bushes
      for (let i = 0; i < 10; i++) {
        els.push(<circle key={`f-b-${i}`} cx={prng.range(0, 1000)} cy={prng.range(500, 650)} r={prng.range(50, 150)} fill={p.fg} />);
      }
      
      if (category === 'Settlement') {
        els.push(<rect key="hut1" x="300" y="300" width="150" height="80" rx="20" fill={p.build} />);
        els.push(<rect key="hut2" x="600" y="250" width="120" height="60" rx="15" fill={p.build} />);
        els.push(<path key="bridge" d="M 450 340 Q 525 380 600 280" stroke={p.build} strokeWidth="10" fill="none" />);
      } else if (category === 'Facility') {
        els.push(<rect key="bunk" x="400" y="450" width="200" height="150" rx="10" fill={p.build} />);
        els.push(<rect key="door" x="460" y="500" width="80" height="100" fill={p.bg} />);
      } else if (category === 'Landmark') {
        els.push(<path key="gtree" d="M 300 600 Q 400 300 350 0 L 650 0 Q 600 300 700 600 Z" fill={p.build} />);
      }
    }
    else if (theme === 'city') {
      // Skyscrapers Back
      for (let i = 0; i < 25; i++) {
        let h = prng.range(200, 500);
        els.push(<rect key={`c-bg-${i}`} x={prng.range(-50, 1000)} y={600 - h} width={prng.range(40, 120)} height={h} fill={p.bg} opacity={0.7} />);
      }
      // Skyscrapers Mid
      for (let i = 0; i < 20; i++) {
        let h = prng.range(150, 600);
        let x = prng.range(-50, 1000);
        let w = prng.range(60, 160);
        els.push(<rect key={`c-m-${i}`} x={x} y={600 - h} width={w} height={h} fill={p.mid} />);
        // Windows
        if (prng.next() > 0.4) {
          for (let wy = 600 - h + 30; wy < 600; wy += 40) {
            els.push(<rect key={`w-${i}-${wy}`} x={x + 10} y={wy} width={w - 20} height="15" fill={p.accent} opacity={0.6} className="animate-pulse" />);
          }
        }
      }
      // Skyscrapers Foreground
      for (let i = 0; i < 10; i++) {
        let h = prng.range(50, 350);
        els.push(<rect key={`c-fg-${i}`} x={prng.range(-50, 1000)} y={600 - h} width={prng.range(80, 250)} height={h} fill={p.fg} />);
      }
      
      if (category === 'Landmark') {
        els.push(<path key="dome" d="M 200 600 L 200 300 A 300 200 0 0 1 800 300 L 800 600 Z" fill={p.build} />);
        els.push(<rect key="dome-glow" x="450" y="350" width="100" height="50" fill={p.accent} opacity={0.8} />);
      } else if (category === 'Settlement' || category === 'Outpost') {
        // Slums/Lower levels
        els.push(<rect key="slum" x="0" y="450" width="1000" height="150" fill={p.build} opacity={0.9} />);
        for(let i=0; i<20; i++) {
           els.push(<rect key={`slum-l-${i}`} x={prng.range(0,1000)} y={prng.range(460, 580)} width={prng.range(10,30)} height={prng.range(10,30)} fill={p.accent} opacity={0.7} />);
        }
      }
    }
    else if (theme === 'water') {
      // Horizon / Deep water
      els.push(<rect key="w-bg" x="0" y="300" width="1000" height="300" fill={p.bg} />);
      
      // Waves Mid
      let d = `M 0 450 `;
      for (let x = 0; x <= 1000; x += 100) d += `Q ${x + 50} 400 ${x + 100} 450 T ${x + 200} 450 `;
      d += `L 1000 600 L 0 600 Z`;
      els.push(<path key="w-mid" d={d} fill={p.mid} />);
      
      // Waves Foreground
      d = `M 0 500 `;
      for (let x = 0; x <= 1000; x += 150) d += `Q ${x + 75} 450 ${x + 150} 500 T ${x + 300} 500 `;
      d += `L 1000 600 L 0 600 Z`;
      els.push(<path key="w-fg" d={d} fill={p.fg} />);

      if (category === 'Settlement' || category === 'Facility') {
        els.push(<rect key="stilt1" x="250" y="350" width="30" height="200" fill={p.build} />);
        els.push(<rect key="stilt2" x="720" y="350" width="30" height="200" fill={p.build} />);
        els.push(<ellipse key="plat" cx="500" cy="350" rx="300" ry="40" fill={p.build} />);
        els.push(<path key="dome" d="M 300 350 A 200 150 0 0 1 700 350 Z" fill={p.accent} opacity={0.3} />);
      } else if (category === 'Landmark') {
        els.push(<ellipse key="city-base" cx="500" cy="300" rx="350" ry="60" fill={p.build} />);
        for (let i = 0; i < 7; i++) {
          let cx = 200 + i * 100;
          els.push(<path key={`spire-${i}`} d={`M ${cx} 300 L ${cx+20} ${100 + prng.range(0,100)} L ${cx+40} 300 Z`} fill={p.mid} />);
        }
      }
      
      // Moons/Planets in sky
      els.push(<circle key="moon1" cx={prng.range(100, 400)} cy={prng.range(50, 150)} r={prng.range(40, 90)} fill="#ffffff" opacity={0.2} />);
    }
    else if (theme === 'volcanic') {
      // Jagged Background Mountains
      let d = `M 0 600 `;
      for (let x = 0; x <= 1000; x += prng.range(80, 160)) d += `L ${x} ${prng.range(50, 300)} `;
      d += `L 1000 600 Z`;
      els.push(<path key="v-bg" d={d} fill={p.bg} />);
      
      // Midground Mountains
      d = `M 0 600 `;
      for (let x = 0; x <= 1000; x += prng.range(120, 250)) d += `L ${x} ${prng.range(250, 450)} `;
      d += `L 1000 600 Z`;
      els.push(<path key="v-mid" d={d} fill={p.mid} />);

      // Lava River
      els.push(<path key="lava" d="M 0 550 Q 250 480 500 600 T 1000 520 L 1000 600 L 0 600 Z" fill={p.accent} opacity={0.9} className="animate-pulse" />);
      
      // Foreground Rocks
      els.push(<polygon key="v-fg1" points="0,600 250,450 450,600" fill={p.fg} />);
      els.push(<polygon key="v-fg2" points="550,600 800,400 1000,600" fill={p.fg} />);

      if (category === 'Facility' || category === 'Landmark') {
        const x = prng.range(300, 500);
        els.push(<polygon key="castle" points={`${x},500 ${x+50},100 ${x+150},100 ${x+200},500`} fill={p.build} />);
        els.push(<rect key="c-light1" x={x+70} y="150" width="60" height="20" fill={p.accent} opacity={0.8} />);
        els.push(<rect key="c-light2" x={x+70} y="200" width="60" height="20" fill={p.accent} opacity={0.8} />);
      } else if (category === 'Settlement' || category === 'Outpost') {
        els.push(<rect key="base" x="200" y="400" width="150" height="80" fill={p.build} />);
        els.push(<rect key="base-pipe" x="350" y="440" width="100" height="20" fill={p.build} />);
      }
    }
    else if (theme === 'swamp') {
      // Mist
      els.push(<rect key="s-mist" x="0" y="0" width="1000" height="600" fill={p.sky2} opacity={0.4} />);
      // Distant Hills
      els.push(<path key="s-bg" d="M 0 600 Q 250 300 500 400 T 1000 300 L 1000 600 Z" fill={p.bg} />);
      
      // Giant roots/vines
      for (let i = 0; i < 12; i++) {
        let x = prng.range(0, 1000);
        els.push(<path key={`root-${i}`} d={`M ${x} 600 Q ${x + prng.range(50, 150)} 300 ${x - prng.range(50, 100)} 50`} stroke={p.mid} strokeWidth={prng.range(15, 50)} fill="none" opacity={0.9} />);
      }
      
      // Murky water foreground
      els.push(<rect key="s-water" x="0" y="520" width="1000" height="80" fill={p.fg} opacity={0.85} />);
      
      if (category === 'Settlement' || category === 'Outpost') {
        els.push(<ellipse key="hut1" cx="300" cy="480" rx="70" ry="50" fill={p.build} />);
        els.push(<ellipse key="hut2" cx="700" cy="450" rx="60" ry="40" fill={p.build} />);
        els.push(<rect key="stilt1" x="270" y="480" width="15" height="100" fill={p.build} />);
        els.push(<rect key="stilt2" x="315" y="480" width="15" height="100" fill={p.build} />);
      } else if (category === 'Landmark') {
        els.push(<polygon key="ship" points="100,600 700,250 850,600" fill={p.build} opacity={0.6} />);
        els.push(<circle key="s-glow" cx="750" cy="400" r="20" fill={p.accent} className="animate-pulse" opacity={0.7} />);
      }
    }
    else if (theme === 'sith') {
      // Lightning
      for (let i = 0; i < 6; i++) {
        let x = prng.range(50, 950);
        els.push(<path key={`light-${i}`} d={`M ${x} 0 L ${x - 60} 200 L ${x + 80} 400 L ${x} 600`} stroke={p.accent} strokeWidth={prng.range(2, 6)} fill="none" opacity={0.7} className="animate-pulse" />);
      }
      // Monoliths
      for (let i = 0; i < 15; i++) {
        let w = prng.range(40, 120);
        els.push(<rect key={`mono-${i}`} x={prng.range(-50, 1000)} y={prng.range(50, 300)} width={w} height="600" fill={p.bg} opacity={0.8} />);
      }
      
      // Inverted Pyramids / Wedges
      els.push(<polygon key="pyr1" points="150,50 450,50 300,450" fill={p.mid} />);
      els.push(<polygon key="pyr2" points="650,-50 950,-50 800,350" fill={p.mid} />);
      
      // Flat oppressive ground
      els.push(<rect key="s-fg" x="0" y="500" width="1000" height="100" fill={p.fg} />);

      if (category === 'Landmark' || category === 'Facility') {
        // Altar / Throne
        els.push(<polygon key="altar1" points="250,500 350,250 650,250 750,500" fill={p.build} />);
        els.push(<rect key="altar2" x="400" y="150" width="200" height="100" fill={p.build} />);
        els.push(<circle key="altar-core" cx="500" cy="200" r="30" fill={p.accent} className="animate-pulse" opacity={0.9} />);
      } else if (category === 'Settlement') {
        // Tombs
        els.push(<polygon key="tomb1" points="100,500 200,400 300,500" fill={p.build} />);
        els.push(<polygon key="tomb2" points="700,500 800,350 900,500" fill={p.build} />);
      }
    }

    return els;
  }, [planet, name]);

  return (
    <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none select-none">
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 600">
        {elements}
      </svg>
    </div>
  );
};
