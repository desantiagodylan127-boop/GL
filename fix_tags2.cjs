const fs = require('fs');

function addTag(file, idRegex, tagToAdd) {
    let content = fs.readFileSync(file, 'utf8');
    const regex = new RegExp(`(id:\\s*'${idRegex}'|'${idRegex}')([\\s\\S]*?tags:\\s*\\[)(.*?)(])`, 'g');
    content = content.replace(regex, (match, p1, p2, p3, p4) => {
        // Only add if not already there
        if (!p3.includes(`'${tagToAdd}'`)) {
            return `${p1}${p2}${p3}, '${tagToAdd}'${p4}`;
        }
        return match;
    });
    fs.writeFileSync(file, content, 'utf8');
}

addTag('src/data/characters/rogue_archaeologist_characters.ts', 'doctor_aphra_event', 'Event Exclusive');
addTag('src/data/characters/rogue_archaeologist_characters.ts', 'triple_zero_conquest', 'Event Exclusive');
addTag('src/data/characters/rogue_archaeologist_characters.ts', 'bt_one_conquest', 'Event Exclusive');
addTag('src/data/characters/imperial_architects_characters.ts', 'admiral_piett_final', 'Journey Character');

console.log("Added tags.");
