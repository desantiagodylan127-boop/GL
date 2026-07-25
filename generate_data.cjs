const fs = require('fs');

const planetsData = [
  { name: 'Tatooine', theme: 'desert', locs: ['Dune Sea', 'Mos Eisley', 'Jabbas Palace', 'Beggars Canyon', 'Moisture Farm'] },
  { name: 'Jakku', theme: 'desert', locs: ['Star Destroyer Wreck', 'Niima Outpost', 'Sand Dunes', 'Tuanul Village', 'Graveyard'] },
  { name: 'Jedha', theme: 'desert', locs: ['Holy City', 'Kyber Mine', 'Desert Plains', 'Partisan Base', 'Destroyed City'] },
  { name: 'Geonosis', theme: 'desert', locs: ['Petranaki Arena', 'Droid Factory', 'Spire Command', 'Dust Plains', 'Catacombs'] },
  { name: 'Hoth', theme: 'ice', locs: ['Echo Base', 'Ice Plains', 'Wampa Cave', 'Trenches', 'Shield Generator'] },
  { name: 'Mygeeto', theme: 'ice', locs: ['War-Torn Bridge', 'Crystalline Spire', 'Banking Vault', 'Ash Plains', 'Ruined City'] },
  { name: 'Kijimi', theme: 'ice', locs: ['Thieves Quarter', 'Snowy Rooftops', 'Spice Runner Base', 'City Square', 'Alleyway'] },
  { name: 'Ilum', theme: 'ice', locs: ['Crystal Cave', 'Jedi Temple', 'Snowy Expanse', 'Trench', 'Core'] },
  { name: 'Endor', theme: 'forest', locs: ['Forest Canopy', 'Ewok Village', 'Shield Bunker', 'Landing Pad', 'Thick Jungle'] },
  { name: 'Kashyyyk', theme: 'forest', locs: ['Wroshyr Tree', 'Kachirho Beach', 'Refinery', 'Forest Floor', 'Command Post'] },
  { name: 'Yavin 4', theme: 'forest', locs: ['Great Temple', 'Briefing Room', 'Jungle Trail', 'Massassi Ruins', 'Hangar Bay'] },
  { name: 'Takodana', theme: 'forest', locs: ['Mazs Castle', 'Forest Clearing', 'Lake', 'Castle Basement', 'Rubble'] },
  { name: 'Coruscant', theme: 'city', locs: ['Jedi Temple', 'Galactic Senate', 'Underworld', 'Dexs Diner', 'Skylanes'] },
  { name: 'Corellia', theme: 'city', locs: ['Shipyard', 'Coronet City', 'Slums', 'Industrial Zone', 'Spaceport'] },
  { name: 'Hosnian Prime', theme: 'city', locs: ['Republic City', 'Fleet Command', 'Plaza', 'Senate Building', 'Urban Center'] },
  { name: 'Kamino', theme: 'water', locs: ['Cloning Facility', 'Stormy Platforms', 'Tipoca City', 'Jangos Quarters', 'Ocean Depths'] },
  { name: 'Mon Cala', theme: 'water', locs: ['Coral City', 'Deep Ocean', 'Cruiser Hangar', 'Reefs', 'Throne Room'] },
  { name: 'Ahch-To', theme: 'water', locs: ['Island Cliffs', 'Jedi Temple', 'Caretaker Village', 'Mirror Cave', 'Ocean View'] },
  { name: 'Mustafar', theme: 'volcanic', locs: ['Vaders Castle', 'Mining Complex', 'Lava River', 'Control Room', 'Obsidian Cliff'] },
  { name: 'Sullust', theme: 'volcanic', locs: ['Lava Tubes', 'Imperial Factory', 'Ash Plains', 'Magma River', 'Bunker'] },
  { name: 'Nevarro', theme: 'volcanic', locs: ['Town Center', 'Lava Flats', 'Imperial Base', 'Cantina', 'Statue Square'] },
  { name: 'Dagobah', theme: 'swamp', locs: ['Swamp Edge', 'Yodas Hut', 'Dark Cave', 'X-Wing Bog', 'Mist Forest'] },
  { name: 'Naboo', theme: 'swamp', locs: ['Theed Palace', 'Grassy Plains', 'Otoh Gunga', 'Plasma Core', 'Swamp'] },
  { name: 'Felucia', theme: 'swamp', locs: ['Mushroom Forest', 'Bioluminescent Bog', 'Sarlacc Pit', 'Overgrowth', 'Clearing'] },
  { name: 'Exegol', theme: 'sith', locs: ['Sith Temple', 'Cloning Vats', 'Lightning Storm', 'Throne Room', 'Arena'] },
  { name: 'Malachor', theme: 'sith', locs: ['Sith Temple Ruins', 'Battlefield', 'Underground Vault', 'Weapon Core', 'Petrified Forest'] },
  { name: 'Moraband', theme: 'sith', locs: ['Valley of the Dark Lords', 'Sith Academy', 'Tomb', 'Desert Wastes', 'Altar'] },
  { name: 'Dathomir', theme: 'sith', locs: ['Nightbrother Village', 'Witches Fortress', 'Red Swamp', 'Graveyard', 'Cliff'] },
  { name: 'Alderaan', theme: 'forest', locs: ['Mountains', 'Palace', 'City Center', 'Royal Gardens', 'Balcony'] },
  { name: 'Lothal', theme: 'desert', locs: ['Grasslands', 'Jedi Temple', 'Imperial Complex', 'Capital City', 'Rebels Base'] }
];

let backgrounds = [];
let idCounter = 1;

planetsData.forEach((p) => {
  p.locs.forEach((loc, idx) => {
    let category = 'Unknown';
    if (idx === 0) category = 'Landmark';
    if (idx === 1) category = 'Settlement';
    if (idx === 2) category = 'Facility';
    if (idx === 3) category = 'Wilderness';
    if (idx === 4) category = 'Outpost';

    let id = `BG_${idCounter.toString().padStart(3, '0')}`;
    idCounter++;
    
    // We'll let BattleScenery handle the visual style completely, so style can just be an empty object or a base fallback color
    let particleType = 'none';
    if (p.theme === 'ice') particleType = 'hoth';
    if (p.theme === 'volcanic' || p.theme === 'sith') particleType = 'mustafar';
    if (p.theme === 'forest' || p.theme === 'swamp') particleType = 'endor';

    backgrounds.push({
      id,
      name: loc,
      planet: p.name,
      category,
      style: { background: 'transparent' },
      particles: particleType,
      theme: p.theme
    });
  });
});

let output = `export interface BattleBackground {
  id: string;
  name: string;
  planet: string;
  category: string;
  theme: string;
  style: {
    background: string;
    boxShadow?: string;
  };
  particles: string;
}

export const BATTLE_BACKGROUNDS: BattleBackground[] = ${JSON.stringify(backgrounds, null, 2)};

export function getFallbackBackground(seed: string): BattleBackground {
  if (!seed) {
    return BATTLE_BACKGROUNDS[0];
  }
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % BATTLE_BACKGROUNDS.length;
  return BATTLE_BACKGROUNDS[index];
}
`;

fs.writeFileSync('src/data/battleBackgrounds.ts', output);
console.log('Generated battleBackgrounds.ts');
