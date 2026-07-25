const fs = require('fs');
let c = fs.readFileSync('src/utils/combatEngine.ts', 'utf8');

const expireHook = `
  // Check Whiteout expiration
  const whiteoutExpired = expired.some(s => s.name === 'Whiteout');
  if (whiteoutExpired) {
      const squad = unit.team === 'player' ? state.playerTeam : state.enemyTeam;
      const rime = squad.find(u => u.characterId === 'captain_rime' && u.activeInBattle && u.hp > 0);
      if (rime && !hasStatusFlag(rime, 'prevent_tm_gain')) {
          rime.turnMeter = Math.min(100, rime.turnMeter + 5);
      }
  }
`;

c = c.replace(/(  \/\/ Check Lockdown expiration)/, expireHook + "\n$1");

fs.writeFileSync('src/utils/combatEngine.ts', c);
