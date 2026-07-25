const fs = require('fs');
let c = fs.readFileSync('src/utils/combatEngine.ts', 'utf8');

const order66Hook = `
      if (name === 'Order 66' && existing.count >= 10) {
         target.statuses = target.statuses.filter(s => s.name !== 'Order 66');
         applyStatus(state, target, 'Healing Immunity', 2, true, attacker, 1);
         applyStatus(state, target, 'Ability Block', 2, true, attacker, 1);
         applyStatus(state, target, 'Marked', 2, true, attacker, 1);
         logBattleEvent(state, \`💀 ORDER 66 EXECUTED on \${target.name}!\`, 'debuff');
         
         const team = target.team === 'player' ? state.enemyTeam : state.playerTeam;
         const kfc = team.find(u => u.characterId === 'knightfall_commander' && u.activeInBattle && u.hp > 0);
         if (kfc) applyStatus(state, kfc, 'Retribution', 1, false);
         
         const fox = team.find(u => u.characterId === 'commander_fox' && u.activeInBattle && u.hp > 0);
         if (fox) {
             applyStatus(state, fox, 'Offense Up', 2, false);
             applyStatus(state, fox, 'Critical Damage Up', 2, false);
             applyStatus(state, fox, 'Advantage', 2, false);
         }
         
         const cross = team.find(u => u.characterId === 'crosshair_imperial' && u.activeInBattle && u.hp > 0);
         if (cross) {
             logBattleEvent(state, \`🎯 Crosshair intercepts the execution!\`, 'info');
             const basic = cross.abilities.find(a => a.type === 'basic');
             if (basic) executeCombatAction(state, cross, target, basic, false, null, 1, 0);
         }
      }
`;

