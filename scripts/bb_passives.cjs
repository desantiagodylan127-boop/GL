const fs = require('fs');
let c = fs.readFileSync('src/utils/combatEngine.ts', 'utf8');

// 1. Tech assist logic
const assistLogic = `
        if (attacker.tags.includes('Bad Batch') || checkHasTag(attacker, 'Bad Batch')) {
           const tech = allies.find(u => u.characterId === 'tech_bb' && u.activeInBattle && u.hp > 0);
           if (tech && !hasStatusFlag(tech, 'prevent_tm_gain')) {
               tech.turnMeter = Math.min(100, tech.turnMeter + 5);
           }
        }
`;
c = c.replace(/(\/\/ 1\) Boost unique Adaptive Tactics[\s\S]*?if \(assistDepth > 0 \|\| counterDepth > 0\) \{)/, `$1\n${assistLogic}`);

// 2. Hunter/Omega/Batcher Special Ability triggers
const specialLogic = `
  if (unit.tags.includes('Bad Batch') || checkHasTag(unit, 'Bad Batch')) {
     const leader = allies.find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
     if (leader && leader.characterId === 'hunter') {
         allies.forEach(a => {
            if ((a.tags.includes('Bad Batch') || checkHasTag(a, 'Bad Batch')) && a.activeInBattle && a.hp > 0) {
                a.hp = Math.min(a.maxHp, a.hp + Math.round(a.maxHp * 0.03));
                if (!hasStatusFlag(a, 'prevent_prot_recovery')) {
                    a.protection = Math.min(a.maxProtection, a.protection + Math.round(a.maxProtection * 0.03));
                }
            }
         });
         logBattleEvent(state, \`🛡️ Sergeant Of Clone Force 99: Bad Batch allies recover 3% Health and Protection!\`, 'heal');
     }
     const omega = allies.find(u => u.characterId === 'omega' && u.activeInBattle && u.hp > 0);
     if (omega && !hasStatusFlag(omega, 'prevent_tm_gain')) {
         omega.turnMeter = Math.min(100, omega.turnMeter + 5);
     }
  }
`;
c = c.replace(/(export function onSpecialAbilityUsed\(state: CombatState, unit: CombatUnit\) \{\n  const allies = unit\.team === 'player' \? state\.playerTeam : state\.enemyTeam;\n  const leader = allies\.find\(u => u\.position === 0 && u\.activeInBattle && u\.hp > 0\);)/, `$1\n${specialLogic}`);

// 3. Tech/Crosshair Defeat Hooks
const defeatLogic = `
    const winningSquad = defeatedUnit.team === 'player' ? state.enemyTeam : state.playerTeam;
    
    // Tech: Reduce cooldowns
    const tech = winningSquad.find(u => u.characterId === 'tech_bb' && u.activeInBattle && u.hp > 0);
    if (tech) {
        Object.keys(tech.cooldowns).forEach(key => {
            if (tech.cooldowns[key] > 0) tech.cooldowns[key]--;
        });
    }

    // Crosshair: Marked enemy defeated
    if (defeatedUnit.statuses.some(s => s.name === 'Marked')) {
        const cross = winningSquad.find(u => u.characterId === 'crosshair_bb' && u.activeInBattle && u.hp > 0);
        if (cross) {
            cross.turnMeter = 100; // Bonus turn
            logBattleEvent(state, \`🎯 Crosshair gains a Bonus Turn (Marked enemy defeated)!\`, 'buff');
        }
        const leader = winningSquad.find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
        if (leader && leader.characterId === 'crosshair_bb') {
            winningSquad.forEach(a => {
                if ((a.tags.includes('Bad Batch') || checkHasTag(a, 'Bad Batch')) && a.activeInBattle && a.hp > 0 && !hasStatusFlag(a, 'prevent_tm_gain')) {
                    a.turnMeter = Math.min(100, a.turnMeter + 10);
                }
            });
        }
    }
`;
c = c.replace(/(export function runDefeatHooks\(state: CombatState, defeatedUnit: CombatUnit\) \{[\s\S]*?return; \/\/ Wait for checkDefeat to trigger the revive\n       \}\n    \})/, `$1\n${defeatLogic}`);

// 4. Hunter Evade
const evadeLogic = `
      if (baseDmg === 0 && currentTarget.characterId === 'hunter' && !hasStatusFlag(currentTarget, 'prevent_tm_gain')) {
          currentTarget.turnMeter = Math.min(100, currentTarget.turnMeter + 10);
      }
`;
c = c.replace(/(} else if \(isBlind\) \{\n        logBattleEvent\(state, \`💨 \$\{attacker\.name\} is BLIND and missed the attack!\`, 'info'\);\n        baseDmg = 0;\n      \})/, `$1\n${evadeLogic}`);

// 5. Wrecker takes damage + Hunter/Batcher 50% HP triggers
const damageLogic = `
          if (currentTarget.characterId === 'wrecker' && preHp > currentTarget.hp && !hasStatusFlag(currentTarget, 'prevent_tm_gain')) {
             currentTarget.turnMeter = Math.min(100, currentTarget.turnMeter + 5);
          }
          if (preHp >= currentTarget.maxHp * 0.5 && currentTarget.hp < currentTarget.maxHp * 0.5 && (currentTarget.tags.includes('Bad Batch') || checkHasTag(currentTarget, 'Bad Batch'))) {
              const allies = currentTarget.team === 'player' ? state.playerTeam : state.enemyTeam;
              const hunter = allies.find(u => u.characterId === 'hunter' && u.hp > 0 && u.activeInBattle);
              if (hunter) {
                  hunter.turnMeter = 100;
                  logBattleEvent(state, \`🚨 Hunter gains a Bonus Turn (Enhanced Senses)!\`, 'buff');
              }
              const batcher = allies.find(u => u.characterId === 'batcher' && u.hp > 0 && u.activeInBattle);
              if (batcher) {
                  batcher.turnMeter = 100;
                  logBattleEvent(state, \`🐺 Batcher gains a Bonus Turn (Faithful Companion)!\`, 'buff');
              }
          }
`;
c = c.replace(/(if \(currentTarget\.hp === 0 && preHp > 0\) \{\n             runDefeatHooks\(state, currentTarget\);\n          \})/, `$1\n${damageLogic}`);

fs.writeFileSync('src/utils/combatEngine.ts', c);
