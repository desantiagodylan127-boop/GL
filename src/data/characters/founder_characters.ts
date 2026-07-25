import { createCharacter, makeAbility, STANDARD_STATS } from '../characters_base';
import { Character } from '../../types';

export const FOUNDER_CHARACTERS: Character[] = [
  {
    id: 'captain_howzer',
    name: 'Captain Howzer',
    role: 'Leader / Support',
    faction: 'Galactic Republic',
    tags: ['Galactic Republic', 'Clone Trooper', 'Founder'],
    lore: 'A honorable and compassionate Clone Captain who stood by his principles despite the Empire`s rise.',
    powerLevel: 14000,
    combatStyle: 'Versatile Clone leader who keeps the squad held together with high health/protection recovery and dynamic defensive buffs.',
    baseStats: { speed: 125, hp: 55000, protection: 50000, defense: 45, offense: 3500, critChance: 0.3, critDamage: 1.5, potency: 0.4, tenacity: 0.6 },
    abilities: [
      makeAbility('howzer_b', 'Encouraging Fire', 'basic', 0, 'Deal Physical Damage. Target Clone Trooper ally recovers 5% Health and Protection.', ['damage', 'heal', 'protection_recovery'], ['offensive']),
      makeAbility('howzer_s1', 'Hold Together', 'special', 3, 'All Clone Trooper allies recover 15% Health and 15% Protection. Dispel all debuffs from target Clone Trooper ally.', ['heal', 'protection_recovery', 'dispel'], ['defensive']),
      makeAbility('howzer_s2', 'Brothers First', 'special', 4, 'All Clone Trooper allies gain Defense Up (2 turns), Tenacity Up (2 turns), and Speed Up (2 turns).', ['Defense Up', 'Tenacity Up', 'Speed Up'], ['defensive']),
      makeAbility('howzer_l', 'For The Republic', 'leader', 0, 'Clone Trooper allies gain 20 Speed, 20% Max Health, and 20% Max Protection. Whenever a Clone Trooper ally falls below 50% Health: Recover 10% Health and Protection.', ['leader', 'speed', 'heal_faction', 'protection_recovery'], []),
      makeAbility('howzer_u', 'A Good Soldier', 'unique', 0, 'At the start of battle: Clone Trooper allies gain Protection Up (15%). Whenever a Clone Trooper ally is defeated: Remaining Clone Trooper allies recover 20% Health and Protection. Whenever Howzer uses a Special Ability: Random Clone Trooper ally gains Offense Up (2 turns). Howzer cannot be targeted while another Clone Trooper ally is active.', ['unique', 'Protection Up', 'heal_on_defeat', 'Offense Up', 'untargetable'], [])
    ]
  }
];