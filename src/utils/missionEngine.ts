import { SaveState } from '../types';
import { MISSIONS } from '../data/missions';
import { getAllCharacters } from '../data/characters';

export type MissionEvent = 
  | 'battle_won' 
  | 'energy_spent' 
  | 'event_completed' 
  | 'character_upgraded' 
  | 'recruit_character' 
  | 'anakin_used' 
  | 'palpatine_won' 
  | 'relic_forged' 
  | 'legend_spark_ignited'
  | 'palpatine_ultimate'
  | 'kenobi_leader_won'
  | 'han_survived_won'
  | 'ahsoka_grey_won'
  | 'mixed_squad_won'
  | 'jedi_defeated'
  | 'conquest_node_cleared'
  | 'conquest_sector_cleared'
  | 'campaign_node_cleared'
  | 'node_3starred'
  | 'credits_earned'
  | 'credits_spent'
  | 'raid_completed';

export function checkMissions(save: SaveState, eventName: MissionEvent, value: number = 1): SaveState {
  const updated = { ...save };
  if (!updated.missionProgress) updated.missionProgress = {};
  if (!updated.claimedMissions) updated.claimedMissions = [];
  if (!updated.stats) updated.stats = {};

  // Increment specific accumulator stats based on event
  if (eventName === 'battle_won') {
    updated.stats.battles_won = (updated.stats.battles_won || 0) + value;
  } else if (eventName === 'energy_spent') {
    updated.stats.energy_spent = (updated.stats.energy_spent || 0) + value;
  } else if (eventName === 'event_completed') {
    updated.stats.events_completed = (updated.stats.events_completed || 0) + value;
  } else if (eventName === 'character_upgraded') {
    updated.stats.character_upgrades = (updated.stats.character_upgrades || 0) + value;
  } else if (eventName === 'relic_forged') {
    updated.stats.relics_forged = (updated.stats.relics_forged || 0) + value;
  } else if (eventName === 'legend_spark_ignited') {
    updated.stats.sparks_ignited = (updated.stats.sparks_ignited || 0) + value;
  } else if (eventName === 'anakin_used') {
    updated.stats.anakin_used = (updated.stats.anakin_used || 0) + value;
  } else if (eventName === 'palpatine_won') {
    updated.stats.palpatine_won = (updated.stats.palpatine_won || 0) + value;
  } else if (eventName === 'palpatine_ultimate') {
    updated.stats.palpatine_ultimate = (updated.stats.palpatine_ultimate || 0) + value;
  } else if (eventName === 'kenobi_leader_won') {
    updated.stats.kenobi_leader_won = (updated.stats.kenobi_leader_won || 0) + value;
  } else if (eventName === 'han_survived_won') {
    updated.stats.han_survived_won = (updated.stats.han_survived_won || 0) + value;
  } else if (eventName === 'ahsoka_grey_won') {
    updated.stats.ahsoka_grey_won = (updated.stats.ahsoka_grey_won || 0) + value;
  } else if (eventName === 'mixed_squad_won') {
    updated.stats.mixed_squad_won = (updated.stats.mixed_squad_won || 0) + value;
  } else if (eventName === 'jedi_defeated') {
    updated.stats.jedi_defeated = (updated.stats.jedi_defeated || 0) + value;
  } else if (eventName === 'conquest_node_cleared') {
    updated.stats.conquest_nodes_cleared = (updated.stats.conquest_nodes_cleared || 0) + value;
  } else if (eventName === 'conquest_sector_cleared') {
    updated.stats.conquest_sectors_cleared = (updated.stats.conquest_sectors_cleared || 0) + value;
  } else if (eventName === 'campaign_node_cleared') {
    updated.stats.campaign_nodes_cleared = (updated.stats.campaign_nodes_cleared || 0) + value;
  } else if (eventName === 'node_3starred') {
    updated.stats.nodes_3starred = (updated.stats.nodes_3starred || 0) + value;
  } else if (eventName === 'credits_earned') {
    updated.stats.total_credits_earned = (updated.stats.total_credits_earned || 0) + value;
  } else if (eventName === 'credits_spent') {
    updated.stats.credits_spent = (updated.stats.credits_spent || 0) + value;
  } else if (eventName === 'raid_completed') {
    updated.stats.raids_completed = (updated.stats.raids_completed || 0) + value;
  } else if (eventName === 'recruit_character') {
    const allC = Object.values(updated.characters || {}).filter(c => c.unlocked).length;
    updated.stats.recruited = allC;
  }

  // Handle Increments on Daily/Weekly (these don't auto-calculate from roster)
  if (eventName === 'battle_won') {
    updated.missionProgress['daily_complete_battles'] = (updated.missionProgress['daily_complete_battles'] || 0) + value;
    updated.missionProgress['weekly_win_battles'] = (updated.missionProgress['weekly_win_battles'] || 0) + value;
    updated.missionProgress['weekly_win_battles_50'] = (updated.missionProgress['weekly_win_battles_50'] || 0) + value;
  }
  if (eventName === 'energy_spent') {
    updated.missionProgress['daily_spend_energy'] = (updated.missionProgress['daily_spend_energy'] || 0) + value;
    updated.missionProgress['weekly_spend_energy'] = (updated.missionProgress['weekly_spend_energy'] || 0) + value;
    updated.missionProgress['weekly_spend_energy_500'] = (updated.missionProgress['weekly_spend_energy_500'] || 0) + value;
  }
  if (eventName === 'event_completed') {
    updated.missionProgress['daily_complete_events'] = (updated.missionProgress['daily_complete_events'] || 0) + value;
    updated.missionProgress['weekly_complete_events'] = (updated.missionProgress['weekly_complete_events'] || 0) + value;
    updated.missionProgress['weekly_complete_events_20'] = (updated.missionProgress['weekly_complete_events_20'] || 0) + value;
  }
  if (eventName === 'character_upgraded') {
    updated.missionProgress['daily_upgrade_character'] = (updated.missionProgress['daily_upgrade_character'] || 0) + value;
  }

  // Finally, trigger full dynamic recalculation of roster & cumulative progress
  return recalculateAchievements(updated);
}

