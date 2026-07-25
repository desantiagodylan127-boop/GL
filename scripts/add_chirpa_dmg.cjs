const fs = require('fs');
let code = fs.readFileSync('src/utils/combat/customKitLogic.ts', 'utf8');

const regex = /const finalDmg = Math.round\(baseDmg\);/g;
const repl = `if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);`;

code = code.replace(regex, repl);

fs.writeFileSync('src/utils/combat/customKitLogic.ts', code);
