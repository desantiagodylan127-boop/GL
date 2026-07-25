import { CombatState, CombatUnit, Ability } from '../../types';
import { applyStatus, executeCombatAction, checkHasTag, logBattleEvent, hasStatusFlag, getModifiedStats, reduceTurnMeter, runDefeatHooks, triggerSummon } from '../combatEngine';
import { STATUS_DEFINITIONS } from '../statusRegistry';

export type CustomAbilityHandler = (
  state: CombatState,
  attacker: CombatUnit,
  target: CombatUnit,
  ability: Ability,
  isCrit: boolean,
  explicitTargetAlly?: CombatUnit,
  assistDepth?: number,
  counterDepth?: number
) => void;

// Place custom abilities keyed by ability ID
export const customAbilityHandlers: Record<string, CustomAbilityHandler> = {};

// Passives that run during applySquadPassives for the ENTIRE team
export const customSquadPassives: Array<(state: CombatState) => void> = [];

// Helper for managing Treasure
export function getTreasure(unit: CombatUnit): number {
   return unit.dynamicState?.treasure || 0;
}
export function addTreasure(unit: CombatUnit, amount: number, state: CombatState) {
   if (!unit.dynamicState) unit.dynamicState = {};
   const current = unit.dynamicState.treasure || 0;
   unit.dynamicState.treasure = Math.min(10, current + amount);
   // Keep status icon/stacks in sync with the Treasure alt system
   applyStatus(state, unit, 'Treasure', 99, false, unit, unit.dynamicState.treasure);
   logBattleEvent(state, `💰 ${unit.name} gains +${amount} Treasure (Total: ${unit.dynamicState.treasure})!`, 'buff');
}
export function consumeTreasure(unit: CombatUnit, amount: number, state: CombatState): boolean {
   const current = getTreasure(unit);
   if (current >= amount) {
      unit.dynamicState.treasure = current - amount;
      if (unit.dynamicState.treasure > 0) {
        applyStatus(state, unit, 'Treasure', 99, false, unit, unit.dynamicState.treasure);
      } else {
        unit.statuses = unit.statuses.filter(s => s.name !== 'Treasure');
      }
      logBattleEvent(state, `🪙 ${unit.name} paid ${amount} Treasure (Total: ${unit.dynamicState.treasure}).`, 'buff');
      return true;
   }
   return false;
}

// Helpers for Artifacts
export function getArtifact(unit: CombatUnit): string | null {
   return unit.dynamicState?.artifact || null;
}
export function assignArtifact(target: CombatUnit, artifactType: string, state: CombatState) {
   if (!target.dynamicState) target.dynamicState = {};
   target.dynamicState.artifact = artifactType;
   logBattleEvent(state, `🏺 ${target.name} equipped the ${artifactType}!`, 'buff');
}

// Triggers when a specific character ID is defeated
export const customDefeatHooks: Record<string, (state: CombatState, defeated: CombatUnit, attacker: CombatUnit | null) => void> = {
   'doctor_aphra_event': (state, defeated, attacker) => {
       // Aphra drops artifacts on defeat...
   }
};

// Triggers at the start of a unit's turn (keyed by character ID)
export const customTurnStartHooks: Record<string, (state: CombatState, unit: CombatUnit) => void> = {};

customAbilityHandlers['aphra_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly) => {
   const artifacts = ['Ancient Blaster', 'Ancient Holocron', 'Ancient Shield Generator', 'Sith Relic'];
   
   if (!attacker.dynamicState) attacker.dynamicState = {};
   const assignedIndex = attacker.dynamicState.artifactsAssigned || 0;
   
   if (assignedIndex >= artifacts.length) {
       logBattleEvent(state, `${attacker.name} is out of artifacts to assign!`, 'info');
       return;
   }
   
   const isPlayer = state.playerTeam.some(u => u.id === attacker.id);
   const allies = isPlayer ? state.playerTeam : state.enemyTeam;
   // Aphra targets explicit ally or randomly finds one that isn't herself
   let ally = explicitTargetAlly;
   if (!ally || ally.id === attacker.id) {
       const availableAllies = allies.filter(a => a.id !== attacker.id && a.hp > 0);
       if (availableAllies.length > 0) {
           ally = availableAllies[Math.floor(Math.random() * availableAllies.length)];
       }
   }
   
   if (ally) {
       const artifactType = artifacts[assignedIndex];
       attacker.dynamicState.artifactsAssigned = assignedIndex + 1;
       applyStatus(state, ally, 'Artifact', 99, false, attacker); // Provide the aura buff
       assignArtifact(ally, artifactType, state);
       
       // Leader heal
       const aphra = allies.find(a => a.id === 'doctor_aphra_event');
       if (aphra) {
           // Provide healing per the leader ability
           logBattleEvent(state, `Fortune And Glory recovers health and protection!`, 'heal');
           ally.hp = Math.min(ally.maxHp, ally.hp + (ally.maxHp * 0.10));
           ally.protection = Math.min(ally.maxProtection, ally.protection + (ally.maxProtection * 0.10));
       }
   } else {
       logBattleEvent(state, `No valid ally to receive artifact!`, 'info');
   }
};

customAbilityHandlers['hondo_gl_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly) => {
   if (consumeTreasure(attacker, 3, state)) {
       applyStatus(state, target, 'Ability Block', 1, true, attacker);
       applyStatus(state, target, 'Offense Down', 2, true, attacker);
   } else {
       logBattleEvent(state, `${attacker.name} doesn't have enough Treasure!`, 'info');
   }
};

customAbilityHandlers['tarkin_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   const finalDamage = Math.round(baseDmg);
   
   const isDecreeAlreadyPresent = target.statuses.some(s => s.name === 'Imperial Decree');
   
   target.hp = Math.max(0, target.hp - finalDamage);
   logBattleEvent(state, `${target.name} suffered ${finalDamage} physical damage from Target The Weakness.`, 'damage', target.id, attacker.id, finalDamage, false);
   
   const nonDebuffsCount = target.statuses.filter(s => {
      const def = STATUS_DEFINITIONS[s.name];
      return def && def.type === 'buff';
   }).length;
   
   if (nonDebuffsCount > 0) {
      target.statuses = target.statuses.filter(s => {
         const def = STATUS_DEFINITIONS[s.name];
         return !def || def.type !== 'buff';
      });
      logBattleEvent(state, `✨ Dispel: All buffs dispelled from ${target.name}!`, 'info');
   }
   
   applyStatus(state, target, 'Imperial Decree', 99, true, attacker);
   
   if (isDecreeAlreadyPresent) {
      reduceTurnMeter(state, target, 15, attacker);
      const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
      allies.forEach(u => {
         if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Emperors Hand') || u.tags.includes("Emperor's Hand")) && !hasStatusFlag(u, 'prevent_tm_gain')) {
            u.turnMeter = Math.min(100, u.turnMeter + 5);
         }
      });
      logBattleEvent(state, `📈 Target The Weakness: Emperor's Hand allies gain 5% Turn Meter!`, 'buff');
   }
   
   if (target.hp === 0) {
      runDefeatHooks(state, target);
   }
};

customAbilityHandlers['tarkin_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly) => {
   applyStatus(state, target, 'Imperial Decree', 99, true, attacker);
   
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   allies.forEach(u => {
      if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Emperors Hand') || u.tags.includes("Emperor's Hand")) && !hasStatusFlag(u, 'prevent_tm_gain')) {
         u.turnMeter = Math.min(100, u.turnMeter + 5);
      }
   });
   logBattleEvent(state, `📈 Priority Target: Emperor's Hand allies gain 5% Turn Meter!`, 'buff');
   
   const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
   const hasDecree = enemies.some(u => u.activeInBattle && u.hp > 0 && u.statuses.some(s => s.name === 'Imperial Decree'));
   if (hasDecree) {
      const liveAlliesExceptSelf = allies.filter(u => u.id !== attacker.id && u.activeInBattle && u.hp > 0);
      if (liveAlliesExceptSelf.length > 0) {
         const highestOffenseAlly = [...liveAlliesExceptSelf].sort((a, b) => b.offense - a.offense)[0];
         const basicAbility = highestOffenseAlly.abilities.find(ab => ab.type === 'basic') || highestOffenseAlly.abilities[0];
         logBattleEvent(state, `⚔️ Priority Target: ${highestOffenseAlly.name} (highest Offense) is called to assist!`, 'info');
         executeCombatAction(state, highestOffenseAlly.id, basicAbility, target.id, undefined, 1, 0);
      }
   }
};
customAbilityHandlers['tarkin_spec1'] = customAbilityHandlers['tarkin_special_1'];

customAbilityHandlers['tarkin_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly) => {
   const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
   const activeEnemies = enemies.filter(u => u.activeInBattle && u.hp > 0);
   
   activeEnemies.forEach(e => {
      const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
      let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
      
      const hasDecree = e.statuses.some(s => s.name === 'Imperial Decree');
      if (hasDecree) {
         baseDmg *= 1.50;
      }
      
      if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
      e.hp = Math.max(0, e.hp - finalDmg);
      logBattleEvent(state, `${e.name} took ${finalDmg} physical damage from Orbital Bombardment.`, 'damage', e.id, attacker.id, finalDmg, false);
      
      if (hasDecree) {
         applyStatus(state, e, 'Offense Down', 2, true, attacker);
         applyStatus(state, e, 'Vulnerable', 2, true, attacker);
      }
      
      if (e.hp === 0) {
         runDefeatHooks(state, e);
      }
   });
   
   const remainingEnemies = enemies.filter(u => u.activeInBattle && u.hp > 0);
   if (remainingEnemies.length === 1 && attacker.hp > 0) {
      const soleTarget = remainingEnemies[0];
      const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
      let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
      
      const hasDecree = soleTarget.statuses.some(s => s.name === 'Imperial Decree');
      if (hasDecree) {
         baseDmg *= 1.50;
      }
      
      if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
      soleTarget.hp = Math.max(0, soleTarget.hp - finalDmg);
      logBattleEvent(state, `💥 Orbital Bombardment repeats: ${soleTarget.name} took ${finalDmg} physical damage!`, 'damage', soleTarget.id, attacker.id, finalDmg, false);
      
      if (hasDecree) {
         applyStatus(state, soleTarget, 'Offense Down', 2, true, attacker);
         applyStatus(state, soleTarget, 'Vulnerable', 2, true, attacker);
      }
      
      if (soleTarget.hp === 0) {
         runDefeatHooks(state, soleTarget);
      }
   }
};
customAbilityHandlers['tarkin_spec2'] = customAbilityHandlers['tarkin_special_2'];

// --- STARKILLER HANDLERS ---
customAbilityHandlers['starkiller_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth = 0, counterDepth = 0) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.9 + Math.random() * 0.3);
   if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);
   
   if (target.hp === 0) {
      return;
   }

   if (isCrit && assistDepth === 0 && counterDepth === 0) {
      attacker.turnMeter += 50;
      logBattleEvent(state, `💥 Critical Hit! Starkiller gains 5% Turn Meter!`, 'buff');
   }

   const hasDecree = target.statuses.some(s => s.name === 'Imperial Decree');
   if (hasDecree && assistDepth === 0) {
      logBattleEvent(state, `⚔️ Furious Assault: Target has Imperial Decree! Starkiller attacks again!`, 'info');
      // Hack: directly do another attack logic without recursive executeCombatAction
      target.hp = Math.max(0, target.hp - finalDmg);
      logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, false);
      if (target.hp === 0) {
          runDefeatHooks(state, target);
          return;
      }
   }
   
   if (target.hp > 0 && target.hp < target.maxHp * 0.5 && assistDepth === 0) {
      logBattleEvent(state, `⚔️ Furious Assault: Target below 50% Health! Starkiller attacks a third time!`, 'info');
      target.hp = Math.max(0, target.hp - finalDmg);
      logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, false);
      if (target.hp === 0) runDefeatHooks(state, target);
   }
};

customAbilityHandlers['starkiller_s1'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
   const activeEnemies = enemies.filter(u => u.activeInBattle && u.hp > 0);
   const decreeEnemies = activeEnemies.filter(u => u.statuses.some(s => s.name === 'Imperial Decree'));
   
   const hitEnemy = (e) => {
      let baseDmg = attStats.offense * 0.9 * (0.9 + Math.random() * 0.2);
      if (e.hp < e.maxHp * 0.5) {
        const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
        if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
            baseDmg *= 1.20;
        }
      }
      const finalDmg = Math.round(baseDmg);
      e.hp = Math.max(0, e.hp - finalDmg);
      logBattleEvent(state, `${e.name} took ${finalDmg} special damage from Force Repulse.`, 'damage', e.id, attacker.id, finalDmg, isCrit);
      
      const hasDecree = e.statuses.some(s => s.name === 'Imperial Decree');
      if (hasDecree) {
         reduceTurnMeter(state, e, 20, attacker);
         applyStatus(state, e, 'Daze', 2, true, attacker);
      }
      
      if (e.hp === 0) runDefeatHooks(state, e);
   };

   activeEnemies.forEach(e => hitEnemy(e));

   if (decreeEnemies.length === 1) {
       logBattleEvent(state, `⚔️ Only one enemy has Imperial Decree! Force Repulse damages again!`, 'info');
       enemies.filter(u => u.activeInBattle && u.hp > 0).forEach(e => hitEnemy(e));
   }
};

customAbilityHandlers['starkiller_s2'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * 2.5 * (0.9 + Math.random() * 0.2);
   if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
   }
   const finalDmg = Math.round(baseDmg);
   
   const hasDecree = target.statuses.some(s => s.name === 'Imperial Decree');
   
   // Ignore protection logic implies applying directly to HP if possible, or just True Damage.
   // Let's deal normal damage (bypassing protection directly)
   const initialProt = target.protection;
   target.protection = 0; // Temporarily remove protection
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage (Ignore Protection)', 'damage', target.id, attacker.id, finalDmg, isCrit);
   
   if (hasDecree) {
      const bonusDmg = Math.round(attacker.maxProtection * 0.2);
      target.hp = Math.max(0, target.hp - bonusDmg);
      logBattleEvent(state, `💥 Bring Down The Fleet Bonus: ${target.name} suffered ${bonusDmg} additional damage!`, 'damage', target.id, attacker.id, bonusDmg, false);
   }
   
   target.protection = initialProt; // Restore protection if it didn't kill

   if (target.hp <= 0) {
      target.hp = 0;
      target.protection = 0;
      attacker.cooldowns['starkiller_basic'] = 0;
      
      const mySquad = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
      mySquad.filter(u => u.hp > 0 && (u.tags.includes('Emperors Hand') || checkHasTag(u, 'Emperors Hand'))).forEach(ally => {
         Object.keys(ally.cooldowns).forEach(key => {
            if (ally.cooldowns[key] > 0) ally.cooldowns[key]--;
         });
      });
      
      applyStatus(state, attacker, 'bonus_turn', 1, false, attacker);
      logBattleEvent(state, `🔄 Bring Down The Fleet: Target defeated! Furious Assault reset, cooldowns reduced, and Starkiller gains a bonus turn!`, 'buff');
      runDefeatHooks(state, target);
   }
};

