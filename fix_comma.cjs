const fs = require('fs');
let content = fs.readFileSync('src/data/campaign.ts', 'utf8');

content = content.replace(/factionAffinity:\s*\['exiles', 'imperial remnant', 'empire'\]\n\s*\}\n\s*\/\/\s*---\s*OUTLAWS ERA\s*---/, "factionAffinity: ['exiles', 'imperial remnant', 'empire']\n  },\n  // --- OUTLAWS ERA ---");

fs.writeFileSync('src/data/campaign.ts', content, 'utf8');
console.log("Fixed comma!");
