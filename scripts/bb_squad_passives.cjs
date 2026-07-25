const fs = require('fs');
let c = fs.readFileSync('src/utils/combat/customKitLogic.ts', 'utf8');

const squadPassives = `
customSquadPassives.push((state) => {
   ['player', 'enemy'].forEach(team => {
      const squad = team === 'player' ? state.playerTeam : state.enemyTeam;
      
      const leader = squad.find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
      if (leader && leader.characterId === 'hunter') {
          squad.forEach(u => {
              if (u.tags.includes('Bad Batch') || checkHasTag(u, 'Bad Batch')) {
                  u.speed += 25;
                  u.maxHp = Math.round(u.maxHp * 1.20);
                  u.hp = u.maxHp;
                  u.offense = Math.round(u.offense * 1.20);
              }
          });
      } else if (leader && leader.characterId === 'crosshair_bb') {
          squad.forEach(u => {
              if (u.tags.includes('Bad Batch') || checkHasTag(u, 'Bad Batch')) {
                  u.speed += 20;
                  u.critDamage += 0.30;
              }
          });
      }

      const hunter = squad.find(u => u.characterId === 'hunter' && u.activeInBattle && u.hp > 0);
      if (hunter && !hunter.statuses.some(s => s.name === 'Hypervigilance Disorder')) {
         applyStatus(state, hunter, 'Hypervigilance Disorder', 99, false);
      }
      const wrecker = squad.find(u => u.characterId === 'wrecker' && u.activeInBattle && u.hp > 0);
      if (wrecker && !wrecker.statuses.some(s => s.name === 'Impulse Control Disorder')) {
         applyStatus(state, wrecker, 'Impulse Control Disorder', 99, false);
      }
      const tech = squad.find(u => u.characterId === 'tech_bb' && u.activeInBattle && u.hp > 0);
      if (tech && !tech.statuses.some(s => s.name === 'Obsessive Analysis Disorder')) {
         applyStatus(state, tech, 'Obsessive Analysis Disorder', 99, false);
      }
      const echo = squad.find(u => u.characterId === 'echo_bb' && u.activeInBattle && u.hp > 0);
      if (echo && !echo.statuses.some(s => s.name === 'Identity Disorder')) {
         applyStatus(state, echo, 'Identity Disorder', 99, false);
      }
      const cross = squad.find(u => u.characterId === 'crosshair_bb' && u.activeInBattle && u.hp > 0);
      if (cross && !cross.statuses.some(s => s.name === 'Paranoia Disorder')) {
         applyStatus(state, cross, 'Paranoia Disorder', 99, false);
      }
      const omega = squad.find(u => u.characterId === 'omega' && u.activeInBattle && u.hp > 0);
      if (omega && !omega.statuses.some(s => s.name === 'Attachment Disorder')) {
         applyStatus(state, omega, 'Attachment Disorder', 99, false);
      }
      const batcher = squad.find(u => u.characterId === 'batcher' && u.activeInBattle && u.hp > 0);
      if (batcher && !batcher.statuses.some(s => s.name === 'No Disorder')) {
         applyStatus(state, batcher, 'No Disorder', 99, false);
      }
   });
});

customTurnStartHooks['omega'] = (state, unit) => {
   const allies = unit.team === 'player' ? state.playerTeam : state.enemyTeam;
   const bbAllies = allies.filter(a => (a.tags.includes('Bad Batch') || checkHasTag(a, 'Bad Batch')) && a.activeInBattle && a.hp > 0);
   if (bbAllies.length > 0) {
       const target = bbAllies[Math.floor(Math.random() * bbAllies.length)];
       target.hp = Math.min(target.maxHp, target.hp + Math.round(target.maxHp * 0.05));
       logBattleEvent(state, \`💖 The Heart Of The Squad: \${target.name} recovers 5% Health!\`, 'heal');
   }
};

customDefeatHooks['wrecker'] = (state, defeated, attacker) => {
   const allies = defeated.team === 'player' ? state.playerTeam : state.enemyTeam;
   allies.forEach(a => {
       if ((a.tags.includes('Bad Batch') || checkHasTag(a, 'Bad Batch')) && a.activeInBattle && a.hp > 0) {
           applyStatus(state, a, 'Offense Up', 2, false);
       }
   });
   logBattleEvent(state, \`💥 I Like Explosions: Wrecker is defeated, Bad Batch allies gain Offense Up!\`, 'buff');
};

customDefeatHooks['batcher'] = (state, defeated, attacker) => {
   // The passive actually says "Whenever Batcher defeats an enemy: All Bad Batch allies recover 10% Health."
   // This hook is for when BATCHER is defeated. So this is the wrong hook! I will leave it empty.
};
`;

c = c + '\n' + squadPassives;
fs.writeFileSync('src/utils/combat/customKitLogic.ts', c);
