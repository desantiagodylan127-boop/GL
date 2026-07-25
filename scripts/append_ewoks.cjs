const fs = require('fs');

let logic = `
// --- EWOKS ---

// Chief Chirpa
customAbilityHandlers['chirpa_b'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   const baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   const finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, \`\${target.name} suffered \${finalDmg} physical damage from Chief's Command.\`, 'damage', target.id, attacker.id, finalDmg, isCrit);

   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   const otherEwoks = allies.filter(u => u.id !== attacker.id && u.activeInBattle && u.hp > 0 && (checkHasTag(u, 'Ewok') || u.tags.includes('Ewok')));
   if (otherEwoks.length > 0) {
       const assistAlly = otherEwoks[Math.floor(Math.random() * otherEwoks.length)];
       executeCombatAction(state, assistAlly.id, assistAlly.abilities.find(a => a.type === 'basic') || assistAlly.abilities[0], target.id, undefined, 1, 0);
       const c3po = allies.find(u => u.characterId === 'c3po_journey' && u.activeInBattle && u.hp > 0);
       if (c3po && !hasStatusFlag(assistAlly, 'prevent_tm_gain')) {
           assistAlly.turnMeter = Math.min(100, assistAlly.turnMeter + 10);
       }
   }
};

customAbilityHandlers['chirpa_s1'] = (state, attacker, target, ability, isCrit) => {
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   allies.forEach(a => {
       if (a.activeInBattle && a.hp > 0 && (checkHasTag(a, 'Ewok') || a.tags.includes('Ewok'))) {
           applyStatus(state, a, 'Offense Up', 2, false, attacker);
           applyStatus(state, a, 'Speed Up', 2, false, attacker);
       }
   });
   
   const activeEwoks = allies.filter(u => u.activeInBattle && u.hp > 0 && (checkHasTag(u, 'Ewok') || u.tags.includes('Ewok')));
   if (activeEwoks.length > 0) {
       activeEwoks.sort((a, b) => b.offense - a.offense);
       const assistAlly = activeEwoks[0];
       executeCombatAction(state, assistAlly.id, assistAlly.abilities.find(a => a.type === 'basic') || assistAlly.abilities[0], target.id, undefined, 1, 0);
   }
   
   const c3po = allies.find(u => u.characterId === 'c3po_journey' && u.activeInBattle && u.hp > 0);
   if (c3po) {
       allies.forEach(a => {
           if (a.activeInBattle && a.hp > 0 && (checkHasTag(a, 'Ewok') || a.tags.includes('Ewok')) && !hasStatusFlag(a, 'prevent_prot_recovery')) {
               const rec = Math.round(a.maxProtection * 0.10);
               a.protection = Math.min(a.maxProtection, a.protection + rec);
           }
       });
   }
};

customAbilityHandlers['chirpa_s2'] = (state, attacker, target, ability, isCrit) => {
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   const otherEwoks = allies.filter(u => u.id !== attacker.id && u.activeInBattle && u.hp > 0 && (checkHasTag(u, 'Ewok') || u.tags.includes('Ewok')));
   
   let assistsCount = 0;
   otherEwoks.forEach(a => {
       executeCombatAction(state, a.id, a.abilities.find(ab => ab.type === 'basic') || a.abilities[0], target.id, undefined, 1, 0);
       assistsCount++;
   });
   
   const healRec = Math.round(attacker.maxHp * 0.05 * assistsCount);
   attacker.hp = Math.min(attacker.maxHp, attacker.hp + healRec);
   
   if (assistsCount >= 3) {
       applyStatus(state, target, 'Exposed', 2, true, attacker);
   }
};

// Wicket
customAbilityHandlers['wicket_b'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   if (target.hp < target.maxHp * 0.5) {
       baseDmg *= 1.5;
   }
   const finalDmg = Math.round(baseDmg);
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, \`\${target.name} suffered \${finalDmg} physical damage from Hunter's Strike.\`, 'damage', target.id, attacker.id, finalDmg, isCrit);

   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   const leia = allies.find(u => u.characterId === 'leia_gl' || u.characterId === 'leia_boushh' || u.characterId === 'leia_organa');
   if (leia && !hasStatusFlag(attacker, 'prevent_tm_gain')) {
       attacker.turnMeter = Math.min(100, attacker.turnMeter + 5);
   }
};

customAbilityHandlers['wicket_s1'] = (state, attacker, target, ability, isCrit) => {
   for (let i = 0; i < 2; i++) {
       const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
       let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
       const finalDmg = Math.round(baseDmg);
       target.hp = Math.max(0, target.hp - finalDmg);
       logBattleEvent(state, \`\${target.name} suffered \${finalDmg} physical damage from Spear Rush.\`, 'damage', target.id, attacker.id, finalDmg, isCrit);
   }
   if (target.hp < target.maxHp * 0.5) {
       applyStatus(state, target, 'Exposed', 2, true, attacker);
   }
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   const leia = allies.find(u => u.characterId === 'leia_gl' || u.characterId === 'leia_boushh' || u.characterId === 'leia_organa');
   if (leia) {
       const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
       let baseDmg = attStats.offense * (0.5 + Math.random() * 0.3); // reduced dmg
       const finalDmg = Math.round(baseDmg);
       target.hp = Math.max(0, target.hp - finalDmg);
       logBattleEvent(state, \`\${target.name} suffered \${finalDmg} physical damage from third strike.\`, 'damage', target.id, attacker.id, finalDmg, isCrit);
   }
};

customAbilityHandlers['wicket_s2'] = (state, attacker, target, ability, isCrit) => {
   applyStatus(state, attacker, 'Offense Up', 2, false, attacker);
   applyStatus(state, attacker, 'Critical Damage Up', 2, false, attacker);
   
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (1.5 + Math.random() * 0.5); // massive
   const finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, \`\${target.name} suffered \${finalDmg} massive physical damage from Endor Champion.\`, 'damage', target.id, attacker.id, finalDmg, isCrit);
   
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   if (target.hp <= 0) {
       if (!hasStatusFlag(attacker, 'prevent_prot_recovery')) {
           attacker.protection = Math.min(attacker.maxProtection, attacker.protection + Math.round(attacker.maxProtection * 0.5));
       }
       Object.keys(attacker.cooldowns).forEach(k => {
           if (attacker.cooldowns[k] > 0) attacker.cooldowns[k]--;
       });
   }
   const leia = allies.find(u => u.characterId === 'leia_gl' || u.characterId === 'leia_boushh' || u.characterId === 'leia_organa');
   if (leia && !hasStatusFlag(attacker, 'prevent_tm_gain')) {
       attacker.turnMeter = Math.min(100, attacker.turnMeter + 20);
   }
};

// Kneesaa
customAbilityHandlers['kneesaa_b'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   const baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   const finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, \`\${target.name} suffered \${finalDmg} physical damage from Forest Medicine.\`, 'damage', target.id, attacker.id, finalDmg, isCrit);

   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   const activeAllies = allies.filter(u => u.activeInBattle && u.hp > 0);
   if (activeAllies.length > 0) {
       activeAllies.sort((a, b) => (a.hp/a.maxHp) - (b.hp/b.maxHp));
       const weakest = activeAllies[0];
       weakest.hp = Math.min(weakest.maxHp, weakest.hp + Math.round(weakest.maxHp * 0.05));
       
       const leia = allies.find(u => u.characterId === 'leia_gl' || u.characterId === 'leia_boushh' || u.characterId === 'leia_organa');
       if (leia && !hasStatusFlag(weakest, 'prevent_prot_recovery')) {
           weakest.protection = Math.min(weakest.maxProtection, weakest.protection + Math.round(weakest.maxProtection * 0.05));
       }
   }
};

customAbilityHandlers['kneesaa_s1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly) => {
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   let tAlly = explicitTargetAlly;
   if (!tAlly) tAlly = attacker;
   
   tAlly.statuses = tAlly.statuses.filter(s => !s.isDebuff);
   tAlly.hp = Math.min(tAlly.maxHp, tAlly.hp + Math.round(tAlly.maxHp * 0.20));
   if (!hasStatusFlag(tAlly, 'prevent_prot_recovery')) {
       tAlly.protection = Math.min(tAlly.maxProtection, tAlly.protection + Math.round(tAlly.maxProtection * 0.20));
   }
   logBattleEvent(state, \`\${tAlly.name} was dispelled and healed by Tribal Remedy!\`, 'heal');
   
   if (tAlly.characterId === 'leia_gl' || tAlly.characterId === 'leia_boushh' || tAlly.characterId === 'leia_organa') {
       applyStatus(state, tAlly, 'Foresight', 1, false, attacker);
   }
};

customAbilityHandlers['kneesaa_s2'] = (state, attacker, target, ability, isCrit) => {
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   allies.forEach(a => {
       if (a.activeInBattle && a.hp > 0) {
           a.hp = Math.min(a.maxHp, a.hp + Math.round(a.maxHp * 0.15));
           if (!hasStatusFlag(a, 'prevent_prot_recovery')) {
               a.protection = Math.min(a.maxProtection, a.protection + Math.round(a.maxProtection * 0.15));
           }
           if (checkHasTag(a, 'Ewok') || a.tags.includes('Ewok')) {
               applyStatus(state, a, 'Tenacity Up', 2, false, attacker);
           }
       }
   });
   
   const leia = allies.find(u => (u.characterId === 'leia_gl' || u.characterId === 'leia_boushh' || u.characterId === 'leia_organa') && u.activeInBattle && u.hp > 0);
   if (leia) {
       if (!hasStatusFlag(leia, 'prevent_prot_recovery')) {
           leia.protection = Math.min(leia.maxProtection, leia.protection + Math.round(leia.maxProtection * 0.20));
       }
       const keys = Object.keys(leia.cooldowns).filter(k => leia.cooldowns[k] > 0);
       if (keys.length > 0) {
           const randK = keys[Math.floor(Math.random() * keys.length)];
           leia.cooldowns[randK]--;
       }
   }
};

// Paploo
customAbilityHandlers['paploo_b'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   const baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   const finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, \`\${target.name} suffered \${finalDmg} physical damage from Hit And Run.\`, 'damage', target.id, attacker.id, finalDmg, isCrit);

   reduceTurnMeter(state, target, 5, attacker);
   if (!hasStatusFlag(attacker, 'prevent_tm_gain')) {
       attacker.turnMeter = Math.min(100, attacker.turnMeter + 5);
   }
   
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   if (allies.some(u => u.characterId === 'c3po_journey' && u.activeInBattle && u.hp > 0)) {
       reduceTurnMeter(state, target, 5, attacker);
   }
};

customAbilityHandlers['paploo_s1'] = (state, attacker, target, ability, isCrit) => {
   const hadTaunt = target.statuses.some(s => s.name === 'Taunt');
   
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   const baseDmg = attStats.offense * (1.0 + Math.random() * 0.4);
   const finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, \`\${target.name} suffered \${finalDmg} physical damage from Stolen Speeder Bike.\`, 'damage', target.id, attacker.id, finalDmg, isCrit);
   
   target.statuses = target.statuses.filter(s => s.isDebuff);
   
   applyStatus(state, attacker, 'Speed Up', 2, false, attacker);
   applyStatus(state, attacker, 'Foresight', 1, false, attacker);
   
   if (hadTaunt && !hasStatusFlag(attacker, 'prevent_tm_gain')) {
       attacker.turnMeter = Math.min(100, attacker.turnMeter + 20);
   }
};

customAbilityHandlers['paploo_s2'] = (state, attacker, target, ability, isCrit) => {
   applyStatus(state, attacker, 'Stealth', 2, false, attacker);
   
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   allies.forEach(a => {
      if (a.activeInBattle && a.hp > 0 && (checkHasTag(a, 'Ewok') || a.tags.includes('Ewok')) && !hasStatusFlag(a, 'prevent_tm_gain')) {
          a.turnMeter = Math.min(100, a.turnMeter + 10);
      }
   });
   
   reduceTurnMeter(state, target, 15, attacker);
   
   const c3po = allies.find(u => u.characterId === 'c3po_journey' && u.activeInBattle && u.hp > 0);
   if (c3po) {
       allies.forEach(a => {
           if (a.activeInBattle && a.hp > 0 && (checkHasTag(a, 'Ewok') || a.tags.includes('Ewok')) && !hasStatusFlag(a, 'prevent_prot_recovery')) {
               const rec = Math.round(a.maxProtection * 0.10);
               a.protection = Math.min(a.maxProtection, a.protection + rec);
           }
       });
   }
};

// Teebo
customAbilityHandlers['teebo_b'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   const baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   const finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, \`\${target.name} suffered \${finalDmg} physical damage from Hidden Hunter.\`, 'damage', target.id, attacker.id, finalDmg, isCrit);

   if (Math.random() < 0.5) {
       applyStatus(state, target, 'Daze', 1, true, attacker);
   }
   
   if (attacker.statuses.some(s => s.name === 'Stealth')) {
       reduceTurnMeter(state, target, 5, attacker);
   }
};

customAbilityHandlers['teebo_s1'] = (state, attacker, target, ability, isCrit) => {
   applyStatus(state, attacker, 'Stealth', 2, false, attacker);
   
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   const otherEwoks = allies.filter(u => u.id !== attacker.id && u.activeInBattle && u.hp > 0 && (checkHasTag(u, 'Ewok') || u.tags.includes('Ewok')));
   if (otherEwoks.length > 0) {
       const assistAlly = otherEwoks[Math.floor(Math.random() * otherEwoks.length)];
       executeCombatAction(state, assistAlly.id, assistAlly.abilities.find(a => a.type === 'basic') || assistAlly.abilities[0], target.id, undefined, 1, 0);
       
       const c3po = allies.find(u => u.characterId === 'c3po_journey' && u.activeInBattle && u.hp > 0);
       if (c3po) {
           if (!hasStatusFlag(attacker, 'prevent_tm_gain')) attacker.turnMeter = Math.min(100, attacker.turnMeter + 10);
           if (!hasStatusFlag(assistAlly, 'prevent_tm_gain')) assistAlly.turnMeter = Math.min(100, assistAlly.turnMeter + 10);
       }
   }
};

customAbilityHandlers['teebo_s2'] = (state, attacker, target, ability, isCrit) => {
   const hadDebuff = target.statuses.some(s => s.isDebuff);
   
   applyStatus(state, target, 'Ability Block', 2, true, attacker);
   applyStatus(state, target, 'Offense Down', 2, true, attacker);
   
   if (hadDebuff) {
       Object.keys(target.cooldowns).forEach(k => {
           target.cooldowns[k]++;
       });
   }
   
   if (target.hp < target.maxHp * 0.5) {
       reduceTurnMeter(state, target, 15, attacker);
   }
};
`;
fs.appendFileSync('src/utils/combat/customKitLogic.ts', logic);