export function recalculateAchievements(updated: SaveState): SaveState {
  if (!updated.missionProgress) updated.missionProgress = {};
  if (!updated.stats) updated.stats = {};
  
  const chars = Object.values(updated.characters || {});
  const unlockedChars = chars.filter(c => c.unlocked);
  
  // Roster counters
  const totalUnlocked = unlockedChars.length;
  const totalLvl85 = unlockedChars.filter(c => c.level >= 85).length;
  const total7Star = unlockedChars.filter(c => c.stars >= 7).length;
  const totalGear12 = unlockedChars.filter(c => c.gearTier >= 12).length;
  const totalGear13 = unlockedChars.filter(c => c.gearTier >= 13).length;
  const totalRelic = unlockedChars.filter(c => c.relicLevel >= 1).length;
  const totalR5 = unlockedChars.filter(c => c.relicLevel >= 5).length;
  const totalR7 = unlockedChars.filter(c => c.relicLevel >= 7).length;
  const totalR9 = unlockedChars.filter(c => c.relicLevel >= 9).length;
  
  const allGameChars = getAllCharacters();
  const getCharData = (id: string) => allGameChars.find(x => x.id === id);

  // Helper to count by tag
  const countByTag = (tag: string) => {
    return unlockedChars.filter(c => {
      const data = getCharData(c.id);
      return data?.tags.some(t => t.toLowerCase() === tag.toLowerCase()) || false;
    }).length;
  };

  // 1. Basic / Roster Progress
  updated.missionProgress['achieve_recruit_10'] = totalUnlocked;
  updated.missionProgress['achieve_recruit_25'] = totalUnlocked;
  updated.missionProgress['achieve_recruit_50'] = totalUnlocked;
  updated.missionProgress['achieve_recruit_100'] = totalUnlocked;

  updated.missionProgress['achieve_max_level_1'] = totalLvl85;
  updated.missionProgress['achieve_max_level_5'] = totalLvl85;
  updated.missionProgress['achieve_max_level_20'] = totalLvl85;
  updated.missionProgress['achieve_max_level_50'] = totalLvl85;

  updated.missionProgress['achieve_7star_1'] = total7Star;
  updated.missionProgress['achieve_7star_5'] = total7Star;
  updated.missionProgress['achieve_7star_20'] = total7Star;
  updated.missionProgress['achieve_7star_50'] = total7Star;

  updated.missionProgress['achieve_gear12_1'] = totalGear12;
  updated.missionProgress['achieve_gear12_5'] = totalGear12;
  updated.missionProgress['achieve_gear12_20'] = totalGear12;

  updated.missionProgress['achieve_gear13_1'] = totalGear13;
  updated.missionProgress['achieve_gear13_5'] = totalGear13;
  updated.missionProgress['achieve_gear13_20'] = totalGear13;

  updated.missionProgress['achieve_relic_first'] = totalRelic;
  updated.missionProgress['achieve_relic_5'] = totalRelic;
  updated.missionProgress['achieve_relic_20'] = totalRelic;
  updated.missionProgress['achieve_relic_50'] = totalRelic;

  updated.missionProgress['achieve_relic_r5_1'] = totalR5;
  updated.missionProgress['achieve_relic_r7_1'] = totalR7;
  updated.missionProgress['achieve_relic_r9_1'] = totalR9;

  // 2. Faction Progress
  updated.missionProgress['achieve_unlock_5_jedi'] = countByTag('Jedi');
  updated.missionProgress['achieve_unlock_15_jedi'] = countByTag('Jedi');
  updated.missionProgress['achieve_unlock_5_sith'] = countByTag('Sith');
  updated.missionProgress['achieve_unlock_15_sith'] = countByTag('Sith');
  updated.missionProgress['achieve_unlock_5_clones'] = countByTag('Clone Trooper');
  updated.missionProgress['achieve_unlock_10_clones'] = countByTag('Clone Trooper');
  updated.missionProgress['achieve_unlock_5_empire'] = countByTag('Empire');
  updated.missionProgress['achieve_unlock_15_empire'] = countByTag('Empire');
  updated.missionProgress['achieve_unlock_5_rebel'] = countByTag('Rebel');
  updated.missionProgress['achieve_unlock_15_rebel'] = countByTag('Rebel');
  updated.missionProgress['achieve_unlock_5_mando'] = countByTag('Mandalorian');
  updated.missionProgress['achieve_unlock_10_mando'] = countByTag('Mandalorian');
  updated.missionProgress['achieve_unlock_5_droid'] = countByTag('Droid');
  updated.missionProgress['achieve_unlock_10_droid'] = countByTag('Droid');
  updated.missionProgress['achieve_unlock_5_bounty'] = countByTag('Bounty Hunter');
  updated.missionProgress['achieve_unlock_10_bounty'] = countByTag('Bounty Hunter');
  updated.missionProgress['achieve_unlock_5_smuggler'] = countByTag('Smuggler');
  updated.missionProgress['achieve_unlock_5_sep'] = countByTag('Separatist');
  updated.missionProgress['achieve_unlock_10_sep'] = countByTag('Separatist');
  updated.missionProgress['achieve_unlock_5_inquisitor'] = countByTag('Inquisitorius');

  // Galactic Legends
  const totalGls = unlockedChars.filter(c => {
    const data = getCharData(c.id);
    return data?.tags.some(t => t.toLowerCase() === 'galactic legend') || false;
  }).length;
  updated.missionProgress['achieve_unlock_first_gl'] = totalGls;
  updated.missionProgress['achieve_unlock_3_gl'] = totalGls;

  // 3. Faction / Roster Combos
  updated.missionProgress['achieve_unlock_spectre_5'] = countByTag('Spectre');
  updated.missionProgress['achieve_unlock_bad_batch'] = countByTag('Bad Batch');
  updated.missionProgress['achieve_unlock_isb_3'] = countByTag('ISB');
  updated.missionProgress['achieve_unlock_peridea_3'] = countByTag('Peridea');
  
  // Grey Jedi combo: Baylan Skoll, Shin Hati, Ahsoka Grey
  const greyJediList = ['baylan_skoll', 'shin_hati', 'ahsoka_tano_grey'];
  const greyJediUnlocked = greyJediList.filter(id => updated.characters[id]?.unlocked).length;
  updated.missionProgress['achieve_unlock_grey_jedi_3'] = greyJediUnlocked;

  updated.missionProgress['achieve_unlock_hutt_cartel_5'] = countByTag('Hutt Cartel');
  updated.missionProgress['achieve_unlock_ewoks_5'] = countByTag('Ewok');

  // Red Squadron combo: Wedge, Biggs, Porkins
  const redSquadList = ['wedge_antilles', 'biggs', 'jek_porkins'];
  const redSquadUnlocked = redSquadList.filter(id => updated.characters[id]?.unlocked).length;
  updated.missionProgress['achieve_unlock_red_squad_3'] = redSquadUnlocked;

  updated.missionProgress['achieve_unlock_geonosians_4'] = countByTag('Geonosian');
  
  // Crimson Dawn combo: Maul, Savage, Qi'ra
  const crimsonDawnList = ['maul_mandalore', 'savage_opress_dw', 'qira'];
  const crimsonDawnUnlocked = crimsonDawnList.filter(id => updated.characters[id]?.unlocked).length;
  updated.missionProgress['achieve_unlock_crimson_dawn_3'] = crimsonDawnUnlocked;

  // Ohnaka Gang: Hondo + pirates
  const pirateCount = countByTag('Pirate');
  updated.missionProgress['achieve_unlock_pirates_3'] = pirateCount;

  updated.missionProgress['achieve_unlock_new_republic_5'] = countByTag('New Republic');
  updated.missionProgress['achieve_unlock_remnants_5'] = countByTag('Imperial Remnant');

  // 4. Specific Character Milestones
  const getRelic = (id: string) => updated.characters[id]?.unlocked ? updated.characters[id].relicLevel : 0;
  const isUnlocked = (id: string) => updated.characters[id]?.unlocked ? 1 : 0;

  updated.missionProgress['achieve_unlock_jocasta'] = isUnlocked('jocasta_nu');
  updated.missionProgress['achieve_unlock_bo_katan'] = isUnlocked('bo_katan_mandalor');
  updated.missionProgress['achieve_unlock_paz'] = isUnlocked('paz_vizsla');
  updated.missionProgress['achieve_unlock_aphra'] = isUnlocked('doctor_aphra');
  updated.missionProgress['achieve_unlock_thrawn'] = isUnlocked('grand_admiral_thrawn');
  updated.missionProgress['achieve_unlock_inquisitor_lead'] = Math.max(isUnlocked('grand_inquisitor'), isUnlocked('reva'));

  updated.missionProgress['achieve_relic_anakin'] = Math.max(getRelic('general_skywalker'), getRelic('anakin_skywalker')) >= 1 ? 1 : 0;
  updated.missionProgress['achieve_relic_kenobi'] = Math.max(getRelic('master_kenobi'), getRelic('obi_wan_kenobi')) >= 1 ? 1 : 0;
  updated.missionProgress['achieve_relic_vader'] = Math.max(getRelic('lord_vader'), getRelic('darth_vader')) >= 1 ? 1 : 0;
  updated.missionProgress['achieve_relic_sidious'] = getRelic('gl_darth_sidious') >= 1 ? 1 : 0;
  updated.missionProgress['achieve_relic_chewie'] = Math.max(getRelic('chewbacca'), getRelic('smuggler_chewbacca')) >= 1 ? 1 : 0;
  updated.missionProgress['achieve_relic_han'] = Math.max(getRelic('han_solo'), getRelic('general_han_solo')) >= 1 ? 1 : 0;
  updated.missionProgress['achieve_relic_rex'] = Math.max(getRelic('captain_rex'), getRelic('rex_lost_commander')) >= 1 ? 1 : 0;
  updated.missionProgress['achieve_relic_porkins'] = getRelic('jek_porkins') >= 1 ? 1 : 0;
  updated.missionProgress['achieve_relic_talon'] = getRelic('mire_talon') >= 1 ? 1 : 0;
  updated.missionProgress['achieve_relic_voss'] = getRelic('warlord_drake_voss') >= 1 ? 1 : 0;

  // 5. Cumulative / Stats-Based Progress
  updated.missionProgress['achieve_earn_credits_1m'] = updated.stats.total_credits_earned || 0;
  updated.missionProgress['achieve_earn_credits_10m'] = updated.stats.total_credits_earned || 0;
  updated.missionProgress['achieve_spend_energy_1k'] = updated.stats.energy_spent || 0;
  updated.missionProgress['achieve_spend_energy_10k'] = updated.stats.energy_spent || 0;
  updated.missionProgress['achieve_spend_energy_50k'] = updated.stats.energy_spent || 0;
  updated.missionProgress['achieve_win_battles_100'] = updated.stats.battles_won || 0;
  updated.missionProgress['achieve_win_battles_500'] = updated.stats.battles_won || 0;
  updated.missionProgress['achieve_win_battles_2000'] = updated.stats.battles_won || 0;
  updated.missionProgress['achieve_complete_events_20'] = updated.stats.events_completed || 0;
  updated.missionProgress['achieve_complete_events_100'] = updated.stats.events_completed || 0;
  updated.missionProgress['achieve_complete_raids_5'] = updated.stats.raids_completed || 0;
  
  updated.missionProgress['achieve_complete_conquest_nodes_20'] = updated.stats.conquest_nodes_cleared || 0;
  updated.missionProgress['achieve_complete_conquest_sectors_5'] = updated.stats.conquest_sectors_cleared || 0;
  
  updated.missionProgress['achieve_complete_campaign_nodes_50'] = updated.stats.campaign_nodes_cleared || 0;
  updated.missionProgress['achieve_complete_campaign_nodes_150'] = updated.stats.campaign_nodes_cleared || 0;
  updated.missionProgress['achieve_completed_3star_25'] = updated.stats.nodes_3starred || 0;
  updated.missionProgress['achieve_completed_3star_100'] = updated.stats.nodes_3starred || 0;
  updated.missionProgress['achieve_spend_credits_500k'] = updated.stats.credits_spent || 0;
  updated.missionProgress['achieve_spend_credits_5m'] = updated.stats.credits_spent || 0;

  // 6. Weekly Objectives
  updated.missionProgress['achieve_weekly_complete_events_20'] = updated.missionProgress['weekly_complete_events'] || 0;
  updated.missionProgress['achieve_weekly_win_battles_50'] = updated.missionProgress['weekly_win_battles'] || 0;
  updated.missionProgress['achieve_weekly_spend_energy_500'] = updated.missionProgress['weekly_spend_energy'] || 0;

  // 7. Hidden Achievements Progress Mapping
  updated.missionProgress['hidden_order_66'] = updated.stats.jedi_defeated || 0;
  updated.missionProgress['hidden_somehow_returned'] = updated.stats.palpatine_won || 0;
  updated.missionProgress['hidden_i_hate_sand'] = updated.stats.anakin_used || 0;
  updated.missionProgress['hidden_unlimited_power'] = updated.stats.palpatine_ultimate || 0;
  updated.missionProgress['hidden_high_ground'] = updated.stats.kenobi_leader_won || 0;
  updated.missionProgress['hidden_never_tell_odds'] = updated.stats.han_survived_won || 0;
  
  // Hidden: Rule of Two (Exactly 2 Sith at Relic Level 7+)
  const sithR7Count = unlockedChars.filter(c => {
    const d = getCharData(c.id);
    const isSith = d?.tags.some(t => t.toLowerCase() === 'sith') || false;
    return isSith && c.relicLevel >= 7;
  }).length;
  updated.missionProgress['hidden_rule_of_two'] = sithR7Count;

  // Hidden: This is the Way (The Armorer and Din Djarin Beskar at Relic)
  const armorerRelic = getRelic('armorer') >= 1;
  const dinRelic = getRelic('din_djarin_beskar') >= 1;
  updated.missionProgress['hidden_this_is_the_way'] = (armorerRelic && dinRelic) ? 2 : ((armorerRelic || dinRelic) ? 1 : 0);

  updated.missionProgress['hidden_im_no_jedi'] = updated.stats.ahsoka_grey_won || 0;
  updated.missionProgress['hidden_unconventional_tactics'] = updated.stats.mixed_squad_won || 0;

  return updated;
}
