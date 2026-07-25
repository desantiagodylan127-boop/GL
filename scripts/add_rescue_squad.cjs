const fs = require('fs');

let logic = `
// --- STORMTROOPER RESCUE ---

// Stormtrooper Luke
customAbilityHandlers['stluke_b'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   let finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, \`\${target.name} suffered \${finalDmg} physical damage from Lucky Shot.\`, 'damage', target.id, attacker.id, finalDmg, isCrit);

   if (attacker.statuses.some(s => !s.isDebuff)) {
       let bonusDmg = Math.round(baseDmg * 0.5);
       target.hp = Math.max(0, target.hp - bonusDmg);
       logBattleEvent(state, \`\${target.name} suffered \${bonusDmg} physical damage from bonus attack.\`, 'damage', target.id, attacker.id, bonusDmg, isCrit);
   }
};

customAbilityHandlers['stluke_s1'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (1.2 + Math.random() * 0.4);
   const finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, \`\${target.name} suffered \${finalDmg} physical damage from Aren't You A Little Short For A Stormtrooper?.\`, 'damage', target.id, attacker.id, finalDmg, isCrit);
   
   applyStatus(state, target, 'Exposed', 2, true, attacker);
   
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   const otherAllies = allies.filter(u => u.id !== attacker.id && u.activeInBattle && u.hp > 0);
   if (otherAllies.length > 0) {
       otherAllies.sort((a, b) => b.offense - a.offense);
       const assistAlly = otherAllies[0];
       executeCombatAction(state, assistAlly.id, assistAlly.abilities.find(a => a.type === 'basic') || assistAlly.abilities[0], target.id, undefined, 1, 0);
       
       if (assistAlly.characterId === 'han_solo' || assistAlly.characterId === 'smuggler_chewbacca') {
           applyStatus(state, assistAlly, 'Offense Up', 2, false, attacker);
       }
   }
};

customAbilityHandlers['stluke_s2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly) => {
   let tAlly = explicitTargetAlly || attacker;
   tAlly.statuses = tAlly.statuses.filter(s => !s.isDebuff);
   
   applyStatus(state, tAlly, 'Speed Up', 2, false, attacker);
   applyStatus(state, tAlly, 'Offense Up', 2, false, attacker);
   
   if (tAlly.hp < tAlly.maxHp * 0.5 && !hasStatusFlag(tAlly, 'prevent_prot_recovery')) {
       tAlly.protection = Math.min(tAlly.maxProtection, tAlly.protection + Math.round(tAlly.maxProtection * 0.25));
   }
   
   if (tAlly.id !== attacker.id) {
       executeCombatAction(state, tAlly.id, tAlly.abilities.find(a => a.type === 'basic') || tAlly.abilities[0], target.id, undefined, 1, 0);
   }
};

// Stormtrooper Han
customAbilityHandlers['sthan_b'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   let finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, \`\${target.name} suffered \${finalDmg} physical damage from Wild Blaster Fire.\`, 'damage', target.id, attacker.id, finalDmg, isCrit);

   if (Math.random() < 0.5) {
       applyStatus(state, target, 'Offense Down', 2, true, attacker);
   }
};

customAbilityHandlers['sthan_s1'] = (state, attacker, target, ability, isCrit) => {
   applyStatus(state, attacker, 'Taunt', 2, false, attacker);
   applyStatus(state, attacker, 'Defense Up', 2, false, attacker);
   attacker.statuses = attacker.statuses.filter(s => !s.isDebuff);
   
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   allies.forEach(a => {
      if (a.activeInBattle && a.hp > 0 && (checkHasTag(a, 'Rebel') || a.tags.includes('Rebel Alliance')) && !hasStatusFlag(a, 'prevent_prot_recovery')) {
          a.protection = Math.min(a.maxProtection, a.protection + Math.round(a.maxProtection * 0.10));
      }
   });
};

customAbilityHandlers['sthan_s2'] = (state, attacker, target, ability, isCrit) => {
   const oppSquad = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   
   oppSquad.forEach(u => {
      if (u.activeInBattle && u.hp > 0) {
         let baseDmg = attStats.offense * (0.7 + Math.random() * 0.3);
         let finalDmg = Math.round(baseDmg);
         u.hp = Math.max(0, u.hp - finalDmg);
         logBattleEvent(state, \`\${u.name} suffered \${finalDmg} physical damage from Into The Detention Block.\`, 'damage', u.id, attacker.id, finalDmg, isCrit);
         applyStatus(state, u, 'Accuracy Down', 2, true, attacker);
      }
   });
   applyStatus(state, attacker, 'Taunt', 1, false, attacker);
   
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   const leia = allies.find(u => u.characterId.includes('leia') && u.activeInBattle && u.hp > 0);
   if (leia && !hasStatusFlag(leia, 'prevent_tm_gain')) {
       leia.turnMeter = Math.min(100, leia.turnMeter + 15);
   }
};

// Senator Organa
customAbilityHandlers['senator_b'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   let finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, \`\${target.name} suffered \${finalDmg} special damage from You're Braver Than I Thought.\`, 'damage', target.id, attacker.id, finalDmg, isCrit);

   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   const activeAllies = allies.filter(u => u.activeInBattle && u.hp > 0);
   if (activeAllies.length > 0) {
       activeAllies.sort((a, b) => (a.hp/a.maxHp) - (b.hp/b.maxHp));
       const weakest = activeAllies[0];
       if (!hasStatusFlag(weakest, 'prevent_prot_recovery')) {
           weakest.protection = Math.min(weakest.maxProtection, weakest.protection + Math.round(weakest.maxProtection * 0.05));
       }
   }
};

customAbilityHandlers['senator_s1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly) => {
   let tAlly = explicitTargetAlly || attacker;
   
   applyStatus(state, tAlly, 'Offense Up', 2, false, attacker);
   applyStatus(state, tAlly, 'Tenacity Up', 2, false, attacker);
   
   if (tAlly.id !== attacker.id) {
       executeCombatAction(state, tAlly.id, tAlly.abilities.find(a => a.type === 'basic') || tAlly.abilities[0], target.id, undefined, 1, 0);
   }
   
   if (tAlly.characterId.includes('luke') || tAlly.characterId.includes('han')) {
       if (!hasStatusFlag(attacker, 'prevent_tm_gain')) {
           attacker.turnMeter = Math.min(100, attacker.turnMeter + 15);
       }
   }
};

customAbilityHandlers['senator_s2'] = (state, attacker, target, ability, isCrit) => {
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   allies.forEach(a => {
       if (a.activeInBattle && a.hp > 0 && (checkHasTag(a, 'Rebel') || a.tags.includes('Rebel Alliance'))) {
           a.hp = Math.min(a.maxHp, a.hp + Math.round(a.maxHp * 0.15));
           if (!hasStatusFlag(a, 'prevent_prot_recovery')) {
               a.protection = Math.min(a.maxProtection, a.protection + Math.round(a.maxProtection * 0.15));
           }
           const debuffIdx = a.statuses.findIndex(s => s.isDebuff);
           if (debuffIdx !== -1) a.statuses.splice(debuffIdx, 1);
       }
   });
   
   const oppSquad = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
   oppSquad.forEach(u => {
       if (u.activeInBattle && u.hp > 0) {
           reduceTurnMeter(state, u, 10, attacker);
       }
   });
};

// Smuggler Chewbacca
customAbilityHandlers['smug_chewie_b'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   let finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, \`\${target.name} suffered \${finalDmg} physical damage from Wookiee Slam.\`, 'damage', target.id, attacker.id, finalDmg, isCrit);

   applyStatus(state, target, 'Offense Down', 2, true, attacker);
};

customAbilityHandlers['smug_chewie_s1'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (1.2 + Math.random() * 0.4);
   let finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, \`\${target.name} suffered \${finalDmg} physical damage from Let The Wookiee Win.\`, 'damage', target.id, attacker.id, finalDmg, isCrit);

   if (target.statuses.some(s => s.isDebuff)) {
       applyStatus(state, target, 'Stun', 1, true, attacker);
   }
   
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   const han = allies.find(u => u.characterId.includes('han_solo') || u.characterId === 'stormtrooper_han');
   if (han && han.activeInBattle && han.hp > 0) {
       executeCombatAction(state, han.id, han.abilities.find(a => a.type === 'basic') || han.abilities[0], target.id, undefined, 1, 0);
   }
};

customAbilityHandlers['smug_chewie_s2'] = (state, attacker, target, ability, isCrit) => {
   const oppSquad = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   
   oppSquad.forEach(u => {
      if (u.activeInBattle && u.hp > 0) {
         let baseDmg = attStats.offense * (0.7 + Math.random() * 0.3);
         if (u.statuses.some(s => s.isDebuff)) baseDmg *= 1.5;
         let finalDmg = Math.round(baseDmg);
         u.hp = Math.max(0, u.hp - finalDmg);
         logBattleEvent(state, \`\${u.name} suffered \${finalDmg} physical damage from Prisoner Transfer.\`, 'damage', u.id, attacker.id, finalDmg, isCrit);
      }
   });
   applyStatus(state, attacker, 'Taunt', 2, false, attacker);
};

// R2-D2
customAbilityHandlers['r2d2_b'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   let finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, \`\${target.name} suffered \${finalDmg} special damage from Shock Prod.\`, 'damage', target.id, attacker.id, finalDmg, isCrit);

   if (Math.random() < 0.5) {
       applyStatus(state, target, 'Stun', 1, true, attacker);
   }
};

customAbilityHandlers['r2d2_s1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly) => {
   let tAlly = explicitTargetAlly || attacker;
   
   applyStatus(state, tAlly, 'Stealth', 2, false, attacker);
   applyStatus(state, tAlly, 'Foresight', 1, false, attacker);
   tAlly.statuses = tAlly.statuses.filter(s => !s.isDebuff);
   
   if ((checkHasTag(tAlly, 'Rebel') || tAlly.tags.includes('Rebel Alliance') || checkHasTag(tAlly, 'Galactic Republic') || tAlly.tags.includes('Galactic Republic')) && !hasStatusFlag(tAlly, 'prevent_prot_recovery')) {
       tAlly.protection = Math.min(tAlly.maxProtection, tAlly.protection + Math.round(tAlly.maxProtection * 0.20));
   }
};

customAbilityHandlers['r2d2_s2'] = (state, attacker, target, ability, isCrit) => {
   const hadDebuff = target.statuses.some(s => s.isDebuff);
   
   reduceTurnMeter(state, target, 15, attacker);
   applyStatus(state, target, 'Buff Immunity', 2, true, attacker);
   applyStatus(state, target, 'Daze', 2, true, attacker);
   
   if (hadDebuff) {
       const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
       const otherAllies = allies.filter(u => u.id !== attacker.id && u.activeInBattle && u.hp > 0);
       if (otherAllies.length > 0) {
           const assistAlly = otherAllies[Math.floor(Math.random() * otherAllies.length)];
           executeCombatAction(state, assistAlly.id, assistAlly.abilities.find(a => a.type === 'basic') || assistAlly.abilities[0], target.id, undefined, 1, 0);
       }
   }
};
`;

fs.appendFileSync('src/utils/combat/customKitLogic.ts', logic);
