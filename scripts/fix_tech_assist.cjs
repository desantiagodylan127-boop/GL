const fs = require('fs');
let c = fs.readFileSync('src/utils/combatEngine.ts', 'utf8');

c = c.replace(/      if \(assistDepth > 0 \|\| counterDepth > 0\) \{\n\n         if \(attacker\.tags\.includes\('Bad Batch'\) \|\| checkHasTag\(attacker, 'Bad Batch'\)\) \{\n            const tech = allies\.find\(u => u\.characterId === 'tech_bb' && u\.activeInBattle && u\.hp > 0\);\n            if \(tech && !hasStatusFlag\(tech, 'prevent_tm_gain'\)\) \{\n                tech\.turnMeter = Math\.min\(100, tech\.turnMeter \+ 5\);\n            \}\n         \}/, 
`      if (assistDepth > 0 || counterDepth > 0) {`);

const outOfTurnHook = `
  if (assistDepth > 0 || counterDepth > 0) {
      if (attacker.tags.includes('Bad Batch') || checkHasTag(attacker, 'Bad Batch')) {
          const squad = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
          const tech = squad.find(u => u.characterId === 'tech_bb' && u.activeInBattle && u.hp > 0);
          if (tech && !hasStatusFlag(tech, 'prevent_tm_gain')) {
              tech.turnMeter = Math.min(100, tech.turnMeter + 5);
          }
      }
  }
`;

c = c.replace(/(\/\/ Wolfpack triggers on attacking:)/, outOfTurnHook + "\n  $1");

fs.writeFileSync('src/utils/combatEngine.ts', c);
