import { getCharacterById } from '../data/characters';

export type AnimationFamily = 
  // Custom characters (GLs)
  | 'gl_kenobi_basic' | 'gl_kenobi_ultimate'
  | 'gl_vader_basic' | 'gl_vader_ultimate'
  | 'gl_leia_basic' | 'gl_leia_ultimate'
  | 'gl_jabba_basic' | 'gl_jabba_ultimate'
  | 'gl_rey_basic' | 'gl_rey_ultimate'
  | 'gl_grievous_basic' | 'gl_grievous_ultimate'
  | 'gl_sidious_basic' | 'gl_sidious_ultimate'
  | 'gl_hondo_basic' | 'gl_hondo_ultimate'
  | 'gl_ahsoka_basic' | 'gl_ahsoka_ultimate'
  | 'gl_luke_basic' | 'gl_luke_ultimate'
  | 'gl_trench_basic' | 'gl_trench_ultimate'
  | 'gl_maz_basic' | 'gl_maz_ultimate'
  | 'gl_thrawn_basic' | 'gl_thrawn_ultimate'
  
  // Conquest units
  | 'cq_vsd' | 'cq_acw' | 'cq_gideon'

  // Elite Marquees
  | 'em_din' | 'em_voren'

  // Journeys
  | 'j_old_ben'
  | 'j_thrawn_remnant'
  | 'j_skywalker'
  | 'j_boba_daimyo'
  | 'j_general_kenobi'
  | 'j_grievous' 
  | 'j_grand_inquisitor'
  | 'j_trench'
  | 'j_krennic'
  | 'j_raddus'
  | 'j_plo_koon' 
  | 'j_maul_mandalore'
  | 'j_palpatine'
  | 'j_ki_adi_mundi'
  | 'j_crosshair' 
  | 'j_pikk_mukmuk'
  | 'j_qira'
  | 'j_gl_tarkin'
  | 'j_mace_windu'
  | 'j_ezra_exile'
  | 'j_pellaeon'
  | 'j_bo_katan_mandalor'
  | 'j_starkiller'

  // Generic Weapon archetypes
  | 'jedi_blue' | 'jedi_green' | 'jedi_purple' | 'jedi_yellow' | 'jedi_white' | 'dark_jedi_orange'
  | 'sith_red' | 'sith_double' | 'sith_curved' | 'darksaber'
  | 'blaster_blue' | 'blaster_red' | 'blaster_green' | 'blaster_orange' | 'blaster_yellow' | 'bowcaster'
  | 'grenade' | 'physical_punch' | 'physical_kick' | 'staff_strike' | 'vibroblade' | 'lightning' 
  | 'force_crush' | 'flamethrower' | 'rocket' | 'sonic_wave' | 'healing' | 'tactical' | 'frost' | 'summon'
  
  // Legacy
  | 'reva' | 'enoch' | 'shin' | 'baylan' | 'morgan' | 'malicos'
  | 'jedi' | 'sith' | 'clone' | 'imperial' | 'droid' | 'mandalorian' | 'spectre' | 'second_empire' | 'morvek_survivors' | 'scoundrel' | 'rebel' | 'resistance' | 'first_order' | 'default';

export const FACTION_COLORS: Record<string, string> = {
  'Galactic Republic': 'blue-400',
  'Separatist': 'orange-500',
  'Empire': 'red-500',
  'Imperial Remnant': 'red-400',
  'Second Empire': 'indigo-500',
  'Inquisitorius': 'fuchsia-600',
  'Mandalorian': 'orange-400',
  'Death Watch': 'blue-600',
  'Spectre': 'green-400',
  'Morvek Survivors': 'neutral-400',
  'Rebel': 'orange-600',
  'Resistance': 'orange-400',
  'First Order': 'red-700',
  'Scumbag': 'yellow-600',
  'Cartel': 'yellow-500'
};