// --- MARA JADE HANDLERS ---
customAbilityHandlers['mara_basic'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.3);
   if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);
   
   if (target.hp === 0) {
      return;
   }

   const hasDecree = target.statuses.some(s => s.name === 'Imperial Decree');
   if (hasDecree) {
      applyStatus(state, target, 'Healing Immunity', 2, true, attacker);
      applyStatus(state, target, 'Ability Block', 1, true, attacker);
      applyStatus(state, attacker, 'Stealth', 1, false, attacker);
   }
};

customAbilityHandlers['mara_s1'] = (state, attacker, target, ability, isCrit) => {
   const wasStealthed = attacker.statuses.some(s => s.name === 'Stealth');
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   
   const hasDecree = target.statuses.some(s => s.name === 'Imperial Decree');
   
   const performAttack = () => {
       let baseDmg = attStats.offense * 2.0 * (0.9 + Math.random() * 0.2);
       // Ignore 50% defense globally for this ability, we simulate this by boosting damage slightly if we don't have direct access to reduce defense dynamically on target
       baseDmg *= 1.25; 
       
       const finalDmg = Math.round(baseDmg);
       target.hp = Math.max(0, target.hp - finalDmg);
       logBattleEvent(state, 'Unit suffered Massive Physical damage (Ignores 50% Defense)', 'damage', target.id, attacker.id, finalDmg, isCrit);
       if (target.hp === 0) runDefeatHooks(state, target);
       
       if (target.hp > 0 && hasDecree) {
           applyStatus(state, attacker, 'Stealth', 2, false, attacker);
           applyStatus(state, target, 'Exposed', 2, true, attacker);
           applyStatus(state, target, 'Buff Immunity', 2, true, attacker);
           logBattleEvent(state, `👤 Silent Assassination: Mara Jade gains Stealth, inflicts Exposed & Buff Immunity!`, 'buff');
       }
   };

   performAttack();
   
   if (target.hp > 0 && wasStealthed) {
       logBattleEvent(state, `👤 Mara Jade attacks again from Stealth!`, 'info');
       performAttack();
   }
};

customAbilityHandlers['mara_s2'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * 1.2 * (0.9 + Math.random() * 0.2);
   if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) {
      runDefeatHooks(state, target);
      return;
   }

   const hasDecree = target.statuses.some(s => s.name === 'Imperial Decree');
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   const ehAllies = allies.filter(u => u.id !== attacker.id && u.activeInBattle && u.hp > 0 && (u.tags.includes('Emperors Hand') || u.tags.includes("Emperor's Hand")));
   
   const callAssist = () => {
      if (ehAllies.length > 0) {
         const assistAlly = ehAllies[Math.floor(Math.random() * ehAllies.length)];
         const basic = assistAlly.abilities.find(ab => ab.type === 'basic') || assistAlly.abilities[0];
         logBattleEvent(state, `⚔️ By The Emperor's Command: Emperor's Hand ally ${assistAlly.name} is called to assist!`, 'info');
         if(customAbilityHandlers[basic.id]) {
             customAbilityHandlers[basic.id](state, assistAlly, target, basic, Math.random() < assistAlly.critChance, undefined, 1, 0);
         } else {
             const bDmg = assistAlly.offense * (0.8 + Math.random()*0.4);
             target.hp = Math.max(0, target.hp - Math.round(bDmg));
             if (target.hp === 0) runDefeatHooks(state, target);
         }
      }
   };

   callAssist();

   if (target.hp > 0 && hasDecree) {
      callAssist();
      reduceTurnMeter(state, target, 25, attacker);
      applyStatus(state, target, 'Ability Block', 1, true, attacker);
      applyStatus(state, target, 'Daze', 1, true, attacker);
   }
};

// --- RIOT TROOPER HANDLERS ---
customAbilityHandlers['riot_basic'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.3);
   if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);
   
   if (Math.random() < 0.5) {
      applyStatus(state, target, 'Daze', 1, true, attacker);
   }
   
   if (target.hp === 0) runDefeatHooks(state, target);
};

customAbilityHandlers['riot_s1'] = (state, attacker, target, ability, isCrit) => {
   applyStatus(state, attacker, 'Taunt', 2, false, attacker);
   applyStatus(state, attacker, 'Defense Up', 2, false, attacker);
   
   const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
   const hasDecree = enemies.some(u => u.activeInBattle && u.hp > 0 && u.statuses.some(s => s.name === 'Imperial Decree'));
   if (hasDecree) {
      applyStatus(state, attacker, 'Retribution', 2, false, attacker);
   }
};

customAbilityHandlers['riot_s2'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * 1.3 * (0.9 + Math.random() * 0.2);
   if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);
   
   if (target.hp === 0) {
      runDefeatHooks(state, target);
      return;
   }

   const hasDecree = target.statuses.some(s => s.name === 'Imperial Decree');
   if (hasDecree) {
      applyStatus(state, target, 'Offense Down', 2, true, attacker);
      applyStatus(state, target, 'Speed Down', 2, true, attacker);
   }
};

// --- GIDEON HASK HANDLERS ---
customAbilityHandlers['hask_basic'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.3);
   if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);
   
   const hasDecree = target.statuses.some(s => s.name === 'Imperial Decree');
   if (hasDecree) {
      reduceTurnMeter(state, target, 5, attacker);
   }
   
   if (target.hp === 0) runDefeatHooks(state, target);
};

customAbilityHandlers['hask_s1'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
   const activeEnemies = enemies.filter(u => u.activeInBattle && u.hp > 0);
   
   activeEnemies.forEach(e => {
      let multiplier = 0.8;
      const hasDecree = e.statuses.some(s => s.name === 'Imperial Decree');
      if (hasDecree) {
         multiplier = 1.3;
         logBattleEvent(state, `🎯 Relentless Barrage: Extra damage against Imperial Decree!`, 'info');
      }
      let baseDmg = attStats.offense * multiplier * (0.9 + Math.random() * 0.2);
      if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
      
      e.hp = Math.max(0, e.hp - finalDmg);
      logBattleEvent(state, `${e.name} took ${finalDmg} physical damage from Relentless Barrage.`, 'damage', e.id, attacker.id, finalDmg, isCrit);
      
      if (e.hp === 0) runDefeatHooks(state, e);
   });
};

customAbilityHandlers['hask_s2'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * 1.4 * (0.9 + Math.random() * 0.2);
   if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);
   
   applyStatus(state, target, 'Daze', 2, true, attacker);
   
   const hasDecree = target.statuses.some(s => s.name === 'Imperial Decree');
   if (hasDecree) {
      applyStatus(state, target, 'Buff Immunity', 2, true, attacker);
      reduceTurnMeter(state, target, 10, attacker);
   }
   
   if (target.hp === 0) runDefeatHooks(state, target);
};

// --- IMPERIAL OFFICER HANDLERS ---
customAbilityHandlers['officer_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.3);
   if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);
   
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   let targetAlly = explicitTargetAlly;
   if (!targetAlly || targetAlly.id === attacker.id) {
      const otherAllies = allies.filter(u => u.activeInBattle && u.hp > 0);
      if (otherAllies.length > 0) {
         targetAlly = otherAllies[Math.floor(Math.random() * otherAllies.length)];
      }
   }
   if (targetAlly && !hasStatusFlag(targetAlly, 'prevent_tm_gain')) {
      targetAlly.turnMeter = Math.min(100, targetAlly.turnMeter + 3);
      logBattleEvent(state, `📈 Commanding Shot: ${targetAlly.name} gains 3% Turn Meter!`, 'buff');
   }
   
   if (target.hp === 0) runDefeatHooks(state, target);
};

customAbilityHandlers['officer_s1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly) => {
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   let targetAlly = explicitTargetAlly;
   if (!targetAlly) {
      const otherAllies = allies.filter(u => u.id !== attacker.id && u.activeInBattle && u.hp > 0);
      targetAlly = otherAllies.length > 0 ? otherAllies[Math.floor(Math.random() * otherAllies.length)] : attacker;
   }
   
   applyStatus(state, targetAlly, 'Offense Up', 2, false, attacker);
   applyStatus(state, targetAlly, 'Critical Chance Up', 2, false, attacker);
   if (!hasStatusFlag(targetAlly, 'prevent_tm_gain')) {
      targetAlly.turnMeter = Math.min(100, targetAlly.turnMeter + 10);
      logBattleEvent(state, `📈 Strategic Repositioning: ${targetAlly.name} gains 10% Turn Meter!`, 'buff');
   }
};

customAbilityHandlers['officer_s2'] = (state, attacker, target, ability, isCrit) => {
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   allies.forEach(u => {
      if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Emperors Hand') || u.tags.includes("Emperor's Hand")) && !hasStatusFlag(u, 'prevent_tm_gain')) {
         u.turnMeter = Math.min(100, u.turnMeter + 5);
      }
   });
   logBattleEvent(state, `📈 Priority Target: Emperor's Hand allies gain 5% Turn Meter!`, 'buff');
   
   const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
   const hasDecree = enemies.some(u => u.activeInBattle && u.hp > 0 && u.statuses.some(s => s.name === 'Imperial Decree'));
   if (hasDecree) {
      const decreeTarget = enemies.find(u => u.activeInBattle && u.hp > 0 && u.statuses.some(s => s.name === 'Imperial Decree')) || target;
      const liveAlliesExceptSelf = allies.filter(u => u.id !== attacker.id && u.activeInBattle && u.hp > 0);
      if (liveAlliesExceptSelf.length > 0) {
         const highestOffenseAlly = [...liveAlliesExceptSelf].sort((a, b) => b.offense - a.offense)[0];
         const basic = highestOffenseAlly.abilities.find(ab => ab.type === 'basic') || highestOffenseAlly.abilities[0];
         logBattleEvent(state, `⚔️ Priority Target: ${highestOffenseAlly.name} (highest Offense) is called to assist!`, 'info');
         executeCombatAction(state, highestOffenseAlly.id, basic, decreeTarget.id, undefined, 1, 0);
      }
   }
};

// --- DARTH SIDIOUS HANDLERS ---
customAbilityHandlers['gl_sidious_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth = 0, counterDepth = 0) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.9 + Math.random() * 0.3);
   if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);
   
   applyStatus(state, target, 'Shock', 2, true, attacker);
   
   if (target.hp === 0) {
      runDefeatHooks(state, target);
      return;
   }

   const hasDecree = target.statuses.some(s => s.name === 'Imperial Decree');
   if (hasDecree && assistDepth === 0) {
      logBattleEvent(state, `⚔️ Unlimited Power: Target has Imperial Decree! Darth Sidious attacks again!`, 'info');
      executeCombatAction(state, attacker.id, ability, target.id, undefined, 1, 0);
   }
};

customAbilityHandlers['gl_sidious_special1'] = (state, attacker, target, ability, isCrit) => {
   applyStatus(state, target, 'Imperial Decree', 99, true, attacker);
   applyStatus(state, target, 'Fear', 1, true, attacker);
   
   let tmToReduce = 15;
   if (target.position === 0) {
      tmToReduce = 30; // 15% + 15% if target is a Leader
      logBattleEvent(state, `👑 I Am The Senate: Target is a Leader! Reducing 30% Turn Meter!`, 'info');
   }
   reduceTurnMeter(state, target, tmToReduce, attacker);
};

customAbilityHandlers['gl_sidious_special2'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
   const activeEnemies = enemies.filter(u => u.activeInBattle && u.hp > 0);
   
   activeEnemies.forEach(e => {
      let baseDmg = attStats.offense * 1.0 * (0.9 + Math.random() * 0.2);
      if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
      e.hp = Math.max(0, e.hp - finalDmg);
      logBattleEvent(state, `${e.name} took ${finalDmg} special damage from Execute Order 66.`, 'damage', e.id, attacker.id, finalDmg, isCrit);
      
      const hasDecree = e.statuses.some(s => s.name === 'Imperial Decree');
      if (hasDecree) {
         reduceTurnMeter(state, e, 20, attacker);
         applyStatus(state, e, 'Healing Immunity', 2, true, attacker);
         applyStatus(state, e, 'Buff Immunity', 2, true, attacker);
      }
      
      if (e.hp === 0) runDefeatHooks(state, e);
   });
};

customAbilityHandlers['gl_sidious_ultimate'] = (state, attacker, target, ability, isCrit) => {
   applyStatus(state, target, 'Imperial Decree', 99, true, attacker);
   
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   allies.forEach(u => {
      if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Emperors Hand') || u.tags.includes("Emperor's Hand"))) {
         applyStatus(state, u, 'Offense Up', 3, false, attacker);
         applyStatus(state, u, 'Critical Damage Up', 3, false, attacker);
         applyStatus(state, u, 'Defense Penetration Up', 3, false, attacker);
      }
   });
   logBattleEvent(state, `😈 The Empire Eternal: Emperor's Hand allies gain massive combat enhancements!`, 'buff');
   
   reduceTurnMeter(state, target, 50, attacker);
   applyStatus(state, target, 'Healing Immunity', 3, true, attacker);
   applyStatus(state, target, 'Buff Immunity', 3, true, attacker);
   
   allies.forEach(u => {
      if (u.id !== attacker.id && u.activeInBattle && u.hp > 0 && (u.tags.includes('Emperors Hand') || u.tags.includes("Emperor's Hand"))) {
         const basic = u.abilities.find(ab => ab.type === 'basic') || u.abilities[0];
         logBattleEvent(state, `⚔️ The Empire Eternal: ${u.name} is called to assist!`, 'info');
         executeCombatAction(state, u.id, basic, target.id, undefined, 1, 0);
      }
   });
   
   if (target.hp === 0) {
      allies.forEach(u => {
         if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Emperors Hand') || u.tags.includes("Emperor's Hand"))) {
            Object.keys(u.cooldowns).forEach(abId => {
               u.cooldowns[abId] = 0;
            });
         }
      });
      logBattleEvent(state, `🔄 The Empire Eternal: Target defeated! Emperor's Hand cooldowns reset!`, 'buff');
      runDefeatHooks(state, target);
   }
};



// --- RED SQUADRON ---

// Biggs Darklighter
customAbilityHandlers['biggs_b'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   const redAllies = allies.filter(u => u.activeInBattle && u.hp > 0 && (u.tags.includes('Red Squadron') || checkHasTag(u, 'Red Squadron')));
   if (redAllies.length > 0) {
      redAllies.sort((a, b) => (a.hp/a.maxHp) - (b.hp/b.maxHp));
      applyStatus(state, redAllies[0], 'Defense Up', 2, false, attacker);
   }
};

