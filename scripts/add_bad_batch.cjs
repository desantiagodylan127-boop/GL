const fs = require('fs');

let logic = `
// --- BAD BATCH ---

// Hunter
customAbilityHandlers['hunter_b'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   let finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, \\\`\\\${target.name} suffered \\\${finalDmg} physical damage from Tracking Shot.\\\`, 'damage', target.id, attacker.id, finalDmg, isCrit);

   if (target.statuses.some(s => s.isDebuff)) {
       const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
       const bbAllies = allies.filter(u => u.id !== attacker.id && u.activeInBattle && u.hp > 0 && (checkHasTag(u, 'Bad Batch') || u.tags.includes('Bad Batch')));
       if (bbAllies.length > 0) {
           const assistAlly = bbAllies[Math.floor(Math.random() * bbAllies.length)];
           executeCombatAction(state, assistAlly.id, assistAlly.abilities.find(a => a.type === 'basic') || assistAlly.abilities[0], target.id, undefined, 1, 0);
       }
   }
};

customAbilityHandlers['hunter_s1'] = (state, attacker, target, ability, isCrit) => {
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   allies.forEach(a => {
       if (a.activeInBattle && a.hp > 0 && (checkHasTag(a, 'Bad Batch') || a.tags.includes('Bad Batch'))) {
           applyStatus(state, a, 'Critical Chance Up', 2, false, attacker);
           applyStatus(state, a, 'Tenacity Up', 2, false, attacker);
       }
   });
   applyStatus(state, attacker, 'Foresight', 2, false, attacker);
};

customAbilityHandlers['hunter_s2'] = (state, attacker, target, ability, isCrit) => {
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   const bbAllies = allies.filter(u => u.id !== attacker.id && u.activeInBattle && u.hp > 0 && (checkHasTag(u, 'Bad Batch') || u.tags.includes('Bad Batch')));
   
   bbAllies.forEach(assistAlly => {
       executeCombatAction(state, assistAlly.id, assistAlly.abilities.find(a => a.type === 'basic') || assistAlly.abilities[0], target.id, undefined, 0.5, 0);
   });
   applyStatus(state, attacker, 'Advantage', 2, false, attacker);
};

// Wrecker
customAbilityHandlers['wrecker_b'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   let finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, \\\`\\\${target.name} suffered \\\${finalDmg} physical damage from Headfirst Assault.\\\`, 'damage', target.id, attacker.id, finalDmg, isCrit);

   if (Math.random() < 0.20) {
       applyStatus(state, target, 'Stun', 1, true, attacker);
   }
};

customAbilityHandlers['wrecker_s1'] = (state, attacker, target, ability, isCrit) => {
   const oppSquad = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   
   oppSquad.forEach(u => {
      if (u.activeInBattle && u.hp > 0) {
         let baseDmg = attStats.offense * (0.7 + Math.random() * 0.3);
         let finalDmg = Math.round(baseDmg);
         u.hp = Math.max(0, u.hp - finalDmg);
         logBattleEvent(state, \\\`\\\${u.name} suffered \\\${finalDmg} physical damage from Demolition Expert.\\\`, 'damage', u.id, attacker.id, finalDmg, isCrit);
         applyStatus(state, u, 'Defense Down', 2, true, attacker);
      }
   });
};

customAbilityHandlers['wrecker_s2'] = (state, attacker, target, ability, isCrit) => {
   applyStatus(state, attacker, 'Taunt', 2, false, attacker);
   applyStatus(state, attacker, 'Defense Up', 2, false, attacker);
   attacker.hp = Math.min(attacker.maxHp, attacker.hp + Math.round(attacker.maxHp * 0.20));
};

// Tech
customAbilityHandlers['tech_b'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   let finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, \\\`\\\${target.name} suffered \\\${finalDmg} special damage from Data Driven Assault.\\\`, 'damage', target.id, attacker.id, finalDmg, isCrit);

   applyStatus(state, target, 'Vulnerable', 1, true, attacker);
};

customAbilityHandlers['tech_s1'] = (state, attacker, target, ability, isCrit) => {
   target.statuses = target.statuses.filter(s => s.isDebuff || s.id === 'Taunt');
   applyStatus(state, target, 'Ability Block', 1, true, attacker);
   
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   const bbAllies = allies.filter(u => u.activeInBattle && u.hp > 0 && (checkHasTag(u, 'Bad Batch') || u.tags.includes('Bad Batch')));
   if (bbAllies.length > 0) {
       const cdAlly = bbAllies[Math.floor(Math.random() * bbAllies.length)];
       let cdReduced = false;
       for (const ab in cdAlly.currentCooldowns) {
           if (cdAlly.currentCooldowns[ab] > 0) {
               cdAlly.currentCooldowns[ab]--;
               cdReduced = true;
           }
       }
       if (cdReduced) {
           logBattleEvent(state, \\\`\\\${cdAlly.name}'s cooldowns were reduced.\\\`, 'buff', cdAlly.id);
       }
   }
};

customAbilityHandlers['tech_s2'] = (state, attacker, target, ability, isCrit) => {
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   allies.forEach(a => {
       if (a.activeInBattle && a.hp > 0 && (checkHasTag(a, 'Bad Batch') || a.tags.includes('Bad Batch'))) {
           applyStatus(state, a, 'Foresight', 2, false, attacker);
           applyStatus(state, a, 'Critical Chance Up', 2, false, attacker);
       }
   });
   attacker.turnMeter = 100;
};

// Echo
customAbilityHandlers['echo_bb_b'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   let finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, \\\`\\\${target.name} suffered \\\${finalDmg} physical damage from Cybernetic Strike.\\\`, 'damage', target.id, attacker.id, finalDmg, isCrit);

   applyStatus(state, target, 'Buff Immunity', 1, true, attacker);
};

customAbilityHandlers['echo_bb_s1'] = (state, attacker, target, ability, isCrit) => {
   const oppSquad = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
   oppSquad.forEach(u => {
      if (u.activeInBattle && u.hp > 0) {
          u.statuses = u.statuses.filter(s => s.isDebuff || s.id === 'Taunt');
          applyStatus(state, u, 'Tenacity Down', 2, true, attacker);
      }
   });
};

customAbilityHandlers['echo_bb_s2'] = (state, attacker, target, ability, isCrit) => {
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   allies.forEach(a => {
       if (a.activeInBattle && a.hp > 0 && (checkHasTag(a, 'Bad Batch') || a.tags.includes('Bad Batch'))) {
           applyStatus(state, a, 'Potency Up', 2, false, attacker);
           applyStatus(state, a, 'Tenacity Up', 2, false, attacker);
           a.hp = Math.min(a.maxHp, a.hp + Math.round(a.maxHp * 0.10));
           if (!hasStatusFlag(a, 'prevent_prot_recovery')) {
               a.protection = Math.min(a.maxProtection, a.protection + Math.round(a.maxProtection * 0.10));
           }
       }
   });
};

// Crosshair
customAbilityHandlers['cross_b'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   let finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, \\\`\\\${target.name} suffered \\\${finalDmg} physical damage from Deadeye Shot.\\\`, 'damage', target.id, attacker.id, finalDmg, isCrit);

   applyStatus(state, target, 'Marked', 2, true, attacker);
};

customAbilityHandlers['cross_s1'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (1.2 + Math.random() * 0.4);
   let finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, \\\`\\\${target.name} suffered \\\${finalDmg} physical damage from Find The Weak Point.\\\`, 'damage', target.id, attacker.id, finalDmg, isCrit);

   if (target.statuses.some(s => s.id === 'Marked')) {
       let bonusDmg = Math.round(baseDmg * 0.5);
       target.hp = Math.max(0, target.hp - bonusDmg);
       logBattleEvent(state, \\\`\\\${target.name} suffered \\\${bonusDmg} physical damage from bonus attack.\\\`, 'damage', target.id, attacker.id, bonusDmg, isCrit);
   }
};

customAbilityHandlers['cross_s2'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (1.5 + Math.random() * 0.5);
   let finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg); // ignore protection implicitly by targeting hp
   logBattleEvent(state, \\\`\\\${target.name} suffered \\\${finalDmg} physical damage (ignoring protection) from Imperial Training.\\\`, 'damage', target.id, attacker.id, finalDmg, isCrit);

   if (target.statuses.some(s => s.id === 'Marked')) {
       applyStatus(state, target, 'Stun', 1, true, attacker);
       applyStatus(state, target, 'Healing Immunity', 2, true, attacker);
   }
};

// Omega
customAbilityHandlers['omega_b'] = (state, attacker, target, ability, isCrit, explicitTargetAlly) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   let finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, \\\`\\\${target.name} suffered \\\${finalDmg} physical damage from Lucky Shot.\\\`, 'damage', target.id, attacker.id, finalDmg, isCrit);

   let tAlly = explicitTargetAlly || attacker;
   tAlly.hp = Math.min(tAlly.maxHp, tAlly.hp + Math.round(tAlly.maxHp * 0.05));
};

customAbilityHandlers['omega_s1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly) => {
   let tAlly = explicitTargetAlly || attacker;
   
   tAlly.hp = Math.min(tAlly.maxHp, tAlly.hp + Math.round(tAlly.maxHp * 0.20));
   if (!hasStatusFlag(tAlly, 'prevent_prot_recovery')) {
       tAlly.protection = Math.min(tAlly.maxProtection, tAlly.protection + Math.round(tAlly.maxProtection * 0.20));
   }
   tAlly.statuses = tAlly.statuses.filter(s => !s.isDebuff);
};

customAbilityHandlers['omega_s2'] = (state, attacker, target, ability, isCrit) => {
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   allies.forEach(a => {
       if (a.activeInBattle && a.hp > 0 && (checkHasTag(a, 'Bad Batch') || a.tags.includes('Bad Batch'))) {
           applyStatus(state, a, 'Offense Up', 2, false, attacker);
           applyStatus(state, a, 'Speed Up', 2, false, attacker);
       }
   });
   applyStatus(state, attacker, 'Stealth', 2, false, attacker);
};

// Batcher
customAbilityHandlers['batcher_b'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   let finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, \\\`\\\${target.name} suffered \\\${finalDmg} physical damage from Tracking Bite.\\\`, 'damage', target.id, attacker.id, finalDmg, isCrit);

   applyStatus(state, target, 'Vulnerable', 1, true, attacker);
   
   if (target.statuses.some(s => s.id === 'Marked')) {
       let bonusDmg = Math.round(baseDmg * 0.5);
       target.hp = Math.max(0, target.hp - bonusDmg);
       logBattleEvent(state, \\\`\\\${target.name} suffered \\\${bonusDmg} physical damage from bonus attack.\\\`, 'damage', target.id, attacker.id, bonusDmg, isCrit);
   }
};

customAbilityHandlers['batcher_s1'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (1.2 + Math.random() * 0.4);
   let finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, \\\`\\\${target.name} suffered \\\${finalDmg} physical damage from Lurca Pounce.\\\`, 'damage', target.id, attacker.id, finalDmg, isCrit);

   applyStatus(state, target, 'Daze', 2, true, attacker);
   if (!hasStatusFlag(attacker, 'prevent_tm_gain')) {
       attacker.turnMeter = Math.min(100, attacker.turnMeter + 25);
   }
};

customAbilityHandlers['batcher_s2'] = (state, attacker, target, ability, isCrit) => {
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   let omegaPresent = false;
   let omegaObj = null;
   allies.forEach(a => {
       if (a.activeInBattle && a.hp > 0 && (checkHasTag(a, 'Bad Batch') || a.tags.includes('Bad Batch'))) {
           a.hp = Math.min(a.maxHp, a.hp + Math.round(a.maxHp * 0.15));
           if (a.characterId === 'omega') {
               omegaPresent = true;
               omegaObj = a;
           }
       }
   });
   
   applyStatus(state, attacker, 'Tenacity Up', 2, false, attacker);
   if (omegaPresent && omegaObj) {
       applyStatus(state, omegaObj, 'Stealth', 2, false, attacker);
       applyStatus(state, attacker, 'Taunt', 2, false, attacker);
   }
};
\n`;

fs.appendFileSync('src/utils/combat/customKitLogic.ts', logic);
