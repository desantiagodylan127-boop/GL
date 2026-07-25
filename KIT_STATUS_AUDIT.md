# Galactic Legends — Kit / Status Link Audit

## Status: FIXED (web + APK)

Working in-battle systems were never treated as broken: Combined Arms, Momentum, Lockdown, Riot Control, Pathfinder, Fatigued, Order 66.

### What was fixed

1. **Health Up, Imperial Approval, Ordered Fire, Blocked** added to `STATUS_DEFINITIONS`
2. **Generic parser** in `parseAndApplyEffects` now applies the previously unwired registry statuses when they appear in ability `effects[]` (buffs + debuffs), including AoE variants (`*_aoe`)
3. **Long-duration / stacking** statuses use duration 99 where appropriate (Last Hope, Endless Legion, Contracts, etc.)
4. **Expose → Exposed** and **Blocked → Ability Block** aliases normalized on apply
5. **Imperial Approval** journey script uses `applyStatus` instead of a raw status push
6. **Pellaeon Ordered Fire** basic now includes the `Ordered Fire` effect token
7. **Treasure** alt system syncs the `Treasure` status stacks for UI
8. **Conquest `scfc*`** basics given real descriptions + effects

### Previously missing (now in generic apply lists)

Accuracy Up, Analysis, Armor Shred, Blaze Of Glory, Bounty, Collector, Contract, Corruption, Critical Chance Down, Dark Maelstrom, Debt, Elusive, Endless Legion, Explosive Charge, Foil, Hostage, Impending Doom, Imperial Contract, Infested, Information Broker, Insight, Intel, Last Hope, Raid Mark, Reanimated, Resolve, Rule of Two, Secrecy, Stagger, Tactical Data, Tortured, Unconventional Tactics, Unlimited Power, Veteran Orders, Entrenched, Payout (+ Momentum / Combined Arms also effect-tag applicable)

### Remaining follow-ups (not blockers for this fix)

- Label-only effect tokens (`debuff`, `leader`, `The Project`, …) still need custom handlers or migration to `aiTags` for full kit fidelity beyond status application
- Leader/unique passives with empty `effects` still rely on characterId hooks / squad passives
