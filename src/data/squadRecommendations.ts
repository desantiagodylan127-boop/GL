export interface RecommendedSquad {
  id: string;
  name: string;
  faction: string;
  role: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Endgame';
  members: string[]; // array of character ids
  description: string;
}

export const SQUAD_RECOMMENDATIONS: RecommendedSquad[] = [
  {
    id: '501st_legion',
    name: '501st Clone Legion',
    faction: '501st',
    role: 'Offensive Clone Team',
    difficulty: 'Intermediate',
    members: ['captain_rex', 'fives', 'echo_501st', 'jesse', 'general_skywalker'],
    description: 'Fast offensive clone squad built around assists, turn meter gain, and coordinated attacks.'
  },
  {
    id: '212th_attack_battalion',
    name: '212th Attack Battalion',
    faction: '212th',
    role: 'Defensive Clone Team',
    difficulty: 'Intermediate',
    members: ['commander_cody', 'general_kenobi', 'clone_trooper_212th', 'aerial_trooper_212th', 'waxer'],
    description: 'A tough clone force focusing on defense, calling multiple assists from Cody, and Kenobi\'s legendary leadership.'
  },
  {
    id: 'wolfpack',
    name: '104th Wolfpack',
    faction: 'Wolfpack',
    role: 'Counterattack and Control Team',
    difficulty: 'Intermediate',
    members: ['commander_wolffe', 'wp_sinker', 'wp_boost', 'wp_heavy', 'wp_scout'],
    description: 'A resilient clone team that punishes enemies who attack them, relying on armor breaks and heavy counter-attacks.'
  },
  {
    id: 'coruscant_guard',
    name: 'Coruscant Guard',
    faction: 'Coruscant Guard',
    role: 'Protection and Punishment Team',
    difficulty: 'Intermediate',
    members: ['commander_fox', 'commander_thorn', 'coruscant_trooper', 'riot_guard', 'underworld_police'],
    description: 'An elite security force. Highly defensive, focused on locking down single targets through stuns and focus fire.'
  },
  {
    id: 'bad_batch',
    name: 'Clone Force 99 (Bad Batch)',
    faction: 'Bad Batch',
    role: 'Adaptive Utility Team',
    difficulty: 'Advanced',
    members: ['hunter', 'echo_bb', 'tech_bb', 'wrecker', 'omega'],
    description: 'A specialized commando squad. Excellent true damage, stealth mechanics, and heavy survivability.'
  },
  {
    id: 'separatist_droids',
    name: 'Separatist Droids',
    faction: 'Separatist',
    role: 'Attrition and Droid Swarm',
    difficulty: 'Intermediate',
    members: ['general_grievous_journey', 'b1_battle_droid', 'b2_super_battle_droid', 'droideka', 'magnaguard'],
    description: 'A relentless swarm. B1 slowly wears down enemies while B2 constantly clears buffs and punishes evades.'
  },
  {
    id: 'separatist_elite',
    name: 'Separatist Elite',
    faction: 'Separatist',
    role: 'Control and Precision Damage',
    difficulty: 'Advanced',
    members: ['grand_admiral_trench', 'kelhani', 'magna_guard_elite', 'bx_commando_droid', 'droideka'],
    description: 'Trench\'s tactical supremacy shines here. Use extortion and overwhelming single-target firepower under a defensive umbrella.'
  },
  {
    id: 'separatist_war_council',
    name: 'Separatist War Council',
    faction: 'Separatist',
    role: 'Debuff and Battlefield Control',
    difficulty: 'Advanced',
    members: ['dooku_war_council', 'wat_tambor', 'nute_gunray', 'lott_dod', 'whorm_loathsom'],
    description: 'The elite leaders of the Confederacy. Manipulate turn meter, extort enemies, and deliver deadly technology.'
  },
  {
    id: 'inquisitorius',
    name: 'Inquisitorius',
    faction: 'Inquisitorius',
    role: 'Control and Sustained Pressure',
    difficulty: 'Advanced',
    members: ['grand_inquisitor', 'reva', 'marrok', 'crow', 'fourth_sister'],
    description: 'Jedi hunters. Use purge mechanics to lock down Jedi enemies and whittle down their health with precise strikes.'
  },
  {
    id: 'empire_classic',
    name: 'Galactic Empire',
    faction: 'Empire',
    role: 'Classic Empire Control Team',
    difficulty: 'Beginner',
    members: ['emperor_palpatine', 'darth_vader', 'admiral_piett', 'royal_guard', 'grand_admiral_thrawn'],
    description: 'Relies on overwhelming turn meter from debuffs under Palpatine lead, allowing Vader to crush his foes.'
  },
  {
    id: 'imperial_troopers',
    name: 'Imperial Troopers',
    faction: 'Imperial Trooper',
    role: 'Trooper Utility Team',
    difficulty: 'Intermediate',
    members: ['admiral_piett', 'range_trooper', 'shore_trooper', 'death_trooper', 'scout_trooper'],
    description: 'A snowballing team that gains massive turn meter and damage whenever an enemy is defeated or a buff is gained.'
  },
  {
    id: 'imperial_remnant',
    name: 'Imperial Remnant',
    faction: 'Imperial Remnant',
    role: 'Remnant Assault Team',
    difficulty: 'Advanced',
    members: ['gideon', 'dark_trooper', 'scout_trooper', 'incinerator_trooper', 'stormtrooper'],
    description: 'A terrifying striking force built around Moff Gideon\'s turn meter manipulation and the sheer power of Dark Troopers.'
  },
  {
    id: 'avalanche_remnant',
    name: 'Avalanche Remnant',
    faction: 'Imperial Remnant',
    role: 'Defensive Remnant Team',
    difficulty: 'Advanced',
    members: ['commander_voren', 'captain_rime', 'frostburn', 'glaze', 'hail'],
    description: 'A heavily armored arctic squad that excels at surviving initial onslaughts and striking back with cold precision.'
  },
  {
    id: 'rogue_one',
    name: 'Rogue One',
    faction: 'Rebel',
    role: 'Rebel Utility Team',
    difficulty: 'Intermediate',
    members: ['jyn_erso', 'cassian_andor', 'k2so', 'chirrut_imwe', 'baze_malbus'],
    description: 'A versatile infiltration squad with reviving capabilities, heavy debuff spread, and strong taunts.'
  },
  {
    id: 'hutt_cartel',
    name: 'Hutt Cartel',
    faction: 'Hutt Cartel',
    role: 'Sustain and Control Team',
    difficulty: 'Endgame',
    members: ['jabba', 'boba_fett', 'krrsantan', 'boushh_leia', 'bib_fortuna'],
    description: 'Bounty hunters and smugglers united under Jabba. Focuses on thermal detonators and making Jabba unstoppable.'
  },
  {
    id: 'death_watch',
    name: 'Death Watch',
    faction: 'Mandalorian',
    role: 'Aggressive Mandalorian Team',
    difficulty: 'Advanced',
    members: ['maul_mandalore', 'savage_opress_dw', 'pre_vizsla', 'rook_kast', 'dw_vanguard'],
    description: 'An aggressive iteration of Mandalorians built for sheer destruction, led by Maul\'s furious offense.'
  },
  {
    id: 'mandalorians',
    name: 'True Mandalorians',
    faction: 'Mandalorian',
    role: 'Versatile Support Team',
    difficulty: 'Advanced',
    members: ['bo_katan_mandalor', 'din_djarin_beskar', 'armorer', 'paz_vizsla', 'ig12_grogu'],
    description: 'A balanced squad utilizing Beskar armor strictly for counter-attacks, durability, and massive single-target damage.'
  },
  {
    id: 'jedi_guardians',
    name: 'Jedi Guardians',
    faction: 'Jedi',
    role: 'Aggressive Jedi Team',
    difficulty: 'Intermediate',
    members: ['mace_windu', 'kit_fisto', 'agen_kolar', 'depa_billaba', 'saesee_tiin'],
    description: 'Combat-focused Jedi squad with high physical output and counter-attacks under Windu\'s command.'
  },
  {
    id: 'jedi_high_council',
    name: 'Jedi High Council',
    faction: 'Jedi',
    role: 'Support and Control Jedi Team',
    difficulty: 'Endgame',
    members: ['master_kenobi', 'yoda', 'adi_gallia', 'oppo_rancisis', 'yaddle'],
    description: 'The pinnacle of Jedi synergy. Mass foresight, extreme mastery gains, and complete control over the battle flow.'
  }
];
