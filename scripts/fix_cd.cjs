const fs = require('fs');
let c = fs.readFileSync('src/utils/combat/customKitLogic.ts', 'utf8');

c = c.replace(/attacker\.abilities\.forEach\(a => \{ if \(a\.cooldown > 0\) a\.cooldown--; \}\);/g, 
"Object.keys(attacker.cooldowns).forEach(key => { if (attacker.cooldowns[key] > 0) attacker.cooldowns[key]--; });");

fs.writeFileSync('src/utils/combat/customKitLogic.ts', c);

