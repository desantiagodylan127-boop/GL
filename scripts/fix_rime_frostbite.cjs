const fs = require('fs');
let c = fs.readFileSync('src/utils/combatEngine.ts', 'utf8');

const rimeHook = `
      if (name === 'Frostbite' && preCount < 3 && existing.count >= 3) {
          const oppSquad = target.team === 'player' ? state.enemyTeam : state.playerTeam;
          const rime = oppSquad.find(u => u.characterId === 'captain_rime' && u.activeInBattle && u.hp > 0);
          if (rime && !hasStatusFlag(rime, 'prevent_tm_gain')) {
              rime.turnMeter = Math.min(100, rime.turnMeter + 10);
              logBattleEvent(state, \`⏩ Captain Rime gains 10% TM (Enemy reached 3 Frostbite)!\`, 'buff');
          }
      }
`;

c = c.replace(/(      const countGained = existing\.count - preCount;\n      \n      logBattleEvent\(state, \`\$\{target\.name\} stacked \$\{name\} \(x\$\{existing\.count\}\)\`, isDebuff \? 'debuff' : 'buff'\);)/, 
`$1\n${rimeHook}\n`);

fs.writeFileSync('src/utils/combatEngine.ts', c);