customAbilityHandlers['biggs_s1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth = 0, counterDepth = 0) => {
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   let tAlly = explicitTargetAlly;
   if (!tAlly || tAlly.id === attacker.id) {
       const otherAllies = allies.filter(u => u.id !== attacker.id && u.activeInBattle && u.hp > 0);
       tAlly = otherAllies.length > 0 ? otherAllies[Math.floor(Math.random() * otherAllies.length)] : attacker;
   }
   
   applyStatus(state, tAlly, 'Defense Up', 2, false, attacker);
   applyStatus(state, tAlly, 'Protection Up', 2, false, attacker, 0.15);
   
   if (assistDepth === 0) {
      executeCombatAction(state, attacker.id, attacker.abilities.find(a => a.type === 'basic') || attacker.abilities[0], target.id, undefined, 1, 0);
      if (tAlly.id !== attacker.id) {
         executeCombatAction(state, tAlly.id, tAlly.abilities.find(a => a.type === 'basic') || tAlly.abilities[0], target.id, undefined, 1, 0);
      }
   }
};

customAbilityHandlers['biggs_s2'] = (state, attacker, target, ability, isCrit) => {
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   allies.forEach(a => {
      if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Red Squadron') || checkHasTag(a, 'Red Squadron'))) {
         applyStatus(state, a, 'Offense Up', 2, false, attacker);
         applyStatus(state, a, 'Critical Chance Up', 2, false, attacker);
      }
   });
   
   const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
   enemies.forEach(e => {
       e.statuses = e.statuses.filter(s => s.name !== 'Marked Target');
   });
   
   applyStatus(state, target, 'Marked Target', 99, true, attacker);
   logBattleEvent(state, `${target.name} became the Marked Target!`, 'debuff');
};

// Jek Porkins
customAbilityHandlers['porkins_b'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

   applyStatus(state, attacker, 'Protection Up', 2, false, attacker, 0.05);
};

customAbilityHandlers['porkins_s1'] = (state, attacker, target, ability, isCrit) => {
   attacker.hp = Math.min(attacker.maxHp, attacker.hp + Math.round(attacker.maxHp * 0.25));
   if (!hasStatusFlag(attacker, 'prevent_prot_recovery')) {
       attacker.protection = Math.min(attacker.maxProtection, attacker.protection + Math.round(attacker.maxProtection * 0.25));
   }
   applyStatus(state, attacker, 'Taunt', 2, false, attacker);
   
   const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
   if (enemies.some(e => e.statuses.some(s => s.name === 'Marked Target'))) {
       applyStatus(state, attacker, 'Defense Up', 2, false, attacker);
   }
};

customAbilityHandlers['porkins_s2'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   const bonusDmg = Math.round(attacker.maxHp * 0.20);
   const finalDmg = baseDmg + bonusDmg;
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

   if (target.statuses.some(s => s.name === 'Marked Target')) {
       applyStatus(state, target, 'Stun', 1, true, attacker);
   }
};

// Dak Ralter
customAbilityHandlers['dak_b'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

   reduceTurnMeter(state, target, 5, attacker);
};

customAbilityHandlers['dak_s1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth = 0, counterDepth = 0) => {
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   let tAlly = explicitTargetAlly;
   if (!tAlly || tAlly.id === attacker.id) {
       const otherAllies = allies.filter(u => u.id !== attacker.id && u.activeInBattle && u.hp > 0);
       tAlly = otherAllies.length > 0 ? otherAllies[Math.floor(Math.random() * otherAllies.length)] : attacker;
   }
   
   applyStatus(state, tAlly, 'Offense Up', 2, false, attacker);
   applyStatus(state, tAlly, 'Speed Up', 2, false, attacker);
   
   if (assistDepth === 0) {
      if (tAlly.id !== attacker.id) {
         executeCombatAction(state, tAlly.id, tAlly.abilities.find(a => a.type === 'basic') || tAlly.abilities[0], target.id, undefined, 1, 0);
         if (target.statuses.some(s => s.name === 'Marked Target')) {
             if (!hasStatusFlag(tAlly, 'prevent_tm_gain')) {
                 tAlly.turnMeter = Math.min(100, tAlly.turnMeter + 15);
                 logBattleEvent(state, `${tAlly.name} gained 15% TM for attacking Marked Target!`, 'buff');
             }
         }
      }
   }
};

customAbilityHandlers['dak_s2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth = 0) => {
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
   
   allies.forEach(a => {
      if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Red Squadron') || checkHasTag(a, 'Red Squadron'))) {
          if (!hasStatusFlag(a, 'prevent_tm_gain')) {
              a.turnMeter = Math.min(100, a.turnMeter + 15);
          }
      }
   });
   
   let markedTarget = enemies.find(e => e.activeInBattle && e.hp > 0 && e.statuses.some(s => s.name === 'Marked Target'));
   
   if (markedTarget && assistDepth === 0) {
       const activeAllies = allies.filter(u => u.activeInBattle && u.hp > 0);
       activeAllies.sort((a, b) => b.offense - a.offense);
       const assistAlly = activeAllies[0];
       executeCombatAction(state, assistAlly.id, assistAlly.abilities.find(a => a.type === 'basic') || assistAlly.abilities[0], markedTarget.id, undefined, 1, 0);
   }
};

// Wes Janson
customAbilityHandlers['wes_janson_b'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

   if (Math.random() < 0.5) {
       applyStatus(state, target, 'Defense Down', 2, true, attacker);
   }
};

customAbilityHandlers['wes_janson_s1'] = (state, attacker, target, ability, isCrit) => {
   const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
   enemies.forEach(e => {
      if (e.activeInBattle && e.hp > 0) {
          const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
          if (e.statuses.some(s => s.name === 'Defense Down')) {
              baseDmg = Math.round(baseDmg * 1.5);
          }
          e.hp = Math.max(0, e.hp - baseDmg);
          logBattleEvent(state, `${e.name} suffered ${baseDmg} physical damage from Bombing Run.`, 'damage', e.id, attacker.id, baseDmg, isCrit);
      }
   });
};

customAbilityHandlers['wes_janson_s2'] = (state, attacker, target, ability, isCrit) => {
   const isMarked = target.statuses.some(s => s.name === 'Marked Target');
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   
   let finalDmg = baseDmg * 2.0; // heavy damage
   if (isMarked) {
       finalDmg = Math.round((attacker.offense * 2.5) * (isCrit ? attacker.critDamage : 1));
   }
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

   if (isMarked) {
       applyStatus(state, target, 'Exposed', 2, true, attacker);
   }
};

// Hobbie Klivian
customAbilityHandlers['hobbie_b'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

   applyStatus(state, target, 'Accuracy Down', 2, true, attacker);
};

customAbilityHandlers['hobbie_s1'] = (state, attacker, target, ability, isCrit) => {
   applyStatus(state, target, 'Speed Down', 2, true, attacker);
   applyStatus(state, target, 'Offense Down', 2, true, attacker);
   
   if (target.statuses.some(s => s.name === 'Marked Target')) {
       reduceTurnMeter(state, target, 15, attacker);
   }
};

customAbilityHandlers['hobbie_s2'] = (state, attacker, target, ability, isCrit) => {
   target.statuses = target.statuses.filter(s => s.isDebuff);
   logBattleEvent(state, `${target.name} had all buffs dispelled by Disable Systems.`, 'info');
   
   applyStatus(state, target, 'Ability Block', 1, true, attacker);
   
   if (target.statuses.some(s => s.name === 'Marked Target')) {
       Object.keys(target.cooldowns).forEach(key => {
           target.cooldowns[key]++;
       });
       logBattleEvent(state, `${target.name} had their cooldowns increased by 1!`, 'debuff');
   }
};

// --- EWOKS ---

// Chief Chirpa
customAbilityHandlers['chirpa_b'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   const otherEwoks = allies.filter(u => u.id !== attacker.id && u.activeInBattle && u.hp > 0 && (checkHasTag(u, 'Ewok') || u.tags.includes('Ewok')));
   if (otherEwoks.length > 0) {
       const assistAlly = otherEwoks[Math.floor(Math.random() * otherEwoks.length)];
       executeCombatAction(state, assistAlly.id, assistAlly.abilities.find(a => a.type === 'basic') || assistAlly.abilities[0], target.id, undefined, 1, 0);
       const c3po = allies.find(u => u.characterId === 'c3po' && u.activeInBattle && u.hp > 0);
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
   
   const c3po = allies.find(u => u.characterId === 'c3po' && u.activeInBattle && u.hp > 0);
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
   if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

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
       if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
       target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);
   }
   if (target.hp < target.maxHp * 0.5) {
       applyStatus(state, target, 'Exposed', 2, true, attacker);
   }
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   const leia = allies.find(u => u.characterId === 'leia_gl' || u.characterId === 'leia_boushh' || u.characterId === 'leia_organa');
   if (leia) {
       const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
       let baseDmg = attStats.offense * (0.5 + Math.random() * 0.3); // reduced dmg
       if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
       target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);
   }
};

customAbilityHandlers['wicket_s2'] = (state, attacker, target, ability, isCrit) => {
   applyStatus(state, attacker, 'Offense Up', 2, false, attacker);
   applyStatus(state, attacker, 'Critical Damage Up', 2, false, attacker);
   
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (1.5 + Math.random() * 0.5); // massive
   if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);
   
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
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

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
   logBattleEvent(state, `${tAlly.name} was dispelled and healed by Tribal Remedy!`, 'heal');
   
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
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

   reduceTurnMeter(state, target, 5, attacker);
   if (!hasStatusFlag(attacker, 'prevent_tm_gain')) {
       attacker.turnMeter = Math.min(100, attacker.turnMeter + 5);
   }
   
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   if (allies.some(u => u.characterId === 'c3po' && u.activeInBattle && u.hp > 0)) {
       reduceTurnMeter(state, target, 5, attacker);
   }
};

customAbilityHandlers['paploo_s1'] = (state, attacker, target, ability, isCrit) => {
   const hadTaunt = target.statuses.some(s => s.name === 'Taunt');
   
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (1.0 + Math.random() * 0.4);
   if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);
   
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
   
   const c3po = allies.find(u => u.characterId === 'c3po' && u.activeInBattle && u.hp > 0);
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
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   if (target.hp < target.maxHp * 0.5) {
    const leader = (attacker.team === 'player' ? state.playerTeam : state.enemyTeam).find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
    if (leader && leader.characterId === 'chief_chirpa' && (checkHasTag(attacker, 'Ewok') || attacker.tags.includes('Ewok'))) {
        baseDmg *= 1.20;
    }
}
const finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

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
       
       const c3po = allies.find(u => u.characterId === 'c3po' && u.activeInBattle && u.hp > 0);
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

// --- STORMTROOPER RESCUE ---

// Stormtrooper Luke
customAbilityHandlers['stluke_b'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   let finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

   if (attacker.statuses.some(s => !s.isDebuff)) {
       let bonusDmg = Math.round(baseDmg * 0.5);
       target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);
   }
};

customAbilityHandlers['stluke_s1'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (1.2 + Math.random() * 0.4);
   const finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);
   
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
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

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
         logBattleEvent(state, `${u.name} suffered ${finalDmg} physical damage from Into The Detention Block.`, 'damage', u.id, attacker.id, finalDmg, isCrit);
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
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

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
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

   applyStatus(state, target, 'Offense Down', 2, true, attacker);
};

