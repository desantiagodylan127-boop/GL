const fs = require('fs');
let c = fs.readFileSync('src/utils/combatEngine.ts', 'utf8');

const dynamicStatsHook = `
  if (unit.characterId === 'hollow' && unit.dynamicState && unit.dynamicState.hollowOffenseStacks) {
      stats.offense = Math.round(stats.offense * (1 + (0.05 * unit.dynamicState.hollowOffenseStacks)));
      stats.speed += (5 * unit.dynamicState.hollowSpeedStacks);
  }
  if (unit.characterId === 'torr_kane' && unit.dynamicState && unit.dynamicState.torrDefenseStacks) {
      stats.defense = Math.round(stats.defense * (1 + (0.02 * unit.dynamicState.torrDefenseStacks)));
  }
  
  if (unit.tags.includes('Avalanche Remnant') || checkHasTag(unit, 'Avalanche Remnant')) {
      const squad = unit.team === 'player' ? state.playerTeam : state.enemyTeam;
      if (squad.some(u => u.activeInBattle && u.hp > 0 && u.statuses.some(s => s.name === 'Whiteout'))) {
          const voren = squad.find(u => u.position === 0 && u.characterId === 'commander_voren' && u.activeInBattle && u.hp > 0);
          if (voren) {
              stats.defense = Math.round(stats.defense * 1.15);
          }
      }
  }
`;

c = c.replace(/(export function getModifiedStats\(unit: CombatUnit, stateOrSquad: CombatState \| CombatUnit\[\]\): \{ speed: number, maxHp: number, maxProtection: number, offense: number, defense: number, critChance: number, critDamage: number, potency: number, tenacity: number \} \{\n[\s\S]*?let stats = \{ \.\.\.unit\.baseStats \};[\s\S]*?\} \= squadEffect;\n    \}\n  \}\))/g, 
`$1\n${dynamicStatsHook}\n`);
fs.writeFileSync('src/utils/combatEngine.ts', c);
