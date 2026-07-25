const fs = require('fs');
const files = [
    'src/data/characters/final_batch_characters.ts',
    'src/data/characters/rogue_archaeologist_characters.ts',
    'src/data/characters/imperial_architects_characters.ts'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Savage
    content = content.replace(/(id:\s*'savage_opress_dw'[\s\S]*?tags:\s*\[.*?)(])/g, "$1, 'Event Exclusive'$2");
    // Crumb
    content = content.replace(/(id:\s*'salacious_crumb'[\s\S]*?tags:\s*\[.*?)(])/g, "$1, 'Event Exclusive'$2");
    // Aphra
    content = content.replace(/(id:\s*'doctor_aphra_event'[\s\S]*?tags:\s*\[.*?)(])/g, "$1, 'Event Exclusive'$2");
    // Piett
    content = content.replace(/(id:\s*'admiral_piett_final'[\s\S]*?tags:\s*\[.*?)(])/g, "$1, 'Journey Character'$2");

    // Also remove 'Legacy (Farmable)' if it exists
    content = content.replace(/'Legacy \(Farmable\)',\s*/g, '');
    
    fs.writeFileSync(file, content, 'utf8');
});

console.log("Fixed tags!");
