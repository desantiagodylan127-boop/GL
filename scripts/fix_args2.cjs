const fs = require('fs');
let c = fs.readFileSync('src/utils/combatEngine.ts', 'utf8');

c = c.replace(/if \(source && source\.characterId === 'hail' && \!hasStatusFlag\(source, 'prevent_prot_recovery'\)\) \{/g, 
"if (attacker && attacker.characterId === 'hail' && !hasStatusFlag(attacker, 'prevent_prot_recovery')) {");

c = c.replace(/source\.protection = Math\.min\(source\.maxProtection, source\.protection \+ Math\.round\(source\.maxProtection \* 0\.05\)\);/g, 
"attacker.protection = Math.min(attacker.maxProtection, attacker.protection + Math.round(attacker.maxProtection * 0.05));");

fs.writeFileSync('src/utils/combatEngine.ts', c);
