const fs = require('fs');
let c = fs.readFileSync('src/utils/combat/customKitLogic.ts', 'utf8');
c = c.replace(/currentCooldowns/g, 'cooldowns');
c = c.replace(/s\.id === 'Taunt'/g, "s.name === 'Taunt'");
c = c.replace(/s\.id === 'Marked'/g, "s.name === 'Marked'");
fs.writeFileSync('src/utils/combat/customKitLogic.ts', c);