customAbilityHandlers['smug_chewie_s1'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (1.2 + Math.random() * 0.4);
   let finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

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
         logBattleEvent(state, `${u.name} suffered ${finalDmg} physical damage from Prisoner Transfer.`, 'damage', u.id, attacker.id, finalDmg, isCrit);
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
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

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

// --- BAD BATCH ---

// Hunter
customAbilityHandlers['hunter_b'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (0.8 + Math.random() * 0.4);
   let finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

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
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

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
         logBattleEvent(state, `${u.name} suffered ${finalDmg} physical damage from Demolition Expert.`, 'damage', u.id, attacker.id, finalDmg, isCrit);
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
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

   applyStatus(state, target, 'Vulnerable', 1, true, attacker);
};

customAbilityHandlers['tech_s1'] = (state, attacker, target, ability, isCrit) => {
   target.statuses = target.statuses.filter(s => s.isDebuff || s.name === 'Taunt');
   applyStatus(state, target, 'Ability Block', 1, true, attacker);
   
   const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
   const bbAllies = allies.filter(u => u.activeInBattle && u.hp > 0 && (checkHasTag(u, 'Bad Batch') || u.tags.includes('Bad Batch')));
   if (bbAllies.length > 0) {
       const cdAlly = bbAllies[Math.floor(Math.random() * bbAllies.length)];
       let cdReduced = false;
       for (const ab in cdAlly.cooldowns) {
           if (cdAlly.cooldowns[ab] > 0) {
               cdAlly.cooldowns[ab]--;
               cdReduced = true;
           }
       }
       if (cdReduced) {
           logBattleEvent(state, `${cdAlly.name}'s cooldowns were reduced.`, 'buff', cdAlly.id);
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
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

   applyStatus(state, target, 'Buff Immunity', 1, true, attacker);
};

customAbilityHandlers['echo_bb_s1'] = (state, attacker, target, ability, isCrit) => {
   const oppSquad = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
   oppSquad.forEach(u => {
      if (u.activeInBattle && u.hp > 0) {
          u.statuses = u.statuses.filter(s => s.isDebuff || s.name === 'Taunt');
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
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

   applyStatus(state, target, 'Marked', 2, true, attacker);
};

customAbilityHandlers['cross_s1'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (1.2 + Math.random() * 0.4);
   let finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

   if (target.statuses.some(s => s.name === 'Marked')) {
       let bonusDmg = Math.round(baseDmg * 0.5);
       target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);
   }
};

customAbilityHandlers['cross_s2'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (1.5 + Math.random() * 0.5);
   let finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg); // ignore protection implicitly by targeting hp
   logBattleEvent(state, `${target.name} suffered ${finalDmg} physical damage (ignoring protection) from Imperial Training.`, 'damage', target.id, attacker.id, finalDmg, isCrit);

   if (target.statuses.some(s => s.name === 'Marked')) {
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
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

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
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

   applyStatus(state, target, 'Vulnerable', 1, true, attacker);
   
   if (target.statuses.some(s => s.name === 'Marked')) {
       let bonusDmg = Math.round(baseDmg * 0.5);
       target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);
   }
};

customAbilityHandlers['batcher_s1'] = (state, attacker, target, ability, isCrit) => {
   const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
   let baseDmg = attStats.offense * (1.2 + Math.random() * 0.4);
   let finalDmg = Math.round(baseDmg);
   
   target.hp = Math.max(0, target.hp - finalDmg);
   logBattleEvent(state, 'Unit suffered damage', 'damage', target.id, attacker.id, finalDmg, isCrit);
   if (target.hp === 0) runDefeatHooks(state, target);

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



customSquadPassives.push((state) => {
   ['player', 'enemy'].forEach(team => {
      const squad = team === 'player' ? state.playerTeam : state.enemyTeam;
      
      const leader = squad.find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
      if (leader && leader.characterId === 'hunter') {
          squad.forEach(u => {
              if (u.tags.includes('Bad Batch') || checkHasTag(u, 'Bad Batch')) {
                  u.speed += 25;
                  u.maxHp = Math.round(u.maxHp * 1.20);
                  u.hp = u.maxHp;
                  u.offense = Math.round(u.offense * 1.20);
              }
          });
      } else if (leader && leader.characterId === 'crosshair_bb') {
          squad.forEach(u => {
              if (u.tags.includes('Bad Batch') || checkHasTag(u, 'Bad Batch')) {
                  u.speed += 20;
                  u.critDamage += 0.30;
              }
          });
      }

      const hunter = squad.find(u => u.characterId === 'hunter' && u.activeInBattle && u.hp > 0);
      if (hunter && !hunter.statuses.some(s => s.name === 'Hypervigilance Disorder')) {
         applyStatus(state, hunter, 'Hypervigilance Disorder', 99, false);
      }
      const wrecker = squad.find(u => u.characterId === 'wrecker' && u.activeInBattle && u.hp > 0);
      if (wrecker && !wrecker.statuses.some(s => s.name === 'Impulse Control Disorder')) {
         applyStatus(state, wrecker, 'Impulse Control Disorder', 99, false);
      }
      const tech = squad.find(u => u.characterId === 'tech_bb' && u.activeInBattle && u.hp > 0);
      if (tech && !tech.statuses.some(s => s.name === 'Obsessive Analysis Disorder')) {
         applyStatus(state, tech, 'Obsessive Analysis Disorder', 99, false);
      }
      const echo = squad.find(u => u.characterId === 'echo_bb' && u.activeInBattle && u.hp > 0);
      if (echo && !echo.statuses.some(s => s.name === 'Identity Disorder')) {
         applyStatus(state, echo, 'Identity Disorder', 99, false);
      }
      const cross = squad.find(u => u.characterId === 'crosshair_bb' && u.activeInBattle && u.hp > 0);
      if (cross && !cross.statuses.some(s => s.name === 'Paranoia Disorder')) {
         applyStatus(state, cross, 'Paranoia Disorder', 99, false);
      }
      const omega = squad.find(u => u.characterId === 'omega' && u.activeInBattle && u.hp > 0);
      if (omega && !omega.statuses.some(s => s.name === 'Attachment Disorder')) {
         applyStatus(state, omega, 'Attachment Disorder', 99, false);
      }
      const batcher = squad.find(u => u.characterId === 'batcher' && u.activeInBattle && u.hp > 0);
      if (batcher && !batcher.statuses.some(s => s.name === 'No Disorder')) {
         applyStatus(state, batcher, 'No Disorder', 99, false);
      }
   });
});

customTurnStartHooks['omega'] = (state, unit) => {
   const allies = unit.team === 'player' ? state.playerTeam : state.enemyTeam;
   const bbAllies = allies.filter(a => (a.tags.includes('Bad Batch') || checkHasTag(a, 'Bad Batch')) && a.activeInBattle && a.hp > 0);
   if (bbAllies.length > 0) {
       const target = bbAllies[Math.floor(Math.random() * bbAllies.length)];
       target.hp = Math.min(target.maxHp, target.hp + Math.round(target.maxHp * 0.05));
       logBattleEvent(state, `💖 The Heart Of The Squad: ${target.name} recovers 5% Health!`, 'heal');
   }
};

customDefeatHooks['wrecker'] = (state, defeated, attacker) => {
   const allies = defeated.team === 'player' ? state.playerTeam : state.enemyTeam;
   allies.forEach(a => {
       if ((a.tags.includes('Bad Batch') || checkHasTag(a, 'Bad Batch')) && a.activeInBattle && a.hp > 0) {
           applyStatus(state, a, 'Offense Up', 2, false);
       }
   });
   logBattleEvent(state, `💥 I Like Explosions: Wrecker is defeated, Bad Batch allies gain Offense Up!`, 'buff');
};

customDefeatHooks['batcher'] = (state, defeated, attacker) => {
   // The passive actually says "Whenever Batcher defeats an enemy: All Bad Batch allies recover 10% Health."
   // This hook is for when BATCHER is defeated. So this is the wrong hook! I will leave it empty.
};


// ==========================================
// APPO 501ST
// ==========================================
customAbilityHandlers['appo_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, explicitTargetAlly ? explicitTargetAlly.id : undefined, assistDepth, counterDepth);
    
    applyStatus(state, attacker, 'Momentum', 99, false, attacker, 1);
    
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    const activeAllies = allies.filter(a => a.activeInBattle && a.hp > 0);
    if (activeAllies.length > 0) {
        const weakest = activeAllies.sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp))[0];
        if (!hasStatusFlag(weakest, 'prevent_prot_recovery')) {
            const rec = Math.round(weakest.maxProtection * 0.05);
            weakest.protection = Math.min(weakest.maxProtection, weakest.protection + rec);
            logBattleEvent(state, `🛡️ Appo's Basic: ${weakest.name} recovers 5% Protection!`, 'heal');
        }
    }
};

customAbilityHandlers['appo_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, explicitTargetAlly ? explicitTargetAlly.id : undefined, assistDepth, counterDepth);
    
    applyStatus(state, attacker, 'Momentum', 99, false, attacker, 2);
    
    const momentum = attacker.statuses.find(s => s.name === 'Momentum');
    if (momentum && momentum.count >= 5) {
        momentum.count -= 5;
        if (momentum.count <= 0) {
            attacker.statuses = attacker.statuses.filter(s => s.name !== 'Momentum');
        }
        if (explicitTargetAlly && !hasStatusFlag(explicitTargetAlly, 'prevent_tm_gain')) {
            explicitTargetAlly.turnMeter = Math.min(100, explicitTargetAlly.turnMeter + 15);
            logBattleEvent(state, `⏩ Appo consumes 5 Momentum! ${explicitTargetAlly.name} gains 15% TM!`, 'buff');
        }
    }
};

customAbilityHandlers['appo_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, explicitTargetAlly ? explicitTargetAlly.id : undefined, assistDepth, counterDepth);
    
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
        logBattleEvent(state, `🛡️ Appo consumes 10 Momentum! Allies recover 15% Protection!`, 'heal');
    }
};

// ==========================================
// COMMANDER APPO (KNIGHTFALL)
// ==========================================
customAbilityHandlers['appo_m_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const hadOrder66 = target.statuses.some(s => s.name === 'Order 66');
    const dummyAbility = { ...ability, id: ability.id + '_base', effects: ability.effects.filter(e => e !== 'assist') };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, explicitTargetAlly ? explicitTargetAlly.id : undefined, assistDepth, counterDepth);
    
    if (hadOrder66) {
        const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
        const kfAllies = allies.filter(a => a.activeInBattle && a.hp > 0 && a.id !== attacker.id && (a.tags.includes('Knightfall') || checkHasTag(a, 'Knightfall')));
        if (kfAllies.length > 0) {
            const assistAlly = kfAllies[Math.floor(Math.random() * kfAllies.length)];
            logBattleEvent(state, `🤝 Knightfall Protocol: ${assistAlly.name} assists Appo!`, 'info');
            const basic = assistAlly.abilities.find(a => a.type === 'basic');
            if (basic) executeCombatAction(state, assistAlly.id, basic, target.id, undefined, assistDepth + 1, counterDepth);
        }
    }
};

customAbilityHandlers['appo_m_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, explicitTargetAlly ? explicitTargetAlly.id : undefined, assistDepth, counterDepth);
    // Commander Appo gains 25% Turn Meter. All enemies gain 2 stacks of Order 66 (handled by base). Dramatic Entrance handled.
    if (!hasStatusFlag(attacker, 'prevent_tm_gain')) {
        attacker.turnMeter = Math.min(100, attacker.turnMeter + 25);
    }
};

customAbilityHandlers['appo_m_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    // Inflict 3 stacks of Order 66 and 2 stacks of Purge on all enemies. Call all Knightfall allies to assist target enemy. If target reaches 10 stacks of Order 66: Consume all Order 66. Inflict Ability Block, Healing Immunity, and Exposed for 2 turns.
    const dummyAbility = { ...ability, id: ability.id + '_base', effects: ability.effects.filter(e => e !== 'assist') };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, explicitTargetAlly ? explicitTargetAlly.id : undefined, assistDepth, counterDepth);
    
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    const kfAllies = allies.filter(a => a.activeInBattle && a.hp > 0 && a.id !== attacker.id && (a.tags.includes('Knightfall') || checkHasTag(a, 'Knightfall')));
    kfAllies.forEach(assistAlly => {
        logBattleEvent(state, `🤝 ${assistAlly.name} assists (Operation Knightfall)!`, 'info');
        const basic = assistAlly.abilities.find(a => a.type === 'basic');
        if (basic) executeCombatAction(state, assistAlly.id, basic, target.id, undefined, assistDepth + 1, counterDepth);
    });

    const o66 = target.statuses.find(s => s.name === 'Order 66');
    if (o66 && o66.count >= 10) {
        target.statuses = target.statuses.filter(s => s.name !== 'Order 66');
        applyStatus(state, target, 'Ability Block', 2, true, attacker);
        applyStatus(state, target, 'Healing Immunity', 2, true, attacker);
        applyStatus(state, target, 'Exposed', 2, true, attacker);
        logBattleEvent(state, `🔥 Target reached 10 stacks of Order 66! Consuming and inflicting debuffs!`, 'debuff');
    }
};

// ==========================================
// KNIGHTFALL COMMANDER
// ==========================================
customAbilityHandlers['kfc_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, explicitTargetAlly ? explicitTargetAlly.id : undefined, assistDepth, counterDepth);
};

customAbilityHandlers['kfc_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, explicitTargetAlly ? explicitTargetAlly.id : undefined, assistDepth, counterDepth);
};

customAbilityHandlers['kfc_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, explicitTargetAlly ? explicitTargetAlly.id : undefined, assistDepth, counterDepth);
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
        logBattleEvent(state, `${target.name} suffered ${finalDmg} damage (Fox ignores Protection!).`, 'damage', target.id, attacker.id, finalDmg, isCrit);
        applyStatus(state, target, 'Order 66', 2, true, attacker, 2);
        if (target.hp === 0) runDefeatHooks(state, target);
    } else {
        const dummyAbility = { ...ability, id: ability.id + '_base' };
        executeCombatAction(state, attacker.id, dummyAbility, target.id, explicitTargetAlly ? explicitTargetAlly.id : undefined, assistDepth, counterDepth);
    }
};

customAbilityHandlers['fox_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    // Consume Order 66, deal massive + bonus damage
    const dummyAbility = { ...ability, id: ability.id + '_base', effects: ability.effects.filter(e => e !== 'damage') };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, explicitTargetAlly ? explicitTargetAlly.id : undefined, assistDepth, counterDepth);
    
    
    const o66 = target.statuses.find(s => s.name === 'Order 66');
    const stacks = o66 ? o66.count : 0;
    target.statuses = target.statuses.filter(s => s.name !== 'Order 66');
    
    if (stacks > 0) {
        const squad = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
        const scorch = squad.find(u => u.characterId === 'scorch_knightfall' && u.activeInBattle && u.hp > 0);
        if (scorch) {
            logBattleEvent(state, `💥 Order 66 Consumed! Scorch assists ${attacker.name}!`, 'info');
            const basic = scorch.abilities.find(a => a.type === 'basic');
            if (basic) executeCombatAction(state, scorch.id, basic, target.id, undefined, assistDepth + 1, counterDepth);
        }
    }

    
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
    
    logBattleEvent(state, `${target.name} suffered ${finalDmg} damage (Consumed ${stacks} stacks of Order 66!).`, 'damage', target.id, attacker.id, finalDmg, isCrit);
    
    if (target.hp === 0) {
        runDefeatHooks(state, target);
        // "Enemy defeated by this attack cannot be revived."
        if (!target.dynamicState) target.dynamicState = {};
        target.dynamicState.preventRevive = true;
    }
};

customAbilityHandlers['fox_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, explicitTargetAlly ? explicitTargetAlly.id : undefined, assistDepth, counterDepth);
};

// ==========================================
// CROSSHAIR IMPERIAL
// ==========================================
customAbilityHandlers['cross_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, explicitTargetAlly ? explicitTargetAlly.id : undefined, assistDepth, counterDepth);
};

customAbilityHandlers['cross_special'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, explicitTargetAlly ? explicitTargetAlly.id : undefined, assistDepth, counterDepth);
    
    if (target.statuses.some(s => s.name === 'Pursued')) {
        logBattleEvent(state, `🎯 Crosshair attacks again (Target is Pursued)!`, 'info');
        executeCombatAction(state, attacker.id, dummyAbility, target.id, explicitTargetAlly ? explicitTargetAlly.id : undefined, assistDepth + 1, counterDepth);
    }
};

customAbilityHandlers['cross_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, explicitTargetAlly ? explicitTargetAlly.id : undefined, assistDepth, counterDepth);
};

// ==========================================
// SCORCH KNIGHTFALL
// ==========================================
customAbilityHandlers['scorch_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, explicitTargetAlly ? explicitTargetAlly.id : undefined, assistDepth, counterDepth);
};
customAbilityHandlers['scorch_special'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, explicitTargetAlly ? explicitTargetAlly.id : undefined, assistDepth, counterDepth);
};
customAbilityHandlers['scorch_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    // Consume Purge, deal bonus damage
    const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
    
    enemies.forEach(e => {
        if (!e.activeInBattle || e.hp <= 0) return;
        
        const purge = e.statuses.find(s => s.name === 'Purge');
        const stacks = purge ? purge.count : 0;
        e.statuses = e.statuses.filter(s => s.name !== 'Purge');
        
        if (stacks > 0 && e.id === target.id) {
            const squad = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
            const fox = squad.find(u => u.characterId === 'commander_fox' && u.activeInBattle && u.hp > 0);
            if (fox) {
                logBattleEvent(state, `💥 Purge Consumed! Commander Fox assists ${attacker.name}!`, 'info');
                const basic = fox.abilities.find(a => a.type === 'basic');
                if (basic) executeCombatAction(state, fox.id, basic, target.id, undefined, assistDepth + 1, counterDepth);
            }
        }

        
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
        
        logBattleEvent(state, `${e.name} suffered ${finalDmg} AoE damage (Consumed ${stacks} stacks of Purge!).`, 'damage', e.id, attacker.id, finalDmg, isCrit);
        if (e.hp === 0) runDefeatHooks(state, e);
    });
};

