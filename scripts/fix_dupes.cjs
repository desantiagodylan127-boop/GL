const fs = require('fs');
const path = require('path');

// 1. Remove dupes from rebel_honor_characters.ts
let rh = fs.readFileSync('src/data/characters/rebel_honor_characters.ts', 'utf8');
const toRemove = [
  /createCharacter\([\s\S]*?'luke_stormtrooper'[\s\S]*?\{ speed: 130 \}\n\s*\),\n/m,
  /createCharacter\([\s\S]*?'han_stormtrooper'[\s\S]*?\{ speed: 136, offense: 3600, critChance: 0.40 \}\n\s*\),\n/m,
  /createCharacter\([\s\S]*?'leia_senator'[\s\S]*?\{ speed: 134, hp: 43000, protection: 37000 \}\n\s*\),\n/m,
  /createCharacter\([\s\S]*?'chewbacca_smuggler'[\s\S]*?\{ speed: 119, hp: 56000, protection: 46000 \}\n\s*\),\n/m,
  /createCharacter\([\s\S]*?'r2d2'[\s\S]*?\{ speed: 140 \}\n\s*\),\n/m
];
for (const regex of toRemove) {
  rh = rh.replace(regex, '');
}
fs.writeFileSync('src/data/characters/rebel_honor_characters.ts', rh);

// 2. Global replacements
const replacements = {
  'luke_stormtrooper': 'stormtrooper_luke',
  'han_stormtrooper': 'stormtrooper_han',
  'leia_senator': 'senator_organa',
  'chewbacca_smuggler': 'smuggler_chewbacca'
};

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let changed = false;
            for (const [oldId, newId] of Object.entries(replacements)) {
                if (content.includes(oldId)) {
                    content = content.replace(new RegExp(oldId, 'g'), newId);
                    changed = true;
                }
            }
            if (changed) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}
replaceInDir('src');
