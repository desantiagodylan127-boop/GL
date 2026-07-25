const fs = require('fs');
let content = fs.readFileSync('src/utils/combat/customKitLogic.ts', 'utf8');
content = content.replace(/\\\`\\\$\\{/g, '`${');
content = content.replace(/\\}/g, '}');
content = content.replace(/\\\`/g, '`');
fs.writeFileSync('src/utils/combat/customKitLogic.ts', content);
