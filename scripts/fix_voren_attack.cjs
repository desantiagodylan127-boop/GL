const fs = require('fs');
let c = fs.readFileSync('src/utils/combatEngine.ts', 'utf8');

const vorenAttackHook = `
    if (attacker.statuses.some(s => s.name === 'Frostbite')) {
        const squad = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
        const voren = squad.find(u => u.position === 0 && u.characterId === 'commander_voren' && u.activeInBattle && u.hp > 0);
        if (voren) {
            reduceTurnMeter(state, attacker, 3);
        }
    }
`;

c = c.replace(/(export function executeCombatAction\(state: CombatState, attackerId: string, ability: CombatAbility, targetId: string, explicitTargetAllyId\?: string, assistDepth: number = 0, counterDepth: number = 0\) \{)/, 
`$1\n    const attacker = (state.playerTeam.find(u => u.id === attackerId) || state.enemyTeam.find(u => u.id === attackerId))!;\n${vorenAttackHook}\n`);

fs.writeFileSync('src/utils/combatEngine.ts', c);
