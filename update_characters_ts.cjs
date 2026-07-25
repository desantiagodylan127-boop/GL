const fs = require('fs');
let content = fs.readFileSync('src/data/characters.ts', 'utf8');

content = content.replace(
  /const sTags = \['Leader', 'Galactic Legend', 'Founder', 'Journey Character', 'Era Unit', 'Marquee', 'Legacy \(Farmable\)', 'NPC', 'Raid Boss', 'Summon'\];/g,
  "const sTags = ['Leader', 'Galactic Legend', 'Founder', 'Journey Character', 'Era Unit', 'Marquee', 'Event Exclusive', 'Legacy (Farmable)', 'NPC', 'Raid Boss', 'Summon'];"
);

content = content.replace(
  /const SYSTEM_TAGS = \['Leader', 'Galactic Legend', 'Founder', 'Journey Character', 'Era Unit', 'Marquee', 'Legacy \(Farmable\)', 'NPC', 'Raid Boss', 'Summon'\];/g,
  "const SYSTEM_TAGS = ['Leader', 'Galactic Legend', 'Founder', 'Journey Character', 'Era Unit', 'Marquee', 'Event Exclusive', 'Legacy (Farmable)', 'NPC', 'Raid Boss', 'Summon'];"
);

content = content.replace(
  /if \(!newTags\.has\('Journey Character'\) && \s*!newTags\.has\('Era Unit'\) && \s*!newTags\.has\('NPC'\) &&\s*!newTags\.has\('Marquee'\) &&\s*!newTags\.has\('Founder'\) &&\s*!newTags\.has\('Raid Boss'\)\)/g,
  "if (!newTags.has('Journey Character') && !newTags.has('Era Unit') && !newTags.has('NPC') && !newTags.has('Marquee') && !newTags.has('Event Exclusive') && !newTags.has('Founder') && !newTags.has('Raid Boss'))"
);

fs.writeFileSync('src/data/characters.ts', content, 'utf8');
console.log("Updated characters.ts");
