# Galactic Legends — Kit / Status Link Audit (static)

Generated from repo source. Focus: **real missing definition ↔ runtime links**.
Working in-battle systems (Combined Arms, Momentum, Lockdown, etc.) are **not** listed as broken.

## Architecture (how links are supposed to work)

1. Ability `effects[]` / `desc` in character data
2. Either:
   - `customAbilityHandlers[ability.id]` runs custom logic, **or**
   - generic `parseAndApplyEffects` applies known buff/debuff tokens
3. Statuses should exist in `STATUS_DEFINITIONS` and be applied via `applyStatus(...)` (or an intentional alt system)

---

## A. Confirmed broken / missing links

### 1. Applied in combat but **missing from status registry**
| Status | Where applied | Problem |
|--------|---------------|---------|
| **Health Up** | `customKitLogic.ts` (`applyStatus(..., 'Health Up', ...)`) | No `STATUS_DEFINITIONS` entry → no stats, flags, or UI definition |

### 2. Used as live status names but **not in registry** (and not via `applyStatus`)
| Name | Where | Problem |
|------|-------|---------|
| **Imperial Approval** | `CombatBattleView.tsx` pushes `{ name: 'Imperial Approval', ... }` on Palpatine journey script | Not in registry; bypasses `applyStatus` |
| **Ordered Fire** | `HoloCombatUnit.tsx` checks `statuses.some(s => s.name === 'Ordered Fire')` | Ability named Ordered Fire exists; **status never applied**; check is dead |
| **Blocked** | `combatAI.ts` treats `Blocked` like Ability Block | Alias not in registry (Ability Block exists) |

### 3. In registry + on kits as effect tags, but **never `applyStatus`'d** (definition without runtime apply)

These have registry entries (and often appear in ability `effects[]`), but combat code never calls `applyStatus` for them:

Accuracy Up, Analysis, Armor Shred, Blaze Of Glory, Bounty, Collector, Contract, Corruption, Critical Chance Down, Dark Maelstrom, Debt, Elusive, Endless Legion, Explosive Charge, Foil, Hostage, Impending Doom, Imperial Contract, Infested, Information Broker, Insight, Intel, Last Hope, Raid Mark, Reanimated, Resolve, Rule of Two, Secrecy, Stagger, Tactical Data, Tortured, Unconventional Tactics, Unlimited Power, Veteran Orders

**Mentioned in code but still never applied:** Entrenched, Payout

**Exception (alt system, intentional):** Treasure — uses `dynamicState` + `addTreasure` / `getTreasure` / `consumeTreasure`, not `applyStatus`.

### 4. Actives with empty `effects` and **no** custom handler
| Ability id | File |
|------------|------|
| scfc1, scfc3, scfc4, scfc5, scfc7 | `src/data/characters/conquest_units.ts` |

These basics have nothing for the generic parser or a custom handler to run.

### 5. Effect tokens that are **labels only** (not executed by generic parser)

Examples used widely as `effects` entries but not implemented as effect verbs:  
`debuff`, `buff_faction`, `passive_boost`, `leader`, `unique`, `double_strike`, `ignore_taunt`, `The Project`, `Hostage Scientist`, `consume_secrecy`, `consume_treasure`, etc.

Unless a custom handler / characterId hook covers the ability, these tags do nothing in combat.

---

## B. Working systems (do not treat as missing)

| System | Evidence |
|--------|----------|
| Combined Arms | `applyStatus` present + registry entry |
| Momentum | multiple `applyStatus` calls + registry |
| Lockdown / Riot Control | applied + in generic parser list |
| Pathfinder / Fatigued / Order 66 | applied + registry |

---

## C. Suggested fix order (when coding)

1. Add **Health Up**, **Imperial Approval**, **Ordered Fire** (if intended as status) to `statusRegistry.ts`; route Imperial Approval through `applyStatus`
2. Wire `applyStatus` (or custom handlers) for the 34 registry-only statuses that kits claim
3. Fill or handler-link conquest `scfc*` basics
4. Align `Blocked` / `ABILITY BLOCK` casing to `Ability Block`
5. Either implement label-only effect tokens or move them to `aiTags` so effects only contain real combat tokens

---

## Counts (static scan)

- Abilities: ~1407
- Custom handlers: ~201
- Registry statuses: 121
- Statuses that call `applyStatus`: 74
- Registry statuses never applied: 36 (+ Treasure alt)
- Missing registry while applied: 1 (Health Up)
