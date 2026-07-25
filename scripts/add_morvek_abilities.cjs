const fs = require('fs');
let c = fs.readFileSync('src/utils/combat/customKitLogic.ts', 'utf8');

const abilities = `
// ==========================================
// MORVEK SURVIVORS (NEW REPUBLIC ERA)
// ==========================================

// WARLORD DRAKE VOSS
customAbilityHandlers['drake_voss_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, target.id, dummyAbility, undefined, assistDepth, counterDepth);
    
    if (Math.random() <= 0.70) {
        applyStatus(state, target, 'Suppressed', 2, true, attacker);
    }
    
    if (attacker.statuses.some(s => s.name === 'Entrenched')) {
        const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
        let baseDmg = attStats.offense * 0.5; // 50% reduced damage
        if (isCrit) baseDmg *= attStats.critDamage;
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
        logBattleEvent(state, \`🔫 Voss attacks again (Entrenched)! \${target.name} suffered \${finalDmg} damage.\`, 'damage', target.id, attacker.id, finalDmg, isCrit);
        if (target.hp === 0) runDefeatHooks(state, target);
    }
};

customAbilityHandlers['drake_voss_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, target.id, dummyAbility, undefined, assistDepth, counterDepth);
    
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    allies.forEach(a => {
        if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Morvek Survivor') || checkHasTag(a, 'Morvek Survivor'))) {
            a.hp = Math.min(a.maxHp, a.hp + Math.round(a.maxHp * 0.10));
        }
    });
    logBattleEvent(state, \`🛡️ Morvek Survivors recover 10% Health!\`, 'heal');
};

customAbilityHandlers['drake_voss_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, target.id, dummyAbility, undefined, assistDepth, counterDepth);
};

// MIRE TALON
customAbilityHandlers['mire_talon_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, target.id, dummyAbility, undefined, assistDepth, counterDepth);
    if (attacker.statuses.some(s => s.name === 'Stealth')) {
        applyStatus(state, target, 'Healing Immunity', 2, true, attacker);
    }
};

customAbilityHandlers['mire_talon_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, target.id, dummyAbility, undefined, assistDepth, counterDepth);
    if (target.statuses.some(s => s.name === 'Battlefield Corruption')) {
        logBattleEvent(state, \`🔪 Talon attacks again (Target has Battlefield Corruption)!\`, 'info');
        const basic = attacker.abilities.find(a => a.type === 'basic');
        if (basic) executeCombatAction(state, attacker.id, target.id, basic, undefined, assistDepth + 1, counterDepth);
    }
};

customAbilityHandlers['mire_talon_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    let multiplier = 1;
    if (target.hp < target.maxHp * 0.5) multiplier = 1.5;
    
    const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
    let baseDmg = attStats.offense * multiplier * (0.8 + Math.random() * 0.4);
    if (isCrit) baseDmg *= attStats.critDamage;
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
    logBattleEvent(state, \`\${target.name} suffered \${finalDmg} damage from No Man's Land.\`, 'damage', target.id, attacker.id, finalDmg, isCrit);
    
    applyStatus(state, target, 'Battlefield Corruption', 3, true, attacker);
    if (target.hp === 0) runDefeatHooks(state, target);
};

// TORR KANE
customAbilityHandlers['torr_kane_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, target.id, dummyAbility, undefined, assistDepth, counterDepth);
    if (Math.random() <= 0.50) {
        applyStatus(state, target, 'Suppressed', 1, true, attacker);
    }
};
customAbilityHandlers['torr_kane_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, target.id, dummyAbility, undefined, assistDepth, counterDepth);
    
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    const activeAllies = allies.filter(a => a.activeInBattle && a.hp > 0);
    if (activeAllies.length > 0) {
        const weakest = activeAllies.sort((a,b) => (a.hp / a.maxHp) - (b.hp / b.maxHp))[0];
        applyStatus(state, weakest, 'Defense Up', 2, false, attacker);
    }
};
customAbilityHandlers['torr_kane_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, target.id, dummyAbility, undefined, assistDepth, counterDepth);
};

// ASHEN VEIL
customAbilityHandlers['ashen_veil_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, target.id, dummyAbility, undefined, assistDepth, counterDepth);
    
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    const activeAllies = allies.filter(a => a.activeInBattle && a.hp > 0);
    if (activeAllies.length > 0) {
        const randomAlly = activeAllies[Math.floor(Math.random() * activeAllies.length)];
        randomAlly.hp = Math.min(randomAlly.maxHp, randomAlly.hp + Math.round(randomAlly.maxHp * 0.05));
        logBattleEvent(state, \`💉 \${randomAlly.name} recovers 5% Health (Combat Stimulants)!\`, 'heal');
    }
};
customAbilityHandlers['ashen_veil_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, target.id, dummyAbility, explicitTargetAlly?.id, assistDepth, counterDepth);
    if (explicitTargetAlly) {
        explicitTargetAlly.hp = Math.min(explicitTargetAlly.maxHp, explicitTargetAlly.hp + Math.round(explicitTargetAlly.maxHp * 0.25));
        logBattleEvent(state, \`💉 \${explicitTargetAlly.name} recovers 25% Health!\`, 'heal');
    }
};
customAbilityHandlers['ashen_veil_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, target.id, dummyAbility, undefined, assistDepth, counterDepth);
};

// HOLLOW
customAbilityHandlers['hollow_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const isBelow50 = attacker.hp < attacker.maxHp * 0.5;
    
    const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
    let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
    if (isBelow50) baseDmg *= 1.5;
    if (isCrit) baseDmg *= attStats.critDamage;
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
    logBattleEvent(state, \`\${target.name} suffered \${finalDmg} damage\${isBelow50 ? ' (Bonus from Low Health!)' : ''}.\`, 'damage', target.id, attacker.id, finalDmg, isCrit);
    if (target.hp === 0) runDefeatHooks(state, target);
};
customAbilityHandlers['hollow_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    attacker.hp = Math.max(1, attacker.hp - Math.round(attacker.maxHp * 0.10));
    logBattleEvent(state, \`🔥 Hollow sacrifices 10% Health for Ash Rage!\`, 'info');
    
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, target.id, dummyAbility, undefined, assistDepth, counterDepth);
};
customAbilityHandlers['hollow_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, target.id, dummyAbility, undefined, assistDepth, counterDepth);
    
    if (target.statuses.some(s => s.name === 'Battlefield Corruption')) {
        applyStatus(state, target, 'Defense Down', 2, true, attacker);
    }
};

`;

c = c + '\n' + abilities;
fs.writeFileSync('src/utils/combat/customKitLogic.ts', c);