// ==========================================
// GL LORD VADER
// ==========================================
customAbilityHandlers['lv_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, explicitTargetAlly ? explicitTargetAlly.id : undefined, assistDepth, counterDepth);
    
    if (target.statuses.some(s => s.name === 'Purge')) {
        logBattleEvent(state, `🗡️ Lord Vader attacks again (Target has Purge)!`, 'info');
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
        logBattleEvent(state, `${target.name} suffered ${finalDmg} follow-up damage.`, 'damage', target.id, attacker.id, finalDmg, false);
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
    
    executeCombatAction(state, attacker.id, dummyAbility, target.id, explicitTargetAlly ? explicitTargetAlly.id : undefined, assistDepth, counterDepth);
    
    if (hadPurge && !hasStatusFlag(attacker, 'prevent_prot_recovery')) {
        const rec = Math.round(attacker.maxProtection * 0.20);
        attacker.protection = Math.min(attacker.maxProtection, attacker.protection + rec);
        logBattleEvent(state, `🛡️ Lord Vader recovers 20% Protection (Purge on enemy)!`, 'heal');
    }
};

customAbilityHandlers['lv_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base', effects: ability.effects.filter(e => e !== 'assist') };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, explicitTargetAlly ? explicitTargetAlly.id : undefined, assistDepth, counterDepth);
    
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
    
    const kfAllies = allies.filter(a => a.activeInBattle && a.hp > 0 && a.id !== attacker.id && (a.tags.includes('Knightfall') || checkHasTag(a, 'Knightfall')));
    kfAllies.forEach(assistAlly => {
        logBattleEvent(state, `🤝 ${assistAlly.name} assists Lord Vader!`, 'info');
        const basic = assistAlly.abilities.find(a => a.type === 'basic');
        if (basic) executeCombatAction(state, assistAlly.id, basic, target.id, undefined, assistDepth + 1, counterDepth);
    });

    if (allies.some(a => a.characterId === 'commander_appo' && a.activeInBattle && a.hp > 0)) {
        enemies.forEach(e => {
            if (e.activeInBattle && e.hp > 0 && !hasStatusFlag(e, 'prevent_tm_gain')) { // Using prevent_tm_gain for simplicity
                e.turnMeter = Math.max(0, e.turnMeter - 25);
                logBattleEvent(state, `📉 ${e.name} loses 25% TM (Appo present)!`, 'debuff');
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
    logBattleEvent(state, `🌋 Lord Vader Activates EXECUTE ORDER 66!`, 'ultimate');
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
    executeCombatAction(state, attacker.id, dummyAbility, target.id, explicitTargetAlly ? explicitTargetAlly.id : undefined, assistDepth, counterDepth);
};
customAbilityHandlers['fox_s2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, explicitTargetAlly ? explicitTargetAlly.id : undefined, assistDepth, counterDepth);
    const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
    enemies.forEach(e => {
        if (e.activeInBattle && e.hp > 0 && e.statuses.some(s => s.name === 'Lockdown')) {
            e.turnMeter = Math.max(0, e.turnMeter - 10);
        }
    });
};



customSquadPassives.push((state) => {
   ['player', 'enemy'].forEach(team => {
      const squad = team === 'player' ? state.playerTeam : state.enemyTeam;
      
      const lv = squad.find(u => u.characterId === 'gl_lord_vader' && u.activeInBattle && u.hp > 0);
      if (lv) {
          applyStatus(state, lv, 'Taunt', 1, false);
          squad.forEach(u => {
              if (u.tags.includes('Knightfall') || checkHasTag(u, 'Knightfall')) {
                  applyStatus(state, u, 'Dramatic Entrance', 1, false);
              }
          });
          
          const appo = squad.some(u => u.characterId === 'commander_appo' && u.activeInBattle && u.hp > 0);
          if (appo) {
              squad.forEach(u => {
                  if (u.tags.includes('Knightfall') || checkHasTag(u, 'Knightfall')) {
                      if (!u.dynamicState) u.dynamicState = {};
                      u.dynamicState.immuneToFear = true;
                  }
              });
          }
          const fox = squad.some(u => u.characterId === 'commander_fox' && u.activeInBattle && u.hp > 0);
          if (fox) {
              if (!lv.dynamicState) lv.dynamicState = {};
              lv.dynamicState.ignoreProtectionO66 = true;
          }
          const cross = squad.some(u => u.characterId === 'crosshair_imperial' && u.activeInBattle && u.hp > 0);
          if (cross) {
              if (!lv.dynamicState) lv.dynamicState = {};
              lv.dynamicState.noEvade = true;
          }
          const kfc = squad.some(u => u.characterId === 'knightfall_commander' && u.activeInBattle && u.hp > 0);
          if (kfc) {
              lv.defense = Math.round(lv.defense * 1.30);
              lv.tenacity += 0.30;
          }
      }
      
      const appo_m_leader = squad.find(u => u.position === 0 && u.characterId === 'commander_appo' && u.activeInBattle && u.hp > 0);
      if (appo_m_leader) {
          squad.forEach(u => {
              if (u.tags.includes('Knightfall') || checkHasTag(u, 'Knightfall')) {
                  u.speed += 35;
                  u.offense = Math.round(u.offense * 1.30);
              }
          });
      }
      
      const fox_riot_leader = squad.find(u => u.position === 0 && u.characterId === 'commander_fox_riot' && u.activeInBattle && u.hp > 0);
      if (fox_riot_leader) {
          squad.forEach(u => {
              if (u.tags.includes('Coruscant Guard') || checkHasTag(u, 'Coruscant Guard')) {
                  u.maxHp = Math.round(u.maxHp * 1.25);
                  u.hp = u.maxHp;
                  u.defense = Math.round(u.defense * 1.20);
              }
          });
      }
      
      // Fox riot unique
      const fox_riot = squad.find(u => u.characterId === 'commander_fox_riot' && u.activeInBattle && u.hp > 0);
      if (fox_riot && fox_riot.statuses.some(s => s.name === 'Taunt')) {
          squad.forEach(u => {
              if (u.tags.includes('Coruscant Guard') || checkHasTag(u, 'Coruscant Guard')) {
                  u.defense = Math.round(u.defense * 1.10);
              }
          });
      }
   });
});

customTurnStartHooks['appo_501st'] = (state, unit) => {
   const allies = unit.team === 'player' ? state.playerTeam : state.enemyTeam;
   const leader = allies.find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
   if (leader && leader.statuses.some(s => s.name === 'Fatigued')) {
       // Gain bonus turn
       if (!unit.dynamicState?.fatigueBonusTurn) {
           if (!unit.dynamicState) unit.dynamicState = {};
           unit.dynamicState.fatigueBonusTurn = true;
           unit.turnMeter = 100;
           logBattleEvent(state, `⏩ Appo gains a Bonus Turn (Leader is Fatigued)!`, 'buff');
       }
   }
};


// ==========================================
// MORVEK SURVIVORS (NEW REPUBLIC ERA)
// ==========================================

// WARLORD DRAKE VOSS
customAbilityHandlers['drake_voss_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
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
        logBattleEvent(state, `🔫 Voss attacks again (Entrenched)! ${target.name} suffered ${finalDmg} damage.`, 'damage', target.id, attacker.id, finalDmg, isCrit);
        if (target.hp === 0) runDefeatHooks(state, target);
    }
};

customAbilityHandlers['drake_voss_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    allies.forEach(a => {
        if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Morvek Survivor') || checkHasTag(a, 'Morvek Survivor'))) {
            a.hp = Math.min(a.maxHp, a.hp + Math.round(a.maxHp * 0.10));
        }
    });
    logBattleEvent(state, `🛡️ Morvek Survivors recover 10% Health!`, 'heal');
};

customAbilityHandlers['drake_voss_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
};

// MIRE TALON
customAbilityHandlers['mire_talon_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    if (attacker.statuses.some(s => s.name === 'Stealth')) {
        applyStatus(state, target, 'Healing Immunity', 2, true, attacker);
    }
};

customAbilityHandlers['mire_talon_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    if (target.statuses.some(s => s.name === 'Battlefield Corruption')) {
        logBattleEvent(state, `🔪 Talon attacks again (Target has Battlefield Corruption)!`, 'info');
        const basic = attacker.abilities.find(a => a.type === 'basic');
        if (basic) executeCombatAction(state, attacker.id, basic, target.id, undefined, assistDepth + 1, counterDepth);
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
    logBattleEvent(state, `${target.name} suffered ${finalDmg} damage from No Man's Land.`, 'damage', target.id, attacker.id, finalDmg, isCrit);
    
    applyStatus(state, target, 'Battlefield Corruption', 3, true, attacker);
    if (target.hp === 0) runDefeatHooks(state, target);
};

// TORR KANE
customAbilityHandlers['torr_kane_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    if (Math.random() <= 0.50) {
        applyStatus(state, target, 'Suppressed', 1, true, attacker);
    }
};
customAbilityHandlers['torr_kane_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    const activeAllies = allies.filter(a => a.activeInBattle && a.hp > 0);
    if (activeAllies.length > 0) {
        const weakest = activeAllies.sort((a,b) => (a.hp / a.maxHp) - (b.hp / b.maxHp))[0];
        applyStatus(state, weakest, 'Defense Up', 2, false, attacker);
    }
};
customAbilityHandlers['torr_kane_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
};

// ASHEN VEIL
customAbilityHandlers['ashen_veil_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    const activeAllies = allies.filter(a => a.activeInBattle && a.hp > 0);
    if (activeAllies.length > 0) {
        const randomAlly = activeAllies[Math.floor(Math.random() * activeAllies.length)];
        randomAlly.hp = Math.min(randomAlly.maxHp, randomAlly.hp + Math.round(randomAlly.maxHp * 0.05));
        logBattleEvent(state, `💉 ${randomAlly.name} recovers 5% Health (Combat Stimulants)!`, 'heal');
    }
};
customAbilityHandlers['ashen_veil_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, explicitTargetAlly?.id, assistDepth, counterDepth);
    if (explicitTargetAlly) {
        explicitTargetAlly.hp = Math.min(explicitTargetAlly.maxHp, explicitTargetAlly.hp + Math.round(explicitTargetAlly.maxHp * 0.25));
        logBattleEvent(state, `💉 ${explicitTargetAlly.name} recovers 25% Health!`, 'heal');
    }
};
customAbilityHandlers['ashen_veil_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
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
    logBattleEvent(state, `${target.name} suffered ${finalDmg} damage${isBelow50 ? ' (Bonus from Low Health!)' : ''}.`, 'damage', target.id, attacker.id, finalDmg, isCrit);
    if (target.hp === 0) runDefeatHooks(state, target);
};
customAbilityHandlers['hollow_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    attacker.hp = Math.max(1, attacker.hp - Math.round(attacker.maxHp * 0.10));
    logBattleEvent(state, `🔥 Hollow sacrifices 10% Health for Ash Rage!`, 'info');
    
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
};
customAbilityHandlers['hollow_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    if (target.statuses.some(s => s.name === 'Battlefield Corruption')) {
        applyStatus(state, target, 'Defense Down', 2, true, attacker);
    }
};



// ==========================================
// AVALANCHE REMNANT (IMPERIAL REMNANT)
// ==========================================

// COMMANDER VOREN
customAbilityHandlers['voren_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    if (target.statuses.some(s => s.name === 'Frostbite')) {
        reduceTurnMeter(state, target, 5);
    }
};
customAbilityHandlers['voren_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
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
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    enemies.forEach(e => {
        if (e.activeInBattle && e.hp > 0 && frostbittenBefore.includes(e.id)) {
            applyStatus(state, e, 'Speed Down', 2, true, attacker);
        }
    });
};

// CAPTAIN RIME
customAbilityHandlers['rime_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    if (Math.random() <= 0.50) {
        applyStatus(state, target, 'Speed Down', 2, true, attacker);
    }
};
customAbilityHandlers['rime_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, explicitTargetAlly?.id, assistDepth, counterDepth);
    
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    const activeAllies = allies.filter(a => a.activeInBattle && a.hp > 0 && (a.tags.includes('Avalanche Remnant') || checkHasTag(a, 'Avalanche Remnant')));
    if (activeAllies.length > 0) {
        const weakest = activeAllies.sort((a,b) => (a.hp / a.maxHp) - (b.hp / b.maxHp))[0];
        applyStatus(state, weakest, 'Whiteout', 2, false, attacker);
    }
};
customAbilityHandlers['rime_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
    enemies.forEach(e => {
        if (e.activeInBattle && e.hp > 0 && e.statuses.some(s => s.name === 'Frostbite')) {
            reduceTurnMeter(state, e, 15);
        }
    });
};

// GLAZE
customAbilityHandlers['glaze_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
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
    logBattleEvent(state, `${target.name} suffered ${finalDmg} Massive damage from Icebreaker Round.`, 'damage', target.id, attacker.id, finalDmg, isCrit);
    
    if (hasFrostbite) {
        applyStatus(state, target, 'Exposed', 1, true, attacker);
    }
    
    if (target.hp === 0) {
        if (!hasStatusFlag(attacker, 'prevent_prot_recovery')) {
            attacker.protection = Math.min(attacker.maxProtection, attacker.protection + Math.round(attacker.maxProtection * 0.50));
            logBattleEvent(state, `🛡️ Glaze defeats an enemy! Recovers 50% Protection!`, 'heal');
        }
        runDefeatHooks(state, target);
    }
};
customAbilityHandlers['glaze_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
};

