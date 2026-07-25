const fs = require('fs');
let code = fs.readFileSync('src/utils/combat/customKitLogic.ts', 'utf8');

code = code.replace(/'c3po_journey'/g, "'c3po'");

fs.writeFileSync('src/utils/combat/customKitLogic.ts', code);
