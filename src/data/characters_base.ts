import { Character, Ability } from '../types';

export const STANDARD_STATS = {
  hp: 45000,
  maxHp: 45000,
  protection: 35000,
  maxProtection: 35000,
  speed: 130,
  offense: 3200,
  defense: 45,
  critChance: 0.35,
  critDamage: 1.50,
  potency: 0.40,
  tenacity: 0.40,
};

export function makeAbility(
  id: string,
  name: string,
  type: Ability['type'],
  cooldown: number,
  desc: string,
  effects: string[],
  aiTags: string[],
  chargeRequirement?: number
): Ability {
  return { id, name, type, cooldown, desc, effects, aiTags, chargeRequirement };
}

export function createCharacter(
  id: string,
  name: string,
  role: string,
  tags: string[],
  lore: string,
  abilities: Ability[],
  faction: string,
  powerLevel: number,
  combatStyle: string,
  statOverrides?: Partial<typeof STANDARD_STATS>,
  acquisition?: 'farmable' | 'journey' | 'era' | 'galactic_legend' | 'conquest' | 'event',
  alignment?: 'light' | 'dark',
  timePeriod?: 'clone_wars' | 'civil_war' | 'post_endor'
): Character {
  return {
    id,
    name,
    role,
    tags,
    lore,
    baseStats: { ...STANDARD_STATS, ...statOverrides },
    abilities,
    faction,
    powerLevel,
    combatStyle,
    acquisition,
    alignment,
    timePeriod
  };
}