export function getCharacterAnimationFamily(charId: string, abilityType?: string, abilityId?: string): AnimationFamily {
  const id = charId.toLowerCase();
  const isUltimate = abilityType === 'ultimate';

  // 1. GALACTIC LEGENDS (GLS)
  if (id.includes('master_kenobi') || id.includes('gl_kenobi')) {
    return isUltimate ? 'gl_kenobi_ultimate' : 'gl_kenobi_basic';
  }
  if (id.includes('lord_vader') || id.includes('gl_lord_vader')) {
    return isUltimate ? 'gl_vader_ultimate' : 'gl_vader_basic';
  }
  if (id.includes('gl_leia') || id.includes('leia_gl')) {
    return isUltimate ? 'gl_leia_ultimate' : 'gl_leia_basic';
  }
  if (id.includes('jabba')) {
    return isUltimate ? 'gl_jabba_ultimate' : 'gl_jabba_basic';
  }
  if (id.includes('rey_gl') || id.includes('gl_rey')) {
    return isUltimate ? 'gl_rey_ultimate' : 'gl_rey_basic';
  }
  if (id.includes('eternal_fire_grievous')) {
    return isUltimate ? 'gl_grievous_ultimate' : 'gl_grievous_basic';
  }
  if (id.includes('gl_darth_sidious')) {
    return isUltimate ? 'gl_sidious_ultimate' : 'gl_sidious_basic';
  }
  if (id.includes('hondo_ohnaka_gl')) {
    return isUltimate ? 'gl_hondo_ultimate' : 'gl_hondo_basic';
  }
  if (id.includes('ahsoka_tano_grey')) {
    return isUltimate ? 'gl_ahsoka_ultimate' : 'gl_ahsoka_basic';
  }
  if (id.includes('luke_skywalker_gl') || id.includes('gl_luke')) {
    return isUltimate ? 'gl_luke_ultimate' : 'gl_luke_basic';
  }
  if (id.includes('immortal_admiral_trench') || id.includes('gl_trench')) {
    return isUltimate ? 'gl_trench_ultimate' : 'gl_trench_basic';
  }
  if (id.includes('maz_kanata_gl') || id.includes('gl_maz')) {
    return isUltimate ? 'gl_maz_ultimate' : 'gl_maz_basic';
  }
  if (id.includes('grand_admiral_thrawn') || id.includes('gl_thrawn')) {
    return isUltimate ? 'gl_thrawn_ultimate' : 'gl_thrawn_basic';
  }

  // 2. CONQUEST EXCLUSIVES
  if (id.includes('vader_skywalker_death')) return 'cq_vsd';
  if (id.includes('ahsoka_clone_wars')) return 'cq_acw';
  if (id.includes('moff_gideon_dark_trooper')) return 'cq_gideon';

  // 3. ELITE MARQUEES
  if (id.includes('din_djarin') || id.includes('beskar')) return 'em_din';
  if (id.includes('commander_voren') || id.includes('voren')) return 'em_voren';

  // 4. JOURNEY UNITS
  if (id.includes('old_ben')) return 'j_old_ben';
  if (id.includes('thrawn_remnant')) return 'j_thrawn_remnant';
  if (id.includes('general_skywalker')) return 'j_skywalker';
  if (id.includes('boba_fett_daimyo') || id.includes('daimyo_boba')) return 'j_boba_daimyo';
  if (id.includes('general_kenobi')) return 'j_general_kenobi';
  if (id.includes('general_grievous_droid')) return 'j_grievous';
  if (id.includes('grand_inquisitor')) return 'j_grand_inquisitor';
  if (id.includes('grand_admiral_trench')) return 'j_trench';
  if (id.includes('director_krennic')) return 'j_krennic';
  if (id.includes('admiral_raddus') || id.includes('raddus_fleet')) return 'j_raddus';
  if (id.includes('plo_koon_journey') || id.includes('plo_koon')) return 'j_plo_koon';
  if (id.includes('maul_mandalore')) return 'j_maul_mandalore';
  if (id.includes('chancellor_palpatine_journey')) return 'j_palpatine';
  if (id.includes('ki_adi_mundi_journey') || id.includes('ki_adi_mundi')) return 'j_ki_adi_mundi';
  if (id.includes('crosshair_bb') || id.includes('crosshair')) return 'j_crosshair';
  if (id.includes('pikk_mukmuk')) return 'j_pikk_mukmuk';
  if (id.includes('qira_journey') || id.includes('qira')) return 'j_qira';
  if (id.includes('gl_tarkin')) return 'j_gl_tarkin';
  if (id.includes('mace_windu')) return 'j_mace_windu';
  if (id.includes('ezra_exile')) return 'j_ezra_exile';
  if (id.includes('captain_pellaeon') || id.includes('pellaeon')) return 'j_pellaeon';
  if (id.includes('bo_katan_mandalor')) return 'j_bo_katan_mandalor';
  if (id.includes('starkiller')) return 'j_starkiller';

  // 5. OTHER SPECIFIC KNOWN CHARACTERS
  if (id.includes('reva')) return 'reva';
  if (id.includes('enoch') || id.includes('commander_enoch')) return 'enoch';
  if (id.includes('shin_hati')) return 'shin';
  if (id.includes('baylan_skoll')) return 'baylan';
  if (id.includes('morgan_elsbeth')) return 'morgan';

  // 6. DYNAMIC LOOKUP BY CHARACTER DATABASE
  const char = getCharacterById(charId);
  const tags = char ? char.tags.map(t => t.toLowerCase()) : [];
  const faction = char ? char.faction.toLowerCase() : '';

  // Saber logic
  if (tags.includes('jedi') || faction.includes('jedi') || id.includes('jedi') || id.includes('padawan') || id.includes('guardian') || id.includes('temple_guard')) {
    if (id.includes('windu') || id.includes('mace')) return 'jedi_purple';
    if (id.includes('ahsoka') || id.includes('fulcrum')) return 'jedi_white';
    if (id.includes('temple_guard') || id.includes('bastila') || id.includes('sentinel')) return 'jedi_yellow';
    
    if (id.includes('yoda') || id.includes('qui_gon') || id.includes('kanan') || id.includes('yaddle') || id.includes('luminara') || id.includes('fisto') || id.includes('ezra') || id.includes('snips')) {
      return 'jedi_green';
    }
    if (id.includes('skywalker') || id.includes('kenobi') || id.includes('cal_kestis') || id.includes('adi_gallia') || id.includes('barriss') || id.includes('jesse')) {
      return 'jedi_blue';
    }
    // Deterministic selection based on characterId
    let hash = 0;
    for (let i = 0; i < charId.length; i++) {
      hash = charId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIdx = Math.abs(hash) % 4;
    return (['jedi_blue', 'jedi_green', 'jedi_yellow', 'jedi_purple'] as AnimationFamily[])[colorIdx];
  }

  if (tags.includes('sith') || faction.includes('sith') || id.includes('sith') || id.includes('inquisitor') || tags.includes('inquisitorius')) {
    if (id.includes('dooku')) return 'sith_curved';
    if (id.includes('maul') || id.includes('savage')) return 'sith_double';
    if (id.includes('malicos') || id.includes('hati') || id.includes('skoll')) return 'dark_jedi_orange';
    return 'sith_red';
  }

  if (id.includes('vizsla') || id.includes('sabine') || id.includes('darksaber')) {
    return 'darksaber';
  }

  // Blaster & Explosive logic
  if (id.includes('chewbacca') || id.includes('krrsantan') || id.includes('bowcaster')) return 'bowcaster';
  
  if (tags.includes('clone') || faction.includes('clone') || id.includes('rex') || id.includes('fives') || id.includes('echo') || id.includes('cody') || id.includes('clone') || id.includes('jesse') || id.includes('bad_batch')) {
    return 'blaster_blue';
  }
  
  if (tags.includes('rebel') || faction.includes('rebel') || tags.includes('resistance') || faction.includes('resistance') || id.includes('han') || id.includes('leia') || id.includes('lando') || id.includes('poe') || id.includes('finn') || id.includes('biggs') || id.includes('porkins') || id.includes('dak') || id.includes('janson') || id.includes('hobbie')) {
    return 'blaster_green';
  }

  if (tags.includes('empire') || faction.includes('empire') || tags.includes('imperial') || faction.includes('imperial') || id.includes('trooper') || id.includes('gideon') || id.includes('remnant') || id.includes('piett') || id.includes('thrawn') || id.includes('death_star') || id.includes('bunker')) {
    return 'blaster_red';
  }

  if (tags.includes('first order') || tags.includes('first_order') || faction.includes('first order') || id.includes('hux') || id.includes('kylo') || id.includes('phasma') || id.includes('sith_trooper')) {
    return 'blaster_yellow';
  }

  if (tags.includes('scoundrel') || tags.includes('bounty hunter') || tags.includes('cartel') || tags.includes('pirate') || faction.includes('scoundrel') || id.includes('boba') || id.includes('greedo') || id.includes('bossk') || id.includes('cad_bane') || id.includes('hondo') || id.includes('sing') || id.includes('syndicate') || id.includes('thug')) {
    return 'blaster_orange';
  }

  // Droid logic
  if (tags.includes('droid') || faction.includes('droid') || id.includes('b1') || id.includes('b2') || id.includes('droid') || id.includes('magnaguard') || id.includes('droideka') || id.includes('grievous') || id.includes('chopper') || id.includes('r2') || id.includes('c3')) {
    return 'droid';
  }

  // Mandalorian logic
  if (tags.includes('mandalorian') || faction.includes('mandalorian') || id.includes('mandalorian') || id.includes('bo_katan') || id.includes('armorer') || id.includes('paz_vizsla')) {
    return 'mandalorian';
  }

  // Spectre logic
  if (id.includes('hera') || id.includes('chopper') || id.includes('spectre')) return 'spectre';

  // Melee/Physical fallback
  if (id.includes('wrecker') || id.includes('gamorrean') || id.includes('guard') || id.includes('executioner') || id.includes('thug') || id.includes('brute') || id.includes('punch') || id.includes('melee')) {
    return 'physical_punch';
  }
  if (id.includes('chirrut') || id.includes('staff') || id.includes('stick') || id.includes('boba_fett_stick')) {
    return 'staff_strike';
  }

  // Deterministic Default to vary the roster beautifully
  let hash = 0;
  for (let i = 0; i < charId.length; i++) {
    hash = charId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const defaultIdx = Math.abs(hash) % 4;
  return (['blaster_green', 'blaster_red', 'physical_punch', 'blaster_orange'] as AnimationFamily[])[defaultIdx];
}

export function getAbilityAnimationType(abilityType: string): 'basic' | 'special' | 'aoe' | 'finisher' {
  if (abilityType === 'ultimate') return 'finisher';
  if (abilityType === 'special' || abilityType === 'special_1' || abilityType === 'special_2') return 'special';
  return 'basic';
}
