const fs = require('fs');
let c = fs.readFileSync('src/utils/combatEngine.ts', 'utf8');

const defeatHook = `
    const veil = squad.find(u => u.characterId === 'ashen_veil' && u.activeInBattle && u.hp > 0);
    if (veil) {
        squad.forEach(u => {
            if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Morvek Survivor') || checkHasTag(u, 'Morvek Survivor'))) {
                u.hp = Math.min(u.maxHp, u.hp + Math.round(u.maxHp * 0.10));
            }
        });
    }
    
    const hollow = squad.find(u => u.characterId === 'hollow' && u.activeInBattle && u.hp > 0);
    if (hollow) {
        if (!hollow.dynamicState) hollow.dynamicState = {};
        hollow.dynamicState.hollowOffenseStacks = (hollow.dynamicState.hollowOffenseStacks || 0) + 1;
        hollow.dynamicState.hollowSpeedStacks = (hollow.dynamicState.hollowSpeedStacks || 0) + 1;
    }
    
    // Attacker defeat triggers: Need to check who defeated them. We don't have the attacker explicitly in runDefeatHooks.
    // However, if we assume we can add a 'lastAttacker' or similar. 
    // Actually, runDefeatHooks doesn't take the killer. We can add a killer parameter to checkDefeat.
    // Or we do it dynamically on the damage hook before calling runDefeatHooks?
    // Wait, in customKitLogic where damage is applied we can do it directly. Let's do that for glaze and frostburn.
`;

c = c.replace(/(export function runDefeatHooks\(state: CombatState, defeatedUnit: CombatUnit\) \{\n    const squad = defeatedUnit\.team === 'player' \? state\.playerTeam : state\.enemyTeam;\n    const oppSquad = defeatedUnit\.team === 'player' \? state\.enemyTeam : state\.playerTeam;)/, 
`$1\n${defeatHook}\n`);
fs.writeFileSync('src/utils/combatEngine.ts', c);

// Let's modify glaze and frostburn's kits to trigger on defeat.
let c2 = fs.readFileSync('src/utils/combat/customKitLogic.ts', 'utf8');
const glazeDefeatHook = `
    if (target.hp === 0) {
        if (!hasStatusFlag(attacker, 'prevent_prot_recovery')) {
            attacker.protection = Math.min(attacker.maxProtection, attacker.protection + Math.round(attacker.maxProtection * 0.50));
            logBattleEvent(state, \`🛡️ Glaze defeats an enemy! Recovers 50% Protection!\`, 'heal');
        }
        runDefeatHooks(state, target);
    }
`;
c2 = c2.replace(/if \(target\.hp === 0\) runDefeatHooks\(state, target\);/g, (match, offset, string) => {
    // We only want to replace it inside Glaze and Frostburn logic.
    return match; // We'll just do it manually for glaze and frostburn
});
// let's do manual replacement for glaze_special_1 and frostburn
c2 = c2.replace(/(\/\/ GLAZE[\s\S]*?)if \(target\.hp === 0\) runDefeatHooks\(state, target\);/g, 
`$1if (target.hp === 0) {
        if (!hasStatusFlag(attacker, 'prevent_prot_recovery')) {
            attacker.protection = Math.min(attacker.maxProtection, attacker.protection + Math.round(attacker.maxProtection * 0.50));
            logBattleEvent(state, \`🛡️ Glaze defeats an enemy! Recovers 50% Protection!\`, 'heal');
        }
        runDefeatHooks(state, target);
    }`);

c2 = c2.replace(/(\/\/ FROSTBURN[\s\S]*?)if \(target\.hp === 0\) runDefeatHooks\(state, target\);/g, 
`$1if (target.hp === 0) {
        attacker.abilities.forEach(a => { if (a.currentCooldown > 0) a.currentCooldown--; });
        logBattleEvent(state, \`⏳ Frostburn defeats an enemy! Cooldowns reduced!\`, 'buff');
        runDefeatHooks(state, target);
    }`);

fs.writeFileSync('src/utils/combat/customKitLogic.ts', c2);

