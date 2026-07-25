import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CombatUnit } from '../types';
import { STATUS_DEFINITIONS } from '../utils/statusRegistry';
import { getCharacterAnimationFamily, FACTION_COLORS, getAbilityAnimationType } from '../utils/combatAnimations';

interface HoloCombatUnitProps {
  unit: CombatUnit;
  isActive: boolean;
  isAttacking?: boolean;
  isSelectedTarget: boolean;
  isSelectedAlly: boolean;
  onSelect: () => void;
  onDoubleClick?: () => void;
  strikeEffect?: { family: string; type: string } | null;
}

export const StrikeVisual: React.FC<{ family: string, type: string }> = ({ family, type }) => {
  const isSpecial = type === 'special';
  const isFinisher = type === 'finisher';

  // --- 1. GALACTIC LEGENDS (GLs) ---
  if (family === 'gl_kenobi_basic' || family === 'gl_kenobi_ultimate') {
    const isUlt = family === 'gl_kenobi_ultimate';
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        {/* Soothing Blue Force Striae */}
        <motion.div 
          initial={{ scale: 0.5, opacity: 0, rotate: 0 }}
          animate={isUlt ? { scale: [1, 3, 1], opacity: [0, 1, 0], rotate: 360 } : { scale: 1.8, opacity: 0, rotate: 180 }}
          transition={{ duration: isUlt ? 1.5 : 0.6, ease: "easeInOut" }}
          className="absolute w-24 h-24 rounded-full border-2 border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.8)]"
        />
        {isUlt && (
          <>
            {/* High Ground Pillar of Light */}
            <motion.div
              initial={{ height: 0, y: -200, opacity: 1 }}
              animate={{ height: 350, y: -100, opacity: [1, 1, 0] }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute w-8 bg-gradient-to-b from-white via-cyan-300 to-indigo-500 rounded-full blur-sm shadow-[0_0_40px_rgba(6,182,212,1)]"
            />
            {/* Shimmering Golden Sparks */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: (i % 2 ? 40 : -40) * Math.random(), y: -80 * Math.random() - 20, opacity: 0, scale: 0.2 }}
                transition={{ duration: 1.0, delay: i * 0.05 }}
                className="absolute w-2 h-2 bg-amber-300 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)]"
              />
            ))}
          </>
        )}
        <motion.div 
          initial={{ scale: 0.8, opacity: 1, rotate: -30, x: -30, y: -30 }}
          animate={{ scale: 2.2, opacity: 0, x: 30, y: 30 }}
          transition={{ duration: 0.5 }}
          className="w-2.5 h-36 bg-white rounded-full shadow-[0_0_20px_rgba(96,165,250,1),0_0_40px_rgba(96,165,250,0.8)] absolute"
        />
      </div>
    );
  }

  if (family === 'gl_vader_basic' || family === 'gl_vader_ultimate') {
    const isUlt = family === 'gl_vader_ultimate';
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        {/* Red Imperial Doom Aura */}
        <motion.div 
          initial={{ scale: 0.2, opacity: 1 }}
          animate={isUlt ? { scale: [1, 2.5, 0], opacity: [0.8, 1, 0] } : { scale: 1.8, opacity: 0 }}
          transition={{ duration: isUlt ? 1.6 : 0.5, ease: "easeOut" }}
          className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-red-600 to-purple-900 blur-md shadow-[0_0_40px_rgba(220,38,38,1)]"
        />
        {isUlt && (
          <>
            {/* Crackling Red Lightning */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scaleY: 0.2 }}
                animate={{ opacity: [0, 1, 0, 1, 0], scaleY: [1, 1.5, 1] }}
                transition={{ duration: 1.0, delay: i * 0.1 }}
                className="absolute w-1 h-36 bg-red-400 blur-[1px] shadow-[0_0_15px_rgba(239,68,68,1)]"
                style={{ rotate: `${(i - 1.5) * 35}deg` }}
              />
            ))}
            {/* Blackout overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: 1.2 }}
              className="absolute -inset-96 bg-black z-[-1] rounded-full blur-2xl"
            />
          </>
        )}
        <motion.div 
          initial={{ scale: 0.7, opacity: 1, rotate: 45, x: 30, y: -30 }}
          animate={{ scale: 2.5, opacity: 0, x: -30, y: 45 }}
          transition={{ duration: 0.55 }}
          className="w-3 h-32 bg-white rounded-full shadow-[0_0_20px_rgba(239,68,68,1),0_0_40px_rgba(239,68,68,1)] absolute"
        />
      </div>
    );
  }

  if (family === 'gl_leia_basic' || family === 'gl_leia_ultimate') {
    const isUlt = family === 'gl_leia_ultimate';
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        {/* Rebellion Blue and White Starburst */}
        <motion.div
          initial={{ scale: 0.1, opacity: 0 }}
          animate={{ scale: isUlt ? [1, 2.8, 1] : 1.5, opacity: [0, 1, 0] }}
          transition={{ duration: isUlt ? 1.4 : 0.5 }}
          className="absolute w-20 h-20 bg-cyan-400 rounded-full blur-xl shadow-[0_0_35px_rgba(56,189,248,1)]"
        />
        {isUlt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
            animate={{ opacity: [0, 1, 0], scale: 2, rotate: 45 }}
            transition={{ duration: 1.3 }}
            className="absolute text-cyan-300 font-bold text-4xl shadow-glow"
          >
            ★
          </motion.div>
        )}
        <motion.div 
          initial={{ scale: 0.5, opacity: 1, x: -50 }}
          animate={{ scale: 1.8, opacity: 0, x: 50 }}
          transition={{ duration: 0.4 }}
          className="w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(59,130,246,1),0_0_30px_rgba(59,130,246,1)]"
        />
      </div>
    );
  }

  if (family === 'gl_jabba_basic' || family === 'gl_jabba_ultimate') {
    const isUlt = family === 'gl_jabba_ultimate';
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        {/* Rancor Claws or Slime */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: -40 }}
          animate={{ scale: isUlt ? 2.5 : 1.5, opacity: [0, 1, 0], y: 10 }}
          transition={{ duration: isUlt ? 1.2 : 0.5 }}
          className="absolute w-24 h-16 bg-gradient-to-b from-green-900/40 to-green-600/20 rounded-full blur-md"
        />
        {isUlt && (
          <div className="absolute flex gap-1 justify-center z-50">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -80, opacity: 0, height: 10 }}
                animate={{ y: 50, opacity: [0, 1, 0], height: [40, 80, 20] }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: "easeIn" }}
                className="w-2.5 bg-stone-700 rounded-b-full shadow-[0_0_15px_rgba(34,197,94,0.5)]"
              />
            ))}
          </div>
        )}
        <motion.div 
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 2.0, opacity: [0, 1, 0] }}
          transition={{ duration: 0.4 }}
          className="absolute w-12 h-12 rounded-full bg-yellow-500 blur-sm shadow-[0_0_15px_rgba(234,179,8,1)]"
        />
      </div>
    );
  }

  if (family === 'gl_rey_basic' || family === 'gl_rey_ultimate') {
    const isUlt = family === 'gl_rey_ultimate';
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        {/* Sparkling Yellow Force Shielding */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={isUlt ? { scale: [1, 2.5, 1.2], opacity: [0, 0.9, 0] } : { scale: 1.5, opacity: [0, 1, 0] }}
          transition={{ duration: isUlt ? 1.5 : 0.5 }}
          className="absolute w-28 h-28 border-4 border-yellow-300 rounded-full bg-yellow-400/10 blur-sm shadow-[0_0_35px_rgba(250,204,21,0.8)]"
        />
        {isUlt && (
          <>
            <motion.div 
              initial={{ scale: 0.6, opacity: 1, rotate: -45, x: -40 }}
              animate={{ scale: 2.2, opacity: 0, x: 40 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="w-2 h-32 bg-white rounded-full shadow-[0_0_15px_rgba(250,204,21,1)] absolute"
            />
            <motion.div 
              initial={{ scale: 0.6, opacity: 1, rotate: 45, x: 40 }}
              animate={{ scale: 2.2, opacity: 0, x: -40 }}
              transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
              className="w-2 h-32 bg-white rounded-full shadow-[0_0_15px_rgba(96,165,250,1)] absolute"
            />
          </>
        )}
        {!isUlt && (
          <motion.div 
            initial={{ scale: 0.7, opacity: 1, rotate: -30 }}
            animate={{ scale: 2.0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-2 h-24 bg-white rounded-full shadow-[0_0_15px_rgba(250,204,21,1)]"
          />
        )}
      </div>
    );
  }

  if (family === 'gl_grievous_basic' || family === 'gl_grievous_ultimate') {
    const isUlt = family === 'gl_grievous_ultimate';
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        {/* Quad Blade Cyclone */}
        <motion.div
          initial={{ rotate: 0, scale: 0.5, opacity: 1 }}
          animate={{ rotate: 720, scale: isUlt ? 2.4 : 1.6, opacity: 0 }}
          transition={{ duration: isUlt ? 1.3 : 0.6, ease: "linear" }}
          className="absolute w-32 h-32 rounded-full border-4 border-dashed border-cyan-400 bg-transparent shadow-[0_0_20px_rgba(34,211,238,0.5),_inset_0_0_20px_rgba(74,222,128,0.5)]"
        />
        {isUlt && (
          <motion.div
            initial={{ scale: 0.8, opacity: 1 }}
            animate={{ scale: 2.6, opacity: 0 }}
            transition={{ duration: 1.0, delay: 0.3 }}
            className="absolute inset-0 bg-red-600/20 rounded-full blur-xl shadow-[0_0_40px_rgba(239,68,68,0.6)]"
          />
        )}
        <div className="absolute flex gap-4">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.2 }} className="w-1 h-16 bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,1)]" />
          <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 0.2 }} className="w-1 h-16 bg-green-300 shadow-[0_0_10px_rgba(74,222,128,1)]" />
        </div>
      </div>
    );
  }

  if (family === 'gl_sidious_basic' || family === 'gl_sidious_ultimate') {
    const isUlt = family === 'gl_sidious_ultimate';
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        {/* Purple Sith Lightning */}
        {[...Array(isUlt ? 6 : 3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5, rotate: i * 40 }}
            animate={{ opacity: [0, 1, 0, 1, 0], scale: [1, 2, 1.2], rotate: i * 40 + (Math.random() * 20 - 10) }}
            transition={{ duration: isUlt ? 1.4 : 0.5, delay: i * 0.05 }}
            className="absolute w-1 h-40 bg-indigo-200 blur-[1px] shadow-[0_0_20px_rgba(139,92,246,1),0_0_5px_white]"
          />
        ))}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: isUlt ? 2.8 : 1.5, opacity: [0, 0.8, 0] }}
          transition={{ duration: isUlt ? 1.2 : 0.4 }}
          className="absolute w-20 h-20 bg-purple-900/30 rounded-full blur-lg"
        />
      </div>
    );
  }

  if (family === 'gl_hondo_basic' || family === 'gl_hondo_ultimate') {
    const isUlt = family === 'gl_hondo_ultimate';
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ scale: 0.8, opacity: 1, y: -40 }}
          animate={{ scale: isUlt ? 2.5 : 1.6, opacity: 0, y: isUlt ? 30 : 10 }}
          transition={{ duration: isUlt ? 1.1 : 0.4 }}
          className="absolute w-16 h-16 rounded-full bg-amber-500 blur-sm shadow-[0_0_25px_rgba(245,158,11,1)]"
        />
        {isUlt && (
          <div className="absolute w-24 h-24 border border-dashed border-amber-400 rounded-full flex items-center justify-center">
             <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-amber-300 font-bold text-lg">⚓</motion.span>
          </div>
        )}
      </div>
    );
  }

  if (family === 'gl_ahsoka_basic' || family === 'gl_ahsoka_ultimate') {
    const isUlt = family === 'gl_ahsoka_ultimate';
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        {/* Pure White Dual Blades */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 1, rotate: -45, x: -40 }}
          animate={{ scale: 2.2, opacity: 0, x: 40 }}
          transition={{ duration: isUlt ? 0.9 : 0.4, ease: "easeOut" }}
          className="w-2.5 h-32 bg-white rounded-full shadow-[0_0_20px_white,0_0_40px_rgba(244,244,245,0.7)] absolute"
        />
        {(isSpecial || isUlt) && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 1, rotate: 45, x: 40 }}
            animate={{ scale: 2.2, opacity: 0, x: -40 }}
            transition={{ duration: isUlt ? 0.9 : 0.4, delay: 0.1, ease: "easeOut" }}
            className="w-2.5 h-32 bg-white rounded-full shadow-[0_0_20px_white,0_0_40px_rgba(244,244,245,0.7)] absolute"
          />
        )}
        {isUlt && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 2.5, opacity: [0, 1, 0] }}
            transition={{ duration: 1.4 }}
            className="absolute w-24 h-24 bg-gradient-to-r from-blue-400/20 via-white/10 to-purple-400/20 rounded-full blur-xl"
          />
        )}
      </div>
    );
  }

  // --- 2. CONQUEST EXCLUSIVES ---
  if (family === 'reva') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ rotate: 0, scale: 0.8, opacity: 1 }}
          animate={{ rotate: 360, scale: isSpecial ? 2.4 : 1.8, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute w-24 h-24 rounded-full border-4 border-double border-red-600 bg-transparent shadow-[0_0_25px_rgba(239,68,68,0.8)]"
        />
      </div>
    );
  }

  if (family === 'enoch') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [1, 2, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 0.8 }}
          className="absolute w-20 h-20 border-2 border-amber-400 rounded-lg shadow-[0_0_20px_rgba(251,191,36,0.5)] rotate-45"
        />
        <motion.div 
          initial={{ scale: 0.6, opacity: 1, x: -40 }}
          animate={{ scale: 1.5, opacity: 0, x: 40 }}
          transition={{ duration: 0.3 }}
          className="w-2 h-16 bg-white rounded-full shadow-[0_0_15px_rgba(239,68,68,1)]"
        />
      </div>
    );
  }

  if (family === 'shin') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div 
          initial={{ scale: 0.5, opacity: 1, rotate: 15, x: 40, y: -20 }}
          animate={{ scale: 2.2, opacity: 0, x: -30, y: 30 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-2 h-28 bg-white rounded-full shadow-[0_0_15px_rgba(249,115,22,1),0_0_30px_rgba(239,68,68,0.8)]"
        />
      </div>
    );
  }

  if (family === 'baylan') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div 
          initial={{ scale: 1.2, opacity: 1, y: -80, rotate: -5 }}
          animate={{ scale: 2.4, opacity: 0, y: 40 }}
          transition={{ duration: 0.5, ease: "easeIn" }}
          className="w-4.5 h-36 bg-white rounded-full shadow-[0_0_25px_rgba(249,115,22,1),0_0_50px_rgba(239,68,68,1)]"
        />
      </div>
    );
  }

  if (family === 'morgan') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 2.3, opacity: [0, 1, 0], rotate: [0, 180] }}
          transition={{ duration: 0.8 }}
          className="absolute w-24 h-24 border-2 border-emerald-500 rounded-full bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.8)]"
        />
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: 0, y: 10, opacity: 1, scale: 0.8 }}
            animate={{ x: (i - 1.5) * 25, y: -50, opacity: 0, scale: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            className="absolute w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,1)]"
          />
        ))}
      </div>
    );
  }

  if (family === 'malicos') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div 
          initial={{ scale: 0.8, opacity: 1, rotate: -45, y: -50 }}
          animate={{ scale: 2.0, opacity: 0, y: 50, rotate: 135 }}
          transition={{ duration: 0.5 }}
          className="w-2 h-24 bg-white rounded-full shadow-[0_0_15px_rgba(239,68,68,1)] absolute"
        />
        <motion.div 
          initial={{ scale: 0.8, opacity: 1, rotate: 45, y: -50 }}
          animate={{ scale: 2.0, opacity: 0, y: 50, rotate: -135 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-2 h-24 bg-white rounded-full shadow-[0_0_15px_rgba(239,68,68,1)] absolute"
        />
      </div>
    );
  }

  // --- 3. JOURNEYS ---
  if (family === 'j_skywalker') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div 
          initial={{ scale: 1.2, opacity: 1, y: -60, rotate: -15 }}
          animate={{ scale: 2.5, opacity: 0, y: 30 }}
          transition={{ duration: 0.45, ease: "easeIn" }}
          className="w-3.5 h-36 bg-white rounded-full shadow-[0_0_25px_rgba(59,130,246,1),0_0_50px_rgba(59,130,246,0.8)]"
        />
      </div>
    );
  }

  if (family === 'j_boba_daimyo') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        {/* Flying Missile */}
        <motion.div
          initial={{ x: -80, y: -80, scale: 0.5, rotate: 45 }}
          animate={{ x: 0, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute w-8 h-3 bg-stone-500 rounded-full border border-orange-500 shadow-[0_0_15px_rgba(249,115,22,1)]"
        />
        <motion.div 
          initial={{ scale: 0.8, opacity: 1 }}
          animate={{ scale: 2.8, opacity: 0 }}
          transition={{ duration: 0.45, delay: 0.28 }}
          className="absolute w-20 h-20 bg-orange-500 rounded-full blur-sm shadow-[0_0_35px_rgba(249,115,22,1)]"
        />
      </div>
    );
  }

  if (family === 'j_general_kenobi') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div 
          initial={{ scale: 0.8, opacity: 1, rotate: -90, x: -40 }}
          animate={{ scale: 2.2, opacity: 0, rotate: 90, x: 40 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-2.5 h-32 bg-white rounded-full shadow-[0_0_20px_rgba(59,130,246,1),0_0_40px_rgba(59,130,246,0.7)]"
        />
      </div>
    );
  }

  if (family === 'j_grievous') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <div className="absolute flex gap-6">
          <motion.div 
            initial={{ scale: 0.6, opacity: 1, rotate: -30 }}
            animate={{ scale: 1.8, opacity: 0, rotate: 180 }}
            transition={{ duration: 0.4 }}
            className="w-2 h-20 bg-white rounded-full shadow-[0_0_15px_rgba(34,211,238,1)]"
          />
          <motion.div 
            initial={{ scale: 0.6, opacity: 1, rotate: 30 }}
            animate={{ scale: 1.8, opacity: 0, rotate: -180 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-2 h-20 bg-white rounded-full shadow-[0_0_15px_rgba(74,222,128,1)]"
          />
        </div>
      </div>
    );
  }

  if (family === 'j_grand_inquisitor') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ rotate: 0, scale: 0.6, opacity: 1 }}
          animate={{ rotate: 540, scale: 2.4, opacity: 0 }}
          transition={{ duration: 0.55 }}
          className="absolute w-28 h-28 rounded-full border-4 border-dashed border-red-600 bg-red-600/10 shadow-[0_0_30px_rgba(220,38,38,1)]"
        />
      </div>
    );
  }

  if (family === 'j_trench') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.8, opacity: [0, 1, 0] }}
          transition={{ duration: 0.5 }}
          className="absolute w-24 h-24 border-2 border-red-400 bg-red-900/20 shadow-[0_0_20px_rgba(248,113,113,0.5)] flex items-center justify-center"
        >
          <div className="w-16 h-16 border border-dashed border-red-300 rounded-full animate-spin"></div>
        </motion.div>
      </div>
    );
  }

  if (family === 'j_krennic') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        {/* Death Star superlaser targeting */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 300, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.6 }}
          className="absolute h-1.5 bg-green-400 shadow-[0_0_15px_rgba(74,222,128,1)] rotate-45"
        />
        <motion.div
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: 2.5, opacity: [0, 1, 0] }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="absolute w-12 h-12 rounded-full bg-white shadow-[0_0_25px_white]"
        />
      </div>
    );
  }

  if (family === 'j_raddus') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ y: -150, opacity: 0, scaleX: 0.2 }}
          animate={{ y: 0, opacity: [0, 1, 0], scaleX: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute w-6 h-48 bg-gradient-to-b from-transparent via-cyan-400 to-white shadow-[0_0_20px_rgba(34,211,238,1)]"
        />
      </div>
    );
  }

  if (family === 'j_plo_koon') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: [0, 1, 0, 1, 0], scale: 1.8 }}
          transition={{ duration: 0.55 }}
          className="absolute w-20 h-20 border border-yellow-400 bg-yellow-400/10 shadow-[0_0_20px_rgba(250,204,21,1)] rounded-full flex items-center justify-center"
        >
          <span className="text-yellow-300 font-bold text-2xl">⚡</span>
        </motion.div>
      </div>
    );
  }

  if (family === 'j_maul_mandalore') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div 
          initial={{ scale: 0.7, opacity: 1, rotate: -45 }}
          animate={{ scale: 2.3, opacity: 0, rotate: 135 }}
          transition={{ duration: 0.5 }}
          className="w-3 h-32 bg-white rounded-full shadow-[0_0_20px_rgba(220,38,38,1)] absolute"
        />
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 2.2, opacity: [0, 0.7, 0] }}
          transition={{ duration: 0.6 }}
          className="absolute w-20 h-20 bg-black/80 shadow-[inset_0_0_20px_rgba(220,38,38,1)] rounded-full blur-sm"
        />
      </div>
    );
  }

  if (family === 'j_palpatine') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scaleX: 0.3, rotate: (i - 1) * 20 }}
            animate={{ opacity: [0, 1, 0, 1, 0], scaleX: 1.5 }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="absolute w-1 h-32 bg-red-400 blur-[1px] shadow-[0_0_15px_rgba(239,68,68,1)]"
          />
        ))}
      </div>
    );
  }

  if (family === 'j_ki_adi_mundi') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div 
          initial={{ scale: 0.8, opacity: 1, rotate: -30, x: -30 }}
          animate={{ scale: 2.2, opacity: 0, x: 30 }}
          transition={{ duration: 0.4 }}
          className="w-2.5 h-32 bg-white rounded-full shadow-[0_0_20px_rgba(96,165,250,1)]"
        />
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 60, opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.4 }}
          className="absolute w-12 h-6 bg-cyan-500/20 border-l border-cyan-400 flex items-center justify-center text-[8px] font-mono font-bold text-cyan-300"
        >
          CHARGE
        </motion.div>
      </div>
    );
  }

  if (family === 'j_crosshair') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        {/* Reticle */}
        <motion.div
          initial={{ scale: 2.2, opacity: 0 }}
          animate={{ scale: 1.0, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.5 }}
          className="absolute w-10 h-10 border-2 border-green-500 rounded-full flex items-center justify-center"
        >
          <div className="w-4 h-[1px] bg-green-500" />
          <div className="h-4 w-[1px] bg-green-500 absolute" />
        </motion.div>
        {/* Bullet spark */}
        <motion.div
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: 2.0, opacity: [0, 1, 0] }}
          transition={{ duration: 0.2, delay: 0.45 }}
          className="absolute w-8 h-8 rounded-full bg-white shadow-[0_0_15px_rgba(34,197,94,1)] blur-[2px]"
        />
      </div>
    );
  }

  if (family === 'j_pikk_mukmuk') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: [1, 2, 0], rotate: [0, 360] }}
          transition={{ duration: 0.6 }}
          className="absolute text-yellow-300 text-3xl font-bold"
        >
          🍌
        </motion.div>
      </div>
    );
  }

  if (family === 'j_qira') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div 
          initial={{ scale: 0.8, opacity: 1, rotate: -45 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="w-2 h-24 bg-white rounded-full shadow-[0_0_15px_rgba(249,115,22,0.8)] absolute"
        />
        <motion.div 
          initial={{ scale: 0.8, opacity: 1, rotate: 45 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="w-2 h-24 bg-white rounded-full shadow-[0_0_15px_rgba(249,115,22,0.8)] absolute"
        />
      </div>
    );
  }

  if (family === 'j_ezra_exile') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 2.5, opacity: [0, 1, 0] }}
          transition={{ duration: 0.45 }}
          className="absolute w-24 h-24 rounded-full border border-emerald-400 bg-emerald-500/10 shadow-[0_0_20px_rgba(52,211,153,0.7)]"
        />
      </div>
    );
  }

  if (family === 'j_pellaeon') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 2.0, opacity: [0, 1, 0] }}
          transition={{ duration: 0.5 }}
          className="absolute w-24 h-24 rounded-full bg-red-600/30 blur-md"
        />
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 20, opacity: [0, 1, 0] }}
          transition={{ duration: 0.4 }}
          className="absolute w-3 h-32 bg-white rounded-full shadow-[0_0_20px_rgba(220,38,38,1)]"
        />
      </div>
    );
  }

  if (family === 'j_bo_katan_mandalor') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 2.2, opacity: [0, 1, 0] }}
          transition={{ duration: 0.4 }}
          className="absolute w-20 h-20 rounded-full border-2 border-cyan-400 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,0.8)]"
        />
        <motion.div 
          initial={{ scale: 0.8, opacity: 1, rotate: -30 }}
          animate={{ scale: 2.0, opacity: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="w-2.5 h-24 bg-white rounded-full shadow-[0_0_15px_rgba(34,211,238,1)] absolute"
        />
      </div>
    );
  }

  // --- 4. ELITE MARQUEES ---
  if (family === 'em_din') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        {/* Whistling Birds */}
        {[...Array(isSpecial || isFinisher ? 6 : 3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: -50, y: -40, opacity: 0, scale: 0.5 }}
            animate={{ x: (i - 1) * 30, y: (Math.random() * 40 - 20), opacity: [0, 1, 0], scale: 1.2 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="absolute w-4 h-1 bg-cyan-100 rounded-full shadow-[0_0_10px_rgba(34,211,238,1)]"
          />
        ))}
      </div>
    );
  }

  if (family === 'em_voren') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: [1, 2, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 0.7 }}
          className="absolute w-16 h-16 border-2 border-red-500 rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.5)] rotate-45"
        />
      </div>
    );
  }

  // --- NEW GLs ---
  if (family === 'gl_luke_basic') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div 
           initial={{ scale: 0.6, opacity: 1, rotate: -30, x: -50, y: -20 }}
           animate={{ scale: [1, 2.2, 0], opacity: [0, 1, 1, 0], x: 50, y: 20 }}
           transition={{ duration: 0.45, ease: "easeOut" }}
           className="w-3 h-28 bg-white rounded-full shadow-[0_0_20px_rgba(34,197,94,1),0_0_45px_rgba(34,197,94,0.8)]"
        />
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 2.5, opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="absolute w-20 h-20 border-2 border-green-400 rounded-full shadow-[0_0_15px_rgba(74,222,128,0.5)]"
        />
      </div>
    );
  }

  if (family === 'gl_luke_ultimate') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: [0, 3, 3, 0], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.8, times: [0, 0.15, 0.85, 1] }}
          className="absolute w-12 h-[300%] bg-gradient-to-t from-emerald-500/10 via-green-400/80 to-emerald-300/10 shadow-[0_0_50px_rgba(74,222,128,0.9)]"
        />
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ rotate: i * 60, scale: 0, opacity: 0, x: 0, y: 0 }}
            animate={{ 
              scale: [0, 1.2, 0], 
              opacity: [0, 1, 0],
              x: Math.cos((i * 60 * Math.PI) / 180) * 80,
              y: Math.sin((i * 60 * Math.PI) / 180) * 80
            }}
            transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: "easeOut" }}
            className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_12px_rgba(74,222,128,1)]"
          />
        ))}
      </div>
    );
  }

  if (family === 'gl_trench_basic') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.5, 2.0, 0.5], opacity: [0, 1, 0] }}
          transition={{ duration: 0.6 }}
          className="absolute w-24 h-24 border-4 border-amber-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,1)] bg-amber-500/10"
        />
        <motion.div
          initial={{ scale: 0.1, opacity: 0, x: -80 }}
          animate={{ scale: [0.1, 1.5, 0], opacity: [0, 1, 0], x: 80 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="absolute w-4 h-4 bg-orange-600 rounded-full shadow-[0_0_15px_rgba(234,88,12,1)]"
        />
      </div>
    );
  }

  if (family === 'gl_trench_ultimate') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: [0, 1.2, 1.2, 0], opacity: [0, 0.7, 0.7, 0] }}
          transition={{ duration: 1.8 }}
          className="absolute w-32 h-32 border-2 border-red-500 border-dashed rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)] bg-red-950/10"
        >
          <div className="w-16 h-16 border border-red-500 rounded-full animate-ping" />
        </motion.div>
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: -100 - i * 20, y: -60 + i * 30, opacity: 0 }}
            animate={{ x: 100, y: 10, opacity: [0, 1, 0] }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
            className="absolute w-12 h-1 bg-red-600 rounded-full shadow-[0_0_10px_red]"
          />
        ))}
      </div>
    );
  }

  if (family === 'gl_maz_basic') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: [1, 2.5, 0], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.6 }}
          className="w-16 h-16 bg-gradient-to-tr from-yellow-400 to-amber-300 rounded-full blur-sm shadow-[0_0_25px_rgba(245,158,11,1)]"
        />
      </div>
    );
  }

  if (family === 'gl_maz_ultimate') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: 0 }}
          animate={{ scale: [0.5, 2.2, 0.5], opacity: [0, 1, 0], rotate: 360 }}
          transition={{ duration: 1.8 }}
          className="absolute w-36 h-36 flex items-center justify-center"
        >
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            return (
              <div 
                key={i} 
                className="absolute w-2.5 h-2.5 bg-yellow-300 rounded-full shadow-[0_0_8px_yellow]"
                style={{
                  transform: `translate(${Math.cos(angle) * 50}px, ${Math.sin(angle) * 50}px)`
                }}
              />
            );
          })}
        </motion.div>
        <motion.div
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: [0.2, 3.0, 0.2], opacity: [0, 0.9, 0] }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute w-24 h-24 bg-amber-400 rounded-full blur-xl shadow-[0_0_40px_rgba(245,158,11,0.8)]"
        />
      </div>
    );
  }

  if (family === 'gl_thrawn_basic') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: [0, 2.5, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.5 }}
          className="absolute w-28 h-2 bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,1)]"
        />
        <motion.div
          initial={{ x: -120, opacity: 0 }}
          animate={{ x: 120, opacity: [0, 1, 0] }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="absolute w-14 h-1 bg-red-500 shadow-[0_0_10px_red]"
        />
      </div>
    );
  }

  if (family === 'gl_thrawn_ultimate') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: -50 }}
          animate={{ scale: [0.8, 1.4, 0.8], opacity: [0, 0.45, 0], y: 0 }}
          transition={{ duration: 2.0 }}
          className="absolute w-48 h-32 bg-slate-900 border-b-4 border-red-500/40 opacity-40 shadow-[0_0_50px_rgba(239,68,68,0.2)] rounded-t-full"
        />
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: -100 + i * 100, y: -100, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute w-1 h-32 bg-sky-400 origin-bottom"
            style={{ transform: `rotate(${(i - 1) * 20}deg)` }}
          />
        ))}
        <motion.div
          initial={{ scale: 0.1, opacity: 0 }}
          animate={{ scale: [0.1, 3.5, 0.1], opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="absolute w-24 h-24 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 rounded-full blur-md shadow-[0_0_40px_red]"
        />
      </div>
    );
  }

  // --- CONQUEST EXCLUSIVES ---
  if (family === 'cq_vsd') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.4, opacity: 0, x: -30 + i * 30 }}
            animate={{ scale: [0.4, 1.8, 0.4], opacity: [0, 0.75, 0], x: -30 + i * 30 }}
            transition={{ duration: 0.75 }}
            className="absolute w-12 h-12 bg-red-950/40 rounded-full blur-md"
          />
        ))}
        <motion.div 
           initial={{ scaleY: 0.5, opacity: 1, rotate: -60, x: -50, y: -40 }}
           animate={{ scaleY: 2.2, opacity: 0, x: 50, y: 50 }}
           transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
           className="w-4 h-32 bg-white rounded-full shadow-[0_0_25px_rgba(220,38,38,1),0_0_50px_rgba(220,38,38,0.8)]"
        />
      </div>
    );
  }

  if (family === 'cq_acw') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div 
           initial={{ scale: 0.8, opacity: 1, rotate: -45, x: -50, y: -30 }}
           animate={{ scale: 2.0, opacity: 0, x: 50, y: 30 }}
           transition={{ duration: 0.38, ease: "easeOut" }}
           className="w-2.5 h-24 bg-white rounded-full shadow-[0_0_15px_rgba(59,130,246,1),0_0_30px_rgba(59,130,246,0.8)]"
        />
        <motion.div 
           initial={{ scale: 0.8, opacity: 1, rotate: 45, x: 50, y: -30 }}
           animate={{ scale: 2.0, opacity: 0, x: -50, y: 30 }}
           transition={{ duration: 0.38, ease: "easeOut", delay: 0.15 }}
           className="w-2.5 h-24 bg-white rounded-full shadow-[0_0_15px_rgba(34,197,94,1),0_0_30px_rgba(34,197,94,0.8)]"
        />
      </div>
    );
  }

  if (family === 'cq_gideon') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ scale: 0.2, opacity: 0, rotate: -90, y: 30 }}
          animate={{ scale: [0.2, 2.4, 0.2], opacity: [0, 0.85, 0], y: -30 }}
          transition={{ duration: 0.7 }}
          className="absolute w-16 h-28 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 rounded-b-full blur-sm"
        />
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 60 }}
          animate={{ scale: [0.5, 1.8, 0.5], opacity: [0, 1, 0], y: -60 }}
          transition={{ duration: 0.55, delay: 0.25 }}
          className="absolute w-4 h-12 bg-zinc-300 rounded-t-full shadow-[0_0_15px_orange]"
        />
      </div>
    );
  }

  // --- NEW JOURNEYS ---
  if (family === 'j_old_ben') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div 
           initial={{ scale: 0.8, opacity: 1, rotate: -45, x: -30, y: -30 }}
           animate={{ scale: 2.0, opacity: 0, x: 30, y: 30 }}
           transition={{ duration: 0.45, ease: "easeOut" }}
           className="w-2 h-24 bg-white rounded-full shadow-[0_0_15px_rgba(59,130,246,1)]"
        />
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: [0.4, 1.6, 0.4], opacity: [0, 0.65, 0] }}
          transition={{ duration: 0.6 }}
          className="absolute w-20 h-20 border border-sky-400 rounded-full shadow-[0_0_12px_rgba(56,189,248,0.5)]"
        />
      </div>
    );
  }

  if (family === 'j_thrawn_remnant') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: [0, 1.4, 0], opacity: [0, 0.7, 0] }}
          transition={{ duration: 0.6 }}
          className="absolute w-20 h-20 border border-sky-500 border-dashed rounded flex items-center justify-center"
        />
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 100, opacity: [0, 1, 0] }}
          transition={{ duration: 0.35, delay: 0.25 }}
          className="absolute w-12 h-1 bg-red-500 shadow-[0_0_10px_red]"
        />
      </div>
    );
  }

  if (family === 'j_gl_tarkin') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: [0, 3, 3, 0], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.5 }}
          className="absolute w-6 h-[200%] bg-green-400 shadow-[0_0_30px_rgba(74,222,128,1)]"
        />
        <motion.div
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: [0.2, 3.5, 0.2], opacity: [0, 0.95, 0] }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="absolute w-20 h-20 bg-emerald-500 rounded-full blur-md shadow-[0_0_40px_rgba(16,185,129,1)]"
        />
      </div>
    );
  }

  if (family === 'j_mace_windu') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div 
           initial={{ scale: 0.8, opacity: 1, rotate: -45, x: -40, y: -40 }}
           animate={{ scale: 2.2, opacity: 0, x: 40, y: 40 }}
           transition={{ duration: 0.45, ease: "easeOut" }}
           className="w-3 h-28 bg-white rounded-full shadow-[0_0_20px_rgba(167,139,250,1),0_0_40px_rgba(167,139,250,0.8)]"
        />
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.2, opacity: 0, x: 0, y: 0 }}
            animate={{ 
              scale: [0.2, 1.5, 0.2], 
              opacity: [0, 0.9, 0],
              x: (i % 2 === 0 ? 1 : -1) * (30 + i * 15),
              y: (i < 2 ? 1 : -1) * (30 + i * 15)
            }}
            transition={{ duration: 0.65, delay: 0.2, ease: "easeOut" }}
            className="absolute w-4 h-4 bg-purple-300 border border-white/60 shadow-[0_0_8px_rgba(167,139,250,0.5)] rotate-45"
          />
        ))}
      </div>
    );
  }

  if (family === 'j_starkiller') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: -150 }}
          animate={{ scale: [0.5, 2.5, 0.5], opacity: [0, 0.45, 0], y: 10 }}
          transition={{ duration: 2.2, times: [0, 0.75, 1] }}
          className="absolute w-48 h-32 bg-slate-900 border-r-8 border-b-8 border-orange-500/20 rotate-45 rounded shadow-[0_0_30px_orange]"
        />
        <motion.div 
           initial={{ scale: 0.8, opacity: 1, rotate: -30, x: -40, y: -30 }}
           animate={{ scale: 2.0, opacity: 0, x: 40, y: 30 }}
           transition={{ duration: 0.4, ease: "easeOut", delay: 0.8 }}
           className="w-2.5 h-24 bg-white rounded-full shadow-[0_0_15px_rgba(59,130,246,1)]"
        />
        <motion.div 
           initial={{ scale: 0.8, opacity: 1, rotate: 30, x: 40, y: -30 }}
           animate={{ scale: 2.0, opacity: 0, x: -40, y: 30 }}
           transition={{ duration: 0.4, ease: "easeOut", delay: 1.0 }}
           className="w-2.5 h-24 bg-white rounded-full shadow-[0_0_15px_rgba(220,38,38,1)]"
        />
        <motion.div
          initial={{ scale: 0.1, opacity: 0 }}
          animate={{ scale: [0.1, 4.0, 0.1], opacity: [0, 1, 0] }}
          transition={{ duration: 1.4, delay: 1.1 }}
          className="absolute w-24 h-24 bg-orange-600 rounded-full blur-md shadow-[0_0_40px_orange]"
        />
      </div>
    );
  }

  // --- 5. GENERIC WEAPON ARCHETYPES ---
  if (family.startsWith('jedi_')) {
    let color = 'rgba(96,165,250,1)'; // Blue default
    if (family === 'jedi_green') color = 'rgba(74,222,128,1)';
    if (family === 'jedi_purple') color = 'rgba(167,139,250,1)';
    if (family === 'jedi_yellow') color = 'rgba(250,204,21,1)';
    if (family === 'jedi_white') color = 'rgba(244,244,245,0.9)';
    
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div 
           initial={{ scale: 0.8, opacity: 1, rotate: -45, x: -40, y: -40 }}
           animate={{ scale: 2, opacity: 0, x: 40, y: 40 }}
           transition={{ duration: 0.35, ease: "easeOut" }}
           className="w-2 h-32 bg-white rounded-full"
           style={{ boxShadow: `0 0 15px ${color}, 0 0 30px ${color}` }}
        />
        {(isSpecial || isFinisher) && (
           <motion.div 
             initial={{ scale: 0.8, opacity: 1, rotate: 45, x: 40, y: -40 }}
             animate={{ scale: 2.5, opacity: 0, x: -40, y: 40 }}
             transition={{ duration: 0.35, delay: 0.12, ease: "easeOut" }}
             className="w-3 h-40 bg-white rounded-full absolute"
             style={{ boxShadow: `0 0 20px ${color}, 0 0 40px ${color}` }}
           />
        )}
      </div>
    );
  }

  if (family.startsWith('sith_') || family === 'dark_jedi_orange') {
    let color = 'rgba(239,68,68,1)'; // Red default
    if (family === 'dark_jedi_orange') color = 'rgba(249,115,22,1)';
    
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div 
           initial={{ scale: 0.8, opacity: 1, rotate: 30, x: 40, y: -40 }}
           animate={{ scale: 2.5, opacity: 0, x: -40, y: 60 }}
           transition={{ duration: 0.38, ease: "easeOut" }}
           className="w-3 h-32 bg-white rounded-full"
           style={{ boxShadow: `0 0 20px ${color}, 0 0 40px ${color}, 0 0 5px white inset` }}
        />
        {(isSpecial || isFinisher) && (
           <motion.div 
              initial={{ opacity: 1, scale: 1.5 }}
              animate={{ opacity: 0, scale: 2.2 }}
              transition={{ duration: 0.42 }}
              className="absolute inset-0 mix-blend-screen"
              style={{ backgroundImage: `linear-gradient(45deg,transparent 45%,${color} 48%,rgba(255,255,255,1) 50%,${color} 52%,transparent 55%)` }}
           />
        )}
      </div>
    );
  }

  if (family === 'darksaber') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div 
           initial={{ scale: 0.7, opacity: 1, rotate: -70, x: -50 }}
           animate={{ scale: 2.2, opacity: 0, x: 50 }}
           transition={{ duration: 0.4, ease: "easeOut" }}
           className="w-4 h-32 bg-black border border-white rounded-full shadow-[0_0_15px_white,0_0_30px_rgba(34,211,238,0.8)]"
        />
      </div>
    );
  }

  if (family.startsWith('blaster_')) {
    let color = 'rgba(239,68,68,1)'; // Red default
    if (family === 'blaster_blue') color = 'rgba(59,130,246,1)';
    if (family === 'blaster_green') color = 'rgba(34,197,94,1)';
    if (family === 'blaster_orange') color = 'rgba(249,115,22,1)';
    if (family === 'blaster_yellow') color = 'rgba(250,204,21,1)';

    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div 
           initial={{ scale: 0.8, opacity: 1, x: -70, y: -20, rotate: 60 }}
           animate={{ scale: 1.6, opacity: 0, x: 70, y: 20 }}
           transition={{ duration: 0.22, ease: "linear" }}
           className="w-2.5 h-16 bg-white rounded-full"
           style={{ boxShadow: `0 0 15px ${color}, 0 0 30px ${color}` }}
        />
        {(isSpecial || isFinisher) && (
           <motion.div 
             initial={{ scale: 0.8, opacity: 1, x: -70, y: 0, rotate: 60 }}
             animate={{ scale: 1.6, opacity: 0, x: 70, y: 0 }}
             transition={{ duration: 0.22, delay: 0.1, ease: "linear" }}
             className="w-2.5 h-16 bg-white rounded-full absolute"
             style={{ boxShadow: `0 0 15px ${color}, 0 0 30px ${color}` }}
           />
        )}
      </div>
    );
  }

  if (family === 'bowcaster') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div 
           initial={{ scale: 1.2, opacity: 1, x: -80, rotate: 45 }}
           animate={{ scale: 2.0, opacity: 0, x: 80 }}
           transition={{ duration: 0.25, ease: "easeOut" }}
           className="w-4 h-8 bg-red-400 rounded-full shadow-[0_0_20px_rgba(239,68,68,1),0_0_10px_rgba(251,146,60,1)]"
        />
      </div>
    );
  }

  if (family === 'grenade') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div 
           initial={{ scale: 0.4, opacity: 1 }}
           animate={{ scale: 2.8, opacity: 0 }}
           transition={{ duration: 0.45, ease: "easeOut" }}
           className="w-24 h-24 rounded-full bg-orange-500 blur-sm shadow-[0_0_35px_rgba(249,115,22,1)]"
        />
      </div>
    );
  }

  if (family === 'flamethrower') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: [1, 2.5, 0.5], opacity: [0, 1, 0] }}
          transition={{ duration: 0.7 }}
          className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-red-600 via-orange-500 to-yellow-400 blur-sm"
        />
      </div>
    );
  }

  if (family === 'lightning') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5, rotate: i * 35 }}
            animate={{ opacity: [0, 1, 0, 1, 0], scale: 1.5 }}
            transition={{ duration: 0.5 }}
            className="absolute w-1 h-32 bg-cyan-200 blur-[1px] shadow-[0_0_15px_rgba(6,182,212,1)]"
          />
        ))}
      </div>
    );
  }

  if (family === 'force_crush') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div
          initial={{ scale: 2.2, opacity: 0 }}
          animate={{ scale: 0.4, opacity: [0, 1, 0] }}
          transition={{ duration: 0.65, ease: "easeInOut" }}
          className="absolute w-24 h-24 border-4 border-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,1)]"
        />
      </div>
    );
  }

  if (family === 'physical_punch' || family === 'physical_kick') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div 
           initial={{ scale: 0.6, opacity: 1 }}
           animate={{ scale: 2.2, opacity: 0 }}
           transition={{ duration: 0.35, ease: "easeOut" }}
           className="w-16 h-16 rounded-full bg-stone-400 blur-md shadow-[0_0_20px_rgba(120,113,108,0.7)]"
        />
      </div>
    );
  }

  if (family === 'staff_strike' || family === 'vibroblade') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div 
           initial={{ scale: 0.8, opacity: 1, rotate: -45, x: -30 }}
           animate={{ scale: 2.0, opacity: 0, x: 30 }}
           transition={{ duration: 0.32, ease: "easeOut" }}
           className="w-2.5 h-24 bg-stone-300 rounded-full shadow-[0_0_12px_rgba(214,211,209,1)]"
        />
      </div>
    );
  }

  // --- LEGACY/FALLBACK FAMILIES ---
  if (family === 'jedi') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div 
           initial={{ scale: 0.8, opacity: 1, rotate: -45, x: -40, y: -40 }}
           animate={{ scale: 2, opacity: 0, x: 40, y: 40 }}
           transition={{ duration: 0.3, ease: "easeOut" }}
           className="w-2 h-32 bg-white rounded-full shadow-[0_0_15px_rgba(96,165,250,1),0_0_30px_rgba(96,165,250,0.8)]"
        />
      </div>
    );
  }
  
  if (family === 'sith') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-visible">
        <motion.div 
           initial={{ scale: 0.8, opacity: 1, rotate: 30, x: 40, y: -40 }}
           animate={{ scale: 2.5, opacity: 0, x: -40, y: 60 }}
           transition={{ duration: 0.35, ease: "easeOut" }}
           className="w-3 h-32 bg-white rounded-full shadow-[0_0_20px_rgba(239,68,68,1),0_0_40px_rgba(239,68,68,0.9)]"
        />
      </div>
    );
  }

  // Default Fallback Explosion
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
       <motion.div
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="w-16 h-16 bg-white rounded-full blur-lg shadow-[0_0_30px_white]"
       />
    </div>
  );
}


