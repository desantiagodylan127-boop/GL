const fs = require('fs');
let c = fs.readFileSync('src/utils/combatEngine.ts', 'utf8');

const scorchDmgHook = `
      // Scorch Knightfall: Burning enemies deal 25% less damage
      if (attacker.statuses.some(s => s.name === 'Burning')) {
          const oppSquad = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
          const scorch = oppSquad.find(u => u.characterId === 'scorch_knightfall' && u.activeInBattle && u.hp > 0);
          if (scorch) {
              const lv = oppSquad.find(u => u.characterId === 'gl_lord_vader' && u.activeInBattle && u.hp > 0);
              if (lv) {
                  baseDmg = Math.round(baseDmg * 0.75);
              }
          }
      }
`;

c = c.replace(/(let baseDmg = attStats\.offense \* \(0\.8 \+ Math\.random\(\) \* 0\.4\);)/, "$1\n" + scorchDmgHook);

fs.writeFileSync('src/utils/combatEngine.ts', c);
