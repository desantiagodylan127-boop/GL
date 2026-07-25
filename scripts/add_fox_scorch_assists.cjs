const fs = require('fs');
let c = fs.readFileSync('src/utils/combat/customKitLogic.ts', 'utf8');

const foxO66Hook = `
    const o66 = target.statuses.find(s => s.name === 'Order 66');
    const stacks = o66 ? o66.count : 0;
    target.statuses = target.statuses.filter(s => s.name !== 'Order 66');
    
    if (stacks > 0) {
        const squad = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
        const scorch = squad.find(u => u.characterId === 'scorch_knightfall' && u.activeInBattle && u.hp > 0);
        if (scorch) {
            logBattleEvent(state, \`💥 Order 66 Consumed! Scorch assists \${attacker.name}!\`, 'info');
            const basic = scorch.abilities.find(a => a.type === 'basic');
            if (basic) executeCombatAction(state, scorch.id, basic, target.id, undefined, assistDepth + 1, counterDepth);
        }
    }
`;
c = c.replace(/const o66 = target\.statuses\.find\(s => s\.name === 'Order 66'\);\n    const stacks = o66 \? o66\.count : 0;\n    target\.statuses = target\.statuses\.filter\(s => s\.name !== 'Order 66'\);/, foxO66Hook);

const scorchPurgeHook = `
        const purge = e.statuses.find(s => s.name === 'Purge');
        const stacks = purge ? purge.count : 0;
        e.statuses = e.statuses.filter(s => s.name !== 'Purge');
        
        if (stacks > 0 && e.id === target.id) {
            const squad = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
            const fox = squad.find(u => u.characterId === 'commander_fox' && u.activeInBattle && u.hp > 0);
            if (fox) {
                logBattleEvent(state, \`💥 Purge Consumed! Commander Fox assists \${attacker.name}!\`, 'info');
                const basic = fox.abilities.find(a => a.type === 'basic');
                if (basic) executeCombatAction(state, fox.id, basic, target.id, undefined, assistDepth + 1, counterDepth);
            }
        }
`;
c = c.replace(/const purge = e\.statuses\.find\(s => s\.name === 'Purge'\);\n        const stacks = purge \? purge\.count : 0;\n        e\.statuses = e\.statuses\.filter\(s => s\.name !== 'Purge'\);/, scorchPurgeHook);

fs.writeFileSync('src/utils/combat/customKitLogic.ts', c);
