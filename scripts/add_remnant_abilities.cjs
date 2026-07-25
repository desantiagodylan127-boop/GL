const fs = require('fs');
let c = fs.readFileSync('src/utils/combat/customKitLogic.ts', 'utf8');

const abilities = `
// ==========================================
// AVALANCHE REMNANT (IMPERIAL REMNANT)
// ==========================================

// COMMANDER VOREN
customAbilityHandlers['voren_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, target.id, dummyAbility, undefined, assistDepth, counterDepth);
    
    if (target.statuses.some(s => s.name === 'Frostbite')) {
        target.turnMeter = Math.max(0, target.turnMeter - 5);
        logBattleEvent(state, \`📉 \${target.name} loses 5% TM (Frostbite)!\`, 'debuff');
    }
};
customAbilityHandlers['voren_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, target.id, dummyAbility, undefined, assistDepth, counterDepth);
    
    const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
    enemies.forEach(e => {
        if (e.activeInBattle && e.hp > 0 && e.statuses.some(s => s.name === 'Frostbite')) {
            applyStatus(state, e, 'Offense Down', 1, true, attacker);
        }
    });
};
customAbilityHandlers['voren_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
    const frostbittenBefore = enemies.filter(e => e.activeInBattle && e.hp > 0 && e.statuses.some(s => s.name === 'Frostbite')).map(e => e.id);
    
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, target.id, dummyAbility, undefined, assistDepth, counterDepth);
    
    enemies.forEach(e => {
        if (e.activeInBattle && e.hp > 0 && frostbittenBefore.includes(e.id)) {
            applyStatus(state, e, 'Speed Down', 2, true, attacker);
        }
    });
};

// CAPTAIN RIME
customAbilityHandlers['rime_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, target.id, dummyAbility, undefined, assistDepth, counterDepth);
    if (Math.random() <= 0.50) {
        applyStatus(state, target, 'Speed Down', 2, true, attacker);
    }
};
customAbilityHandlers['rime_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, target.id, dummyAbility, explicitTargetAlly?.id, assistDepth, counterDepth);
    
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    const activeAllies = allies.filter(a => a.activeInBattle && a.hp > 0 && (a.tags.includes('Avalanche Remnant') || checkHasTag(a, 'Avalanche Remnant')));
    if (activeAllies.length > 0) {
        const weakest = activeAllies.sort((a,b) => (a.hp / a.maxHp) - (b.hp / b.maxHp))[0];
        applyStatus(state, weakest, 'Whiteout', 2, false, attacker);
    }
};
customAbilityHandlers['rime_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, target.id, dummyAbility, undefined, assistDepth, counterDepth);
    
    const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
    enemies.forEach(e => {
        if (e.activeInBattle && e.hp > 0 && e.statuses.some(s => s.name === 'Frostbite')) {
            e.turnMeter = Math.max(0, e.turnMeter - 15);
        }
    });
};

// GLAZE
customAbilityHandlers['glaze_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, target.id, dummyAbility, undefined, assistDepth, counterDepth);
    if (!hasStatusFlag(attacker, 'prevent_tm_gain')) {
        attacker.turnMeter = Math.min(100, attacker.turnMeter + 5);
    }
};
customAbilityHandlers['glaze_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const hasFrostbite = target.statuses.some(s => s.name === 'Frostbite');
    
    const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
    let baseDmg = attStats.offense * 2.0;
    if (isCrit) baseDmg *= attStats.critDamage;
    const defStats = getModifiedStats(target, attacker.team === 'player' ? state.enemyTeam : state.playerTeam);
    const effDef = hasFrostbite ? defStats.defense * 0.75 : defStats.defense; // ignore 25% defense
    const armor = effDef / (effDef + 100);
    const finalDmg = Math.round(baseDmg * (1 - armor));
    
    if (target.protection > 0) {
        if (finalDmg > target.protection) {
            target.hp = Math.max(0, target.hp - (finalDmg - target.protection));
            target.protection = 0;
        } else {
            target.protection -= finalDmg;
        }
    } else {
        target.hp = Math.max(0, target.hp - finalDmg);
    }
    logBattleEvent(state, \`\${target.name} suffered \${finalDmg} Massive damage from Icebreaker Round.\`, 'damage', target.id, attacker.id, finalDmg, isCrit);
    
    if (hasFrostbite) {
        applyStatus(state, target, 'Exposed', 1, true, attacker);
    }
    
    if (target.hp === 0) runDefeatHooks(state, target);
};
customAbilityHandlers['glaze_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, target.id, dummyAbility, undefined, assistDepth, counterDepth);
};

// HAIL
customAbilityHandlers['hail_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, target.id, dummyAbility, undefined, assistDepth, counterDepth);
    if (Math.random() <= 0.50) {
        applyStatus(state, target, 'Frostbite', 1, true, attacker);
    }
};
customAbilityHandlers['hail_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, target.id, dummyAbility, undefined, assistDepth, counterDepth);
    
    if (!attacker.dynamicState) attacker.dynamicState = {};
    attacker.dynamicState.hailCounterFrostbite = true;
};
customAbilityHandlers['hail_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, target.id, dummyAbility, undefined, assistDepth, counterDepth);
    
    const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
    enemies.forEach(e => {
        if (e.activeInBattle && e.hp > 0) {
            let reduction = 5;
            if (e.statuses.some(s => s.name === 'Frostbite')) {
                reduction += 5;
            }
            e.turnMeter = Math.max(0, e.turnMeter - reduction);
        }
    });
};

// FROSTBURN
customAbilityHandlers['frostburn_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const isFrostbitten = target.statuses.some(s => s.name === 'Frostbite');
    
    const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
    let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
    if (isFrostbitten) baseDmg *= 1.5; // Bonus damage
    if (isCrit) baseDmg *= attStats.critDamage;
    
    // Special Damage uses defense but we assume same formula for simplicity here
    const defStats = getModifiedStats(target, attacker.team === 'player' ? state.enemyTeam : state.playerTeam);
    const armor = defStats.defense / (defStats.defense + 100);
    const finalDmg = Math.round(baseDmg * (1 - armor));
    
    if (target.protection > 0) {
        if (finalDmg > target.protection) {
            target.hp = Math.max(0, target.hp - (finalDmg - target.protection));
            target.protection = 0;
        } else {
            target.protection -= finalDmg;
        }
    } else {
        target.hp = Math.max(0, target.hp - finalDmg);
    }
    logBattleEvent(state, \`\${target.name} suffered \${finalDmg} Special Damage\${isFrostbitten ? ' (Bonus vs Frostbite!)' : ''}.\`, 'damage', target.id, attacker.id, finalDmg, isCrit);
    
    if (target.hp === 0) runDefeatHooks(state, target);
};
customAbilityHandlers['frostburn_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, target.id, dummyAbility, undefined, assistDepth, counterDepth);
    
    const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
    enemies.forEach(e => {
        if (e.activeInBattle && e.hp > 0) {
            const frostbite = e.statuses.find(s => s.name === 'Frostbite');
            if (frostbite) {
                e.statuses = e.statuses.filter(s => s.name !== 'Frostbite');
                logBattleEvent(state, \`💥 Frostburn consumes Frostbite from \${e.name}!\`, 'info');
                // Trigger consume hook manually or let it trigger elsewhere?
                // The hook in unique says "whenever Frostbite is consumed"
                if (!attacker.dynamicState) attacker.dynamicState = {};
                attacker.dynamicState.frostbiteConsumed = (attacker.dynamicState.frostbiteConsumed || 0) + 1;
            }
        }
    });
    // Gain 5% TM per consumed
    if (attacker.dynamicState && attacker.dynamicState.frostbiteConsumed && !hasStatusFlag(attacker, 'prevent_tm_gain')) {
        attacker.turnMeter = Math.min(100, attacker.turnMeter + (5 * attacker.dynamicState.frostbiteConsumed));
        attacker.dynamicState.frostbiteConsumed = 0; // reset
    }
};
customAbilityHandlers['frostburn_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const frostbite = target.statuses.find(s => s.name === 'Frostbite');
    const stacks = frostbite ? frostbite.count : 0;
    
    if (stacks > 0) {
        target.statuses = target.statuses.filter(s => s.name !== 'Frostbite');
        
        const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
        let baseDmg = attStats.offense * 2.0 * (1 + (stacks * 0.20));
        
        if (isCrit) baseDmg *= attStats.critDamage;
        const finalDmg = Math.round(baseDmg); // True damage? The text says "massive additional damage". We'll ignore armor.
        
        if (target.protection > 0) {
            if (finalDmg > target.protection) {
                target.hp = Math.max(0, target.hp - (finalDmg - target.protection));
                target.protection = 0;
            } else {
                target.protection -= finalDmg;
            }
        } else {
            target.hp = Math.max(0, target.hp - finalDmg);
        }
        logBattleEvent(state, \`\${target.name} suffered \${finalDmg} Massive damage (Consumed \${stacks} stacks of Frostbite!).\`, 'damage', target.id, attacker.id, finalDmg, isCrit);
        
        if (!hasStatusFlag(attacker, 'prevent_tm_gain')) {
            attacker.turnMeter = Math.min(100, attacker.turnMeter + 5);
        }
        
        if (target.hp === 0) runDefeatHooks(state, target);
    } else {
        const dummyAbility = { ...ability, id: ability.id + '_base' };
        executeCombatAction(state, attacker.id, target.id, dummyAbility, undefined, assistDepth, counterDepth);
    }
};

`;

c = c + '\n' + abilities;
fs.writeFileSync('src/utils/combat/customKitLogic.ts', c);
