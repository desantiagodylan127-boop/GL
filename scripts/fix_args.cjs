const fs = require('fs');
let c = fs.readFileSync('src/utils/combat/customKitLogic.ts', 'utf8');

c = c.replace(/executeCombatAction\(state, attacker\.id, target\.id, dummyAbility/g, 
"executeCombatAction(state, attacker.id, dummyAbility, target.id");

c = c.replace(/executeCombatAction\(state, attacker\.id, target\.id, basic/g, 
"executeCombatAction(state, attacker.id, basic, target.id");

c = c.replace(/a\.currentCooldown/g, "a.cooldown");

fs.writeFileSync('src/utils/combat/customKitLogic.ts', c);

let ce = fs.readFileSync('src/utils/combatEngine.ts', 'utf8');
ce = ce.replace(/sourceUnit/g, "source");
fs.writeFileSync('src/utils/combatEngine.ts', ce);

