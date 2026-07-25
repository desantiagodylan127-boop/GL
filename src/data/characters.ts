import { Character } from '../types';
import { JOURNEY_CONFIGS } from './journeys';
import { NEW_REPUBLIC_CHARACTERS } from './characters/new_republic_characters';
import { CLONE_CHARACTERS } from './characters/clone_characters';
import { EMPIRE_INQUISITOR_CHARACTERS } from './characters/empire_inquisitor_characters';
import { REBEL_HONOR_CHARACTERS } from './characters/rebel_honor_characters';
import { REMNANT_MANDY_CARTEL_CHARACTERS } from './characters/remnant_mandy_cartel_characters';
import { JEDI_SEPARATIST_CHARACTERS } from './characters/jedi_separatist_characters';
import { STARTER_CHARACTERS as STARTERS } from './characters/starter_characters';
import { JEDI_HIGH_COUNCIL_CHARACTERS } from './characters/jedi_high_council_characters';
import { SEPARATIST_WAR_COUNCIL_CHARACTERS } from './characters/separatist_war_council_characters';
import { KNIGHTFALL_CHARACTERS } from './characters/knightfall_characters';
import { NEW_KIT_CHARACTERS } from './characters/new_kit_characters';
import { EXPANSION_UNITS } from './characters/expansion_units';
import { CONQUEST_UNITS } from './characters/conquest_units';
import { FOUNDER_CHARACTERS } from './characters/founder_characters';
import { REWORKED_CHARACTERS } from './characters/reworked_characters';
import { SEPARATIST_DROID_CHARACTERS } from './characters/separatist_droid_characters';
import { SEPARATIST_ELITE_CHARACTERS } from './characters/separatist_elite_characters';
import { GEONOSIAN_CHARACTERS } from './characters/geonosian_characters';
import { PIRATE_OHNAKA_CHARACTERS } from './characters/pirate_ohnaka_characters';
import { PIRATE_CORSAIR_CHARACTERS } from './characters/pirate_corsair_characters';
import { THE_NETWORK_CHARACTERS } from './characters/the_network_characters';
import { CRIMSON_DAWN_CHARACTERS } from './characters/crimson_dawn_characters';
import { ROGUE_ARCHAEOLOGIST_CHARACTERS } from './characters/rogue_archaeologist_characters';
import { ISB_CHARACTERS } from './characters/isb_characters';
import { EMPERORS_HAND_CHARACTERS } from './characters/emperors_hand_characters';
import { EMPIRE_STANDARD_CHARACTERS } from './characters/empire_standard_characters';
import { REBEL_HUNTER_CHARACTERS } from './characters/rebel_hunter_characters';
import { IMPERIAL_ARCHITECTS_CHARACTERS } from './characters/imperial_architects_characters';
import { FINAL_BATCH_CHARACTERS } from './characters/final_batch_characters';
import { JOURNEY_NPC_CHARACTERS } from './characters/journey_npc_characters';
import { RAID_EXCLUSIVE_CHARACTERS } from './characters/raid_exclusive_characters';

// We combine raw characters first
let RAW_INITIAL_CHARACTERS: Character[] = [
  ...CLONE_CHARACTERS,
  ...EMPIRE_INQUISITOR_CHARACTERS,
  ...REBEL_HONOR_CHARACTERS,
  ...REMNANT_MANDY_CARTEL_CHARACTERS,
  ...JEDI_SEPARATIST_CHARACTERS,
  ...JEDI_HIGH_COUNCIL_CHARACTERS,
  ...SEPARATIST_WAR_COUNCIL_CHARACTERS,
  ...SEPARATIST_DROID_CHARACTERS,
  ...SEPARATIST_ELITE_CHARACTERS,
  ...GEONOSIAN_CHARACTERS,
  ...KNIGHTFALL_CHARACTERS,

  ...NEW_KIT_CHARACTERS,
  ...EXPANSION_UNITS,
  ...CONQUEST_UNITS,
  ...FOUNDER_CHARACTERS,
  ...NEW_REPUBLIC_CHARACTERS,

  ...PIRATE_OHNAKA_CHARACTERS,
  ...PIRATE_CORSAIR_CHARACTERS,
  ...THE_NETWORK_CHARACTERS,
  ...CRIMSON_DAWN_CHARACTERS,
  ...ROGUE_ARCHAEOLOGIST_CHARACTERS,
  ...ISB_CHARACTERS,
  ...EMPERORS_HAND_CHARACTERS,
  ...EMPIRE_STANDARD_CHARACTERS,
  ...REBEL_HUNTER_CHARACTERS,
  ...IMPERIAL_ARCHITECTS_CHARACTERS,
  ...FINAL_BATCH_CHARACTERS,
  ...JOURNEY_NPC_CHARACTERS,
  ...RAID_EXCLUSIVE_CHARACTERS
];

// Apply Reworks
REWORKED_CHARACTERS.forEach(reworkedChar => {
  const idx = RAW_INITIAL_CHARACTERS.findIndex(c => c.id === reworkedChar.id);
  if (idx !== -1) {
    RAW_INITIAL_CHARACTERS[idx] = reworkedChar;
  } else {
    RAW_INITIAL_CHARACTERS.push(reworkedChar);
  }
});

