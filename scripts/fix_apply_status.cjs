const fs = require('fs');
let c = fs.readFileSync('src/utils/combatEngine.ts', 'utf8');

const hook = `
  if (name === 'Entrenched') {
      const teamSquad = target.team === 'player' ? state.playerTeam : state.enemyTeam;
      const voss = teamSquad.find(u => u.position === 0 && u.characterId === 'warlord_drake_voss' && u.activeInBattle && u.hp > 0);
      if (voss && (target.tags.includes('Morvek Survivor') || checkHasTag(target, 'Morvek Survivor'))) {
          target.hp = Math.min(target.maxHp, target.hp + Math.round(target.maxHp * 0.05));
      }
  }
  
  if (name === 'Frostbite') {
      const oppTeam = target.team === 'player' ? state.enemyTeam : state.playerTeam;
      const voren = oppTeam.find(u => u.position === 0 && u.characterId === 'commander_voren' && u.activeInBattle && u.hp > 0);
      if (voren) {
          oppTeam.forEach(a => {
              if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Avalanche Remnant') || checkHasTag(a, 'Avalanche Remnant')) && !hasStatusFlag(a, 'prevent_prot_recovery')) {
                  a.protection = Math.min(a.maxProtection, a.protection + Math.round(a.maxProtection * 0.02));
              }
          });
      }
      
      const glaze = oppTeam.find(u => u.characterId === 'glaze' && u.activeInBattle && u.hp > 0);
      if (glaze && !hasStatusFlag(glaze, 'prevent_tm_gain')) {
          glaze.turnMeter = Math.min(100, glaze.turnMeter + 5);
      }
      
      if (sourceUnit && sourceUnit.characterId === 'hail' && !hasStatusFlag(sourceUnit, 'prevent_prot_recovery')) {
          sourceUnit.protection = Math.min(sourceUnit.maxProtection, sourceUnit.protection + Math.round(sourceUnit.maxProtection * 0.05));
      }
  }
  
  if (name === 'Healing Immunity') {
      const oppTeam = target.team === 'player' ? state.enemyTeam : state.playerTeam;
      const frostburn = oppTeam.find(u => u.characterId === 'frostburn' && u.activeInBattle && u.hp > 0);
      if (frostburn) {
          oppTeam.forEach(a => {
              if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Avalanche Remnant') || checkHasTag(a, 'Avalanche Remnant')) && !hasStatusFlag(a, 'prevent_prot_recovery')) {
                  a.protection = Math.min(a.maxProtection, a.protection + Math.round(a.maxProtection * 0.02));
              }
          });
      }
  }
`;

c = c.replace(/(if \(name === 'Imperial Decree'\) \{)/, hook + "\n  $1");

fs.writeFileSync('src/utils/combatEngine.ts', c);
