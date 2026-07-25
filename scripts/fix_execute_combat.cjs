const fs = require('fs');
let c = fs.readFileSync('src/utils/combat/customKitLogic.ts', 'utf8');

// Replace standard signature
c = c.replace(/executeCombatAction\(state, ([a-zA-Z0-9_]+), ([a-zA-Z0-9_]+), ([a-zA-Z0-9_]+), (?:isCrit|false), ([a-zA-Z0-9_]+), (assistDepth[+0-9 ]*?), counterDepth\)/g, 
"executeCombatAction(state, $1.id, $3, $2.id, $4 ? $4.id : undefined, $5, counterDepth)");

c = c.replace(/executeCombatAction\(state, ([a-zA-Z0-9_]+), ([a-zA-Z0-9_]+), ([a-zA-Z0-9_]+), (?:isCrit|false), null, (assistDepth[+0-9 ]*?), counterDepth\)/g, 
"executeCombatAction(state, $1.id, $3, $2.id, undefined, $5, counterDepth)");

c = c.replace(/executeCombatAction\(state, ([a-zA-Z0-9_]+), ([a-zA-Z0-9_]+), ([a-zA-Z0-9_]+), (?:isCrit|false), null, 1, 0\)/g, 
"executeCombatAction(state, $1.id, $3, $2.id, undefined, 1, 0)");


fs.writeFileSync('src/utils/combat/customKitLogic.ts', c);

let ce = fs.readFileSync('src/utils/combatEngine.ts', 'utf8');

ce = ce.replace(/executeCombatAction\(state, ([a-zA-Z0-9_]+), ([a-zA-Z0-9_]+), ([a-zA-Z0-9_]+), (?:isCrit|false), ([a-zA-Z0-9_]+), (assistDepth[+0-9 ]*?), counterDepth\)/g, 
"executeCombatAction(state, $1.id, $3, $2.id, $4 ? $4.id : undefined, $5, counterDepth)");

ce = ce.replace(/executeCombatAction\(state, ([a-zA-Z0-9_]+), ([a-zA-Z0-9_]+), ([a-zA-Z0-9_]+), (?:isCrit|false), null, (assistDepth[+0-9 ]*?), counterDepth\)/g, 
"executeCombatAction(state, $1.id, $3, $2.id, undefined, $5, counterDepth)");

ce = ce.replace(/executeCombatAction\(state, ([a-zA-Z0-9_]+), ([a-zA-Z0-9_]+), ([a-zA-Z0-9_]+), (?:isCrit|false), null, 1, 0\)/g, 
"executeCombatAction(state, $1.id, $3, $2.id, undefined, 1, 0)");

fs.writeFileSync('src/utils/combatEngine.ts', ce);

