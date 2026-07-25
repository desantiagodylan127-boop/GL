const fs = require('fs');
let c = fs.readFileSync('src/utils/combatEngine.ts', 'utf8');

const hailAttackHook = `
    if (target && target.statuses.some(s => s.name === 'Whiteout')) {
        const squad = target.team === 'player' ? state.playerTeam : state.enemyTeam;
        const hail = squad.find(u => u.characterId === 'hail' && u.activeInBattle && u.hp > 0);
        if (hail) applyStatus(state, hail, 'Retribution', 1, false);
    }
`;

c = c.replace(/(    if \(attacker\.statuses\.some\(s => s\.name === 'Frostbite'\)\) \{)/, 
`${hailAttackHook}\n$1`);

const hailCounterHook = `
    if (counterDepth > 0 && attacker.characterId === 'hail' && !hasStatusFlag(attacker, 'prevent_prot_recovery')) {
        attacker.protection = Math.min(attacker.maxProtection, attacker.protection + Math.round(attacker.maxProtection * 0.03));
    }
`;

c = c.replace(/(    if \(attacker\.tags\.includes\('Wolfpack'\) \|\| checkHasTag\(attacker, 'Wolfpack'\)\) \{)/, 
`${hailCounterHook}\n$1`);

fs.writeFileSync('src/utils/combatEngine.ts', c);
