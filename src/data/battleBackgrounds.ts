export interface BattleBackground {
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

export const BATTLE_BACKGROUNDS: BattleBackground[] = [
  {
    "id": "BG_001",
    "name": "Dune Sea",
    "planet": "Tatooine",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "desert"
  },
  {
    "id": "BG_002",
    "name": "Mos Eisley",
    "planet": "Tatooine",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "desert"
  },
  {
    "id": "BG_003",
    "name": "Jabbas Palace",
    "planet": "Tatooine",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "desert"
  },
  {
    "id": "BG_004",
    "name": "Beggars Canyon",
    "planet": "Tatooine",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "desert"
  },
  {
    "id": "BG_005",
    "name": "Moisture Farm",
    "planet": "Tatooine",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "desert"
  },
  {
    "id": "BG_006",
    "name": "Star Destroyer Wreck",
    "planet": "Jakku",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "desert"
  },
  {
    "id": "BG_007",
    "name": "Niima Outpost",
    "planet": "Jakku",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "desert"
  },
  {
    "id": "BG_008",
    "name": "Sand Dunes",
    "planet": "Jakku",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "desert"
  },
  {
    "id": "BG_009",
    "name": "Tuanul Village",
    "planet": "Jakku",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "desert"
  },
  {
    "id": "BG_010",
    "name": "Graveyard",
    "planet": "Jakku",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "desert"
  },
  {
    "id": "BG_011",
    "name": "Holy City",
    "planet": "Jedha",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "desert"
  },
  {
    "id": "BG_012",
    "name": "Kyber Mine",
    "planet": "Jedha",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "desert"
  },
  {
    "id": "BG_013",
    "name": "Desert Plains",
    "planet": "Jedha",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "desert"
  },
  {
    "id": "BG_014",
    "name": "Partisan Base",
    "planet": "Jedha",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "desert"
  },
  {
    "id": "BG_015",
    "name": "Destroyed City",
    "planet": "Jedha",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "desert"
  },
  {
    "id": "BG_016",
    "name": "Petranaki Arena",
    "planet": "Geonosis",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "desert"
  },
  {
    "id": "BG_017",
    "name": "Droid Factory",
    "planet": "Geonosis",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "desert"
  },
  {
    "id": "BG_018",
    "name": "Spire Command",
    "planet": "Geonosis",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "desert"
  },
  {
    "id": "BG_019",
    "name": "Dust Plains",
    "planet": "Geonosis",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "desert"
  },
  {
    "id": "BG_020",
    "name": "Catacombs",
    "planet": "Geonosis",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "desert"
  },
  {
    "id": "BG_021",
    "name": "Echo Base",
    "planet": "Hoth",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "hoth",
    "theme": "ice"
  },
  {
    "id": "BG_022",
    "name": "Ice Plains",
    "planet": "Hoth",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "hoth",
    "theme": "ice"
  },
  {
    "id": "BG_023",
    "name": "Wampa Cave",
    "planet": "Hoth",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "hoth",
    "theme": "ice"
  },
  {
    "id": "BG_024",
    "name": "Trenches",
    "planet": "Hoth",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "hoth",
    "theme": "ice"
  },
  {
    "id": "BG_025",
    "name": "Shield Generator",
    "planet": "Hoth",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "hoth",
    "theme": "ice"
  },
  {
    "id": "BG_026",
    "name": "War-Torn Bridge",
    "planet": "Mygeeto",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "hoth",
    "theme": "ice"
  },
  {
    "id": "BG_027",
    "name": "Crystalline Spire",
    "planet": "Mygeeto",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "hoth",
    "theme": "ice"
  },
  {
    "id": "BG_028",
    "name": "Banking Vault",
    "planet": "Mygeeto",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "hoth",
    "theme": "ice"
  },
  {
    "id": "BG_029",
    "name": "Ash Plains",
    "planet": "Mygeeto",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "hoth",
    "theme": "ice"
  },
  {
    "id": "BG_030",
    "name": "Ruined City",
    "planet": "Mygeeto",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "hoth",
    "theme": "ice"
  },
  {
    "id": "BG_031",
    "name": "Thieves Quarter",
    "planet": "Kijimi",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "hoth",
    "theme": "ice"
  },
  {
    "id": "BG_032",
    "name": "Snowy Rooftops",
    "planet": "Kijimi",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "hoth",
    "theme": "ice"
  },
  {
    "id": "BG_033",
    "name": "Spice Runner Base",
    "planet": "Kijimi",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "hoth",
    "theme": "ice"
  },
  {
    "id": "BG_034",
    "name": "City Square",
    "planet": "Kijimi",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "hoth",
    "theme": "ice"
  },
  {
    "id": "BG_035",
    "name": "Alleyway",
    "planet": "Kijimi",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "hoth",
    "theme": "ice"
  },
  {
    "id": "BG_036",
    "name": "Crystal Cave",
    "planet": "Ilum",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "hoth",
    "theme": "ice"
  },
  {
    "id": "BG_037",
    "name": "Jedi Temple",
    "planet": "Ilum",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "hoth",
    "theme": "ice"
  },
  {
    "id": "BG_038",
    "name": "Snowy Expanse",
    "planet": "Ilum",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "hoth",
    "theme": "ice"
  },
  {
    "id": "BG_039",
    "name": "Trench",
    "planet": "Ilum",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "hoth",
    "theme": "ice"
  },
  {
    "id": "BG_040",
    "name": "Core",
    "planet": "Ilum",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "hoth",
    "theme": "ice"
  },
  {
    "id": "BG_041",
    "name": "Forest Canopy",
    "planet": "Endor",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "forest"
  },
  {
    "id": "BG_042",
    "name": "Ewok Village",
    "planet": "Endor",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "forest"
  },
  {
    "id": "BG_043",
    "name": "Shield Bunker",
    "planet": "Endor",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "forest"
  },
  {
    "id": "BG_044",
    "name": "Landing Pad",
    "planet": "Endor",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "forest"
  },
  {
    "id": "BG_045",
    "name": "Thick Jungle",
    "planet": "Endor",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "forest"
  },
  {
    "id": "BG_046",
    "name": "Wroshyr Tree",
    "planet": "Kashyyyk",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "forest"
  },
  {
    "id": "BG_047",
    "name": "Kachirho Beach",
    "planet": "Kashyyyk",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "forest"
  },
  {
    "id": "BG_048",
    "name": "Refinery",
    "planet": "Kashyyyk",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "forest"
  },
  {
    "id": "BG_049",
    "name": "Forest Floor",
    "planet": "Kashyyyk",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "forest"
  },
  {
    "id": "BG_050",
    "name": "Command Post",
    "planet": "Kashyyyk",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "forest"
  },
  {
    "id": "BG_051",
    "name": "Great Temple",
    "planet": "Yavin 4",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "forest"
  },
  {
    "id": "BG_052",
    "name": "Briefing Room",
    "planet": "Yavin 4",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "forest"
  },
  {
    "id": "BG_053",
    "name": "Jungle Trail",
    "planet": "Yavin 4",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "forest"
  },
  {
    "id": "BG_054",
    "name": "Massassi Ruins",
    "planet": "Yavin 4",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "forest"
  },
  {
    "id": "BG_055",
    "name": "Hangar Bay",
    "planet": "Yavin 4",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "forest"
  },
  {
    "id": "BG_056",
    "name": "Mazs Castle",
    "planet": "Takodana",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "forest"
  },
  {
    "id": "BG_057",
    "name": "Forest Clearing",
    "planet": "Takodana",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "forest"
  },
  {
    "id": "BG_058",
    "name": "Lake",
    "planet": "Takodana",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "forest"
  },
  {
    "id": "BG_059",
    "name": "Castle Basement",
    "planet": "Takodana",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "forest"
  },
  {
    "id": "BG_060",
    "name": "Rubble",
    "planet": "Takodana",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "forest"
  },
  {
    "id": "BG_061",
    "name": "Jedi Temple",
    "planet": "Coruscant",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "city"
  },
  {
    "id": "BG_062",
    "name": "Galactic Senate",
    "planet": "Coruscant",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "city"
  },
  {
    "id": "BG_063",
    "name": "Underworld",
    "planet": "Coruscant",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "city"
  },
  {
    "id": "BG_064",
    "name": "Dexs Diner",
    "planet": "Coruscant",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "city"
  },
  {
    "id": "BG_065",
    "name": "Skylanes",
    "planet": "Coruscant",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "city"
  },
  {
    "id": "BG_066",
    "name": "Shipyard",
    "planet": "Corellia",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "city"
  },
  {
    "id": "BG_067",
    "name": "Coronet City",
    "planet": "Corellia",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "city"
  },
  {
    "id": "BG_068",
    "name": "Slums",
    "planet": "Corellia",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "city"
  },
  {
    "id": "BG_069",
    "name": "Industrial Zone",
    "planet": "Corellia",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "city"
  },
  {
    "id": "BG_070",
    "name": "Spaceport",
    "planet": "Corellia",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "city"
  },
  {
    "id": "BG_071",
    "name": "Republic City",
    "planet": "Hosnian Prime",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "city"
  },
  {
    "id": "BG_072",
    "name": "Fleet Command",
    "planet": "Hosnian Prime",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "city"
  },
  {
    "id": "BG_073",
    "name": "Plaza",
    "planet": "Hosnian Prime",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "city"
  },
  {
    "id": "BG_074",
    "name": "Senate Building",
    "planet": "Hosnian Prime",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "city"
  },
  {
    "id": "BG_075",
    "name": "Urban Center",
    "planet": "Hosnian Prime",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "city"
  },
  {
    "id": "BG_076",
    "name": "Cloning Facility",
    "planet": "Kamino",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "water"
  },
  {
    "id": "BG_077",
    "name": "Stormy Platforms",
    "planet": "Kamino",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "water"
  },
  {
    "id": "BG_078",
    "name": "Tipoca City",
    "planet": "Kamino",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "water"
  },
  {
    "id": "BG_079",
    "name": "Jangos Quarters",
    "planet": "Kamino",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "water"
  },
  {
    "id": "BG_080",
    "name": "Ocean Depths",
    "planet": "Kamino",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "water"
  },
  {
    "id": "BG_081",
    "name": "Coral City",
    "planet": "Mon Cala",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "water"
  },
  {
    "id": "BG_082",
    "name": "Deep Ocean",
    "planet": "Mon Cala",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "water"
  },
  {
    "id": "BG_083",
    "name": "Cruiser Hangar",
    "planet": "Mon Cala",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "water"
  },
  {
    "id": "BG_084",
    "name": "Reefs",
    "planet": "Mon Cala",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "water"
  },
  {
    "id": "BG_085",
    "name": "Throne Room",
    "planet": "Mon Cala",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "water"
  },
  {
    "id": "BG_086",
    "name": "Island Cliffs",
    "planet": "Ahch-To",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "water"
  },
  {
    "id": "BG_087",
    "name": "Jedi Temple",
    "planet": "Ahch-To",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "water"
  },
  {
    "id": "BG_088",
    "name": "Caretaker Village",
    "planet": "Ahch-To",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "water"
  },
  {
    "id": "BG_089",
    "name": "Mirror Cave",
    "planet": "Ahch-To",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "water"
  },
  {
    "id": "BG_090",
    "name": "Ocean View",
    "planet": "Ahch-To",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "water"
  },
  {
    "id": "BG_091",
    "name": "Vaders Castle",
    "planet": "Mustafar",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "volcanic"
  },
  {
    "id": "BG_092",
    "name": "Mining Complex",
    "planet": "Mustafar",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "volcanic"
  },
  {
    "id": "BG_093",
    "name": "Lava River",
    "planet": "Mustafar",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "volcanic"
  },
  {
    "id": "BG_094",
    "name": "Control Room",
    "planet": "Mustafar",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "volcanic"
  },
  {
    "id": "BG_095",
    "name": "Obsidian Cliff",
    "planet": "Mustafar",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "volcanic"
  },
  {
    "id": "BG_096",
    "name": "Lava Tubes",
    "planet": "Sullust",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "volcanic"
  },
  {
    "id": "BG_097",
    "name": "Imperial Factory",
    "planet": "Sullust",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "volcanic"
  },
  {
    "id": "BG_098",
    "name": "Ash Plains",
    "planet": "Sullust",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "volcanic"
  },
  {
    "id": "BG_099",
    "name": "Magma River",
    "planet": "Sullust",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "volcanic"
  },
  {
    "id": "BG_100",
    "name": "Bunker",
    "planet": "Sullust",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "volcanic"
  },
  {
    "id": "BG_101",
    "name": "Town Center",
    "planet": "Nevarro",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "volcanic"
  },
  {
    "id": "BG_102",
    "name": "Lava Flats",
    "planet": "Nevarro",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "volcanic"
  },
  {
    "id": "BG_103",
    "name": "Imperial Base",
    "planet": "Nevarro",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "volcanic"
  },
  {
    "id": "BG_104",
    "name": "Cantina",
    "planet": "Nevarro",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "volcanic"
  },
  {
    "id": "BG_105",
    "name": "Statue Square",
    "planet": "Nevarro",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "volcanic"
  },
  {
    "id": "BG_106",
    "name": "Swamp Edge",
    "planet": "Dagobah",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "swamp"
  },
  {
    "id": "BG_107",
    "name": "Yodas Hut",
    "planet": "Dagobah",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "swamp"
  },
  {
    "id": "BG_108",
    "name": "Dark Cave",
    "planet": "Dagobah",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "swamp"
  },
  {
    "id": "BG_109",
    "name": "X-Wing Bog",
    "planet": "Dagobah",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "swamp"
  },
  {
    "id": "BG_110",
    "name": "Mist Forest",
    "planet": "Dagobah",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "swamp"
  },
  {
    "id": "BG_111",
    "name": "Theed Palace",
    "planet": "Naboo",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "swamp"
  },
  {
    "id": "BG_112",
    "name": "Grassy Plains",
    "planet": "Naboo",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "swamp"
  },
  {
    "id": "BG_113",
    "name": "Otoh Gunga",
    "planet": "Naboo",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "swamp"
  },
  {
    "id": "BG_114",
    "name": "Plasma Core",
    "planet": "Naboo",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "swamp"
  },
  {
    "id": "BG_115",
    "name": "Swamp",
    "planet": "Naboo",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "swamp"
  },
  {
    "id": "BG_116",
    "name": "Mushroom Forest",
    "planet": "Felucia",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "swamp"
  },
  {
    "id": "BG_117",
    "name": "Bioluminescent Bog",
    "planet": "Felucia",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "swamp"
  },
  {
    "id": "BG_118",
    "name": "Sarlacc Pit",
    "planet": "Felucia",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "swamp"
  },
  {
    "id": "BG_119",
    "name": "Overgrowth",
    "planet": "Felucia",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "swamp"
  },
  {
    "id": "BG_120",
    "name": "Clearing",
    "planet": "Felucia",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "swamp"
  },
  {
    "id": "BG_121",
    "name": "Sith Temple",
    "planet": "Exegol",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "sith"
  },
  {
    "id": "BG_122",
    "name": "Cloning Vats",
    "planet": "Exegol",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "sith"
  },
  {
    "id": "BG_123",
    "name": "Lightning Storm",
    "planet": "Exegol",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "sith"
  },
  {
    "id": "BG_124",
    "name": "Throne Room",
    "planet": "Exegol",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "sith"
  },
  {
    "id": "BG_125",
    "name": "Arena",
    "planet": "Exegol",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "sith"
  },
  {
    "id": "BG_126",
    "name": "Sith Temple Ruins",
    "planet": "Malachor",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "sith"
  },
  {
    "id": "BG_127",
    "name": "Battlefield",
    "planet": "Malachor",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "sith"
  },
  {
    "id": "BG_128",
    "name": "Underground Vault",
    "planet": "Malachor",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "sith"
  },
  {
    "id": "BG_129",
    "name": "Weapon Core",
    "planet": "Malachor",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "sith"
  },
  {
    "id": "BG_130",
    "name": "Petrified Forest",
    "planet": "Malachor",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "sith"
  },
  {
    "id": "BG_131",
    "name": "Valley of the Dark Lords",
    "planet": "Moraband",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "sith"
  },
  {
    "id": "BG_132",
    "name": "Sith Academy",
    "planet": "Moraband",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "sith"
  },
  {
    "id": "BG_133",
    "name": "Tomb",
    "planet": "Moraband",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "sith"
  },
  {
    "id": "BG_134",
    "name": "Desert Wastes",
    "planet": "Moraband",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "sith"
  },
  {
    "id": "BG_135",
    "name": "Altar",
    "planet": "Moraband",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "sith"
  },
  {
    "id": "BG_136",
    "name": "Nightbrother Village",
    "planet": "Dathomir",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "sith"
  },
  {
    "id": "BG_137",
    "name": "Witches Fortress",
    "planet": "Dathomir",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "sith"
  },
  {
    "id": "BG_138",
    "name": "Red Swamp",
    "planet": "Dathomir",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "sith"
  },
  {
    "id": "BG_139",
    "name": "Graveyard",
    "planet": "Dathomir",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "sith"
  },
  {
    "id": "BG_140",
    "name": "Cliff",
    "planet": "Dathomir",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "mustafar",
    "theme": "sith"
  },
  {
    "id": "BG_141",
    "name": "Mountains",
    "planet": "Alderaan",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "forest"
  },
  {
    "id": "BG_142",
    "name": "Palace",
    "planet": "Alderaan",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "forest"
  },
  {
    "id": "BG_143",
    "name": "City Center",
    "planet": "Alderaan",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "forest"
  },
  {
    "id": "BG_144",
    "name": "Royal Gardens",
    "planet": "Alderaan",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "forest"
  },
  {
    "id": "BG_145",
    "name": "Balcony",
    "planet": "Alderaan",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "endor",
    "theme": "forest"
  },
  {
    "id": "BG_146",
    "name": "Grasslands",
    "planet": "Lothal",
    "category": "Landmark",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "desert"
  },
  {
    "id": "BG_147",
    "name": "Jedi Temple",
    "planet": "Lothal",
    "category": "Settlement",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "desert"
  },
  {
    "id": "BG_148",
    "name": "Imperial Complex",
    "planet": "Lothal",
    "category": "Facility",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "desert"
  },
  {
    "id": "BG_149",
    "name": "Capital City",
    "planet": "Lothal",
    "category": "Wilderness",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "desert"
  },
  {
    "id": "BG_150",
    "name": "Rebels Base",
    "planet": "Lothal",
    "category": "Outpost",
    "style": {
      "background": "transparent"
    },
    "particles": "none",
    "theme": "desert"
  }
];

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
