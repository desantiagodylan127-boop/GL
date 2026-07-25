import { getAllCharacters } from './characters';

// Authoritative registries representing Tasks 12, 13, 14, and 15

export interface CharacterRegistryEntry {
  characterId: string;
  name: string;
  faction: string;
  role: string;
  alignment: 'light' | 'dark' | 'neutral';
  era: string;
  tags: string[];
  releaseType: 'legacy' | 'marquee' | 'conquest' | 'journey' | 'legend';
  status: 'active' | 'deprecated' | 'testing';
  abilities: {
    abilityId: string;
    name: string;
    type: string;
    desc: string;
    cooldown: number;
    statusEffects: string[];
  }[];
}

export interface FactionRegistryEntry {
  factionId: string;
  name: string;
  icon: string;
  description: string;
  bonuses: { stat: string; value: number }[];
  releaseInfo: string;
  planetSynergies: string[];
}

export interface TagRegistryEntry {
  tagId: string;
  name: string;
  description: string;
  associatedCharacters: string[];
}

export interface AbilityRegistryEntry {
  abilityId: string;
  name: string;
  description: string;
  cooldown: number;
  associatedCharacterId: string;
  statusEffectsUsed: string[];
}

// Built dynamically from the characters file, and enriched for completeness.
let characterRegistryCache: CharacterRegistryEntry[] = [];
let factionRegistryCache: FactionRegistryEntry[] = [];
let tagRegistryCache: TagRegistryEntry[] = [];
let abilityRegistryCache: AbilityRegistryEntry[] = [];

export function buildRegistries() {
  const rawCharacters = getAllCharacters();
  
  // 1. Build Character Registry
  characterRegistryCache = rawCharacters.map(char => {
    let releaseType: 'legacy' | 'marquee' | 'conquest' | 'journey' | 'legend' = 'legacy';
    if (char.isLegend) releaseType = 'legend';
    else if (char.acquisition === 'conquest') releaseType = 'conquest';
    else if (char.acquisition === 'journey') releaseType = 'journey';
    else if (char.acquisition === 'farmable') releaseType = 'marquee';

    const abilitiesMapped = (char.abilities || []).map(ab => ({
      abilityId: ab.id,
      name: ab.name,
      type: ab.type,
      desc: ab.desc || '',
      cooldown: ab.cooldown || 0,
      statusEffects: ab.effects || []
    }));

    return {
      characterId: char.id,
      name: char.name,
      faction: char.faction || char.tags[0] || 'Unassigned',
      role: char.role || 'Attacker',
      alignment: char.alignment || (char.tags.includes('Jedi') || char.tags.includes('Clone Trooper') ? 'light' : 'dark'),
      era: char.era || 'Galactic Civil War',
      tags: char.tags || [],
      releaseType,
      status: 'active',
      abilities: abilitiesMapped
    };
  });

  // 2. Build Faction Registry
  const uniqueFactions = Array.from(new Set(rawCharacters.map(c => c.faction || c.tags[0]).filter(Boolean)));
  factionRegistryCache = uniqueFactions.map(faction => {
    const fId = faction.toLowerCase().replace(/\s+/g, '_');
    return {
      factionId: fId,
      name: faction,
      icon: `${fId}_insignia`,
      description: `Authoritative alignment representing the ${faction} network.`,
      bonuses: [
        { stat: 'Offense', value: 15 },
        { stat: 'Defense', value: 20 }
      ],
      releaseInfo: 'Original launch package',
      planetSynergies: ['Tatooine', 'Coruscant', 'Geonosis']
    };
  });

  // 3. Build Tag Registry
  const tagMap = new Map<string, string[]>();
  rawCharacters.forEach(c => {
    (c.tags || []).forEach(t => {
      if (!tagMap.has(t)) {
        tagMap.set(t, []);
      }
      tagMap.get(t)!.push(c.id);
    });
  });

  tagRegistryCache = Array.from(tagMap.entries()).map(([tag, charIds]) => {
    const tagId = tag.toLowerCase().replace(/\s+/g, '_');
    return {
      tagId,
      name: tag,
      description: `Authority categorization for ${tag} archetypes.`,
      associatedCharacters: charIds
    };
  });

  // 4. Build Ability Registry
  rawCharacters.forEach(char => {
    (char.abilities || []).forEach(ab => {
      abilityRegistryCache.push({
        abilityId: ab.id,
        name: ab.name,
        description: ab.desc || '',
        cooldown: ab.cooldown || 0,
        associatedCharacterId: char.id,
        statusEffectsUsed: ab.effects || []
      });
    });
  });
}

// Accessors
export function getCharacterRegistry(): CharacterRegistryEntry[] {
  if (characterRegistryCache.length === 0) buildRegistries();
  return characterRegistryCache;
}

export function getFactionRegistry(): FactionRegistryEntry[] {
  if (factionRegistryCache.length === 0) buildRegistries();
  return factionRegistryCache;
}

export function getTagRegistry(): TagRegistryEntry[] {
  if (tagRegistryCache.length === 0) buildRegistries();
  return tagRegistryCache;
}

export function getAbilityRegistry(): AbilityRegistryEntry[] {
  if (abilityRegistryCache.length === 0) buildRegistries();
  return abilityRegistryCache;
}
