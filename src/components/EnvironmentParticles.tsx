import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface EnvironmentParticlesProps {
  environment: string;
}

export const EnvironmentParticles: React.FC<EnvironmentParticlesProps> = ({ environment }) => {
  const isHoth = environment.includes('hoth') || environment.includes('kamino');
  const isLava = environment.includes('mustafar') || environment.includes('exegol');
  const isForest = environment.includes('endor') || environment.includes('felucia') || environment.includes('ryloth');
  
  const particleCount = isHoth ? 20 : isLava ? 15 : isForest ? 10 : 0;

  const particlesConfig = useMemo(() => {
    if (particleCount === 0) return [];
    
    return Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      startX: Math.random() * 100,
      speed: 6 + Math.random() * 8,
      delay: Math.random() * 8,
      size: Math.random() * 3 + 2,
      driftX: Math.random() * 16 - 8,
      driftLavaX: Math.random() * 20 - 10,
      forestY: Math.random() * 100,
      forestTargetY: Math.random() * 100,
    }));
  }, [particleCount]);
  
  if (particleCount === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {particlesConfig.map(p => {
        if (isHoth) {
          // Snowstorm
          return (
            <motion.div
              key={p.id}
              initial={{ y: -50, x: `${p.startX}vw`, opacity: 0 }}
              animate={{ y: '110vh', x: `${p.startX + p.driftX}vw`, opacity: [0, 0.7, 0] }}
              transition={{ repeat: Infinity, duration: p.speed, delay: p.delay, ease: "linear" }}
              className="absolute rounded-full bg-white opacity-80"
              style={{ width: p.size, height: p.size }}
            />
          );
        }
        if (isLava) {
          // Fire Embers
          return (
            <motion.div
              key={p.id}
              initial={{ y: '110vh', x: `${p.startX}vw`, opacity: 0 }}
              animate={{ y: '-10vh', x: `${p.startX + p.driftLavaX}vw`, opacity: [0, 0.9, 0] }}
              transition={{ repeat: Infinity, duration: p.speed * 1.5, delay: p.delay, ease: "easeOut" }}
              className="absolute rounded-full bg-orange-500 opacity-90 shadow-[0_0_6px_#f97316]"
              style={{ width: p.size, height: p.size }}
            />
          );
        }
        
        // Forest Pollen/Mist
        return (
          <motion.div 
             key={p.id}
             initial={{ y: `${p.forestY}vh`, x: '-5vw', opacity: 0 }}
             animate={{ x: '105vw', y: `${p.forestTargetY}vh`, opacity: [0, 0.4, 0] }}
             transition={{ repeat: Infinity, duration: p.speed * 2, delay: p.delay, ease: "easeInOut" }}
             className="absolute rounded-full bg-indigo-200 opacity-60"
             style={{ width: p.size * 2, height: p.size * 2 }}
          />
        );
      })}
    </div>
  );
};
