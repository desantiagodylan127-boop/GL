const fs = require('fs');
let c = fs.readFileSync('src/utils/combat/customKitLogic.ts', 'utf8');
c = c.replace(/target\.hp = Math\.max\(0, target\.hp - \);\s*logBattleEvent\(state, \);\s*if \(target\.hp === 0\) runDefeatHooks\(state, target\);/g, 
"target.hp = Math.max(0, target.hp - finalDmg);\n   logBattleEvent(state, `${target.name} suffered ${finalDmg} damage.`, 'damage', target.id, attacker.id, finalDmg, isCrit);\n   if (target.hp === 0) runDefeatHooks(state, target);");
fs.writeFileSync('src/utils/combat/customKitLogic.ts', c);
