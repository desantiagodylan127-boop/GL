const fs = require('fs');
let code = fs.readFileSync('src/utils/combatEngine.ts', 'utf8');

const target1 = `             // Adi Gallia unique: "Whenever allies fall below 50% Health, Adi Gallia gains Foresight (1 turn)."
             const adi = targetAllies.find(u => u.characterId === 'adi_gallia' && u.activeInBattle && u.hp > 0);
             if (adi) {
                 applyStatus(state, adi, 'Foresight', 1, false, null);
             }
          }`;

const repl1 = `             // Adi Gallia unique: "Whenever allies fall below 50% Health, Adi Gallia gains Foresight (1 turn)."
             const adi = targetAllies.find(u => u.characterId === 'adi_gallia' && u.activeInBattle && u.hp > 0);
             if (adi) {
                 applyStatus(state, adi, 'Foresight', 1, false, null);
             }

             // Chief Chirpa Trap: Ambush Signal (50% HP threshold)
             const chirpa = squad.find(u => u.characterId === 'chief_chirpa' && u.activeInBattle && u.hp > 0);
             if (chirpa && !chirpa.dynamicState?.trapTriggered) {
                 if (!chirpa.dynamicState) chirpa.dynamicState = {};
                 chirpa.dynamicState.trapTriggered = true;
                 logBattleEvent(state, \`🌳 TRAP SPRUNG: Ambush Signal! The enemy fell below 50% Health.\`, 'info');
                 squad.forEach(u => {
                    if (u.activeInBattle && u.hp > 0 && (checkHasTag(u, 'Ewok') || u.tags.includes('Ewok')) && !hasStatusFlag(u, 'prevent_tm_gain')) {
                        u.turnMeter = Math.min(100, u.turnMeter + 25);
                    }
                 });
                 // They immediately assist the weakest enemy dealing 50% reduced damage.
                 const oppSquadActive = targetAllies.filter(u => u.activeInBattle && u.hp > 0);
                 if (oppSquadActive.length > 0) {
                     oppSquadActive.sort((a, b) => (a.hp/a.maxHp) - (b.hp/b.maxHp));
                     const weakest = oppSquadActive[0];
                     squad.forEach(u => {
                         if (u.activeInBattle && u.hp > 0 && (checkHasTag(u, 'Ewok') || u.tags.includes('Ewok'))) {
                             executeCombatAction(state, u.id, u.abilities.find(a => a.type === 'basic') || u.abilities[0], weakest.id, undefined, 1, 0);
                         }
                     });
                 }
             }
          }

          // Wicket Trap: Hunter's Snare (30% HP threshold)
          if (preHp >= currentTarget.maxHp * 0.3 && currentTarget.hp < currentTarget.maxHp * 0.3) {
             const wicket = squad.find(u => u.characterId === 'wicket' && u.activeInBattle && u.hp > 0);
             if (wicket && !wicket.dynamicState?.trapTriggered) {
                 if (!wicket.dynamicState) wicket.dynamicState = {};
                 wicket.dynamicState.trapTriggered = true;
                 logBattleEvent(state, \`🌳 TRAP SPRUNG: Hunter's Snare! Wicket gains Offense Up and attacks!\`, 'info');
                 applyStatus(state, wicket, 'Offense Up', 2, false, wicket);
                 executeCombatAction(state, wicket.id, wicket.abilities.find(a => a.type === 'basic') || wicket.abilities[0], currentTarget.id, undefined, 1, 0);
                 if (currentTarget.hp <= 0) {
                     if (wicket.cooldowns['wicket_s2'] > 0) wicket.cooldowns['wicket_s2'] = 0;
                 }
             }
          }
          
          // Kneesaa Trap: Forest Refuge (40% HP threshold)
          if (preHp >= currentTarget.maxHp * 0.4 && currentTarget.hp < currentTarget.maxHp * 0.4) {
             if (checkHasTag(currentTarget, 'Ewok') || currentTarget.tags.includes('Ewok')) {
                 const kneesaa = targetAllies.find(u => u.characterId === 'kneesaa' && u.activeInBattle && u.hp > 0);
                 if (kneesaa && !kneesaa.dynamicState?.trapTriggered) {
                     if (!kneesaa.dynamicState) kneesaa.dynamicState = {};
                     kneesaa.dynamicState.trapTriggered = true;
                     logBattleEvent(state, \`🌳 TRAP SPRUNG: Forest Refuge! Ewok ally protected.\`, 'heal');
                     currentTarget.hp = Math.min(currentTarget.maxHp, currentTarget.hp + Math.round(currentTarget.maxHp * 0.30));
                     if (!hasStatusFlag(currentTarget, 'prevent_prot_recovery')) {
                         currentTarget.protection = Math.min(currentTarget.maxProtection, currentTarget.protection + Math.round(currentTarget.maxProtection * 0.30));
                     }
                     currentTarget.statuses = currentTarget.statuses.filter(s => !s.isDebuff);
                     if (currentTarget.characterId === 'leia_gl' || currentTarget.characterId === 'leia_boushh' || currentTarget.characterId === 'leia_organa') {
                         applyStatus(state, currentTarget, 'Foresight', 1, false, kneesaa);
                     }
                 }
             }
          }`;

if (!code.includes("TRAP SPRUNG: Ambush Signal")) {
    code = code.replace(target1, repl1);
}

fs.writeFileSync('src/utils/combatEngine.ts', code);