c = c.replace(/if \(name === 'Order 66' && existing\.count >= 10\) \{[\s\S]*?logBattleEvent\(state, \`💀 ORDER 66 EXECUTED on \$\{target\.name\}!\`, 'debuff'\);\n      \}/, order66Hook);

const generalOrder66Hook = `
  if (name === 'Order 66') {
      const oppTeam = target.team === 'player' ? state.enemyTeam : state.playerTeam;
      const kfc = oppTeam.find(u => u.characterId === 'knightfall_commander' && u.activeInBattle && u.hp > 0);
      if (kfc && !hasStatusFlag(kfc, 'prevent_prot_recovery')) {
          kfc.protection = Math.min(kfc.maxProtection, kfc.protection + Math.round(kfc.maxProtection * 0.03));
      }
      const appo = oppTeam.find(u => u.characterId === 'commander_appo' && u.activeInBattle && u.hp > 0 && u.position === 0);
      if (appo) {
          oppTeam.forEach(a => {
              if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Knightfall') || checkHasTag(a, 'Knightfall')) && !hasStatusFlag(a, 'prevent_prot_recovery')) {
                  a.protection = Math.min(a.maxProtection, a.protection + Math.round(a.maxProtection * 0.03));
              }
          });
      }
  }
`;

c = c.replace(/(if \(name === 'Imperial Decree'\) \{)/, \`\${generalOrder66Hook}\n  $1\`);

const burningHook = `
  if (name === 'Burning') {
      const oppTeam = target.team === 'player' ? state.enemyTeam : state.playerTeam;
      const scorch = oppTeam.find(u => u.characterId === 'scorch_knightfall' && u.activeInBattle && u.hp > 0);
      if (scorch) {
          applyStatus(state, target, 'Order 66', 1, true, scorch, 1);
      }
  }
`;
c = c.replace(/(if \(name === 'Imperial Decree'\) \{)/, \`\${burningHook}\n  $1\`);

const dramaticEntranceHook = `
  if (name === 'Dramatic Entrance') {
      const team = target.team === 'player' ? state.playerTeam : state.enemyTeam;
      const appo = team.find(u => u.characterId === 'commander_appo' && u.activeInBattle && u.hp > 0);
      if (appo && !hasStatusFlag(appo, 'prevent_tm_gain')) {
          appo.turnMeter = Math.min(100, appo.turnMeter + 10);
      }
      const kfc = team.find(u => u.characterId === 'knightfall_commander' && u.activeInBattle && u.hp > 0);
      if (kfc) {
          applyStatus(state, kfc, 'Taunt', 1, false);
      }
      const scorch = team.find(u => u.characterId === 'scorch_knightfall' && u.activeInBattle && u.hp > 0);
      if (scorch) {
          scorch.offense = Math.round(scorch.offense * 1.20);
      }
  }
`;
c = c.replace(/(if \(name === 'Imperial Decree'\) \{)/, \`\${dramaticEntranceHook}\n  $1\`);

const specialUsageHook = `
  if (checkHasTag(unit, 'Knightfall') || unit.tags.includes('Knightfall')) {
      const lv = allies.find(u => u.characterId === 'gl_lord_vader' && u.activeInBattle && u.hp > 0);
      if (lv && !hasStatusFlag(lv, 'prevent_tm_gain')) {
          lv.turnMeter = Math.min(100, lv.turnMeter + 5);
      }
  }
  if (checkHasTag(unit, '501st') || unit.tags.includes('501st')) {
      const appo = allies.find(u => u.characterId === 'appo_501st' && u.activeInBattle && u.hp > 0 && u.id !== unit.id);
      if (appo) applyStatus(state, appo, 'Momentum', 1, false, appo, 1);
  }
`;
c = c.replace(/(export function onSpecialAbilityUsed\(state: CombatState, unit: CombatUnit\) \{\n  const allies = unit\.team === 'player' \? state\.playerTeam : state\.enemyTeam;\n  const leader = allies\.find\(u => u\.position === 0 && u\.activeInBattle && u\.hp > 0\);)/, \`$1\n\${specialUsageHook}\`);


// Damage hook for Crosshair + Pursued
const pursuedDmgHook = `
      if (currentTarget.statuses.some(s => s.name === 'Pursued')) {
          const oppSquad = attacker.team === 'player' ? state.playerTeam : state.enemyTeam;
          const cross = oppSquad.find(u => u.characterId === 'crosshair_imperial' && u.activeInBattle && u.hp > 0);
          if (cross && !hasStatusFlag(cross, 'prevent_tm_gain')) {
              cross.turnMeter = Math.min(100, cross.turnMeter + 5);
          }
      }
`;
c = c.replace(/(currentTarget\.hp = Math\.max\(0, currentTarget\.hp - healthDamage\);)/, \`$1\n\${pursuedDmgHook}\`);

const defHook = `
    if (checkHasTag(defeatedUnit, 'Enemy') || !checkHasTag(defeatedUnit, 'Enemy')) {
        const winningSquad = defeatedUnit.team === 'player' ? state.enemyTeam : state.playerTeam;
        const leader = winningSquad.find(u => u.position === 0 && u.activeInBattle && u.hp > 0);
        if (leader && leader.characterId === 'gl_lord_vader') {
            winningSquad.forEach(a => {
                if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Knightfall') || checkHasTag(a, 'Knightfall'))) {
                    a.hp = Math.min(a.maxHp, a.hp + Math.round(a.maxHp * 0.20));
                    if (!hasStatusFlag(a, 'prevent_prot_recovery')) {
                        a.protection = Math.min(a.maxProtection, a.protection + Math.round(a.maxProtection * 0.20));
                    }
                }
            });
        }
    }
`;
c = c.replace(/(export function runDefeatHooks\(state: CombatState, defeatedUnit: CombatUnit\) \{[\s\S]*?return; \/\/ Wait for checkDefeat to trigger the revive\n       \}\n    \})/, \`$1\n\${defHook}\`);

fs.writeFileSync('src/utils/combatEngine.ts', c);
