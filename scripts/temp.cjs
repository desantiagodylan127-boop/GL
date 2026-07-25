const fs = require('fs');
const files = ['src/data/characters/reworked_characters.ts', 'src/data/characters/jedi_separatist_characters.ts'];
let abilityIds = [];
files.forEach(f => {
  if (fs.existsSync(f)) {
    const text = fs.readFileSync(f, 'utf8');
    const matches = text.matchAll(/makeAbility\('([^']+)'/g);
    for (const match of matches) {
      abilityIds.push(match[1]);
    }
  }
});
const engineCode = fs.readFileSync('src/utils/combatEngine.ts', 'utf8') + (fs.existsSync('src/utils/combat/customKitLogic.ts') ? fs.readFileSync('src/utils/combat/customKitLogic.ts', 'utf8') : '');
const missing = abilityIds.filter(id => !engineCode.includes(id));
console.log('Missing Abilities:\\n' + missing.join('\\n'));