// HAIL
customAbilityHandlers['hail_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    if (Math.random() <= 0.50) {
        applyStatus(state, target, 'Frostbite', 1, true, attacker);
    }
};
customAbilityHandlers['hail_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    if (!attacker.dynamicState) attacker.dynamicState = {};
    attacker.dynamicState.hailCounterFrostbite = true;
};
customAbilityHandlers['hail_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
    enemies.forEach(e => {
        if (e.activeInBattle && e.hp > 0) {
            let reduction = 5;
            if (e.statuses.some(s => s.name === 'Frostbite')) {
                reduction += 5;
            }
            reduceTurnMeter(state, e, reduction);
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
    logBattleEvent(state, `${target.name} suffered ${finalDmg} Special Damage${isFrostbitten ? ' (Bonus vs Frostbite!)' : ''}.`, 'damage', target.id, attacker.id, finalDmg, isCrit);
    
    if (target.hp === 0) {
        Object.keys(attacker.cooldowns).forEach(key => { if (attacker.cooldowns[key] > 0) attacker.cooldowns[key]--; });
        logBattleEvent(state, `⏳ Frostburn defeats an enemy! Cooldowns reduced!`, 'buff');
        runDefeatHooks(state, target);
    }
};
customAbilityHandlers['frostburn_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
    enemies.forEach(e => {
        if (e.activeInBattle && e.hp > 0) {
            const frostbite = e.statuses.find(s => s.name === 'Frostbite');
            if (frostbite) {
                e.statuses = e.statuses.filter(s => s.name !== 'Frostbite');
                logBattleEvent(state, `💥 Frostburn consumes Frostbite from ${e.name}!`, 'info');
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
        logBattleEvent(state, `${target.name} suffered ${finalDmg} Massive damage (Consumed ${stacks} stacks of Frostbite!).`, 'damage', target.id, attacker.id, finalDmg, isCrit);
        
        if (!hasStatusFlag(attacker, 'prevent_tm_gain')) {
            attacker.turnMeter = Math.min(100, attacker.turnMeter + 5);
        }
        
        if (target.hp === 0) runDefeatHooks(state, target);
    } else {
        const dummyAbility = { ...ability, id: ability.id + '_base' };
        executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    }
};



customSquadPassives.push((state) => {
   ['player', 'enemy'].forEach(team => {
      const squad = team === 'player' ? state.playerTeam : state.enemyTeam;
      
      const voss_leader = squad.find(u => u.position === 0 && u.characterId === 'warlord_drake_voss' && u.activeInBattle && u.hp > 0);
      if (voss_leader) {
          squad.forEach(u => {
              if (u.tags.includes('Morvek Survivor') || checkHasTag(u, 'Morvek Survivor')) {
                  u.maxHp = Math.round(u.maxHp * 1.20);
                  u.hp = u.maxHp;
                  u.defense = Math.round(u.defense * 1.30);
              }
          });
      }
      
      const voss = squad.find(u => u.characterId === 'warlord_drake_voss' && u.activeInBattle && u.hp > 0);
      if (voss) {
          if (!voss.dynamicState) voss.dynamicState = {};
          voss.dynamicState.immuneToFear = true;
          voss.dynamicState.immuneToDaze = true;
      }
      
      const voren_leader = squad.find(u => u.position === 0 && u.characterId === 'commander_voren' && u.activeInBattle && u.hp > 0);
      if (voren_leader) {
          squad.forEach(u => {
              if (u.tags.includes('Avalanche Remnant') || checkHasTag(u, 'Avalanche Remnant')) {
                  u.maxProtection = Math.round(u.maxProtection * 1.20);
                  u.protection = u.maxProtection;
                  u.defense = Math.round(u.defense * 1.30);
              }
          });
      }
      
      // While any Avalanche Remnant ally has Whiteout, all Avalanche Remnant allies gain 15% Defense. (Can do in combatEngine.ts getModifiedStats, but simpler to apply dynamically or skip. We'll do it in getModifiedStats)
   });
});

// Helper to consume Dossier
export function consumeDossier(state: CombatState, unit: CombatUnit, countToConsume: number, attacker: CombatUnit) {
    const dossier = unit.statuses.find(s => s.name === 'Dossier');
    if (!dossier) return;

    const currentCount = dossier.count || 1;
    const consumed = Math.min(currentCount, countToConsume);
    const newCount = currentCount - consumed;

    if (newCount <= 0) {
        unit.statuses = unit.statuses.filter(s => s.name !== 'Dossier');
    } else {
        dossier.count = newCount;
    }

    logBattleEvent(state, `📁 Dossier Consumed: ${unit.name} lost ${consumed} stack(s) of Dossier!`, 'info');

    const opposingSquad = unit.team === 'player' ? state.enemyTeam : state.playerTeam;
    
    // 1. Leader: Whenever Dossier is consumed, ISB allies gain 5% Turn Meter
    const krennicLead = opposingSquad.find(u => u.characterId === 'director_krennic' && u.position === 0 && u.activeInBattle && u.hp > 0);
    if (krennicLead) {
        opposingSquad.forEach(u => {
            if (u.activeInBattle && u.hp > 0 && (u.tags.includes('ISB') || checkHasTag(u, 'ISB'))) {
                if (!hasStatusFlag(u, 'prevent_tm_gain')) {
                    u.turnMeter = Math.min(100, u.turnMeter + 5);
                }
            }
        });
        logBattleEvent(state, `🛡️ Total Surveillance: ISB allies gain 5% Turn Meter from Dossier consumption!`, 'buff');
    }

    // 2. Unique 2: Whenever Dossier is consumed, Krennic gains 5% Turn Meter
    const krennic = opposingSquad.find(u => u.characterId === 'director_krennic' && u.activeInBattle && u.hp > 0);
    if (krennic && krennic.position !== 0) {
        if (!hasStatusFlag(krennic, 'prevent_tm_gain')) {
            krennic.turnMeter = Math.min(100, krennic.turnMeter + 5);
            logBattleEvent(state, `🛡️ Fear Through Information: Director Krennic gains 5% Turn Meter!`, 'buff');
        }
    }

    // 3. Death Trooper Reinforcement: Whenever Dossier is consumed, gain Offense Up (2 turns)
    const dtr = opposingSquad.find(u => u.characterId === 'death_trooper_reinforcement' && u.activeInBattle && u.hp > 0);
    if (dtr) {
        applyStatus(state, dtr, 'Offense Up', 2, false, attacker);
    }
}

customAbilityHandlers['krennic_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    const hasDossier = target.statuses.some(s => s.name === 'Dossier');
    applyStatus(state, target, 'Dossier', 99, true, attacker, 1);
    if (hasDossier) {
        reduceTurnMeter(state, target, 5, attacker);
    }
};

customAbilityHandlers['krennic_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    const dtr = allies.find(u => u.characterId === 'death_trooper_reinforcement' && u.activeInBattle && u.hp > 0);
    if (!dtr) {
        logBattleEvent(state, `📣 Asset Deployment: Director Krennic summons Death Trooper Reinforcement!`, 'info');
        triggerSummon(state, attacker, 'death_trooper_reinforcement');
    } else {
        const basic = dtr.abilities.find(a => a.type === 'basic');
        if (basic) {
            logBattleEvent(state, `📣 Asset Deployment: Calling Death Trooper Reinforcement to assist!`, 'info');
            executeCombatAction(state, dtr.id, basic, target.id, undefined, (assistDepth || 0) + 1, counterDepth);
        }
    }
};

customAbilityHandlers['krennic_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
    
    enemies.forEach(e => {
        if (e.activeInBattle && e.hp > 0) {
            applyStatus(state, e, 'Dossier', 99, true, attacker, 2);
            
            const hasDossier = e.statuses.some(s => s.name === 'Dossier');
            if (hasDossier) {
                reduceTurnMeter(state, e, 10, attacker);
            }
            
            const dossier = e.statuses.find(s => s.name === 'Dossier');
            if (dossier && dossier.count >= 5) {
                applyStatus(state, e, 'Ability Block', 1, true, attacker);
            }
        }
    });
};

customAbilityHandlers['dtr_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const hasDossier = target.statuses.some(s => s.name === 'Dossier');
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    
    if (hasDossier) {
        const origOff = attacker.offense;
        attacker.offense = Math.round(attacker.offense * 1.20);
        executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
        attacker.offense = origOff;
    } else {
        executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    }
};

customAbilityHandlers['dtr_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dossier = target.statuses.find(s => s.name === 'Dossier');
    const stacksBefore = dossier ? dossier.count || 1 : 0;
    const stacksConsumed = Math.min(stacksBefore, 3);
    
    if (stacksConsumed > 0) {
        consumeDossier(state, target, stacksConsumed, attacker);
    }
    
    const attStats = getModifiedStats(attacker, attacker.team === 'player' ? state.playerTeam : state.enemyTeam);
    let mult = 2.5 + (0.20 * stacksConsumed);
    let baseDmg = attStats.offense * mult;
    if (isCrit) baseDmg *= attStats.critDamage;
    const finalDmg = Math.round(baseDmg);
    
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
    
    logBattleEvent(state, `💥 Termination Order: ${target.name} suffered ${finalDmg} Heavy damage (Consumed ${stacksConsumed} stacks of Dossier!).`, 'damage', target.id, attacker.id, finalDmg, isCrit);
    if (target.hp === 0) runDefeatHooks(state, target);
};

customAbilityHandlers['dtr_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
    enemies.forEach(e => {
        if (e.activeInBattle && e.hp > 0) {
            applyStatus(state, e, 'Daze', 2, true, attacker);
            if (e.statuses.some(s => s.name === 'Dossier')) {
                reduceTurnMeter(state, e, 5, attacker);
            }
        }
    });
};

// ==========================================
// MAJOR PARTAGAZ ABILITY HANDLERS
// ==========================================
customAbilityHandlers['partagaz_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    applyStatus(state, target, 'Dossier', 99, true, attacker, 1);
};

customAbilityHandlers['partagaz_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    const enemies = target.team === 'player' ? state.playerTeam : state.enemyTeam;
    enemies.forEach(e => {
        if (e.activeInBattle && e.hp > 0) {
            const hasDossier = e.statuses.some(s => s.name === 'Dossier');
            applyStatus(state, e, 'Dossier', 99, true, attacker, 1);
            if (hasDossier) {
                reduceTurnMeter(state, e, 15, attacker);
            }
        }
    });
};

customAbilityHandlers['partagaz_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const hasDossier = target.statuses.some(s => s.name === 'Dossier');
    applyStatus(state, target, 'Dossier', 99, true, attacker, 2);
    if (hasDossier && target.activeInBattle && target.hp > 0) {
        applyStatus(state, target, 'Ability Block', 2, true, attacker);
    }
};

// ==========================================
// DEATH TROOPER ABILITY HANDLERS
// ==========================================
customAbilityHandlers['deathtrooper_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const hasDossier = target.statuses.some(s => s.name === 'Dossier');
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    
    const origCC = attacker.critChance;
    if (hasDossier) {
        attacker.critChance = 999;
    }
    
    // First hit
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    // 50% chance to attack again
    if (Math.random() < 0.50 && target.hp > 0 && target.activeInBattle) {
        logBattleEvent(state, `🔫 Suppressive Fire: Death Trooper attacks again!`, 'info');
        executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, (assistDepth || 0) + 1, counterDepth);
    }
    
    attacker.critChance = origCC;
};

customAbilityHandlers['deathtrooper_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const hasDossier = target.statuses.some(s => s.name === 'Dossier');
    if (hasDossier) {
        target.statuses = target.statuses.filter(s => s.isDebuff || s.name === 'Dossier' || s.name === 'Imperial Decree');
        logBattleEvent(state, `🛡️ Dispel: Death Trooper removed all buffs from ${target.name}!`, 'info');
    }
    
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    if (hasDossier && target.activeInBattle && target.hp > 0) {
        applyStatus(state, target, 'Deathmark', 2, true, attacker);
    }
};

customAbilityHandlers['deathtrooper_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    const enemies = target.team === 'player' ? state.playerTeam : state.enemyTeam;
    enemies.forEach(e => {
        if (e.activeInBattle && e.hp > 0 && e.statuses.some(s => s.name === 'Dossier')) {
            reduceTurnMeter(state, e, 15, attacker);
        }
    });
};

// ==========================================
// PROBE DROID ABILITY HANDLERS
// ==========================================
customAbilityHandlers['probe_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    applyStatus(state, target, 'Dossier', 99, true, attacker, 1);
};

customAbilityHandlers['probe_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    applyStatus(state, target, 'Target Lock', 2, true, attacker);
    applyStatus(state, target, 'Dossier', 99, true, attacker, 1);
    
    const enemies = target.team === 'player' ? state.playerTeam : state.enemyTeam;
    enemies.forEach(e => {
        if (e.activeInBattle && e.hp > 0) {
            const beforeLen = e.statuses.length;
            e.statuses = e.statuses.filter(s => s.name !== 'Stealth');
            if (e.statuses.length < beforeLen) {
                logBattleEvent(state, `👁️ Surveillance Sweep: Dispelled Stealth from ${e.name}!`, 'info');
            }
        }
    });
};

customAbilityHandlers['probe_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    const enemies = target.team === 'player' ? state.playerTeam : state.enemyTeam;
    enemies.forEach(e => {
        if (e.activeInBattle && e.hp > 0 && e.statuses.some(s => s.name === 'Dossier')) {
            reduceTurnMeter(state, e, 15, attacker);
            applyStatus(state, e, 'Buff Immunity', 1, true, attacker);
        }
    });
};

// ==========================================
// COLONEL WULLF YULAREN ABILITY HANDLERS
// ==========================================
customAbilityHandlers['yularen_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    if (Math.random() < 0.50) {
        const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
        const isbAllies = allies.filter(a => a.activeInBattle && a.hp > 0 && (a.tags.includes('ISB') || checkHasTag(a, 'ISB')));
        if (isbAllies.length > 0) {
            const randomAlly = isbAllies[Math.floor(Math.random() * isbAllies.length)];
            applyStatus(state, randomAlly, 'Speed Up', 1, false, attacker);
        }
    }
};

customAbilityHandlers['yularen_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    allies.forEach(a => {
        if (a.activeInBattle && a.hp > 0 && (a.tags.includes('ISB') || checkHasTag(a, 'ISB')) && !hasStatusFlag(a, 'prevent_prot_recovery')) {
            const rec = Math.round(a.maxProtection * 0.15);
            a.protection = Math.min(a.maxProtection, a.protection + rec);
        }
    });
    logBattleEvent(state, `🎖️ Coordinated Investigation: All ISB allies recovered 15% Protection!`, 'heal');
    applyStatus(state, target, 'Dossier', 99, true, attacker, 1);
};

customAbilityHandlers['yularen_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const realTarget = explicitTargetAlly || target;
    if (realTarget && (realTarget.tags.includes('ISB') || checkHasTag(realTarget, 'ISB'))) {
        Object.keys(realTarget.cooldowns).forEach(key => {
            if (realTarget.cooldowns[key] > 0) {
                realTarget.cooldowns[key]--;
            }
        });
        if (!hasStatusFlag(realTarget, 'prevent_tm_gain')) {
            realTarget.turnMeter = Math.min(100, realTarget.turnMeter + 20);
        }
        logBattleEvent(state, `🎖️ Operational Priority: Cooldowns reduced by 1 and gained 20% TM for ${realTarget.name}!`, 'buff');
    }
};

// ==========================================
// KX SECURITY DROID ABILITY HANDLERS
// ==========================================
customAbilityHandlers['kx_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    const hasDossier = target.statuses.some(s => s.name === 'Dossier');
    const chance = hasDossier ? 1.00 : 0.50;
    if (Math.random() < chance && target.activeInBattle && target.hp > 0) {
        applyStatus(state, target, 'Offense Down', 1, true, attacker);
    }
};

customAbilityHandlers['kx_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    applyStatus(state, attacker, 'Taunt', 2, false, attacker);
    applyStatus(state, attacker, 'Defense Up', 2, false, attacker);
    
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    allies.forEach(a => {
        if (a.id !== attacker.id && a.activeInBattle && a.hp > 0 && (a.tags.includes('ISB') || checkHasTag(a, 'ISB')) && !hasStatusFlag(a, 'prevent_prot_recovery')) {
            const rec = Math.round(a.maxProtection * 0.10);
            a.protection = Math.min(a.maxProtection, a.protection + rec);
        }
    });
    logBattleEvent(state, `🛡️ Containment Protocol: Other ISB allies recovered 10% Protection!`, 'heal');
};

customAbilityHandlers['kx_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    if (target.activeInBattle && target.hp > 0) {
        applyStatus(state, target, 'Daze', 2, true, attacker);
        applyStatus(state, target, 'Speed Down', 2, true, attacker);
    }
};

// ==========================================
// DEDRA MEERO ABILITY HANDLERS
// ==========================================
customAbilityHandlers['dedra_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    applyStatus(state, target, 'Dossier', 99, true, attacker, 1);
    if (target.tags.includes('Jedi') || checkHasTag(target, 'Jedi')) {
        applyStatus(state, target, 'Vulnerable', 1, true, attacker);
    }
};

customAbilityHandlers['dedra_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    target.statuses = target.statuses.filter(s => s.isDebuff || s.name === 'Dossier' || s.name === 'Imperial Decree');
    logBattleEvent(state, `🛡️ Dispel: Dedra Meero removed all buffs from ${target.name}!`, 'info');
    applyStatus(state, target, 'Exposed', 2, true, attacker);
    
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    allies.forEach(a => {
        if (a.activeInBattle && a.hp > 0 && (a.tags.includes('ISB') || checkHasTag(a, 'ISB'))) {
            applyStatus(state, a, 'Offense Up', 2, false, attacker);
        }
    });
};

customAbilityHandlers['dedra_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    applyStatus(state, target, 'Target Lock', 2, true, attacker);
    applyStatus(state, target, 'Dossier', 99, true, attacker, 2);
    
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    const otherIsb = allies.filter(a => a.id !== attacker.id && a.activeInBattle && a.hp > 0 && (a.tags.includes('ISB') || checkHasTag(a, 'ISB')));
    if (otherIsb.length > 0) {
        const assistant = otherIsb[Math.floor(Math.random() * otherIsb.length)];
        const basic = assistant.abilities.find(a => a.type === 'basic');
        if (basic) {
            logBattleEvent(state, `📣 Nothing Is Random: Calling ${assistant.name} to assist!`, 'info');
            executeCombatAction(state, assistant.id, basic, target.id, undefined, (assistDepth || 0) + 1, counterDepth);
        }
    }
};

// ==========================================
// PIRATE CORSAIR ABILITY HANDLERS
// ==========================================
export function activateCorsairPayout(state: CombatState, unit: CombatUnit) {
  if (unit.statuses.some(s => s.name === 'Payout')) return;
  
  const payoutStatus = {
    name: 'Payout',
    duration: 99,
    isDebuff: false,
    sourceId: unit.id,
    prevent_cleanse: true,
    prevent_copy: true
  };
  unit.statuses.push(payoutStatus);
  logBattleEvent(state, `🏆 PAYOUT ACHIEVED: ${unit.name} completed their Corsair Payout Contract!`, 'buff');
  
  if (unit.characterId === 'captain_ithano') {
     unit.offense = Math.round(unit.offense * 1.20);
     logBattleEvent(state, `🏴‍☠️ Corsair Captain (Payout): Captain Ithano gains +40 Speed and +20% Critical Chance (modified dynamically)!`, 'buff');
  } else if (unit.characterId === 'quiggold') {
     unit.defense = Math.round(unit.defense * 1.60);
     logBattleEvent(state, `🛡️ Veteran Protector (Payout): Quiggold gains +60% Defense and immunities!`, 'buff');
  } else if (unit.characterId === 'reveth') {
     logBattleEvent(state, `🧭 Master Navigator (Payout): Reveth gains +35 Speed!`, 'buff');
  } else if (unit.characterId === 'navrokk') {
     logBattleEvent(state, `🦝 Opportunist (Payout): Squeaky ignores Stealth and Foresight, and deals +35% bonus damage to debuffed enemies!`, 'buff');
  } else if (unit.characterId === 'pendewqell') {
     unit.offense = Math.round(unit.offense * 1.40);
     logBattleEvent(state, `💥 Heavy Gunner (Payout): Pendewqell gains +40% Offense and ignores 35% Defense!`, 'buff');
  } else if (unit.characterId === 'kix_conquest') {
     unit.maxHp = Math.round(unit.maxHp * 1.20);
     unit.hp = Math.min(unit.maxHp, unit.hp + Math.round(unit.maxHp * 0.16));
     logBattleEvent(state, `🏥 Survivor's Fortune (Payout): Kix gains +25 Speed and +20% Max Health!`, 'buff');
  }

  const squad = unit.team === 'player' ? state.playerTeam : state.enemyTeam;
  
  const leader = squad.find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
  if (leader && leader.characterId === 'captain_ithano') {
    squad.forEach(u => {
      if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Corsair') || checkHasTag(u, 'Corsair'))) {
        if (!hasStatusFlag(u, 'prevent_tm_gain')) {
          u.turnMeter = Math.min(100, u.turnMeter + 10);
        }
      }
    });
    logBattleEvent(state, `🏴‍☠️ Professional Raiders: Corsair completed Payout! All Corsair allies gain 10% Turn Meter.`, 'buff');
  }

  const kix = squad.find(u => u.characterId === 'kix_conquest' && u.activeInBattle && u.hp > 0);
  if (kix && !kix.statuses.some(s => s.name === 'Payout')) {
    if (!kix.dynamicState) kix.dynamicState = {};
    kix.dynamicState.witnessedPayouts = (kix.dynamicState.witnessedPayouts || 0) + 1;
    logBattleEvent(state, `🏥 Survivor's Fortune: Kix witnessed a Corsair ally gain Payout (${kix.dynamicState.witnessedPayouts}/3)!`, 'info');
    if (kix.dynamicState.witnessedPayouts >= 3) {
      activateCorsairPayout(state, kix);
    }
  }

  if (kix) {
    squad.forEach(u => {
      if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Corsair') || checkHasTag(u, 'Corsair'))) {
        const hpHeal = Math.round(u.maxHp * 0.10);
        const protHeal = Math.round(u.maxProtection * 0.10);
        u.hp = Math.min(u.maxHp, u.hp + hpHeal);
        u.protection = Math.min(u.maxProtection, u.protection + protHeal);
      }
    });
    logBattleEvent(state, `🏥 Survivor's Fortune: All Corsair allies recover 10% Health and Protection!`, 'heal');
  }
}

