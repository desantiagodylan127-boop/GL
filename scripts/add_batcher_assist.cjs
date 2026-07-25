const fs = require('fs');
let c = fs.readFileSync('src/utils/combatEngine.ts', 'utf8');

const hook = `
  if (unit.characterId === 'omega') {
      const batcher = allies.find(u => u.characterId === 'batcher' && u.activeInBattle && u.hp > 0);
      if (batcher) {
          const enemies = unit.team === 'player' ? state.enemyTeam : state.playerTeam;
          const targetable = enemies.filter(e => e.activeInBattle && e.hp > 0);
          if (targetable.length > 0) {
              const target = targetable.sort((a,b) => a.hp - b.hp)[0]; // target weakest
              logBattleEvent(state, \`🐺 Faithful Companion: Batcher assists Omega!\`, 'info');
              const basic = batcher.abilities.find(a => a.type === 'basic');
              if (basic) executeCombatAction(state, batcher.id, basic, target.id, undefined, 1, 0);
          }
      }
  }
`;

c = c.replace(/(const omega = allies\.find\(u => u\.characterId === 'omega' && u\.activeInBattle && u\.hp > 0\);)/, hook + "\n     $1");
fs.writeFileSync('src/utils/combatEngine.ts', c);