// Deduplicate units safely based on id - later items overwrite earlier
const dedupedChars = new Map<string, Character>();
RAW_INITIAL_CHARACTERS.forEach(c => dedupedChars.set(c.id, c));

const JOURNEY_IDS = JOURNEY_CONFIGS.map(j => j.rewardCharacterId);
const GL_IDS = ['gl_leia', 'luke_skywalker_gl', 'gl_darth_sidious', 'jabba', 'master_kenobi', 'lord_vader', 'rey_gl', 'eternal_fire_grievous', 'immortal_admiral_trench', 'hondo_ohnaka_gl', 'maz_kanata_gl', 'grand_admiral_thrawn', 'ahsoka_tano_grey'];

export const CLONE_WARS_ERA_IDS = [
  'captain_rex', 'jesse', 'fives', 'echo_501st', 'appo_501st', 'general_skywalker',
  'bx_commando_droid', 'kelhani', 'droideka', 'dwarf_spider_droid', 'magna_guard_elite', 'grand_admiral_trench',
  'coleman_kcaj', 'oppo_rancisis', 'adi_gallia', 'luminara_unduli', 'yaddle', 'master_kenobi',
  'nute_gunray', 'dooku_war_council', 'wat_tambor', 'lott_dod', 'whorm_loathsom', 'eternal_fire_grievous',
  'aayla_secura', 'barriss_offee', 'quinlan_vos', 'ima_gun_di'
];

export const NEW_REPUBLIC_ERA_IDS = [
  'general_hera', 'chopper', 'huyang', 'sabine_apprentice', 'zeb_nr',
  'din_djarin_beskar', 'paz_vizsla', 'ig12_grogu', 'axe_woves', 'koska_reeves',
  'commander_enoch', 'night_trooper_peridea', 'death_trooper_peridea', 'scout_trooper_peridea', 'shadow_trooper_peridea',
  'warlord_drake_voss', 'mire_talon', 'torr_kane', 'ashen_veil', 'hollow',
  'ezra_exile', 'agent_kallus', 'ahsoka_tano_grey', 'bo_katan_mandalor',
  'grand_admiral_thrawn', 'captain_pellaeon',
  'gideon', 'dark_trooper', 'range_trooper', 'incinerator_trooper', 'hazard_trooper', 'moff_gideon_dark_trooper',
  'rex_lost_commander', 'shin_hati', 'baylan_skoll', 'morgan_elsbeth', 'marrok_mercenary', 'commander_hux_exile'
];

export const ERA_IDS = CLONE_WARS_ERA_IDS;
const MARQUEE_IDS: string[] = ['din_djarin']; // commander_voren is legacy
const RAID_UNITS: string[] = [];
export const RAID_EXCLUSIVE_CHAR_IDS = [
  'ig90', 'rotta_hutt', 'shaak_ti', 'commander_bly', 'atat_driver', 'eeth_koth', 'darth_maul_theed'
];
const NPC_IDS = ['raid_boss_1', 'cartel_enforcer', 'magna_guard_remnant'];
const CONQUEST_IDS = CONQUEST_UNITS.map(c => c.id);

