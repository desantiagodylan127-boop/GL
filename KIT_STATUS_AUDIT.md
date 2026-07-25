# Galactic Legends — Kit / Status Link Audit

## Linked this pass

### Kit condition trackers (`kitConditionSystem.ts`)
Dedicated battle hooks for kits that need counters / special rules:
- **BH Payout** — Bossk (15 damage taken), Embo (Merciless Pursuit ×3), Aurra (15 debuffs + Contract Broker lead progress)
- **Scum** — Salacious Crumb 10 turns → +50 Speed; Jabba Ultimate Charge on Crumb turns
- **Brotherly Love** — Maul/Savage start bond, shared TM/Offense, Maul below 50% → Savage Defense Up
- **Ewok Traps** — Chirpa / Wicket / Kneesaa / Paploo / Teebo armed at start; fire on HP / Taunt / out-of-turn
- **Endless Legion** — start stacks from leader/unique; death-save consume; GG / Magna / Crab consume rewards
- **Howzer** — untargetable while another Clone Trooper ally is alive
- **Last Hope** — Luke Ultimate Charge + C-3PO TM on gain; Luke charge on ally assists

Wired into `applySquadPassives`, `applyStatus`, damage path, ability use, turn start, `checkDefeat`, `grabValidTargets`, assist/out-of-turn, ignore-defense / irresistible debuffs.

### Description-driven leader/unique passives (`descPassiveSystem.ts`)
Parses kit text for previously unwired leaders/uniques (~88) and installs:
- **Stat auras** at battle start (Speed / Offense% / Defense% / Max HP / Max Prot / Crit / Potency)
- **Whenever** hooks: secrecy gained/consumed, buff/debuff gained, special used, crit, damage dealt/taken, assist, enemy/ally defeated, ally below 50%, burning gained

### Earlier passes (still in effect)
- 34 registry statuses in generic parser
- The Project + Hostage Scientist full system
- Shared verbs: ignore_*, double_strike, consume_*, steal_buff, instakill, sacrifice, burn, etc.
- Health Up / Imperial Approval / Ordered Fire / Blocked
- Conquest scfc basics, Treasure sync

### Note on snake_case effect tokens
Tokens like `taunt`, `offense_down`, `stealth` already map via parser `dbTag` matching — not missing.

## Remaining limitations (honest)
- Natural-language passives that don’t match the common templates still need hand hooks
- Complex Imperial Contract / some GL-only ultimate charge / immunity passives remain niche
- Trap multi-assist uses assistDepth=1 (50% damage path) by design to avoid recursion storms

Core status + Project + shared verbs + desc passives + condition trackers are linked in web + APK.