export const AuraVisual: React.FC<{ family: string }> = ({ family }) => {
  let color = '';
  
  switch(family) {
    case 'jedi': color = 'bg-blue-500/60 shadow-[0_0_100px_rgba(59,130,246,1)]'; break;
    case 'sith': color = 'bg-red-600/60 shadow-[0_0_100px_rgba(220,38,38,1)]'; break;
    case 'clone': color = 'bg-blue-400/60 shadow-[0_0_80px_rgba(96,165,250,0.9)]'; break;
    case 'imperial': color = 'bg-red-500/60 shadow-[0_0_80px_rgba(239,68,68,0.9)]'; break;
    case 'droid': color = 'bg-orange-500/60 shadow-[0_0_80px_rgba(249,115,22,0.9)]'; break;
    case 'mandalorian': color = 'bg-orange-400/60 shadow-[0_0_100px_rgba(251,146,60,1)]'; break;
    case 'spectre': color = 'bg-green-400/60 shadow-[0_0_80px_rgba(74,222,128,0.9)]'; break;
    case 'second_empire': color = 'bg-indigo-500/60 shadow-[0_0_100px_rgba(99,102,241,1)]'; break;
    case 'morvek_survivors': color = 'bg-stone-500/60 shadow-[0_0_80px_rgba(120,113,108,0.9)]'; break;
    default: color = 'bg-cyan-500/50 shadow-[0_0_80px_rgba(6,182,212,0.8)]'; break;
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1.5 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ type: "spring", bounce: 0.6 }}
      className={`absolute inset-0 ${color} rounded-full blur-xl z-[-1] pointer-events-none`}
    />
  )
}

