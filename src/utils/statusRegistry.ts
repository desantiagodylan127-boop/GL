export const STATUS_DEFINITIONS: Record<string, {
    name: string;
    type: 'buff' | 'debuff';
    stackLimit: number;
    flags: string[];
    desc?: string;
    statModifiers: {
        offense?: number;
        defense?: number;
        speed?: number; // can be multiplier (1.25) or additive
        speedAdd?: number;
        tenacity?: number;
        potency?: number;
        critChance?: number;
        critDamage?: number;
        maxHp?: number; // multiplier to effective max health scaling / heal base
        healReceived?: number; // additive heal potency (0.25 = +25%)
        accuracy?: number; // additive hit chance
        evasion?: number; // additive evade chance
        defensePenetration?: number; // fraction of defense ignored (0.25 = 25%)
        critAvoidance?: number; // subtract from attacker crit chance
    };
}> = {
    // Buffs
    'Offense Up': { name: 'Offense Up', type: 'buff', stackLimit: 1, flags: [], statModifiers: { offense: 1.5 }, desc: 'Increases Offense by 50%' },
    'Health Up': { name: 'Health Up', type: 'buff', stackLimit: 1, flags: [], statModifiers: { maxHp: 1.15, healReceived: 0.25 }, desc: '+15% Max Health effectiveness and +25% incoming healing while active' },
    'Defense Up': { name: 'Defense Up', type: 'buff', stackLimit: 1, flags: [], statModifiers: { defense: 1.5 }, desc: 'Increases Defense by 50%' },
    'Speed Up': { name: 'Speed Up', type: 'buff', stackLimit: 1, flags: [], statModifiers: { speed: 1.25 }, desc: 'Increases Speed by 25%' },
    'Tenacity Up': { name: 'Tenacity Up', type: 'buff', stackLimit: 1, flags: ['tenacity_up'], statModifiers: { tenacity: 0.5 }, desc: 'Base chance to resist harmful effects drastically increased' },
    'Potency Up': { name: 'Potency Up', type: 'buff', stackLimit: 1, flags: [], statModifiers: { potency: 0.5 }, desc: 'Base chance to apply harmful effects drastically increased' },
    'Critical Chance Up': { name: 'Critical Chance Up', type: 'buff', stackLimit: 1, flags: [], statModifiers: { critChance: 0.25 }, desc: 'Critical Hit Chance increased by 25%' },
    'Crit Chance Up': { name: 'Crit Chance Up', type: 'buff', stackLimit: 1, flags: [], statModifiers: { critChance: 0.25 }, desc: 'Alias of Critical Chance Up. Critical Hit Chance increased by 25%' },
    'Critical Damage Up': { name: 'Critical Damage Up', type: 'buff', stackLimit: 1, flags: [], statModifiers: { critDamage: 0.5 }, desc: 'Critical Damage multiplier increased by 50%' },
    'Evasion Up': { name: 'Evasion Up', type: 'buff', stackLimit: 1, flags: [], statModifiers: { evasion: 0.35 }, desc: '+35% chance to evade attacks' },
    'Critical Avoidance Up': { name: 'Critical Avoidance Up', type: 'buff', stackLimit: 1, flags: [], statModifiers: { critAvoidance: 0.35 }, desc: 'Attackers have 35% reduced Critical Hit Chance against this unit' },
    'Advantage': { name: 'Advantage', type: 'buff', stackLimit: 1, flags: ['guaranteed_crit', 'consume_on_attack'], statModifiers: {}, desc: 'Next attack is a guaranteed Critical Hit' },
    'Retribution': { name: 'Retribution', type: 'buff', stackLimit: 1, flags: ['counterattack'], statModifiers: {}, desc: 'Counterattacks instantly whenever damaged' },
    'Stealth': { name: 'Stealth', type: 'buff', stackLimit: 1, flags: ['stealth'], statModifiers: {}, desc: 'Cannot be directly targeted unless all allies are Stealthed' },
    'Taunt': { name: 'Taunt', type: 'buff', stackLimit: 1, flags: ['taunt'], statModifiers: {}, desc: 'Forces enemies to target this unit' },
    'Foresight': { name: 'Foresight', type: 'buff', stackLimit: 1, flags: ['evade_next', 'consume_on_evade'], statModifiers: {}, desc: 'Evades the next attack completely' },
    'Damage Immunity': { name: 'Damage Immunity', type: 'buff', stackLimit: 1, flags: ['damage_immunity'], statModifiers: {}, desc: 'Immune to all direct damage' },
    'Heal Over Time': { name: 'Heal Over Time', type: 'buff', stackLimit: 99, flags: ['heal_on_turn_start'], statModifiers: {}, desc: 'Recovers Health at the start of next turn' },
    'Protection Up': { name: 'Protection Up', type: 'buff', stackLimit: 1, flags: ['bonus_protection'], statModifiers: {}, desc: 'Granted a layer of Bonus Protection (default 30% Max Protection; kit % overrides)' },
    'Protection Over Time': { name: 'Protection Over Time', type: 'buff', stackLimit: 99, flags: ['prot_on_turn_start'], statModifiers: {}, desc: 'Recovers Protection at the start of next turn' },
    'Dramatic Entrance': { name: 'Dramatic Entrance', type: 'buff', stackLimit: 1, flags: ['immune_ability_block'], statModifiers: { speed: 1.3, offense: 1.25 }, desc: 'Immune to Ability Block. +30% Speed and +25% Offense' },
    'Inspired': { name: 'Inspired', type: 'buff', stackLimit: 1, flags: [], statModifiers: { speed: 1.1, tenacity: 0.1 }, desc: 'Boosted morale: +10% Speed and Tenacity' },
    'Unconventional Tactics': { name: 'Unconventional Tactics', type: 'buff', stackLimit: 1, flags: ['unconventional_tactics'], statModifiers: { speedAdd: 10, potency: 0.1, evasion: 0.1 }, desc: '+10 Speed, +10% Potency, +10% Evasion' },
    'Intel': { name: 'Intel', type: 'buff', stackLimit: 10, flags: [], statModifiers: { potency: 0.02, speedAdd: 1 }, desc: 'Enables Agent Kallus abilities. +2% Potency and +1 Speed per stack.' },
    'Insight': { name: 'Insight', type: 'buff', stackLimit: 20, flags: [], statModifiers: { offense: 1.02, critChance: 0.01 }, desc: 'Ahsoka Tano (The Grey) mechanic. +2% Offense and +1% Crit Chance per stack.' },
    'Blaze Of Glory': { name: 'Blaze Of Glory', type: 'buff', stackLimit: 1, flags: ['blaze_of_glory', 'prevent_prot_recovery'], statModifiers: { offense: 1.3, critDamage: 0.2, defense: 0.8, defensePenetration: 0.25 }, desc: '+30% Offense, +20% Critical Damage, Ignore 25% Defense, -20% Defense, Cannot gain Protection Up' },
    'Reanimated': { name: 'Reanimated', type: 'buff', stackLimit: 1, flags: ['reanimated'], statModifiers: {}, desc: 'Upon defeat: Revive with 20% Health, Remove Reanimated' },
    'Analysis': { name: 'Analysis', type: 'buff', stackLimit: 20, flags: [], statModifiers: { speedAdd: 2, potency: 0.02 }, desc: '+2 Speed, +2% Potency/Mastery per stack' },
    'Entrenched': { name: 'Entrenched', type: 'buff', stackLimit: 1, flags: ['entrenched', 'prevent_tm_reduction', 'aoe_damage_reduction'], statModifiers: { defense: 1.4, speedAdd: -20 }, desc: '+40% Defense, -20 Speed, Immune to Turn Meter Reduction, Take 25% reduced AoE Damage' },
    'Veteran Orders': { name: 'Veteran Orders', type: 'buff', stackLimit: 1, flags: ['veteran_orders', 'prevent_crit', 'aoe_damage_reduction'], statModifiers: {}, desc: 'Cannot be Critically Hit, Take 25% reduced AoE Damage' },
    'Resolve': { name: 'Resolve', type: 'buff', stackLimit: 10, flags: [], statModifiers: { defense: 0.05, offense: 0.03 }, desc: '+5% Defense, +3% Offense per stack' },
    'Ultimate Stance': { name: 'Ultimate Stance', type: 'buff', stackLimit: 1, flags: [], statModifiers: {}, desc: 'Unit is in Ultimate Stance with enhanced combat capabilities' },
    'bonus_turn': { name: 'bonus_turn', type: 'buff', stackLimit: 1, flags: [], statModifiers: {}, desc: 'Granted a Bonus Turn' },

    // Debuffs
    'Ability Block': { name: 'Ability Block', type: 'debuff', stackLimit: 1, flags: ['prevent_special'], statModifiers: {}, desc: 'Cannot use Special or Ultimate abilities' },
    'Analyze': { name: 'Analyze', type: 'debuff', stackLimit: 1, flags: [], statModifiers: { defense: 0.8 }, desc: 'Defense reduced by 20% due to tactical analysis' },
    'Bribed': { name: 'Bribed', type: 'debuff', stackLimit: 1, flags: ['prevent_counter'], statModifiers: {}, desc: 'Cannot counterattack. Action undermined by the cartel' },
    'Intimidated': { name: 'Intimidated', type: 'debuff', stackLimit: 1, flags: ['prevent_counter'], statModifiers: { offense: 0.5 }, desc: 'Offense halved and cannot counterattack' },
    'Target Lock': { name: 'Target Lock', type: 'debuff', stackLimit: 1, flags: ['prevent_stealth'], statModifiers: {}, desc: 'Cannot gain Stealth and takes enhanced effects from certain attacks' },
    'Vulnerable': { name: 'Vulnerable', type: 'debuff', stackLimit: 1, flags: [], statModifiers: {}, desc: 'Any attack against this unit is a guaranteed Critical Hit' },
    'Blind': { name: 'Blind', type: 'debuff', stackLimit: 1, flags: [], statModifiers: {}, desc: 'Next attack is guaranteed to Evade/Miss' },
    'Plague': { name: 'Plague', type: 'debuff', stackLimit: 99, flags: ['damage_on_turn_start_dot'], statModifiers: {}, desc: 'Takes damage equivalent to 5% Max Health at start of turn. Dispelled only when healed to Full Health' },
    'Thermal Detonator': { name: 'Thermal Detonator', type: 'debuff', stackLimit: 99, flags: [], statModifiers: {}, desc: 'Explodes dynamically, heavily damaging the victim' },
    'Isolation': { name: 'Isolation', type: 'debuff', stackLimit: 1, flags: ['prevent_buff', 'prevent_assist'], statModifiers: {}, desc: 'Cannot gain Buffs, assist, or counterattack. Cannot be targeted by ally abilities' },
    'Healing Immunity': { name: 'Healing Immunity', type: 'debuff', stackLimit: 1, flags: ['prevent_heal'], statModifiers: {}, desc: 'HP cannot be recovered' },
    'Buff Immunity': { name: 'Buff Immunity', type: 'debuff', stackLimit: 1, flags: ['prevent_buff'], statModifiers: {}, desc: 'Cannot gain any positive status effects' },
    'Defense Down': { name: 'Defense Down', type: 'debuff', stackLimit: 1, flags: [], statModifiers: { defense: 0.5 }, desc: 'Defense reduced by 50%' },
    'Offense Down': { name: 'Offense Down', type: 'debuff', stackLimit: 1, flags: [], statModifiers: { offense: 0.5 }, desc: 'Offense reduced by 50%' },
    'Speed Down': { name: 'Speed Down', type: 'debuff', stackLimit: 1, flags: [], statModifiers: { speed: 0.75 }, desc: 'Speed reduced by 25%' },
    'Potency Down': { name: 'Potency Down', type: 'debuff', stackLimit: 1, flags: [], statModifiers: { potency: -0.5 }, desc: 'Potency reduced by 50%' },
    'Tenacity Down': { name: 'Tenacity Down', type: 'debuff', stackLimit: 1, flags: [], statModifiers: { tenacity: -0.5 }, desc: 'Tenacity reduced by 50%. Cannot resist debuffs.' },
    'Daze': { name: 'Daze', type: 'debuff', stackLimit: 1, flags: ['prevent_assist', 'prevent_counter'], statModifiers: {}, desc: 'Cannot assist, counterattack, or gain bonus Turn Meter' },
    'Stun': { name: 'Stun', type: 'debuff', stackLimit: 1, flags: ['skip_turn', 'prevent_assist', 'prevent_counter'], statModifiers: {}, desc: 'Misses their next turn completely' },
    'Fear': { name: 'Fear', type: 'debuff', stackLimit: 1, flags: ['skip_turn', 'take_damage_on_expiration', 'prevent_assist', 'prevent_counter'], statModifiers: {}, desc: 'Misses next turn. If damaged, Fear breaks and deals bonus damage' },
    'Exposed': { name: 'Exposed', type: 'debuff', stackLimit: 1, flags: ['bonus_damage_on_hit', 'consume_on_hit'], statModifiers: {}, desc: 'Takes bonus damage equivalent to 10% Max HP when damaged next' },
    'Burning': { name: 'Burning', type: 'debuff', stackLimit: 1, flags: ['damage_on_turn_start'], statModifiers: {}, desc: 'Takes Burn damage equal to 15% Max HP at start of turn' },
    'Marked': { name: 'Marked', type: 'debuff', stackLimit: 1, flags: ['marked', 'override_stealth'], statModifiers: {}, desc: 'Forces enemies to target this unit regardless of Stealth or Taunt' },
    'Marked Target': { name: 'Marked Target', type: 'debuff', stackLimit: 1, flags: ['marked', 'override_stealth'], statModifiers: {}, desc: 'Forces enemies to target this unit regardless of Stealth or Taunt. Triggers Red Squadron synergies.' },
    'Pursued': { name: 'Pursued', type: 'debuff', stackLimit: 1, flags: ['prevent_stealth'], statModifiers: {}, desc: 'Cannot gain Stealth' },
    'Purge': { name: 'Purge', type: 'debuff', stackLimit: 6, flags: [], statModifiers: { tenacity: -0.05 }, desc: 'Consumed by Inquisitors for devastating effects' },
    'Order 66': { name: 'Order 66', type: 'debuff', stackLimit: 10, flags: ['take_bonus_damage_kf'], statModifiers: {}, desc: 'Irrevocable target. Lord Vader manipulates this status directly' },
    'Frostbite': { name: 'Frostbite', type: 'debuff', stackLimit: 4, flags: ['lose_tm_on_action'], statModifiers: { speedAdd: -5 }, desc: 'Loses fixed Speed and Turn Meter' },
    'Damage Over Time': { name: 'Damage Over Time', type: 'debuff', stackLimit: 99, flags: ['damage_on_turn_start_dot'], statModifiers: {}, desc: 'Takes damage equivalent to 5% Max HP at start of turn per stack' },
    'Shattered Defense': { name: 'Shattered Defense', type: 'debuff', stackLimit: 1, flags: [], statModifiers: { defense: 0.2 }, desc: 'Armor critically compromised (Defense reduced to 20%)' },
    'Shock': { name: 'Shock', type: 'debuff', stackLimit: 1, flags: ['prevent_heal', 'prevent_prot_recovery', 'prevent_tm_gain', 'prevent_buff'], statModifiers: {}, desc: 'Cannot heal, recover protection, gain buffs, or gain Turn Meter' },
    'Whiteout': { name: 'Whiteout', type: 'buff', stackLimit: 1, flags: ['whiteout', 'evade_next_attack'], statModifiers: { tenacity: 0.1 }, desc: 'Evades the next attack completely' },
    'Predicted': { name: 'Predicted', type: 'debuff', stackLimit: 1, flags: ['predicted'], statModifiers: {}, desc: 'When this unit would take a turn: Remove Predicted, Grand Admiral Thrawn gains Bonus Turn' },
    'Battlefield Corruption': { name: 'Battlefield Corruption', type: 'debuff', stackLimit: 1, flags: ['battlefield_corruption', 'damage_on_turn_start'], statModifiers: {}, desc: 'Take damage at start of turn, Receive 50% reduced healing' },
    'Suppressed': { name: 'Suppressed', type: 'debuff', stackLimit: 1, flags: ['suppressed', 'prevent_bonus_tm'], statModifiers: { critChance: -0.2, speedAdd: -20 }, desc: '-20% Critical Chance, -20 Speed, Cannot gain Bonus Turn Meter' },
    'Momentum': { name: 'Momentum', type: 'buff', stackLimit: 20, flags: ['prevent_cleanse', 'prevent_copy', 'prevent_prevent'], statModifiers: { offense: 1.01, speedAdd: 1 }, desc: '+1% Offense and +1 Speed per stack (max 20). Cannot be dispelled, copied or prevented.' },
    'Pathfinder': { name: 'Pathfinder', type: 'buff', stackLimit: 1, flags: ['taunt', 'prevent_cleanse', 'prevent_copy', 'pathfinder'], statModifiers: {}, desc: 'Taunt. Cannot lose Taunt. Cannot be dispelled. On reaching 0 Protection, removed and unit gains Fatigued.' },
    'Fatigued': { name: 'Fatigued', type: 'debuff', stackLimit: 1, flags: ['skip_turn', 'prevent_assist', 'prevent_counter', 'untargetable', 'damage_immunity', 'prevent_cleanse', 'prevent_prevent', 'fatigued'], statModifiers: {}, desc: 'Cannot Act, cannot be Targeted, cannot Take Damage, cannot Assist, cannot Counterattack. Dur: 3 turns. On expiration, recovers 100% Integrity/Protection, gains Pathfinder.' },
    'Lockdown': { name: 'Lockdown', type: 'debuff', stackLimit: 1, flags: ['prevent_special', 'prevent_assist', 'prevent_counter', 'prevent_bonus_tm', 'prevent_cleanse', 'prevent_copy', 'lockdown'], statModifiers: {}, desc: 'Cannot use Special Abilities, Assist, Counterattack, or gain bonus Turn Meter. Cannot be copied or dispelled.' },
    'Riot Control': { name: 'Riot Control', type: 'buff', stackLimit: 1, flags: ['prevent_cleanse', 'prevent_copy', 'riot_control'], statModifiers: { defense: 1.25, tenacity: 0.25, speedAdd: 10 }, desc: '+25% Defense, +25% Tenacity, +10 Speed. Damages to Locked Down enemies recover 3% Protection and gain 2% TM. Cannot be copied or dispelled.' },
    'Combined Arms': { name: 'Combined Arms', type: 'buff', stackLimit: 3, flags: ['prevent_cleanse', 'prevent_copy'], statModifiers: {}, desc: 'Enables 212th Combined Arms Assault. Max 3 stacks. Cannot be copied or dispelled.' },
    'Negotiator': { name: 'Negotiator', type: 'buff', stackLimit: 1, flags: ['prevent_cleanse', 'prevent_copy'], statModifiers: {}, desc: 'All allied Health damage is redirected to this unit\'s Protection while it has Protection. Ignores Taunt. Cannot be copied or dispelled.' },
    'Ambushed': { name: 'Ambushed', type: 'debuff', stackLimit: 1, flags: ['marked', 'override_stealth', 'ambushed'], statModifiers: {}, desc: 'Double target status. Cannot be copied or dispelled.' },
    'Overdisciplined': { name: 'Overdisciplined', type: 'buff', stackLimit: 1, flags: ['prevent_cleanse', 'prevent_copy', 'prevent_prevent', 'prevent_prot_recovery'], statModifiers: {}, desc: 'Frontline fortitude: Cannot gain Protection, Protection Up or suffer Fear. Gains 100% of Max Protection as Max Health. Gains 5% TM whenever losing 10% Health.' },
    'Hypervigilance Disorder': { name: 'Hypervigilance Disorder', type: 'buff', stackLimit: 1, flags: ['prevent_cleanse', 'prevent_copy', 'prevent_prevent'], statModifiers: { speedAdd: 30 }, desc: '+30 Speed. Whenever an ally takes damage, gain 5% TM. Ignores Stealth. Cannot gain bonus TM from allies.' },
    'Impulse Control Disorder': { name: 'Impulse Control Disorder', type: 'buff', stackLimit: 1, flags: ['prevent_cleanse', 'prevent_copy', 'prevent_prevent'], statModifiers: { offense: 1.3 }, desc: '+30% Offense, +20% Max Health. When taking damage, gain Offense Up (1 turn). When defeating an enemy, gain Daze (1 turn).' },
    'Attachment Disorder': { name: 'Attachment Disorder', type: 'buff', stackLimit: 1, flags: ['prevent_cleanse', 'prevent_copy', 'prevent_prevent'], statModifiers: {}, desc: 'When Bad Batch ally < 50% HP, gain 10% TM. When using specials, target heals 10% HP. Bonus turn on ally defeat. Untargetable while other Bad Batch allies active.' },
    'Obsessive Analysis Disorder': { name: 'Obsessive Analysis Disorder', type: 'buff', stackLimit: 1, flags: ['prevent_cleanse', 'prevent_copy', 'prevent_prevent'], statModifiers: { potency: 0.3, speedAdd: 30 }, desc: '+30% Potency, +30 Speed. Whenever a debuff expires, gain 5% TM. Taking a Bonus Turn loses 5% Max Health.' },
    'Identity Disorder': { name: 'Identity Disorder', type: 'buff', stackLimit: 1, flags: ['prevent_cleanse', 'prevent_copy', 'prevent_prevent'], statModifiers: {}, desc: 'Immune to Shock. +25% Critical Avoidance. Gain debuffs when allies do for 1 turn. When debuffed, recover 5% Protection.' },
    'Paranoia Disorder': { name: 'Paranoia Disorder', type: 'buff', stackLimit: 1, flags: ['prevent_cleanse', 'prevent_copy', 'prevent_prevent'], statModifiers: {}, desc: 'Ignore Stealth. Ignore Taunt against Marked targets. Gain 2% Offense when allies attack. Lose 2% Defense when attacking.' },
    'No Disorder': { name: 'No Disorder', type: 'buff', stackLimit: 1, flags: ['prevent_cleanse', 'prevent_copy', 'prevent_prevent'], statModifiers: {}, desc: 'Unaffected by Disorders. Whenever Bad Batch triggers a disorder, Batcher gains 5% TM. When attacking, random Bad Batch ally heals 5% Health. Taunt (1 turn) on Omega taking damage.' },
    'Investigation': { name: 'Investigation', type: 'debuff', stackLimit: 1, flags: ['investigation'], statModifiers: { defense: 0.8 }, desc: 'Under Jedi investigation. Certain Jedi Guardian abilities trigger bonus effects against this unit.' },
    'Arrest Warrant': { name: 'Arrest Warrant', type: 'debuff', stackLimit: 1, flags: ['arrest_warrant'], statModifiers: { speed: 0.85, defense: 0.7 }, desc: 'An active arrest warrant is issued by the Jedi Council. Jedi Guardian allies gain high offense and trigger extra combat utility.' },
    'Council Guidance': { name: 'Council Guidance', type: 'buff', stackLimit: 1, flags: ['prevent_cleanse', 'prevent_copy', 'prevent_prevent'], statModifiers: {}, desc: 'Guided by the Jedi High Council. Used to power up and trigger supreme team-wide effects. Cannot be copied, dispelled, or prevented.' },
    "Guardian's Resolve": { name: "Guardian's Resolve", type: 'buff', stackLimit: 10, flags: [], statModifiers: { defense: 1.05 }, desc: 'Guardian stack: +5% Defense per stack (max +50%). Reaching 10 stacks triggers full team-wide defensive burst and recovery.' },
    
        'Last Hope': { name: 'Last Hope', type: 'buff', stackLimit: 99, flags: ['prevent_cleanse'], statModifiers: { offense: 1.1 }, desc: 'Grants 10% Offense per stack. Cannot be dispelled by enemies.' },
    'Endless Legion': { name: 'Endless Legion', type: 'buff', stackLimit: 99, flags: [], statModifiers: { offense: 1.02, defense: 1.02 }, desc: 'Separatist Droid stack effect. +2% Offense and Defense per stack.' },
    'Tactical Advantage': { name: 'Tactical Advantage', type: 'buff', stackLimit: 99, flags: [], statModifiers: { potency: 0.03, speedAdd: 2 }, desc: 'Trench mechanic. +3% Potency and +2 Speed per stack.' },
    'Tactical Data': { name: 'Tactical Data', type: 'buff', stackLimit: 99, flags: [], statModifiers: { critChance: 0.02, offense: 1.02 }, desc: 'Trench mechanic. +2% Crit Chance and Offense per stack.' },
    'Impending Doom': { name: 'Impending Doom', type: 'buff', stackLimit: 99, flags: [], statModifiers: { offense: 1.01 }, desc: 'Trench ultimate charge mechanic. +1% Offense per stack.' },
    'Dark Maelstrom': { name: 'Dark Maelstrom', type: 'buff', stackLimit: 1, flags: [], statModifiers: { offense: 1.25, critDamage: 0.25 }, desc: 'Vader mechanic. +25% Offense and Critical Damage.' },
    'Rule of Two': { name: 'Rule of Two', type: 'buff', stackLimit: 1, flags: [], statModifiers: { offense: 1.2, tenacity: 0.2 }, desc: 'Sith mechanic. +20% Offense and Tenacity.' },
    'Unlimited Power': { name: 'Unlimited Power', type: 'buff', stackLimit: 1, flags: [], statModifiers: { offense: 1.35, potency: 0.35 }, desc: 'Palpatine mechanic. +35% Offense and Potency.' },
    'Deathmark': { name: 'Deathmark', type: 'debuff', stackLimit: 1, flags: ['marked', 'override_stealth', 'deathmark'], statModifiers: {}, desc: 'Forces enemies to target this unit. Takes 25% bonus damage when hit.' },
    'Elusive': { name: 'Elusive', type: 'buff', stackLimit: 1, flags: ['untargetable', 'prevent_cleanse'], statModifiers: { evasion: 0.15 }, desc: 'Cannot be targeted. +15% Evasion.' },
    'Contract': { name: 'Contract', type: 'buff', stackLimit: 1, flags: ['prevent_cleanse'], statModifiers: {}, desc: 'Bounty Hunter Contract.' },
    'Bounty': { name: 'Bounty', type: 'buff', stackLimit: 1, flags: [], statModifiers: { offense: 1.1, speedAdd: 10 }, desc: 'Bounty Hunter Reward. +10% Offense, +10 Speed.' },
    'Unleashed': { name: 'Unleashed', type: 'buff', stackLimit: 1, flags: ['prevent_cleanse'], statModifiers: { offense: 1.4, critDamage: 0.3 }, desc: 'Starkiller Unleashed. +40% Offense, +30% Critical Damage.' },
    'Imperial Contract': { name: 'Imperial Contract', type: 'debuff', stackLimit: 1, flags: ['prevent_cleanse', 'imperial_contract'], statModifiers: {}, desc: 'Marked by Rebel Hunters. Transfers when the holder is defeated. Enables Rebel Hunter Contract synergies.' },
    'Armor Shred': { name: 'Armor Shred', type: 'debuff', stackLimit: 99, flags: ['prevent_cleanse'], statModifiers: { defense: 0.5 }, desc: 'Defense permanently reduced 50% per stack (multiplicative).' },
    'Debt': { name: 'Debt', type: 'debuff', stackLimit: 99, flags: [], statModifiers: { offense: 0.97, speedAdd: -1 }, desc: 'Hondo mechanic. -3% Offense and -1 Speed per stack.' },
    'Corruption': { name: 'Corruption', type: 'debuff', stackLimit: 99, flags: ['corruption'], statModifiers: { defense: 0.95, tenacity: -0.03 }, desc: 'Corruption mechanic. -5% Defense and -3% Tenacity per stack.' },
    'Collector': { name: 'Collector', type: 'buff', stackLimit: 1, flags: [], statModifiers: { potency: 0.2, speedAdd: 15 }, desc: 'Collector mechanic. +20% Potency, +15 Speed.' },
    'Infested': { name: 'Infested', type: 'debuff', stackLimit: 1, flags: ['infested'], statModifiers: { defense: 0.85 }, desc: 'Takes 25% bonus damage. Defense reduced 15%.' },
    'Foil': { name: 'Foil', type: 'debuff', stackLimit: 1, flags: ['foil'], statModifiers: { offense: 0.85, tenacity: -0.15 }, desc: 'Plans disrupted: -15% Offense, -15% Tenacity.' },
    'Critical Chance Down': { name: 'Critical Chance Down', type: 'debuff', stackLimit: 1, flags: [], statModifiers: { critChance: -0.25 }, desc: 'Critical Chance reduced by 25%.' },
    'Accuracy Up': { name: 'Accuracy Up', type: 'buff', stackLimit: 1, flags: [], statModifiers: { accuracy: 0.35 }, desc: 'Accuracy increased by 35%.' },
    'Defense Penetration Up': { name: 'Defense Penetration Up', type: 'buff', stackLimit: 1, flags: [], statModifiers: { defensePenetration: 0.35 }, desc: 'Ignore 35% of target Defense.' },
    'Accuracy Down': { name: 'Accuracy Down', type: 'debuff', stackLimit: 1, flags: [], statModifiers: { accuracy: -0.35 }, desc: 'Accuracy decreased by 35%.' },
    'Evasion Down': { name: 'Evasion Down', type: 'debuff', stackLimit: 1, flags: [], statModifiers: { evasion: -0.35 }, desc: 'Evasion decreased by 35%.' },
    'Stagger': { name: 'Stagger', type: 'debuff', stackLimit: 1, flags: ['consume_on_hit', 'stagger'], statModifiers: {}, desc: 'Next time this unit takes damage, it loses 100% Turn Meter.' },

    // Custom Expansion Statuses
    'Information Broker': { name: 'Information Broker', type: 'debuff', stackLimit: 3, flags: ['information_broker'], statModifiers: { tenacity: -0.05 }, desc: 'Tracked by The Network. Triggers powerful anti-faction synergies. -5% Tenacity per stack.' },
    'Info Broker': { name: 'Info Broker', type: 'debuff', stackLimit: 3, flags: ['information_broker'], statModifiers: { tenacity: -0.05 }, desc: 'Alias of Information Broker.' },
    'Treasure': { name: 'Treasure', type: 'buff', stackLimit: 10, flags: ['treasure'], statModifiers: { offense: 1.02, potency: 0.02 }, desc: '+2% Offense and +2% Potency per stack. Triggers pirate mechanics.' },
    'Hostage': { name: 'Hostage', type: 'debuff', stackLimit: 1, flags: ['prevent_assist', 'prevent_counter', 'hostage'], statModifiers: { offense: 0.8 }, desc: '-20% Offense. Cannot Assist or Counterattack.' },
    'Payout': { name: 'Payout', type: 'buff', stackLimit: 1, flags: ['prevent_cleanse', 'prevent_copy', 'payout'], statModifiers: {}, desc: 'Reward for completing a Corsair contract.' },
    'Raid Mark': { name: 'Raid Mark', type: 'buff', stackLimit: 10, flags: ['raid_mark'], statModifiers: {}, desc: 'Marks enemy vulnerability. Stacks to trigger Captain Ithano\'s Payout.' },
    'Secrecy': { name: 'Secrecy', type: 'buff', stackLimit: 1, flags: ['untargetable', 'prevent_copy', 'secrecy'], statModifiers: { critChance: 0.25, critDamage: 0.25 }, desc: 'Cannot be targeted directly. +25% Critical Chance, +25% Critical Damage.' },
    'Artifact': { name: 'Artifact', type: 'buff', stackLimit: 1, flags: ['prevent_cleanse', 'prevent_copy'], statModifiers: {}, desc: 'Powerful ancient relic.' },
    'Explosive Charge': { name: 'Explosive Charge', type: 'debuff', stackLimit: 1, flags: ['explosive_charge'], statModifiers: {}, desc: 'Detonates for 20% Max Health damage when consumed or on expiration.' },
    'Tortured': { name: 'Tortured', type: 'debuff', stackLimit: 1, flags: ['tortured'], statModifiers: { defense: 0.9, tenacity: -0.1 }, desc: 'Exposed to interrogations. Feeds 0-0-0 mechanics. -10% Defense and Tenacity.' },
    'Imperial Decree': { name: 'Imperial Decree', type: 'debuff', stackLimit: 1, flags: ['prevent_cleanse', 'prevent_copy', 'prevent_prevent'], statModifiers: { speedAdd: -10, tenacity: -0.20 }, desc: 'Designated an enemy of the Empire. -10 Speed and -20% Tenacity. Cannot be copied, dispelled, or prevented.' },
    'Dossier': { name: 'Dossier', type: 'debuff', stackLimit: 5, flags: [], statModifiers: {}, desc: 'Sought-after imperial evidence. Enables advanced ISB execution strategies and tactical debuffs.' },
    'Expose': { name: 'Expose', type: 'debuff', stackLimit: 1, flags: ['bonus_damage_on_hit', 'consume_on_hit'], statModifiers: {}, desc: 'Takes bonus damage equivalent to 10% Max HP when damaged next' },
    'Protect the Child': { name: 'Protect the Child', type: 'buff', stackLimit: 1, flags: ['prevent_cleanse', 'prevent_copy', 'protect_the_child'], statModifiers: {}, desc: 'Rotta the Huttlet accompanies this unit. If this unit loses all Protection, the entire team suffers Offense Down until protection is restored.' },

    // Scripted / ability-named statuses previously applied or checked without definitions
    'Imperial Approval': { name: 'Imperial Approval', type: 'buff', stackLimit: 1, flags: ['prevent_cleanse', 'prevent_copy'], statModifiers: { offense: 1.15, tenacity: 0.15 }, desc: 'Emperor Palpatine holds Imperial Approval. Imperial allies recover Protection when enemies fall.' },
    'Ordered Fire': { name: 'Ordered Fire', type: 'buff', stackLimit: 1, flags: [], statModifiers: { critChance: 0.1 }, desc: 'Coordinated volley. This unit has issued or received Ordered Fire and fights with heightened coordination.' },
    // Alias recognized by AI / logs (canonical status remains Ability Block)
    'Blocked': { name: 'Blocked', type: 'debuff', stackLimit: 1, flags: ['prevent_special'], statModifiers: {}, desc: 'Alias of Ability Block. Cannot use Special or Ultimate abilities.' },

    // Imperial Architects — The Project
    'The Project': { name: 'The Project', type: 'buff', stackLimit: 99, flags: ['prevent_cleanse', 'prevent_copy', 'prevent_prevent'], statModifiers: {}, desc: 'Team construction progress toward the Imperial superweapon. Reaches Complete at 25 stacks. Cannot be dispelled, copied, or prevented.' },
    'The Project Complete': { name: 'The Project Complete', type: 'buff', stackLimit: 1, flags: ['prevent_cleanse', 'prevent_copy', 'prevent_prevent'], statModifiers: {}, desc: 'The Project has reached 25 stacks. Authority By All Means is unlocked.' },
    'Hostage Scientist': { name: 'Hostage Scientist', type: 'buff', stackLimit: 1, flags: ['prevent_cleanse', 'prevent_copy', 'prevent_prevent'], statModifiers: {}, desc: 'Galen Erso is held as the Hostage Scientist. Cannot be dispelled. Damaging him advances The Project.' },

    // Kit condition trackers
    'Brotherly Love': { name: 'Brotherly Love', type: 'buff', stackLimit: 1, flags: ['prevent_cleanse'], statModifiers: {}, desc: 'Nightbrother bond between Maul and Savage. Enables shared TM and Offense synergies.' },
    'Scum': { name: 'Scum', type: 'buff', stackLimit: 1, flags: ['prevent_cleanse', 'prevent_copy'], statModifiers: {}, desc: "Jabba's Pet. Salacious B. Crumb gains +50 Speed after taking 10 turns." },

    // Stack / form trackers used by raid exclusives and Emperor's Hand
    'Wrath': { name: 'Wrath', type: 'buff', stackLimit: 10, flags: ['prevent_cleanse'], statModifiers: { offense: 1.02 }, desc: "Starkiller's Emperor's Wrath stacks. +2% Offense per stack. At 10: consume for Offense Up, Critical Damage Up, Defense Penetration Up." },
    'Guarded Position': { name: 'Guarded Position', type: 'buff', stackLimit: 3, flags: [], statModifiers: { speedAdd: 10, offense: 1.1 }, desc: 'Bly escort stacks. +10 Speed and +10% Offense per stack. At 3: converts to Veteran Commander.' },
    'Veteran Commander': { name: 'Veteran Commander', type: 'buff', stackLimit: 1, flags: ['prevent_cleanse', 'prevent_copy', 'prevent_prevent'], statModifiers: { offense: 1.25, defensePenetration: 0.25 }, desc: 'Bly at full Guarded Position. Assist when Jedi attack; ignore Taunt and 25% Defense.' },
    'Duelist': { name: 'Duelist', type: 'buff', stackLimit: 5, flags: [], statModifiers: { speedAdd: 10, offense: 1.1 }, desc: 'Maul consecutive-hit stacks. +10 Speed and +10% Offense per stack. At 5: Master Duelist.' },
    'Master Duelist': { name: 'Master Duelist', type: 'buff', stackLimit: 1, flags: ['prevent_cleanse', 'prevent_copy'], statModifiers: { offense: 1.75, speedAdd: 40, defensePenetration: 0.5 }, desc: '+75% Offense, +40 Speed, ignore Taunt, ignore 50% Defense.' },
    'Advance': { name: 'Advance', type: 'buff', stackLimit: 5, flags: [], statModifiers: { speedAdd: 5, defense: 1.05 }, desc: 'AT-AT walker advance stacks. +5 Speed and +5% Defense per stack. At 5: Siege Formation.' },
    'Siege Formation': { name: 'Siege Formation', type: 'buff', stackLimit: 1, flags: ['prevent_cleanse', 'prevent_copy'], statModifiers: { defensePenetration: 0.3 }, desc: 'Imperial Troopers ignore Taunt, gain 30% Defense Penetration, recover 5% Protection vs debuffed enemies.' },
    'Museum Guardian': { name: 'Museum Guardian', type: 'buff', stackLimit: 1, flags: ['prevent_cleanse', 'prevent_copy', 'prevent_prevent'], statModifiers: { offense: 1.75, speedAdd: 40, defensePenetration: 0.4 }, desc: 'IG-90 at 4 Artifacts. +75% Offense, +40 Speed, ignore 40% Defense, enhanced assists and saves.' }
};
