const fs = require('fs');
let contentAphra = fs.readFileSync('src/data/characters/rogue_archaeologist_characters.ts', 'utf8');
contentAphra = contentAphra.replace(
  /\['Rogue Archaeologist', 'Pirate', 'Scoundrel', 'Event Character'\]/,
  "['Rogue Archaeologist', 'Pirate', 'Scoundrel', 'Event Character', 'Event Exclusive']"
);
fs.writeFileSync('src/data/characters/rogue_archaeologist_characters.ts', contentAphra, 'utf8');

let contentPiett = fs.readFileSync('src/data/characters/imperial_architects_characters.ts', 'utf8');
contentPiett = contentPiett.replace(
  /\['Galactic Empire', 'Imperial Architects'\]/,
  "['Galactic Empire', 'Imperial Architects', 'Journey Character']"
);
fs.writeFileSync('src/data/characters/imperial_architects_characters.ts', contentPiett, 'utf8');

console.log("Fixed!");
