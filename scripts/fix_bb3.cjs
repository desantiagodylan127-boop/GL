const fs = require('fs');
let c = fs.readFileSync('src/utils/combat/customKitLogic.ts', 'utf8');
c = c.split('\\${').join('${');
fs.writeFileSync('src/utils/combat/customKitLogic.ts', c);