export function normalizeTag(tag: string): string {
  const vRoles = ['Attacker', 'Saboteur', 'Support', 'Strategist', 'Tank'];
  const sTags = ['Leader', 'Galactic Legend', 'Founder', 'Journey Character', 'Era Unit', 'Marquee', 'Event Exclusive', 'Legacy (Farmable)', 'NPC', 'Raid Boss', 'Summon'];
  if (vRoles.includes(tag) || sTags.includes(tag)) return tag;

  let formatted = tag.replace(/_/g, ' ').trim();
  formatted = formatted.split(/\s+/).map(word => {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');

  return formatted;
}

// Apply dynamic tags
const allRawTags = Array.from(dedupedChars.values()).flatMap(c => (c.tags || []).map(t => normalizeTag(t)));
const tagCounts = allRawTags.reduce((acc, tag) => {
   acc[tag] = (acc[tag] || 0) + 1;
   return acc;
}, {} as Record<string, number>);

const VALID_ROLES = ['Attacker', 'Saboteur', 'Support', 'Strategist', 'Tank'];
const SYSTEM_TAGS = ['Leader', 'Galactic Legend', 'Founder', 'Journey Character', 'Era Unit', 'Marquee', 'Event Exclusive', 'Legacy (Farmable)', 'NPC', 'Raid Boss', 'Summon'];

export const INITIAL_CHARACTERS: Character[] = Array.from(dedupedChars.values()).map(char => {
  const normalizedRawTags = (char.tags || []).map(t => normalizeTag(t));
  const newTags = new Set(normalizedRawTags);
  let releaseState: 'legacy' | 'era' | 'conquest' = 'legacy';

  if (JOURNEY_IDS.includes(char.id)) newTags.add('Journey Character');
  if (GL_IDS.includes(char.id)) {
    newTags.add('Galactic Legend');
    newTags.add('Journey Character');
  }
  // FOR THE TIME BEING: All Era characters are treated as Legacy (Farmable) as requested.
  // We keep the structure here commented out for when we re-add:
  /*
  if (ERA_IDS.includes(char.id)) {
      newTags.add('Era Unit');
      releaseState = 'era';
  }
  */
  if (MARQUEE_IDS.includes(char.id)) newTags.add('Marquee');
  
  if (RAID_EXCLUSIVE_CHAR_IDS.includes(char.id)) {
    newTags.add('Event Exclusive');
  }

  if (char.id === 'captain_howzer') newTags.add('Founder');
  if (NPC_IDS.includes(char.id) || newTags.has('Summon') || char.id.includes('bunker') || char.id.includes('turret')) newTags.add('NPC');
  if (RAID_UNITS.includes(char.id)) newTags.add('Raid Boss');

  // Any non-special/non-event characters that aren't already categorized can be marked as Legacy (Farmable)
  if (!newTags.has('Journey Character') && !newTags.has('Era Unit') && !newTags.has('NPC') && !newTags.has('Marquee') && !newTags.has('Event Exclusive') && !newTags.has('Founder') && !newTags.has('Raid Boss')) {
    newTags.add('Legacy (Farmable)');
  }
  
  // Strict role assignment
  let activeRoles: string[] = [];
  const rawRoleLower = char.role.toLowerCase();
  
  VALID_ROLES.forEach(r => {
    if (rawRoleLower.includes(r.toLowerCase()) || 
        (r === 'Saboteur' && rawRoleLower.includes('sabateur'))) {
      activeRoles.push(r);
    }
  });

  // Assign a default role if none matched to prevent stray text
  if (activeRoles.length === 0) {
    if (rawRoleLower.includes('tank') || rawRoleLower.includes('protector')) activeRoles.push('Tank');
    else if (rawRoleLower.includes('attacker') || rawRoleLower.includes('executioner')) activeRoles.push('Attacker');
    else if (rawRoleLower.includes('saboteur') || rawRoleLower.includes('sabateur')) activeRoles.push('Saboteur');
    else if (rawRoleLower.includes('strategist') || rawRoleLower.includes('tactician')) activeRoles.push('Strategist');
    else activeRoles.push('Support'); // General catch-all
  }

  // Check for Leader tag from abilities or role name
  const isLeader = char.abilities.some(a => a.type === 'leader') || rawRoleLower.includes('leader');
  if (isLeader) {
     newTags.add('Leader');
  }
  
  if (char.isLegend || rawRoleLower.includes('galactic legend')) {
     newTags.add('Galactic Legend');
  }

  const finalRole = activeRoles.join(' / ');

  const filteredTags = Array.from(newTags).filter(t => {
     // Always keep valid roles and system tags and faction tags
     if (VALID_ROLES.includes(t)) return true;
     if (SYSTEM_TAGS.includes(t)) return true;
     
     // Remove misspelled roles or old roles mapped improperly as generic tags
     const tLower = t.toLowerCase();
     if (['sabateur', 'attacker', 'tank', 'support', 'strategist', 'leader', 'galactic legend'].includes(tLower)) return false; 
     
     // Specific messy tags removal
     if (tLower.includes('isb leader') || tLower.includes('cg leader') || tLower.includes('isb soldier') || tLower.includes('isb tank') || tLower.includes('isb support') || tLower.includes('isb strategist')) return false;

     // For Factions, if a tag is only on one character, it was an accidental/meaningless tag
     return tagCounts[t] > 1 || t === '212th'; 
  });
  
  // Add actual roles as tags too
  activeRoles.forEach(r => filteredTags.push(r));
  
  const finalUniqueTags = Array.from(new Set(filteredTags));

  const factionTag = finalUniqueTags.find(t => !VALID_ROLES.includes(t) && !SYSTEM_TAGS.includes(t) && !['Light Side', 'Dark Side'].includes(t)) || 'Unaligned';
  
  return {
    ...char,
    baseStats: char.baseStats || { hp: 15000, protection: 10000, offense: 1200, defense: 400, speed: 130, critChance: 0.25, critDamage: 1.5, potency: 0.3, tenacity: 0.3 },
    role: finalRole,
    tags: finalUniqueTags,
    faction: char.faction || factionTag,
    isSummon: finalUniqueTags.includes('Summon') || finalUniqueTags.includes('NPC') || finalUniqueTags.includes('Raid Boss'),
    releaseState,
    eraId: (releaseState as string) === 'era' ? 'clone_wars' : undefined
  };
});

export const STARTER_CHARACTER_IDS = STARTERS;

export function getCharacterById(id: string): Character | undefined {
  return INITIAL_CHARACTERS.find(c => c.id === id);
}

export function getAllCharacters(): Character[] {
  return INITIAL_CHARACTERS;
}

export function getCharactersByFaction(faction: string): Character[] {
  return INITIAL_CHARACTERS.filter(c => c.faction === faction);
}