// Ithano Handlers
customAbilityHandlers['ithano_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    applyStatus(state, target, 'Expose', 1, true, attacker);
    
    if (attacker.statuses.some(s => s.name === 'Payout')) {
      const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
      const corsairs = allies.filter(u => u.id !== attacker.id && u.activeInBattle && u.hp > 0 && (u.tags.includes('Corsair') || checkHasTag(u, 'Corsair')) && !hasStatusFlag(u, 'prevent_assist'));
      if (corsairs.length > 0) {
        const assistant = corsairs[Math.floor(Math.random() * corsairs.length)];
        const basic = assistant.abilities.find(a => a.type === 'basic');
        if (basic) {
          logBattleEvent(state, `🏴‍☠️ Coordinated Raid (Payout): Ithano calls ${assistant.name} to assist!`, 'buff');
          executeCombatAction(state, assistant.id, basic, target.id, undefined, (assistDepth || 0) + 1, counterDepth);
        }
      }
    }
};

customAbilityHandlers['ithano_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    const hadDebuff = target.statuses.some(s => s.isDebuff);
    applyStatus(state, target, 'Defense Down', 2, true, attacker);
    
    if (hadDebuff) {
      if (!attacker.dynamicState) attacker.dynamicState = {};
      attacker.dynamicState.raidMarks = (attacker.dynamicState.raidMarks || 0) + 1;
      logBattleEvent(state, `🏴‍☠️ Boarding Action: Target had a debuff! Ithano gains 1 Raid Mark (${attacker.dynamicState.raidMarks}/10).`, 'buff');
      if (attacker.dynamicState.raidMarks >= 10 && !attacker.statuses.some(s => s.name === 'Payout')) {
        activateCorsairPayout(state, attacker);
      }
    }
};

customAbilityHandlers['ithano_special_2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    const oppTeam = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
    const livingEnemies = oppTeam.filter(u => u.activeInBattle && u.hp > 0);
    
    livingEnemies.forEach(e => {
       applyStatus(state, e, 'Expose', 1, true, attacker);
       if (e.statuses.some(s => s.isDebuff)) {
          reduceTurnMeter(state, e, 10, attacker);
       }
    });
};

// Quiggold Handlers
customAbilityHandlers['quiggold_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    applyStatus(state, target, 'Target Lock', 2, true, attacker);
};

customAbilityHandlers['quiggold_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    applyStatus(state, attacker, 'Taunt', 2, false, attacker);
    applyStatus(state, attacker, 'Defense Up', 2, false, attacker);
    logBattleEvent(state, `🛡️ Take Cover: Quiggold gains Taunt and Defense Up (2 turns)!`, 'buff');
};

// Reveth Handlers
customAbilityHandlers['reveth_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    const livingAllies = allies.filter(u => u.id !== attacker.id && u.activeInBattle && u.hp > 0);
    if (livingAllies.length > 0) {
      livingAllies.sort((a, b) => a.turnMeter - b.turnMeter);
      const targetAlly = explicitTargetAlly || livingAllies[0];
      if (!hasStatusFlag(targetAlly, 'prevent_tm_gain')) {
        targetAlly.turnMeter = Math.min(100, targetAlly.turnMeter + 15);
        logBattleEvent(state, `🧭 Precise Course: Reveth grants 15% Turn Meter to ${targetAlly.name}!`, 'buff');
        
        if (!attacker.statuses.some(s => s.name === 'Payout')) {
          if (!attacker.dynamicState) attacker.dynamicState = {};
          attacker.dynamicState.tmGranted = (attacker.dynamicState.tmGranted || 0) + 15;
          logBattleEvent(state, `🧭 Precise Course Payout Progress: Reveth has granted ${attacker.dynamicState.tmGranted}%/100% Turn Meter!`, 'info');
          if (attacker.dynamicState.tmGranted >= 100) {
            activateCorsairPayout(state, attacker);
          }
        }
      }
    }
};

customAbilityHandlers['reveth_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    const livingAllies = allies.filter(u => u.id !== attacker.id && u.activeInBattle && u.hp > 0);
    if (livingAllies.length > 0) {
      livingAllies.sort((a, b) => b.offense - a.offense);
      const targetAlly = explicitTargetAlly || livingAllies[0];
      if (!hasStatusFlag(targetAlly, 'prevent_tm_gain')) {
        targetAlly.turnMeter = 100;
        logBattleEvent(state, `🧭 Flank Speed: Reveth grants a Bonus Turn (100% TM) to ${targetAlly.name}!`, 'buff');
        
        allies.forEach(u => {
          if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Corsair') || checkHasTag(u, 'Corsair'))) {
            u.protection = Math.min(u.maxProtection, u.protection + Math.round(u.maxProtection * 0.05));
          }
        });
        logBattleEvent(state, `🧭 Flank Speed: All Corsair allies recover 5% Protection!`, 'heal');

        if (!attacker.statuses.some(s => s.name === 'Payout')) {
          if (!attacker.dynamicState) attacker.dynamicState = {};
          attacker.dynamicState.tmGranted = (attacker.dynamicState.tmGranted || 0) + 100;
          logBattleEvent(state, `🧭 Master Navigator: Reveth has granted ${attacker.dynamicState.tmGranted}%/100% Turn Meter!`, 'info');
          if (attacker.dynamicState.tmGranted >= 100) {
             activateCorsairPayout(state, attacker);
          }
        }
      }
    }
};

// Squeaky Handlers
customAbilityHandlers['navrokk_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    const targetBuffs = target.statuses.filter(s => !s.isDebuff);
    if (targetBuffs.length > 0) {
      const stolenBuff = targetBuffs[Math.floor(Math.random() * targetBuffs.length)];
      target.statuses = target.statuses.filter(s => s.name !== stolenBuff.name);
      applyStatus(state, attacker, stolenBuff.name, stolenBuff.duration, false, attacker);
      logBattleEvent(state, `🦝 Cheap Shot: ${attacker.name} stole ${stolenBuff.name} from ${target.name}!`, 'buff');
      
      if (!attacker.statuses.some(s => s.name === 'Payout')) {
        if (!attacker.dynamicState) attacker.dynamicState = {};
        attacker.dynamicState.buffsStolen = (attacker.dynamicState.buffsStolen || 0) + 1;
        logBattleEvent(state, `🦝 Cheap Shot Payout Progress: Na'vrokk has stolen ${attacker.dynamicState.buffsStolen}/15 buffs!`, 'info');
        if (attacker.dynamicState.buffsStolen >= 15) {
          activateCorsairPayout(state, attacker);
        }
      }
    }
};

customAbilityHandlers['navrokk_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const hasTargetLock = target.statuses.some(s => s.name === 'Target Lock');
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    if (hasTargetLock) {
      logBattleEvent(state, `🦝 Exploit: Target has Target Lock! Dealing double damage!`, 'info');
      const originalOffense = attacker.offense;
      attacker.offense *= 2;
      executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
      attacker.offense = originalOffense;
    } else {
      executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    }
};

// Pendewqell Handlers
customAbilityHandlers['pendewqell_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    applyStatus(state, target, 'Offense Down', 2, true, attacker);
};

customAbilityHandlers['pendewqell_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    logBattleEvent(state, `💥 Concentrated Barrage: Pendewqell attacks ${target.name} 3 times!`, 'info');
    executeCombatAction(state, attacker.id, { ...ability, id: 'pendewqell_special_1_base1' }, target.id, undefined, assistDepth, counterDepth);
    if (target.activeInBattle && target.hp > 0) {
      executeCombatAction(state, attacker.id, { ...ability, id: 'pendewqell_special_1_base2' }, target.id, undefined, (assistDepth || 0) + 1, counterDepth);
    }
    if (target.activeInBattle && target.hp > 0) {
      executeCombatAction(state, attacker.id, { ...ability, id: 'pendewqell_special_1_base3' }, target.id, undefined, (assistDepth || 0) + 1, counterDepth);
    }
};

// Kix Handlers
customAbilityHandlers['kix_basic'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    const livingAllies = allies.filter(u => u.activeInBattle && u.hp > 0);
    if (livingAllies.length > 0) {
      livingAllies.sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp));
      const targetAlly = explicitTargetAlly || livingAllies[0];
      const healAmt = Math.round(targetAlly.maxHp * 0.10);
      targetAlly.hp = Math.min(targetAlly.maxHp, targetAlly.hp + healAmt);
      logBattleEvent(state, `💚 Covering Fire: ${attacker.name} heals ${targetAlly.name} for ${healAmt} Health!`, 'heal');
      
      if (!attacker.statuses.some(s => s.name === 'Payout')) {
        if (!attacker.dynamicState) attacker.dynamicState = {};
        attacker.dynamicState.totalHealed = (attacker.dynamicState.totalHealed || 0) + healAmt;
        if (attacker.dynamicState.totalHealed >= attacker.maxHp * 1.50) {
          activateCorsairPayout(state, attacker);
        }
      }
    }
};

