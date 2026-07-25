const fs = require('fs');
let code = fs.readFileSync('src/utils/combat/customKitLogic.ts', 'utf8');

code = code.replace(/const baseDmg = /g, 'let baseDmg = ');
code = code.replace(/let let baseDmg/g, 'let baseDmg');

fs.writeFileSync('src/utils/combat/customKitLogic.ts', code);
