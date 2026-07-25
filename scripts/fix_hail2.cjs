const fs = require('fs');
let c = fs.readFileSync('src/utils/combatEngine.ts', 'utf8');

c = c.replace(/    if \(target && target\.statuses\.some\(s => s\.name === 'Whiteout'\)\) \{/g, 
"    const target = (state.playerTeam.find(u => u.id === targetId) || state.enemyTeam.find(u => u.id === targetId))!;\n    if (target && target.statuses.some(s => s.name === 'Whiteout')) {");

fs.writeFileSync('src/utils/combatEngine.ts', c);
