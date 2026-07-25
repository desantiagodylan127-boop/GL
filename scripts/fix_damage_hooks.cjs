const fs = require('fs');
let c = fs.readFileSync('src/utils/combatEngine.ts', 'utf8');

const damageHook = `
    if (isCrit) {
        if (currentTarget.characterId === 'warlord_drake_voss') {
            applyStatus(state, currentTarget, 'Entrenched', 1, false);
        }
        if (currentTarget.tags.includes('Avalanche Remnant') || checkHasTag(currentTarget, 'Avalanche Remnant')) {
            const voren = (currentTarget.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.characterId === 'commander_voren' && u.activeInBattle && u.hp > 0);
            if (voren) {
                applyStatus(state, attacker, 'Frostbite', 1, true, voren);
            }
        }
    }
    
    if (currentTarget.characterId === 'torr_kane') {
        if (!currentTarget.dynamicState) currentTarget.dynamicState = {};
        currentTarget.dynamicState.torrDefenseStacks = (currentTarget.dynamicState.torrDefenseStacks || 0) + 1;
    }
`;

c = c.replace(/(export function checkHealthThresholdHooks\(state: CombatState, currentTarget: CombatUnit, attacker: CombatUnit, isCrit: boolean = false\) \{)/, 
`$1\n${damageHook}\n`);
fs.writeFileSync('src/utils/combatEngine.ts', c);
