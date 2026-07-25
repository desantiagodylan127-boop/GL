const fs = require('fs');
let c = fs.readFileSync('src/utils/combat/customKitLogic.ts', 'utf8');

const additionalAbilities = `
// ==========================================
// APPO 501ST
// ==========================================
customAbilityHandlers['appo_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker, target, dummyAbility, isCrit, explicitTargetAlly, assistDepth, counterDepth);
    
    applyStatus(state, attacker, 'Momentum', 99, false, attacker, 1);
    
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    const activeAllies = allies.filter(a => a.activeInBattle && a.hp > 0);
    if (activeAllies.length > 0) {
        const weakest = activeAllies.sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp))[0];
        if (!hasStatusFlag(weakest, 'prevent_prot_recovery')) {
            const rec = Math.round(weakest.maxProtection * 0.05);
            weakest.protection = Math.min(weakest.maxProtection, weakest.protection + rec);
            logBattleEvent(state, \`🛡️ Appo's Basic: \${weakest.name} recovers 5% Protection!\`, 'heal');
        }
    }
};

customAbilityHandlers['appo_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker, target, dummyAbility, isCrit, explicitTargetAlly, assistDepth, counterDepth);
    
    applyStatus(state, attacker, 'Momentum', 99, false, attacker, 2);
    
    const momentum = attacker.statuses.find(s => s.name === 'Momentum');
    if (momentum && momentum.count >= 5) {
        momentum.count -= 5;
        if (momentum.count <= 0) {
            attacker.statuses = attacker.statuses.filter(s => s.name !== 'Momentum');
        }
        if (explicitTargetAlly && !hasStatusFlag(explicitTargetAlly, 'prevent_tm_gain')) {
            explicitTargetAlly.turnMeter = Math.min(100, explicitTargetAlly.turnMeter + 15);
            logBattleEvent(state, \`⏩ Appo consumes 5 Momentum! \${explicitTargetAlly.name} gains 15% TM!\`, 'buff');
        }
    }
};

customAbilityHandlers['appo_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker, target, dummyAbility, isCrit, explicitTargetAlly, assistDepth, counterDepth);
    
    applyStatus(state, attacker, 'Momentum', 99, false, attacker, 3);
    
    const momentum = attacker.statuses.find(s => s.name === 'Momentum');
    if (momentum && momentum.count >= 10) {
        momentum.count -= 10;
        if (momentum.count <= 0) {
            attacker.statuses = attacker.statuses.filter(s => s.name !== 'Momentum');
        }
        const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
        allies.forEach(a => {
            if (a.activeInBattle && a.hp > 0 && !hasStatusFlag(a, 'prevent_prot_recovery')) {
                const rec = Math.round(a.maxProtection * 0.15);
                a.protection = Math.min(a.maxProtection, a.protection + rec);
            }
        });
        logBattleEvent(state, \`🛡️ Appo consumes 10 Momentum! Allies recover 15% Protection!\`, 'heal');
    }
};

// ==========================================
// COMMANDER APPO (KNIGHTFALL)
// ==========================================
customAbilityHandlers['appo_m_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const hadOrder66 = target.statuses.some(s => s.name === 'Order 66');
    const dummyAbility = { ...ability, id: ability.id + '_base', effects: ability.effects.filter(e => e !== 'assist') };
    executeCombatAction(state, attacker, target, dummyAbility, isCrit, explicitTargetAlly, assistDepth, counterDepth);
    
    if (hadOrder66) {
        const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
        const kfAllies = allies.filter(a => a.activeInBattle && a.hp > 0 && a.id !== attacker.id && (a.tags.includes('Knightfall') || checkHasTag(a, 'Knightfall')));
        if (kfAllies.length > 0) {
            const assistAlly = kfAllies[Math.floor(Math.random() * kfAllies.length)];
            logBattleEvent(state, \`🤝 Knightfall Protocol: \${assistAlly.name} assists Appo!\`, 'info');
            const basic = assistAlly.abilities.find(a => a.type === 'basic');
            if (basic) executeCombatAction(state, assistAlly, target, basic, false, null, assistDepth + 1, counterDepth);
        }
    }
};

customAbilityHandlers['appo_m_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker, target, dummyAbility, isCrit, explicitTargetAlly, assistDepth, counterDepth);
    // Commander Appo gains 25% Turn Meter. All enemies gain 2 stacks of Order 66 (handled by base). Dramatic Entrance handled.
    if (!hasStatusFlag(attacker, 'prevent_tm_gain')) {
        attacker.turnMeter = Math.min(100, attacker.turnMeter + 25);
    }
};

customAbilityHandlers['appo_m_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    // Inflict 3 stacks of Order 66 and 2 stacks of Purge on all enemies. Call all Knightfall allies to assist target enemy. If target reaches 10 stacks of Order 66: Consume all Order 66. Inflict Ability Block, Healing Immunity, and Exposed for 2 turns.
    const dummyAbility = { ...ability, id: ability.id + '_base', effects: ability.effects.filter(e => e !== 'assist') };
    executeCombatAction(state, attacker, target, dummyAbility, isCrit, explicitTargetAlly, assistDepth, counterDepth);
    
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    const kfAllies = allies.filter(a => a.activeInBattle && a.hp > 0 && a.id !== attacker.id && (a.tags.includes('Knightfall') || checkHasTag(a, 'Knightfall')));
    kfAllies.forEach(assistAlly => {
        logBattleEvent(state, \`🤝 \${assistAlly.name} assists (Operation Knightfall)!\`, 'info');
        const basic = assistAlly.abilities.find(a => a.type === 'basic');
        if (basic) executeCombatAction(state, assistAlly, target, basic, false, null, assistDepth + 1, counterDepth);
    });

    const o66 = target.statuses.find(s => s.name === 'Order 66');
    if (o66 && o66.count >= 10) {
        target.statuses = target.statuses.filter(s => s.name !== 'Order 66');
        applyStatus(state, target, 'Ability Block', 2, true, attacker);
        applyStatus(state, target, 'Healing Immunity', 2, true, attacker);
        applyStatus(state, target, 'Exposed', 2, true, attacker);
        logBattleEvent(state, \`🔥 Target reached 10 stacks of Order 66! Consuming and inflicting debuffs!\`, 'debuff');
    }
};

// ==========================================
// KNIGHTFALL COMMANDER
// ==========================================
customAbilityHandlers['kfc_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker, target, dummyAbility, isCrit, explicitTargetAlly, assistDepth, counterDepth);
};

customAbilityHandlers['kfc_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker, target, dummyAbility, isCrit, explicitTargetAlly, assistDepth, counterDepth);
};

customAbilityHandlers['kfc_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker, target, dummyAbility, isCrit, explicitTargetAlly, assistDepth, counterDepth);
    // Dispel debuffs from Knightfall allies handled by base if possible. Let's do it manually just in case:
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    allies.forEach(a => {
        if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Knightfall') || checkHasTag(a, 'Knightfall'))) {
            a.statuses = a.statuses.filter(s => !s.isDebuff || STATUS_DEFINITIONS[s.name]?.flags.includes('prevent_cleanse'));
        }
    });
};

// ==========================================
// COMMANDER FOX (KNIGHTFALL)
// ==========================================
customAbilityHandlers['fox_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const hasPurge = target.statuses.some(s => s.name === 'Purge');
    
    // Ignore protection if Purge
    if (hasPurge) {
        // Calculate true damage to ignore protection
        const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
        let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
        if (isCrit) baseDmg *= attStats.critDamage;
        const finalDmg = Math.round(baseDmg);
        
        target.hp = Math.max(0, target.hp - finalDmg);
        logBattleEvent(state, \`\${target.name} suffered \${finalDmg} damage (Fox ignores Protection!).\`, 'damage', target.id, attacker.id, finalDmg, isCrit);
        applyStatus(state, target, 'Order 66', 2, true, attacker, 2);
        if (target.hp === 0) runDefeatHooks(state, target);
    } else {
        const dummyAbility = { ...ability, id: ability.id + '_base' };
        executeCombatAction(state, attacker, target, dummyAbility, isCrit, explicitTargetAlly, assistDepth, counterDepth);
    }
};

customAbilityHandlers['fox_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    // Consume Order 66, deal massive + bonus damage
    const dummyAbility = { ...ability, id: ability.id + '_base', effects: ability.effects.filter(e => e !== 'damage') };
    executeCombatAction(state, attacker, target, dummyAbility, isCrit, explicitTargetAlly, assistDepth, counterDepth);
    
    const o66 = target.statuses.find(s => s.name === 'Order 66');
    const stacks = o66 ? o66.count : 0;
    target.statuses = target.statuses.filter(s => s.name !== 'Order 66');
    
    const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
    let baseDmg = attStats.offense * 2.5 * (1 + (stacks * 0.10)); // Massive + bonus
    if (isCrit) baseDmg *= attStats.critDamage;
    const defStats = getModifiedStats(target, attacker.team === 'player' ? state.enemyTeam : state.playerTeam);
    const armor = defStats.defense / (defStats.defense + 100);
    const finalDmg = Math.round(baseDmg * (1 - armor));
    
    if (target.protection > 0) {
        if (finalDmg > target.protection) {
            const rem = finalDmg - target.protection;
            target.protection = 0;
            target.hp = Math.max(0, target.hp - rem);
        } else {
            target.protection -= finalDmg;
        }
    } else {
        target.hp = Math.max(0, target.hp - finalDmg);
    }
    
    logBattleEvent(state, \`\${target.name} suffered \${finalDmg} damage (Consumed \${stacks} stacks of Order 66!).\`, 'damage', target.id, attacker.id, finalDmg, isCrit);
    
    if (target.hp === 0) {
        runDefeatHooks(state, target);
        // "Enemy defeated by this attack cannot be revived."
        if (!target.dynamicState) target.dynamicState = {};
        target.dynamicState.preventRevive = true;
    }
};

customAbilityHandlers['fox_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker, target, dummyAbility, isCrit, explicitTargetAlly, assistDepth, counterDepth);
};

// ==========================================
// CROSSHAIR IMPERIAL
// ==========================================
customAbilityHandlers['cross_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker, target, dummyAbility, isCrit, explicitTargetAlly, assistDepth, counterDepth);
};

customAbilityHandlers['cross_special'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker, target, dummyAbility, isCrit, explicitTargetAlly, assistDepth, counterDepth);
    
    if (target.statuses.some(s => s.name === 'Pursued')) {
        logBattleEvent(state, \`🎯 Crosshair attacks again (Target is Pursued)!\`, 'info');
        executeCombatAction(state, attacker, target, dummyAbility, false, explicitTargetAlly, assistDepth + 1, counterDepth);
    }
};

customAbilityHandlers['cross_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker, target, dummyAbility, isCrit, explicitTargetAlly, assistDepth, counterDepth);
};

// ==========================================
// SCORCH KNIGHTFALL
// ==========================================
customAbilityHandlers['scorch_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker, target, dummyAbility, isCrit, explicitTargetAlly, assistDepth, counterDepth);
};
customAbilityHandlers['scorch_special'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker, target, dummyAbility, isCrit, explicitTargetAlly, assistDepth, counterDepth);
};
customAbilityHandlers['scorch_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    // Consume Purge, deal bonus damage
    const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
    
    enemies.forEach(e => {
        if (!e.activeInBattle || e.hp <= 0) return;
        const purge = e.statuses.find(s => s.name === 'Purge');
        const stacks = purge ? purge.count : 0;
        e.statuses = e.statuses.filter(s => s.name !== 'Purge');
        
        const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
        let baseDmg = attStats.offense * 1.5 * (1 + (stacks * 0.10));
        if (isCrit) baseDmg *= attStats.critDamage;
        const defStats = getModifiedStats(e, enemies);
        const armor = defStats.defense / (defStats.defense + 100);
        const finalDmg = Math.round(baseDmg * (1 - armor));
        
        if (e.protection > 0) {
            if (finalDmg > e.protection) {
                const rem = finalDmg - e.protection;
                e.protection = 0;
                e.hp = Math.max(0, e.hp - rem);
            } else {
                e.protection -= finalDmg;
            }
        } else {
            e.hp = Math.max(0, e.hp - finalDmg);
        }
        
        logBattleEvent(state, \`\${e.name} suffered \${finalDmg} AoE damage (Consumed \${stacks} stacks of Purge!).\`, 'damage', e.id, attacker.id, finalDmg, isCrit);
        if (e.hp === 0) runDefeatHooks(state, e);
    });
};

// ==========================================
// GL LORD VADER
// ==========================================
customAbilityHandlers['lv_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker, target, dummyAbility, isCrit, explicitTargetAlly, assistDepth, counterDepth);
    
    if (target.statuses.some(s => s.name === 'Purge')) {
        logBattleEvent(state, \`🗡️ Lord Vader attacks again (Target has Purge)!\`, 'info');
        const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
        let baseDmg = attStats.offense * 0.5; // Reduced damage
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
        logBattleEvent(state, \`\${target.name} suffered \${finalDmg} follow-up damage.\`, 'damage', target.id, attacker.id, finalDmg, false);
        if (target.hp === 0) runDefeatHooks(state, target);
    }
    
    const o66 = target.statuses.find(s => s.name === 'Order 66');
    if (o66 && o66.count >= 10) {
        applyStatus(state, target, 'Healing Immunity', 2, true, attacker);
        applyStatus(state, target, 'Ability Block', 2, true, attacker);
    }
};

customAbilityHandlers['lv_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
    const hadPurge = enemies.some(e => e.activeInBattle && e.hp > 0 && e.statuses.some(s => s.name === 'Purge'));
    
    executeCombatAction(state, attacker, target, dummyAbility, isCrit, explicitTargetAlly, assistDepth, counterDepth);
    
    if (hadPurge && !hasStatusFlag(attacker, 'prevent_prot_recovery')) {
        const rec = Math.round(attacker.maxProtection * 0.20);
        attacker.protection = Math.min(attacker.maxProtection, attacker.protection + rec);
        logBattleEvent(state, \`🛡️ Lord Vader recovers 20% Protection (Purge on enemy)!\`, 'heal');
    }
};

customAbilityHandlers['lv_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base', effects: ability.effects.filter(e => e !== 'assist') };
    executeCombatAction(state, attacker, target, dummyAbility, isCrit, explicitTargetAlly, assistDepth, counterDepth);
    
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
    
    const kfAllies = allies.filter(a => a.activeInBattle && a.hp > 0 && a.id !== attacker.id && (a.tags.includes('Knightfall') || checkHasTag(a, 'Knightfall')));
    kfAllies.forEach(assistAlly => {
        logBattleEvent(state, \`🤝 \${assistAlly.name} assists Lord Vader!\`, 'info');
        const basic = assistAlly.abilities.find(a => a.type === 'basic');
        if (basic) executeCombatAction(state, assistAlly, target, basic, false, null, assistDepth + 1, counterDepth);
    });

    if (allies.some(a => a.characterId === 'commander_appo' && a.activeInBattle && a.hp > 0)) {
        enemies.forEach(e => {
            if (e.activeInBattle && e.hp > 0 && !hasStatusFlag(e, 'prevent_tm_gain')) { // Using prevent_tm_gain for simplicity
                e.turnMeter = Math.max(0, e.turnMeter - 25);
                logBattleEvent(state, \`📉 \${e.name} loses 25% TM (Appo present)!\`, 'debuff');
            }
        });
    }
    
    // Prevent Revive is handled by dynamicState if defeated
    enemies.forEach(e => {
        if (e.hp <= 0 && (!e.dynamicState || !e.dynamicState.preventRevive)) {
            if (!e.dynamicState) e.dynamicState = {};
            e.dynamicState.preventRevive = true;
        }
    });
};

customAbilityHandlers['lv_ultimate'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    // Ultimate logic is usually handled via checkUltimate, but we can activate it here if called.
    logBattleEvent(state, \`🌋 Lord Vader Activates EXECUTE ORDER 66!\`, 'ultimate');
    applyStatus(state, attacker, 'Ultimate Stance', 3, false, attacker);
    attacker.ultimateCharge = 0;
    
    const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
    enemies.forEach(e => {
        if (e.activeInBattle && e.hp > 0) {
            applyStatus(state, e, 'Order 66', 2, true, attacker, 10);
            applyStatus(state, e, 'Purge', 3, true, attacker, 5);
            applyStatus(state, e, 'Healing Immunity', 2, true, attacker);
            applyStatus(state, e, 'Daze', 2, true, attacker);
            applyStatus(state, e, 'Buff Immunity', 2, true, attacker);
        }
    });
    
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    allies.forEach(a => {
        if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Knightfall') || checkHasTag(a, 'Knightfall'))) {
            applyStatus(state, a, 'Dramatic Entrance', 2, false, attacker);
            applyStatus(state, a, 'Offense Up', 2, false, attacker);
            applyStatus(state, a, 'Critical Damage Up', 2, false, attacker);
        }
    });
};

// ==========================================
// COMMANDER FOX (RIOT)
// ==========================================
customAbilityHandlers['fox_s1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker, target, dummyAbility, isCrit, explicitTargetAlly, assistDepth, counterDepth);
};
customAbilityHandlers['fox_s2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker, target, dummyAbility, isCrit, explicitTargetAlly, assistDepth, counterDepth);
    const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
    enemies.forEach(e => {
        if (e.activeInBattle && e.hp > 0 && e.statuses.some(s => s.name === 'Lockdown')) {
            e.turnMeter = Math.max(0, e.turnMeter - 10);
        }
    });
};

`;

c = c + '\n' + additionalAbilities;
fs.writeFileSync('src/utils/combat/customKitLogic.ts', c);
