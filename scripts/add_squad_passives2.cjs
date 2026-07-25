const fs = require('fs');
let c = fs.readFileSync('src/utils/combat/customKitLogic.ts', 'utf8');

const newPassives = `
customSquadPassives.push((state) => {
   ['player', 'enemy'].forEach(team => {
      const squad = team === 'player' ? state.playerTeam : state.enemyTeam;
      
      const voss_leader = squad.find(u => u.position === 0 && u.characterId === 'warlord_drake_voss' && u.activeInBattle && u.hp > 0);
      if (voss_leader) {
          squad.forEach(u => {
              if (u.tags.includes('Morvek Survivor') || checkHasTag(u, 'Morvek Survivor')) {
                  u.maxHp = Math.round(u.maxHp * 1.20);
                  u.hp = u.maxHp;
                  u.defense = Math.round(u.defense * 1.30);
              }
          });
      }
      
      const voss = squad.find(u => u.characterId === 'warlord_drake_voss' && u.activeInBattle && u.hp > 0);
      if (voss) {
          if (!voss.dynamicState) voss.dynamicState = {};
          voss.dynamicState.immuneToFear = true;
          voss.dynamicState.immuneToDaze = true;
      }
      
      const voren_leader = squad.find(u => u.position === 0 && u.characterId === 'commander_voren' && u.activeInBattle && u.hp > 0);
      if (voren_leader) {
          squad.forEach(u => {
              if (u.tags.includes('Avalanche Remnant') || checkHasTag(u, 'Avalanche Remnant')) {
                  u.maxProtection = Math.round(u.maxProtection * 1.20);
                  u.protection = u.maxProtection;
                  u.defense = Math.round(u.defense * 1.30);
              }
          });
      }
      
      // While any Avalanche Remnant ally has Whiteout, all Avalanche Remnant allies gain 15% Defense. (Can do in combatEngine.ts getModifiedStats, but simpler to apply dynamically or skip. We'll do it in getModifiedStats)
   });
});
`;

c = c + '\n' + newPassives;
fs.writeFileSync('src/utils/combat/customKitLogic.ts', c);