export const HoloCombatUnit: React.FC<HoloCombatUnitProps> = ({
  unit,
  isActive,
  isAttacking = false,
  strikeEffect,
  isSelectedTarget,
  isSelectedAlly,
  onSelect,
  onDoubleClick
}) => {
  const isDead = unit.hp <= 0;
  const hpPct = Math.max(0, Math.round((unit.hp / unit.maxHp) * 100));
  const protPct = unit.maxProtection > 0 ? Math.round((unit.protection / unit.maxProtection) * 100) : 0;
  
  // Determine Faction Colors
  const fLow = unit.tags.join(' ').toLowerCase();
  let shadowColor = 'rgba(6, 182, 212, 0.4)'; // Default cyan
  let borderColor = 'border-cyan-500/30';
  let bgColor = 'bg-cyan-950/20';
  
  const family = getCharacterAnimationFamily(unit.id);
  
  if (fLow.includes('empire') || fLow.includes('sith') || fLow.includes('inquisitorius')) {
    shadowColor = 'rgba(220, 38, 38, 0.5)';
    borderColor = 'border-red-500/40';
    bgColor = 'bg-red-950/20';
  } else if (fLow.includes('republic') || fLow.includes('jedi') || fLow.includes('rebel')) {
    shadowColor = 'rgba(59, 130, 246, 0.5)';
    borderColor = 'border-blue-500/40';
    bgColor = 'bg-blue-950/20';
  } else if (fLow.includes('separatist')) {
    shadowColor = 'rgba(245, 158, 11, 0.5)';
    borderColor = 'border-amber-500/40';
    bgColor = 'bg-amber-950/20';
  } else if (fLow.includes('mandalorian')) {
    shadowColor = 'rgba(251, 146, 60, 0.5)';
    borderColor = 'border-orange-500/40';
    bgColor = 'bg-orange-950/20';
  } else if (fLow.includes('avalanche') || fLow.includes('glacier')) {
     shadowColor = 'rgba(224, 242, 254, 0.5)';
     borderColor = 'border-sky-200/50';
     bgColor = 'bg-sky-950/30';
  }

  // Animation variants
  const getAttackVariant = () => {
    const dir = unit.team === 'player' ? 1 : -1;
    switch (family) {
      case 'jedi':
        return {
          y: [-10, 0],
          x: [dir * 10, dir * 20, 0],
          scale: 1.1,
          rotate: dir * 5,
          boxShadow: `0px 0px 20px rgba(59, 130, 246, 0.4)`,
          transition: { type: "spring", stiffness: 400, damping: 10 }
        };
      case 'sith':
        return {
          y: -10,
          x: dir * 25,
          scale: 1.15,
          rotate: dir * 5,
          boxShadow: `0px 0px 30px rgba(220, 38, 38, 0.4)`,
          transition: { type: "spring", stiffness: 500, damping: 12 }
        };
      case 'clone':
      case 'imperial':
        return {
          y: -5,
          x: dir * 15,
          scale: 1.05,
          rotate: dir * -5,
          boxShadow: `0px 0px 20px ${shadowColor}`,
          transition: { type: "spring", stiffness: 500, damping: 15 } // Quick recoil
        };
      case 'droid':
        return {
          x: dir * 15,
          scale: 1.05,
          boxShadow: `0px 0px 20px rgba(245, 158, 11, 0.4)`,
          transition: { type: "tween", duration: 0.15 } // Stiff movement
        };
      case 'mandalorian':
        return {
          y: -15, // jetpack
          x: dir * 20,
          scale: 1.1,
          rotate: dir * -10,
          boxShadow: `0px -10px 20px rgba(251, 146, 60, 0.4)`,
          transition: { type: "spring", stiffness: 350, damping: 15 }
        };
      case 'spectre':
        return {
          y: [-5, -10, 0],
          x: dir * 20,
          rotate: [0, dir * 10, 0],
          scale: 1.1,
          boxShadow: `0px 0px 20px rgba(74, 222, 128, 0.4)`,
          transition: { duration: 0.3 }
        };
      default:
        return {
          y: -5,
          scale: 1.1,
          x: dir * 30,
          rotate: dir * 5,
          boxShadow: `0px 0px 50px ${shadowColor}`,
          transition: { type: "spring", stiffness: 600, damping: 15 }
        };
    }
  };

  const variants = {
    idle: {
      y: 0,
      scale: 1,
      transition: { duration: 0.3 }
    },
    active: {
      y: -10,
      scale: 1.15,
      boxShadow: `0px 10px 40px ${shadowColor}`,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    attack: getAttackVariant(),
    dead: {
      opacity: 0.2,
      scale: 0.5,
      filter: "blur(4px) grayscale(100%)",
      transition: { duration: 0.6 }
    },
    hit: {
      x: [-5, 5, -5, 5, 0],
      transition: { duration: 0.3 }
    }
  };

  const getStatusIcon = (name: string) => {
    switch (name) {
      case 'Stun':
      case 'STUNNED':
        return '💤';
      case 'Ability Block':
      case 'ABILITY BLOCK':
        return '🔇';
      case 'Healing Immunity':
        return '🏥';
      case 'Daze':
        return '😵';
      case 'Shock':
        return '🌩️';
      case 'Burn':
      case 'Burning':
        return '🔥';
      case 'Exposed':
      case 'Expose':
        return '🎯';
      case 'Purge':
        return '👁️‍🗨️';
      case 'Frostbite':
        return '❄️';
      case 'Blind':
        return '🦯';
      case 'Fear':
        return '👻';
      case 'Offense Up':
        return '⚔️';
      case 'Offense Down':
        return '🗡️';
      case 'Defense Up':
        return '🛡️';
      case 'Defense Down':
        return '💔';
      case 'Speed Up':
        return '💨';
      case 'Speed Down':
        return '🐌';
      case 'Tenacity Up':
        return '💪';
      case 'Tenacity Down':
        return '🤒';
      case 'Potency Up':
        return '🎯';
      case 'Potency Down':
        return '📉';
      case 'Critical Chance Up':
        return '💥';
      case 'Critical Damage Up':
        return '🔥';
      case 'Foresight':
        return '👁️';
      case 'Retribution':
        return '↩️';
      case 'Protection Up':
        return '🔵';
      case 'Stealth':
        return '🥷';
      case 'Taunt':
        return '📢';
      case 'Tactical Data':
        return '💾';
      case 'Tactical Advantage':
        return '📈';
      case 'Impending Doom':
        return '⏳';
      case 'Last Hope':
        return '🌟';
      case 'Endless Legion':
        return '🤖';
      case 'Dark Maelstrom':
        return '🌪️';
      case 'Rule of Two':
        return '👥';
      case 'Unlimited Power':
        return '⚡';
      case 'Deathmark':
        return '💀';
      case 'Elusive':
        return '🌫️';
      case 'Contract':
        return '📜';
      case 'Bounty':
        return '🪙';
      case 'Unleashed':
        return '🔋';
      case 'Imperial Contract':
        return '📋';
      case 'Armor Shred':
        return '🔓';
      case 'Debt':
        return '💸';
      case 'Corruption':
        return '☣️';
      case 'Collector':
        return '🎒';
      case 'Infested':
        return '🐛';
      case 'Foil':
        return '⚔️';
      case 'Information Broker':
        return '🕵️';
      case 'Treasure':
        return '💎';
      case 'Hostage':
        return '🔗';
      case 'Payout':
        return '💰';
      case 'Raid Mark':
        return '🎯';
      case 'Secrecy':
        return '🤫';
      case 'Artifact':
        return '🏺';
      case 'Explosive Charge':
        return '💣';
      case 'Tortured':
        return '⛓️';
      case 'Imperial Decree':
        return '📜';
      case 'Dossier':
        return '📂';
      case 'Combined Arms':
        return '🤝';
      case 'Negotiator':
        return '⚖️';
      case 'Ambushed':
        return '🚨';
      case 'Overdisciplined':
        return '🧠';
      case 'Council Guidance':
        return '🧘';
      case 'Guardian\'s Resolve':
        return '🛡️';
      case 'Inspired':
        return '⭐';
      case 'Unconventional Tactics':
        return '💡';
      case 'Intel':
        return '🔎';
      case 'Insight':
        return '🔮';
      case 'Blaze Of Glory':
        return '🌠';
      case 'Reanimated':
        return '🧟';
      case 'Analysis':
        return '📊';
      case 'Entrenched':
        return '🪖';
      case 'Veteran Orders':
        return '🫡';
      case 'Resolve':
        return '🦁';
      case 'Ultimate Stance':
        return '👑';
      case 'Marked':
      case 'Marked Target':
        return '🎯';
      case 'Pursued':
        return '👣';
      case 'Order 66':
        return '💀';
      case 'Damage Over Time':
        return '🩸';
      case 'Shattered Defense':
        return '💥';
      case 'Whiteout':
        return '🌫️';
      case 'Predicted':
        return '🔮';
      case 'Battlefield Corruption':
        return '☣️';
      case 'Suppressed':
        return '🛑';
      case 'Momentum':
        return '👟';
      case 'Pathfinder':
        return '🧭';
      case 'Fatigued':
        return '🥱';
      case 'Lockdown':
        return '🔒';
      case 'Riot Control':
        return '🧱';
      default: {
        const def = STATUS_DEFINITIONS[name];
        if (def) {
          return def.type === 'buff' ? '⬆️' : '⬇️';
        }
        return name.includes('Up') || name.includes('Recovery') ? '⬆️' : '⬇️';
      }
    }
  };

  // Stealth rendering
  const isStealthed = unit.statuses.some(s => s.name === 'Stealth');
  const isTaunting = unit.statuses.some(s => s.name === 'Taunt');

  // Status Effect Visuals
  const hasPredicted = unit.statuses.some(s => s.name === 'Predicted');
  const hasAnalyze = unit.statuses.some(s => s.name === 'Analyze');
  const hasResolve = unit.statuses.some(s => s.name === 'Resolve');
  const hasEntrenched = unit.statuses.some(s => s.name === 'Entrenched');
  const hasSuppressed = unit.statuses.some(s => s.name === 'Suppressed');
  const hasCorruption = unit.statuses.some(s => s.name === 'Battlefield Corruption');
  const hasBlaze = unit.statuses.some(s => s.name === 'Blaze Of Glory');
  const hasFear = unit.statuses.some(s => s.name === 'Fear');
  const hasOrderedFire = unit.statuses.some(s => s.name === 'Ordered Fire');

  return (
    <motion.div
      onClick={() => { if (!isDead) onSelect(); }}
      onDoubleClick={() => { if (!isDead && onDoubleClick) onDoubleClick(); }}
      variants={variants}
      initial="idle"
      animate={isDead ? "dead" : isAttacking ? "attack" : isActive ? "active" : "idle"}
      className={`relative cursor-pointer flex flex-col w-24 sm:w-28 lg:w-32 p-2 lg:p-3 rounded-xl lg:rounded-2xl border backdrop-blur z-20 
        ${bgColor} ${borderColor}
        ${isSelectedTarget ? 'ring-2 ring-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)]' : ''}
        ${isSelectedAlly ? 'ring-2 ring-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)]' : ''}
        ${isStealthed ? 'opacity-40 hover:opacity-70' : 'opacity-100'}
        ${isTaunting ? 'ring-2 ring-yellow-400/80 shadow-[0_0_30px_rgba(250,204,21,0.5)]' : ''}
      `}
      style={{
         boxShadow: (isActive && !isSelectedTarget && !isSelectedAlly && !isTaunting) ? `0px 10px 40px ${shadowColor}` : undefined
      }}
    >
      <AnimatePresence>
        {isAttacking && <AuraVisual family={family} />}
      </AnimatePresence>
      
      <AnimatePresence>
        {strikeEffect && <StrikeVisual family={strikeEffect.family} type={strikeEffect.type} />}
      </AnimatePresence>
        {/* Hologram details */}
        <div className="absolute inset-0 scan-overlay rounded-xl lg:rounded-2xl pointer-events-none"></div>

        {/* Status Effect Overlays */}
        {hasPredicted && (
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 w-6 h-6 border-2 border-dashed border-blue-400 rounded-full flex items-center justify-center pointer-events-none z-30"
          >
            <div className="w-1.5 h-1.5 bg-blue-300 rounded-full shadow-[0_0_10px_rgba(96,165,250,1)]"></div>
          </motion.div>
        )}
        
        {hasAnalyze && (
          <motion.div 
            animate={{ opacity: [0, 1, 0], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 border border-blue-500/50 bg-blue-500/10 pointer-events-none z-30 mix-blend-screen rounded-xl lg:rounded-2xl"
          >
             <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-blue-400"></div>
             <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-blue-400"></div>
          </motion.div>
        )}
        
        {hasResolve && (
          <div className="absolute -inset-2 bg-amber-500/10 rounded-3xl border border-amber-500/20 pointer-events-none z-30 animate-pulse"></div>
        )}
        
        {hasEntrenched && (
          <div className="absolute -bottom-2 -inset-x-2 h-4 bg-gradient-to-t from-stone-600/80 to-transparent border-b-2 border-stone-500 rounded-b-2xl pointer-events-none z-30"></div>
        )}
        
        {hasSuppressed && (
          <motion.div 
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          >
            <div className="w-8 h-8 rounded-full border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] flex items-center justify-center">
               <div className="w-1 h-1 bg-red-400 rounded-full"></div>
            </div>
          </motion.div>
        )}
        
        {hasCorruption && (
          <motion.div 
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-x-0 -bottom-4 h-8 bg-gradient-to-t from-green-900/60 to-transparent blur-md pointer-events-none z-30"
          ></motion.div>
        )}
        
        {hasBlaze && (
          <motion.div 
            animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.05, 0.95] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="absolute -inset-1 border border-orange-500/50 bg-orange-500/10 shadow-[0_0_20px_rgba(249,115,22,0.4)] pointer-events-none z-30 rounded-xl lg:rounded-2xl"
          ></motion.div>
        )}
        
        {hasFear && (
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-black/60 shadow-[inset_0_0_30px_rgba(0,0,0,1)] mix-blend-multiply pointer-events-none z-30 rounded-xl lg:rounded-2xl"
          ></motion.div>
        )}
        
        {hasOrderedFire && (
          <motion.div 
            animate={{ rotate: -90, scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 text-blue-500 font-bold z-30 pointer-events-none"
          >
            ▼
          </motion.div>
        )}

        <div className="flex justify-between items-start mb-2 lg:mb-3 relative z-10 w-full h-[32px] lg:h-[36px]">
          <div className="text-[10px] lg:text-[11px] font-mono font-bold leading-tight text-white drop-shadow-md">
            {unit.isSummon && <span className="text-amber-500 mr-1 shrink-0" title="Summoned">⚡</span>}
            {unit.name}
          </div>
          {isActive && (
            <motion.div 
               animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
               transition={{ repeat: Infinity, duration: 1 }}
               className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,1)] shrink-0 ml-1 mt-0.5" 
            />
          )}
        </div>

        {/* Health Bars */}
        <div className="space-y-1.5 mt-auto bg-black/60 p-1.5 lg:p-2 rounded-lg border border-white/10 group relative z-10">
          {unit.maxProtection > 0 && (
            <div className="h-1.5 lg:h-2 w-full bg-zinc-900 overflow-hidden relative rounded-full">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                initial={{ width: `${protPct}%` }}
                animate={{ width: `${protPct}%` }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              />
            </div>
          )}
          <div className="h-1.5 lg:h-2 w-full bg-zinc-900 overflow-hidden relative rounded-full">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
              initial={{ width: `${hpPct}%` }}
              animate={{ width: `${hpPct}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            />
          </div>
          <div className="h-1 w-full bg-zinc-950 mt-1 overflow-hidden relative rounded-full">
            <motion.div 
               className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-600 to-amber-400"
               initial={{ width: `${unit.turnMeter}%` }}
               animate={{ width: `${unit.turnMeter}%` }}
               transition={{ ease: "linear", duration: 0.1 }}
            />
          </div>
        </div>

        {/* Statuses */}
        {unit.statuses.length > 0 && (
           <div className="flex flex-wrap justify-center gap-1 mt-2 z-10 relative">
             <AnimatePresence>
               {unit.statuses.map((st, i) => (
                 <motion.div 
                   key={`${st.name}-${i}`}
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   exit={{ scale: 0 }}
                   className={`w-5 h-5 lg:w-6 lg:h-6 rounded-md flex items-center justify-center text-[9px] lg:text-[11px] font-black border backdrop-blur-sm ${st.isDebuff ? 'bg-red-950/80 border-red-500/50 text-red-300' : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'}`}
                   title={`${st.name}${STATUS_DEFINITIONS[st.name]?.desc ? ': ' + STATUS_DEFINITIONS[st.name].desc : ''}`}
                 >
                   {getStatusIcon(st.name)}
                   <div className="absolute -top-1 -right-1 bg-black text-[7px] w-[12px] h-[12px] flex items-center justify-center rounded-full border border-zinc-600 font-bold z-10">{st.duration}</div>
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>
        )}
    </motion.div>
  );
};
