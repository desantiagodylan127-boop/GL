export interface GearPiece {
  id: string;
  name: string;
  tier: number;
  slot: number;
  find: string;
  cost: number;
}

export const GEAR_DICT: Record<string, GearPiece> = {};
export const ALL_GEAR_PIECES: GearPiece[] = [];

// Pre-generate all 72 pieces (tiers 1-12, slots 0-5)
const genericNames = [
  'SoroSuub Keypad',
  'Czerka Stun Cuffs',
  'Arakyd Droid Caller',
  'Merr-Sonn Thermal Detonator',
  'Zaltin Bacta Gel',
  'Chiewab Hypo Syringe',
  'Fabritech Data Pad',
  'Corellian Comlink',
  'Sienar Holo Projector',
  'Neuro-Saav Electrobinoculars',
  'Gregar Sensor Array',
  'Carbanti Sensor Array'
];

for (let t = 1; t <= 12; t++) {
  for (let s = 0; s <= 5; s++) {
    const id = `gear_t${t}_s${s}`;
    const prefix = t < 4 ? 'Mk 1' : t < 7 ? 'Mk 3' : t < 10 ? 'Mk 5' : 'Mk 7';
    // Shift generic name index based on tier + slot so it varies per level
    const nameIndex = ((t * 2) + s) % genericNames.length;
    const baseName = genericNames[nameIndex];
    let rarityColor = 'text-gray-300';
    if (t > 4) rarityColor = 'text-green-400';
    if (t > 7) rarityColor = 'text-blue-400';
    if (t > 10) rarityColor = 'text-purple-400';

    const name = `${prefix} ${baseName}`;
    let find = 'Farm Campaign Series I (Sectors 1-3) or Scavenger';
    if (t >= 5 && t <= 8) find = 'Farm Campaign Series II (Sectors 4-6) or Scavenger';
    if (t >= 9) find = 'Farm Campaign Series III (Sectors 7-9) or Scavenger';

    const count = t < 5 ? 2 : t < 9 ? 3 : 5;
    const cost = count * (t * 50);

    const piece = { id, name, tier: t, slot: s, find, cost };
    GEAR_DICT[id] = piece;
    ALL_GEAR_PIECES.push(piece);
  }
}

export function getGearPiece(tier: number, slot: number): GearPiece {
  return GEAR_DICT[`gear_t${tier}_s${slot}`] || { id: `max_gear_${slot}`, name: 'Max Level Component', tier, slot, find: 'N/A', cost: 1000 };
}

