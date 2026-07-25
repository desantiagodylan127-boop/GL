import { createCharacter, makeAbility, STANDARD_STATS } from '../characters_base';
import { Character } from '../../types';

export const ROGUE_ARCHAEOLOGIST_CHARACTERS: Character[] = [
  createCharacter(
    'doctor_aphra_event',
    'Doctor Aphra',
    'Leader / Strategist / Saboteur / Event Character',
    ['Rogue Archaeologist', 'Pirate', 'Scoundrel', 'Event Character', 'Event Exclusive'],
    'Archaeologist assigning 4 unique ancient Artifacts for massive power.',
    [
      makeAbility('aphra_basic', 'Opportunistic Blast', 'basic', 0, 'Attack target enemy. Inflict Defense Down. If Aphra has assigned all 4 Artifacts: Attack again.', ['damage', 'Defense Down', 'bonus_attack'], ['offensive']),
      makeAbility('aphra_special_1', 'Catalogued Curiosities', 'special', 3, 'Choose target ally (not self). Apply the next unused Artifact. Priority: Ancient Blaster, Ancient Holocron, Ancient Shield Generator, Sith Relic.', ['Artifact'], ['buff']),
      makeAbility('aphra_special_2', 'Ancient Catastrophe', 'special', 4, 'Attack all enemies. For each active allied Artifact: Deal 15% extra damage. Inflict Ability Block.', ['damage_aoe', 'bonus_damage', 'Ability Block'], ['offensive', 'debuff']),
      makeAbility('aphra_leader', 'Fortune And Glory', 'leader', 0, 'Rogue Archaeologist allies gain +25 Speed, +20% Potency. Whenever an Artifact is assigned: Recover 10% Health & Protection. For each active Artifact: Rogue Archaeologists gain 5% Offense.', ['buff_faction', 'heal_aoe_passive', 'offense_passive'], []),
      makeAbility('aphra_unique', 'I Probably Shouldn\'t Touch That', 'unique', 0, 'At battle start: Gain 4 Artifact Charges. Whenever a Rogue Archaeologist ally uses a Special: Recover 3% Protection. Whenever an Artifact holder is defeated: Aphra gains 25% Turn Meter. Artifacts are lost on defeat, max 1 per ally.', ['Artifact', 'protection_recovery_passive', 'turn_meter_gain_passive'], [])
    ],
    'Rogue Archaeologist',
    18000,
    'Artifact assignment system (Blaster, Holocron, Shield, Relic)',
    { speed: 155, hp: 55000, protection: 60000, potency: 55 }
  ),
  createCharacter(
    'triple_zero_conquest',
    '0-0-0',
    'Support / Saboteur',
    ['Rogue Archaeologist', 'Crimson Dawn', 'Droid'],
    'Torture droid super-sizing debuffs with an Artifact.',
    [
      makeAbility('triple_zero_basic', 'Courteous Inquiry', 'basic', 0, 'Attack target enemy. Inflict Tortured (2 turns).', ['damage', 'Tortured'], ['offensive']),
      makeAbility('triple_zero_special_1', 'Enhanced Interrogation', 'special', 3, 'Target enemy gains Tortured (3 turns) and Ability Block. If 0-0-0 has an Artifact: Inflict Healing Immunity (2 turns).', ['Tortured', 'Ability Block', 'Healing Immunity'], ['debuff']),
      makeAbility('triple_zero_special_2', 'Pain Is Information', 'special', 4, 'All enemies with Tortured: Lose 20% Turn Meter. Inflict Healing Immunity (2 turns).', ['turn_meter_reduction_aoe', 'Healing Immunity'], ['debuff']),
      makeAbility('triple_zero_unique', 'Delightful Suffering', 'unique', 0, 'Whenever Tortured is applied: Gain 10% Turn Meter. Whenever enemy with Tortured takes a turn: Recover 5% Protection. If 0-0-0 has an Artifact: Gain 20% Potency.', ['turn_meter_gain_passive', 'protection_recovery_passive', 'potency_passive'], [])
    ],
    'Rogue Archaeologist',
    11500,
    'Tortured mechanic and Artifact synergy',
    { speed: 145, hp: 45000, protection: 50000 }
  ),
  createCharacter(
    'bt_one_conquest',
    'BT-1',
    'Attacker',
    ['Rogue Archaeologist', 'Droid'],
    'Explosive maniac detonating bombs on the enemy.',
    [
      makeAbility('bt1_basic', 'Murder Protocol', 'basic', 0, 'Attack target enemy. Inflict Defense Down (2 turns).', ['damage', 'Defense Down'], ['offensive']),
      makeAbility('bt1_special_1', 'Everything Is A Weapon', 'special', 3, 'Attack all enemies. Inflict Burning (2 turns).', ['damage_aoe', 'Burning'], ['offensive']),
      makeAbility('bt1_special_2', 'Hidden Detonators', 'special', 4, 'Target enemy gains Explosive Charge. If BT-1 has an Artifact: Inflict Explosive Charge on an additional enemy.', ['Explosive Charge'], ['debuff']),
      makeAbility('bt1_unique', 'Enthusiastic Violence', 'unique', 0, 'Whenever an enemy is defeated: Gain Offense Up. Whenever Explosive Charge detonates: Gain 15% Turn Meter. If BT-1 has an Artifact: Gain 25% Critical Damage.', ['Offense Up', 'turn_meter_gain_passive', 'Critical Damage Up'], [])
    ],
    'Rogue Archaeologist',
    11800,
    'Explosions and Artifact scaling',
    { speed: 140, hp: 45000, protection: 40000, offense: 5000 }
  ),
];
