const fs = require('fs');
let c = fs.readFileSync('src/utils/combat/customKitLogic.ts', 'utf8');

const squadPassives = `
customSquadPassives.push((state) => {
   ['player', 'enemy'].forEach(team => {
      const squad = team === 'player' ? state.playerTeam : state.enemyTeam;
      
      const lv = squad.find(u => u.characterId === 'gl_lord_vader' && u.activeInBattle && u.hp > 0);
      if (lv) {
          applyStatus(state, lv, 'Taunt', 1, false);
          squad.forEach(u => {
              if (u.tags.includes('Knightfall') || checkHasTag(u, 'Knightfall')) {
                  applyStatus(state, u, 'Dramatic Entrance', 1, false);
              }
          });
          
          const appo = squad.some(u => u.characterId === 'commander_appo' && u.activeInBattle && u.hp > 0);
          if (appo) {
              squad.forEach(u => {
                  if (u.tags.includes('Knightfall') || checkHasTag(u, 'Knightfall')) {
                      if (!u.dynamicState) u.dynamicState = {};
                      u.dynamicState.immuneToFear = true;
                  }
              });
          }
          const fox = squad.some(u => u.characterId === 'commander_fox' && u.activeInBattle && u.hp > 0);
          if (fox) {
              if (!lv.dynamicState) lv.dynamicState = {};
              lv.dynamicState.ignoreProtectionO66 = true;
          }
          const cross = squad.some(u => u.characterId === 'crosshair_imperial' && u.activeInBattle && u.hp > 0);
          if (cross) {
              if (!lv.dynamicState) lv.dynamicState = {};
              lv.dynamicState.noEvade = true;
          }
          const kfc = squad.some(u => u.characterId === 'knightfall_commander' && u.activeInBattle && u.hp > 0);
          if (kfc) {
              lv.defense = Math.round(lv.defense * 1.30);
              lv.tenacity += 0.30;
          }
      }
      
      const appo_m_leader = squad.find(u => u.position === 0 && u.characterId === 'commander_appo' && u.activeInBattle && u.hp > 0);
      if (appo_m_leader) {
          squad.forEach(u => {
              if (u.tags.includes('Knightfall') || checkHasTag(u, 'Knightfall')) {
                  u.speed += 35;
                  u.offense = Math.round(u.offense * 1.30);
              }
          });
      }
      
      const fox_riot_leader = squad.find(u => u.position === 0 && u.characterId === 'commander_fox_riot' && u.activeInBattle && u.hp > 0);
      if (fox_riot_leader) {
          squad.forEach(u => {
              if (u.tags.includes('Coruscant Guard') || checkHasTag(u, 'Coruscant Guard')) {
                  u.maxHp = Math.round(u.maxHp * 1.25);
                  u.hp = u.maxHp;
                  u.defense = Math.round(u.defense * 1.20);
              }
          });
      }
      
      // Fox riot unique
      const fox_riot = squad.find(u => u.characterId === 'commander_fox_riot' && u.activeInBattle && u.hp > 0);
      if (fox_riot && fox_riot.statuses.some(s => s.name === 'Taunt')) {
          squad.forEach(u => {
              if (u.tags.includes('Coruscant Guard') || checkHasTag(u, 'Coruscant Guard')) {
                  u.defense = Math.round(u.defense * 1.10);
              }
          });
      }
   });
});

customTurnStartHooks['appo_501st'] = (state, unit) => {
   const allies = unit.team === 'player' ? state.playerTeam : state.enemyTeam;
   const leader = allies.find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
   if (leader && leader.statuses.some(s => s.name === 'Fatigued')) {
       // Gain bonus turn
       if (!unit.dynamicState?.fatigueBonusTurn) {
           if (!unit.dynamicState) unit.dynamicState = {};
           unit.dynamicState.fatigueBonusTurn = true;
           unit.turnMeter = 100;
           logBattleEvent(state, \`⏩ Appo gains a Bonus Turn (Leader is Fatigued)!\`, 'buff');
       }
   }
};
`;

c = c + '\n' + squadPassives;
fs.writeFileSync('src/utils/combat/customKitLogic.ts', c);
