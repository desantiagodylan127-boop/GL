const fs = require('fs');
let c = fs.readFileSync('src/utils/combatEngine.ts', 'utf8');

const tmReductionHook = `
    const team = target.team === 'player' ? state.enemyTeam : state.playerTeam;
    const rime = team.find(u => u.characterId === 'captain_rime' && u.activeInBattle && u.hp > 0);
    if (rime) {
        team.forEach(a => {
            if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Avalanche Remnant') || checkHasTag(a, 'Avalanche Remnant')) && !hasStatusFlag(a, 'prevent_prot_recovery')) {
                a.protection = Math.min(a.maxProtection, a.protection + Math.round(a.maxProtection * 0.02));
            }
        });
    }
`;

c = c.replace(/(if \(tmReduced > 0\) \{)/, "$1\n" + tmReductionHook);

// and also for Frostbite in processTurnStartHooks
const frostbiteTMHook = `
    if (tmReduction > 0) {
        const team = unit.team === 'player' ? state.enemyTeam : state.playerTeam;
        const rime = team.find(u => u.characterId === 'captain_rime' && u.activeInBattle && u.hp > 0);
        if (rime) {
            team.forEach(a => {
                if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Avalanche Remnant') || checkHasTag(a, 'Avalanche Remnant')) && !hasStatusFlag(a, 'prevent_prot_recovery')) {
                    a.protection = Math.min(a.maxProtection, a.protection + Math.round(a.maxProtection * 0.02));
                }
            });
        }
    }
`;
c = c.replace(/(unit\.turnMeter = Math\.max\(0, unit\.turnMeter - tmReduction\);)/, "$1\n" + frostbiteTMHook);

fs.writeFileSync('src/utils/combatEngine.ts', c);

// Let's modify customKitLogic.ts to use reduceTurnMeter
let c2 = fs.readFileSync('src/utils/combat/customKitLogic.ts', 'utf8');
c2 = c2.replace(/target\.turnMeter = Math\.max\(0, target\.turnMeter - 5\);\n        logBattleEvent\(state, \`📉 \${target\.name} loses 5% TM \(Frostbite\)!\`, 'debuff'\);/g, 
"reduceTurnMeter(state, target, 5);");

c2 = c2.replace(/e\.turnMeter = Math\.max\(0, e\.turnMeter - 15\);/g, 
"reduceTurnMeter(state, e, 15);");

c2 = c2.replace(/e\.turnMeter = Math\.max\(0, e\.turnMeter - reduction\);/g, 
"reduceTurnMeter(state, e, reduction);");

fs.writeFileSync('src/utils/combat/customKitLogic.ts', c2);

