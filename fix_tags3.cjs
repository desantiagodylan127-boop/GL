const fs = require('fs');

function removeTag(file, idRegex, tagToRemove) {
    let content = fs.readFileSync(file, 'utf8');
    const regex = new RegExp(`(id:\\s*'${idRegex}'|'${idRegex}')([\\s\\S]*?tags:\\s*\\[)(.*?)(])`, 'g');
    content = content.replace(regex, (match, p1, p2, p3, p4) => {
        let tags = p3.split(',').map(t => t.trim().replace(/^'|'$/g, '')).filter(t => t !== tagToRemove);
        return `${p1}${p2}'${tags.join("', '")}'${p4}`;
    });
    fs.writeFileSync(file, content, 'utf8');
}

removeTag('src/data/characters/rogue_archaeologist_characters.ts', 'triple_zero_conquest', 'Event Exclusive');
removeTag('src/data/characters/rogue_archaeologist_characters.ts', 'bt_one_conquest', 'Event Exclusive');
console.log("Removed from BT1 and 000");
