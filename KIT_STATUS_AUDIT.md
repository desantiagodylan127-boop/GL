# Galactic Legends — Kit / Status Link Audit

## The Project — YES, fully defined in kits

From Imperial Architect ability text, The Project is:

- **Team-wide stack** shared by Imperial Architects (not per-unit only)
- **Gains** from ability text (“Gain N stacks of The Project”)
- **Complete at 25** → unlocks Piett’s Authority By All Means; team Offense/Defense Up; Krennic/Dodd thresholds
- **Milestones 10/15/20** → Krennic lead Protection recover; Engineer CD −1
- **Passives**: specials/defeats/Galen damage/buffs/Taunt hits advance stacks
- **Consume**: Bevel Superlaser (up to 5); Authority consumes all
- **Hostage Scientist**: Galen start-of-battle undispellable buff; damage/defeat advance Project

**Now wired** in `projectSystem.ts` + combat hooks (web + rebuilt APK).

---

## Status: what was linked this pass

### The Project system
Registry: `The Project`, `The Project Complete`, `Hostage Scientist`  
Runtime: stack tracking, thresholds, Authority instakill, Galen sacrifice, Bevel consume, Architect passives

### Shared effect verbs now handled
`double_strike` / `bonus_attack`, `ignore_taunt` / `ignore_stealth` / `ignore_defense` / `ignore_protection` / `ignore_foresight`, `consume_secrecy`, `consume_treasure`, `steal_buff`, `cooldown_decrease*`, `instakill` / `prevent_revive`, `sacrifice`, `burn` / `burn_all`, `crit_chance_up` / `crit_damage_up` / `evasion_up`, `max_health_reduction`, `swap_turn_meter`, `turn_meter_gain_ally`, faction filter includes Imperial Architects

### Previously fixed
34 registry statuses in generic parser; Health Up / Imperial Approval / Ordered Fire / Blocked; Treasure sync; scfc basics

---

## Still remaining (leader/unique *passive* fidelity)

Many `leader` / `unique` abilities still rely on empty `effects` + missing characterId hooks. Meta tags (`leader`, `unique`, `passive_boost`) are not combat verbs.

High-count leftovers to keep wiring next:
- Per-character unique/leader passives without hooks
- Niche tokens (`save_ally`, `contract_leader`, `buff_gl_faction`, `mastery_passive`, …)

Combat statuses claimed by actives are largely linked; **passive kit text** is the next bulk pass.
