# Galactic Legends — Kit / Status Link Audit

## Linked

### Imperial Contract (`imperialContractSystem.ts`)
Full Rebel Hunter Contract lifecycle: apply on Dengar lead → damage prot → transfer on defeat → ability gates / extras → Keibu summon & assists → Embo/IG/Zuckuss/4-LOM/Storm Commando hooks.

### Hutt Cartel Contracts + Rotta Scum (`huttContractSystem.ts`)
- Bib / Boba / Jabba Contract progress (rewards on completion, not premature battle-start)
- Bribed / Intimidated TM rules, Bribed bonus damage, prot-on-debuff rewards
- Rotta Scum ecosystem, death-saves, untargetable, Crumb Scum shared earn path

### Kit condition trackers (`kitConditionSystem.ts`)
BH Payout, Crumb Scum, Brotherly Love, Ewok Traps, Endless Legion, Howzer, Last Hope / Luke charge

### Description-driven passives (`descPassiveSystem.ts`)
~88 leader/unique auras + whenever hooks

### Earlier
The Project, shared effect verbs, status registry/parser links, Corsair Payout

### Bugfix
Leia Ultimate Charge now looks up `leia_gl` (was broken `gl_leia` id)

## Honest leftovers
Mon Mothma kit text mentions Ultimate Charge but she has no ultimate ability — charge would be dead unless an ultimate is added.
Some ultra-niche “until start of next turn” trackers (e.g. Zuckuss Predictive Tracking TM tax) are partially stubbed.
