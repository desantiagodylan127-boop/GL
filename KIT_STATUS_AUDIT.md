# Galactic Legends — Kit / Status Link Audit

## Linked this pass

### Description-driven leader/unique passives (`descPassiveSystem.ts`)
Parses kit text for previously unwired leaders/uniques (~88) and installs:
- **Stat auras** at battle start (Speed / Offense% / Defense% / Max HP / Max Prot / Crit / Potency)
- **Whenever** hooks: secrecy gained/consumed, buff/debuff gained, special used, crit, damage dealt/taken, assist, enemy/ally defeated, ally below 50%, burning gained

Wired into `applySquadPassives`, `applyStatus`, damage/crit path, assists, defeat hooks, Secrecy consume.

### Earlier passes (still in effect)
- 34 registry statuses in generic parser
- The Project + Hostage Scientist full system
- Shared verbs: ignore_*, double_strike, consume_*, steal_buff, instakill, sacrifice, burn, etc.
- Health Up / Imperial Approval / Ordered Fire / Blocked
- Conquest scfc basics, Treasure sync

### Note on snake_case effect tokens
Tokens like `taunt`, `offense_down`, `stealth` already map via parser `dbTag` matching — not missing.

## Remaining limitations (honest)
- Natural-language passives that don’t match the common “Whenever X: Y” / “allies gain +N Speed” templates still need hand hooks
- Complex payout/contract/scum condition trackers (Bossk 15 hits, Embo pursuit counts, etc.) need dedicated counters beyond generic desc parsing
- Some GL-specific ultimate charge / immunity passives remain niche

Those are the next incremental targets; core status + Project + shared verbs + generic leader auras/whenever are linked in web + APK.
