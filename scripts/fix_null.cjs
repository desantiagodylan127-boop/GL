const fs = require('fs');
let c = fs.readFileSync('src/utils/combat/customKitLogic.ts', 'utf8');

c = c.replace(/null \? null\.id : undefined/g, "undefined");

fs.writeFileSync('src/utils/combat/customKitLogic.ts', c);

let ce = fs.readFileSync('src/utils/combatEngine.ts', 'utf8');
ce = ce.replace(/null \? null\.id : undefined/g, "undefined");
fs.writeFileSync('src/utils/combatEngine.ts', ce);