customAbilityHandlers['kix_special_1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    let totalHealPctApplied = 0;
    allies.forEach(u => {
      if (u.activeInBattle && u.hp > 0) {
        const hpHeal = Math.round(u.maxHp * 0.30);
        const protHeal = Math.round(u.maxProtection * 0.30);
        u.hp = Math.min(u.maxHp, u.hp + hpHeal);
        u.protection = Math.min(u.maxProtection, u.protection + protHeal);
        totalHealPctApplied += hpHeal + protHeal;
      }
    });
    logBattleEvent(state, `💚 Combat Medic: Kix heals all allies for 30% Health and Protection!`, 'heal');
    
    if (!attacker.statuses.some(s => s.name === 'Payout')) {
      if (!attacker.dynamicState) attacker.dynamicState = {};
      attacker.dynamicState.totalHealed = (attacker.dynamicState.totalHealed || 0) + totalHealPctApplied;
      if (attacker.dynamicState.totalHealed >= attacker.maxHp * 1.50) {
         activateCorsairPayout(state, attacker);
      }
    }
};

// ==========================================
// Galactic Marines Abilities Implementation
// ==========================================

// --- Commander Bacara ---

// Mygeeto Offensive (Basic): Deal Physical Damage. If target is suffering Fear: Attack again.
customAbilityHandlers['bacara_b'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    const hasFear = target.statuses.some(s => s.name === 'Fear');
    if (hasFear && target.hp > 0) {
        logBattleEvent(state, `⚔️ Mygeeto Offensive: Target has Fear! Bacara attacks again!`, 'info');
        executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, (assistDepth || 0) + 1, counterDepth);
    }
};

// Relentless Advance (Special 1): Deal Physical Damage to all enemies. Inflict: Offense Down (2 turns). If an enemy is suffering Fear: Gain Offense Up (2 turns).
customAbilityHandlers['bacara_s1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    const oppTeam = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
    let anyEnemyFeared = false;
    oppTeam.forEach(e => {
        if (e.activeInBattle && e.hp > 0) {
            applyStatus(state, e, 'Offense Down', 2, true, attacker);
            if (e.statuses.some(s => s.name === 'Fear')) {
                anyEnemyFeared = true;
            }
        }
    });
    
    if (anyEnemyFeared) {
        applyStatus(state, attacker, 'Offense Up', 2, false, attacker);
        logBattleEvent(state, `⚔️ Relentless Advance: A Feared enemy is present! Bacara gains Offense Up (2 turns)!`, 'buff');
    }
};

// No Retreat (Special 2): All Galactic Marine allies gain: Tenacity Up (2 turns), Critical Chance Up (2 turns). Inflict Fear on target enemy.
customAbilityHandlers['bacara_s2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    allies.forEach(u => {
        if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Galactic Marines') || checkHasTag(u, 'Galactic Marines'))) {
            applyStatus(state, u, 'Tenacity Up', 2, false, attacker);
            applyStatus(state, u, 'Critical Chance Up', 2, false, attacker);
        }
    });
    applyStatus(state, target, 'Fear', 1, true, attacker);
    logBattleEvent(state, `🛡️ No Retreat: Applied Tenacity Up and Critical Chance Up to Galactic Marines. Inflicted Fear on ${target.name}!`, 'buff');
};

// --- Neyo ---

// Recon Sweep (Basic): Deal Physical Damage. 50% chance to inflict: Speed Down (2 turns). If target is suffering Fear: Inflict Healing Immunity (2 turns).
customAbilityHandlers['neyo_b'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    if (target.hp > 0) {
        if (Math.random() < 0.50) {
            applyStatus(state, target, 'Speed Down', 2, true, attacker);
        }
        if (target.statuses.some(s => s.name === 'Fear')) {
            applyStatus(state, target, 'Healing Immunity', 2, true, attacker);
        }
    }
};

// Scout Intelligence (Special 1): Dispel all buffs from target enemy. Inflict: Fear. If target already had Fear: Reduce cooldowns of a random Galactic Marine ally by 1.
customAbilityHandlers['neyo_s1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const preFear = target.statuses.some(s => s.name === 'Fear');
    target.statuses = target.statuses.filter(s => s.isDebuff); // dispel all buffs
    logBattleEvent(state, `✨ Scout Intelligence: Dispelled all buffs from ${target.name}!`, 'info');
    
    applyStatus(state, target, 'Fear', 1, true, attacker);
    
    if (preFear) {
        const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
        const marines = allies.filter(u => u.activeInBattle && u.hp > 0 && (u.tags.includes('Galactic Marines') || checkHasTag(u, 'Galactic Marines')));
        if (marines.length > 0) {
            const randomAlly = marines[Math.floor(Math.random() * marines.length)];
            Object.keys(randomAlly.cooldowns).forEach(key => {
                if (randomAlly.cooldowns[key] > 0) randomAlly.cooldowns[key]--;
            });
            logBattleEvent(state, `🔄 Scout Intelligence: Reduced cooldowns of ${randomAlly.name} by 1!`, 'buff');
        }
    }
};

// Behind Enemy Lines (Special 2): Deal Physical Damage. Inflict: Expose (2 turns), Fear. Gain Stealth (2 turns).
customAbilityHandlers['neyo_s2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    if (target.hp > 0) {
        applyStatus(state, target, 'Exposed', 2, true, attacker);
        applyStatus(state, target, 'Fear', 1, true, attacker);
    }
    applyStatus(state, attacker, 'Stealth', 2, false, attacker);
};

// --- Jet ---

// Supply Run (Basic): Deal Physical Damage. Target ally recovers 5% Health.
customAbilityHandlers['jet_b'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    let targetAlly = explicitTargetAlly;
    if (!targetAlly || targetAlly.id === attacker.id) {
        const otherAllies = allies.filter(a => a.id !== attacker.id && a.hp > 0 && a.activeInBattle);
        targetAlly = otherAllies.length > 0 ? otherAllies[Math.floor(Math.random() * otherAllies.length)] : attacker;
    }
    const healAmt = Math.round(targetAlly.maxHp * 0.05);
    targetAlly.hp = Math.min(targetAlly.maxHp, targetAlly.hp + healAmt);
    logBattleEvent(state, `💖 Supply Run: ${targetAlly.name} recovers 5% Health (${healAmt})!`, 'heal');
};

// Emergency Reinforcements (Special 1): Target ally gains: Health Up (2 turns), Defense Up (2 turns), Recover 15% Health.
customAbilityHandlers['jet_s1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    let targetAlly = explicitTargetAlly;
    if (!targetAlly) {
        const otherAllies = allies.filter(a => a.id !== attacker.id && a.hp > 0 && a.activeInBattle);
        targetAlly = otherAllies.length > 0 ? otherAllies[Math.floor(Math.random() * otherAllies.length)] : attacker;
    }
    applyStatus(state, targetAlly, 'Health Up', 2, false, attacker);
    applyStatus(state, targetAlly, 'Defense Up', 2, false, attacker);
    const healAmt = Math.round(targetAlly.maxHp * 0.15);
    targetAlly.hp = Math.min(targetAlly.maxHp, targetAlly.hp + healAmt);
    logBattleEvent(state, `💖 Emergency Reinforcements: ${targetAlly.name} recovers 15% Health (${healAmt})!`, 'heal');
};

// Medical Evacuation (Special 2): All Galactic Marine allies recover: 20% Health. Dispel all debuffs from target ally. If an enemy is suffering Fear: Recover an additional 10% Health.
customAbilityHandlers['jet_s2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
    const hasFear = enemies.some(e => e.activeInBattle && e.hp > 0 && e.statuses.some(s => s.name === 'Fear'));
    const pct = hasFear ? 0.30 : 0.20;
    
    allies.forEach(u => {
        if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Galactic Marines') || checkHasTag(u, 'Galactic Marines'))) {
            const healAmt = Math.round(u.maxHp * pct);
            u.hp = Math.min(u.maxHp, u.hp + healAmt);
            logBattleEvent(state, `💖 Medical Evacuation: Galactic Marine ${u.name} recovers ${pct * 100}% Health (${healAmt})!`, 'heal');
        }
    });

    let targetAlly = explicitTargetAlly;
    if (!targetAlly) {
        const debuffed = allies.filter(a => a.hp > 0 && a.activeInBattle && a.statuses.some(s => s.isDebuff));
        targetAlly = debuffed.length > 0 ? debuffed[0] : attacker;
    }
    targetAlly.statuses = targetAlly.statuses.filter(s => !s.isDebuff);
    logBattleEvent(state, `✨ Medical Evacuation: Dispelled all debuffs from ${targetAlly.name}!`, 'heal');
};

// --- Keller ---

// Close Quarters Assault (Basic): Deal Physical Damage. Inflict: Offense Down (2 turns). If target is suffering Fear: Inflict Daze (2 turns).
customAbilityHandlers['keller_b'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    if (target.hp > 0) {
        applyStatus(state, target, 'Offense Down', 2, true, attacker);
        if (target.statuses.some(s => s.name === 'Fear')) {
            applyStatus(state, target, 'Daze', 2, true, attacker);
        }
    }
};

// Breach The Position (Special 1): Deal Physical Damage. Inflict: Fear. Gain: Taunt (2 turns).
customAbilityHandlers['keller_s1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    if (target.hp > 0) {
        applyStatus(state, target, 'Fear', 1, true, attacker);
    }
    applyStatus(state, attacker, 'Taunt', 2, false, attacker);
};

// Hold This Ground (Special 2): Gain: Taunt (2 turns), Defense Up (2 turns). All Galactic Marine allies recover 10% Health. If an enemy is suffering Fear: Gain Damage Immunity (1 turn).
customAbilityHandlers['keller_s2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    applyStatus(state, attacker, 'Taunt', 2, false, attacker);
    applyStatus(state, attacker, 'Defense Up', 2, false, attacker);
    
    const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
    allies.forEach(u => {
        if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Galactic Marines') || checkHasTag(u, 'Galactic Marines'))) {
            const healAmt = Math.round(u.maxHp * 0.10);
            u.hp = Math.min(u.maxHp, u.hp + healAmt);
            logBattleEvent(state, `💖 Hold This Ground: Galactic Marine ${u.name} recovers 10% Health (${healAmt})!`, 'heal');
        }
    });

    const enemies = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
    const anyFear = enemies.some(e => e.activeInBattle && e.hp > 0 && e.statuses.some(s => s.name === 'Fear'));
    if (anyFear) {
        applyStatus(state, attacker, 'Damage Immunity', 1, false, attacker);
        logBattleEvent(state, `🛡️ Hold This Ground: Feared enemy detected! Keller gains Damage Immunity (1 turn)!`, 'buff');
    }
};

// --- Stak ---

// Precision Burst (Basic): Deal Physical Damage. If target is suffering Fear: Deal bonus damage.
customAbilityHandlers['stak_b'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base', effects: [...(ability.effects || [])] };
    const hasFear = target.statuses.some(s => s.name === 'Fear');
    if (hasFear) {
        dummyAbility.effects.push('bonus_damage');
        logBattleEvent(state, `🎯 Precision Burst: Target is Feared! Stak deals bonus damage!`, 'info');
    }
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
};

// Concentrated Fire (Special 1): Deal Physical Damage. Ignore 25% Defense. If target is suffering Fear: Attack again.
customAbilityHandlers['stak_s1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base', effects: ['ignore_defense_25'] };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    const hasFear = target.statuses.some(s => s.name === 'Fear');
    if (hasFear && target.hp > 0) {
        logBattleEvent(state, `⚔️ Concentrated Fire: Target has Fear! Stak attacks again!`, 'info');
        executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, (assistDepth || 0) + 1, counterDepth);
    }
};

// No Safe Position (Special 2): Deal Physical Damage to all enemies. Enemies suffering Fear: Gain Expose (2 turns).
customAbilityHandlers['stak_s2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    const oppTeam = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
    oppTeam.forEach(e => {
        if (e.activeInBattle && e.hp > 0) {
            if (e.statuses.some(s => s.name === 'Fear')) {
                applyStatus(state, e, 'Exposed', 2, true, attacker);
            }
        }
    });
};

// --- Ki-Adi-Mundi ---

// Form VII Execution (Basic): Deal Physical Damage. Dispel all buffs from target enemy. If target is suffering Fear: Attack again.
customAbilityHandlers['kam_b'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    target.statuses = target.statuses.filter(s => s.isDebuff); // dispel buffs
    logBattleEvent(state, `✨ Form VII Execution: Dispelled all buffs from ${target.name}!`, 'info');

    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    const hasFear = target.statuses.some(s => s.name === 'Fear');
    if (hasFear && target.hp > 0) {
        logBattleEvent(state, `⚔️ Form VII Execution: Target has Fear! Ki-Adi-Mundi attacks again!`, 'info');
        executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, (assistDepth || 0) + 1, counterDepth);
    }
};

// Break Their Resolve (Special 1): Deal Physical Damage to all enemies. Inflict: Fear. Enemies already suffering Fear: Lose 25% Turn Meter.
customAbilityHandlers['kam_s1'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base' };
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    const oppTeam = attacker.team === 'player' ? state.enemyTeam : state.playerTeam;
    oppTeam.forEach(e => {
        if (e.activeInBattle && e.hp > 0) {
            const alreadyFeared = e.statuses.some(s => s.name === 'Fear');
            applyStatus(state, e, 'Fear', 1, true, attacker);
            if (alreadyFeared) {
                reduceTurnMeter(state, e, 25, attacker);
            }
        }
    });
};

// Makashi Execution (Special 2): Deal massive Physical Damage to target enemy. Ignore Protection. If target is suffering Fear: Ignore Defense. Cannot be Revived. If this defeats an enemy: All Galactic Marine allies recover 20% Health.
customAbilityHandlers['kam_s2'] = (state, attacker, target, ability, isCrit, explicitTargetAlly, assistDepth, counterDepth) => {
    const dummyAbility = { ...ability, id: ability.id + '_base', effects: ['ignore_protection'] };
    const hasFear = target.statuses.some(s => s.name === 'Fear');
    if (hasFear) {
        dummyAbility.effects.push('ignore_defense');
        logBattleEvent(state, `⚔️ Makashi Execution: Target is Feared! Attack ignores defense!`, 'info');
    }
    
    const preHp = target.hp;
    executeCombatAction(state, attacker.id, dummyAbility, target.id, undefined, assistDepth, counterDepth);
    
    if (target.hp === 0 && preHp > 0) {
        target.preventRevive = true;
        logBattleEvent(state, `💀 Makashi Execution: Enemy defeated! Cannot be Revived.`, 'info');

        const allies = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
        allies.forEach(u => {
            if (u.activeInBattle && u.hp > 0 && (u.tags.includes('Galactic Marines') || checkHasTag(u, 'Galactic Marines'))) {
                const healAmt = Math.round(u.maxHp * 0.20);
                u.hp = Math.min(u.maxHp, u.hp + healAmt);
                logBattleEvent(state, `💖 Makashi Execution: Galactic Marine ${u.name} recovers 20% Health (${healAmt})!`, 'heal');
            }
        });
    }
};


