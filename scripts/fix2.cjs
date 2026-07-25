const fs = require('fs');
let c = fs.readFileSync('src/utils/combat/customKitLogic.ts', 'utf8');
c = c.replace(/logBattleEvent\(state, \);/g, "logBattleEvent(state, 'Unit suffered damage', 'damage');");
fs.writeFileSync('src/utils/combat/customKitLogic.ts', c);
