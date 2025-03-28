const BRANDS = {
  ACOPA: "Acopa",
  ALPIDEX: "Alpidex",
  ASAKUSA: "Asakusa",
  BLACK_DIAMOND: "Black Diamond",
  BOREAL: "Boreal",
  BUTORA: "Butora",
  CLIMB_X: "Climb X",
  CYPHER: "Cypher",
  EB: "EB",
  EVOLV: "Evolv",
  FIVE_TEN: "Five Ten",
  GARRA: "Garra",
  JURAX: "Jurax",
  LA_SPORTIVA: "La Sportiva",
  LAVAN: "Lavan",
  LOWA: "Lowa",
  MAD_ROCK: "Mad Rock",
  MILLET: "Millet",
  OCUN: "Ocun",
  RED_CHILI: "Red Chili",
  SALTIC: "Saltic",
  SCARPA: "Scarpa",
  SIMOND: "Simond",
  SNAKE: "Snake",
  SO_ILL: "So iLL",
  TENAYA: "Tenaya",
  TRIOP: "Triop",
  TULSON_TOLF: "Tulson Tolf",
  UNPARALLEL: "Unparallel",
  WILD_CLIMB: "Wild Climb",
} as const;
type Brand = (typeof BRANDS)[keyof typeof BRANDS];

const SHOES: Record<Brand, string[]> = {
  [BRANDS.ACOPA]: [
    "AZTEC",
    "B3",
    "CHAMELEON",
    "ENZO",
    "FLY",
    "GAMA",
    "JB",
    "LEGEND",
    "MERLIN",
    "NOVA",
    "NOVA LACES",
    "SHOT",
    "SPECTRE",
  ],
  [BRANDS.ALPIDEX]: [],
  [BRANDS.ASAKUSA]: [],
  [BRANDS.BLACK_DIAMOND]: [
    "Aspect",
    "Aspect Pro",
    "Focus",
    "Method",
    "Method S",
    "Momentum",
    "Momentum Lace",
    "Session",
    "Shadow",
    "Shadow LV",
    "Zone",
    "Zone LV",
  ],
  [BRANDS.BOREAL]: [
    "Ace",
    "Alpha",
    "Ballet",
    "Beta",
    "Beta Eco",
    "Crux",
    "Crux Lace",
    "Dharma",
    "Diabola",
    "Diabolo",
    "Joker",
    "Joker Lace",
    "Joker Plus",
    "Mutant",
    "Ninja",
    "Satori",
    "Silex",
    "Synergy",
  ],
  [BRANDS.BUTORA]: [
    "Acro Comp",
    "Altura",
    "Brava",
    "Endeavor",
    "Gomi Spider",
    "Habara",
    "Mantra",
    "New Bora",
  ],
  [BRANDS.CLIMB_X]: [],
  [BRANDS.CYPHER]: [],
  [BRANDS.EB]: [
    "Jarvis Velcro",
    "Balboa",
    "Nebula",
    "Jarvis Lace",
    "Strange",
    "Black Opium",
    "Red",
    "Guardian",
    "Django 3.0",
    "Electron",
    "Mojo",
    "Torch Lace 3.0",
    "Neo Kid",
  ],
  [BRANDS.EVOLV]: [
    "Defy Lace",
    "Defy",
    "Eldo Z",
    "Elektra Lace",
    "Elektra",
    "Geshido Lace",
    "Geshido",
    "Kira",
    "Kronos",
    "Phantom",
    "Phantom LV",
    "Rave",
    "Shaktra",
    "Shaman",
    "Shaman Lace",
    "Shaman Lace LV",
    "Shaman LV",
    "Shaman Pro",
    "Shaman Pro LV",
    "The General",
    "Titan",
    "Venga",
    "Yosemite Bum",
    "Yosemite Bum LV",
    "Zenist",
    "Zenist Pro",
    "Zenist Pro LV",
    "V6",
  ],
  [BRANDS.FIVE_TEN]: [
    "Kirigami",
    "Crawe",
    "Niad Lace",
    "Niad Moccasym",
    "Niad VCS",
    "Hiangle Pro",
    "Hiangle",
    "Rogue VCS",
    "Aleon",
    "Quantum VCS",
    "Asym",
    "Anasazi",
    "Anasazi VCS",
    "Grandstone",
  ],
  [BRANDS.GARRA]: ["Kamae", "Sensei", "Kokoro", "Kyoso"],
  [BRANDS.JURAX]: [],
  [BRANDS.LA_SPORTIVA]: [
    "Miura",
    "Miura VS",
    "TC Pro",
    "Katana",
    "Katana Lace",
    "Kataki",
    "Mantra",
    "Skwama Vegan",
    "Tarantula Boulder",
    "Tarantula",
    "Tarantulace",
    "Aragon",
    "Finale",
    "Kubo",
    "Mandala",
    "Mistral",
    "Mythos Eco",
    "Mythos",
    "Cobra",
    "Cobra 4.99",
    "Cobra 4:99",
    "Cobra Eco",
    "Skwama",
    "Otaki",
    "Solution Comp",
    "Solution",
    "Theory",
    "Futura",
    "Genius",
    "Testarossa",
    "Mega Ice Evo",
    "Python",
    "Stickit",
    "Ondra Comp",
    "Speedster",
    "Zenit",
  ],
  [BRANDS.LAVAN]: [],
  [BRANDS.LOWA]: [],
  [BRANDS.MAD_ROCK]: [
    "Drone Comp LV",
    "Drone Comp HV",
    "Redline Strap",
    "Shark 2.0",
    "Drone LV Black",
    "Drone HV Black",
    "Drone LV",
    "Drone CS HV",
    "Drone CS LV",
    "Drone HV",
    "Rover",
    "Haywire",
    "Lotus",
    "Redline Lace",
    "Redline Strap",
    "Weaver",
    "Remora",
    "Remora LV",
    "Remora HV",
    "Remora Tokyo",
    "M5",
    "Lyra",
    "Demon 2.0",
    "Agama",
    "Flash 2.0",
    "Drifter",
    "Pulse Negative",
    "Pulse Positive",
    "Badger",
    "Phoenix",
    "Shark 3.0",
  ],
  [BRANDS.MILLET]: ["EASY UP", "ROCK UP EVO", "SIURANA EVO"],
  [BRANDS.OCUN]: [
    "Fury",
    "Diamond",
    "Ozone",
    "Ozone HV",
    "Bullit",
    "Havoc",
    "Jett QC",
    "Jett LU",
    "Jett Crack",
    "Pearl 20th Anniversary",
    "Advancer QC",
    "Advancer LU",
    "Striker LU",
    "Striker QC",
    "Rival",
    "Rental",
    "Ribbit",
    "Iris",
    "Oxi Lu",
    "Sigma",
    "Pearl",
  ],
  [BRANDS.RED_CHILI]: [
    "Sensor",
    "Mystix",
    "Voltage 2",
    "Voltage LV",
    "Voltage Lace",
    "Fusion",
    "Fusion LV",
    "Puzzle",
    "Circuit LV",
    "Circuit",
    "Ventic Air Lace",
    "Sausalito",
    "Session 4 S",
    "Session",
    "Pulpo",
    "Session Air",
  ],
  [BRANDS.SALTIC]: [],
  [BRANDS.SCARPA]: [
    "Mago",
    "Boostic",
    "Booster",
    "Vapor V",
    "Vapor",
    "Vapor S",
    "Veloce",
    "Veloce Lace",
    "Reflex",
    "Velocity",
    "Reflex V",
    "Drago",
    "Drago LV",
    "Chimera",
    "Furia S",
    "Furia Air",
    "Instinct VS",
    "Instinct",
    "Instinct SR",
    "Instinct VSR",
    "Arpia",
    "Maestro Eco",
    "Maestro Alpine",
    "Maestro Mid Eco",
    "Helix",
    "Origin",
    "Jungle",
    "Force V",
    "Force",
    "Generator Mid",
    "Generator",
    "Quantix SF",
    "Quantic",
  ],
  [BRANDS.SIMOND]: [
    "Klimb",
    "EDGE SOFT",
    "VERTIKA SOFT",
    "VERTIKA",
    "EDGE LACES",
    "EDGE SLIPPER",
  ],
  [BRANDS.SNAKE]: [],
  [BRANDS.SO_ILL]: [
    "The Onset",
    "New Zero",

    "Free Range LV",
    "Street LV",
    "The Street",
    "Momoa Pro",
    "Momoa Pro LV",
    "Free Range Pro",
    "Street",
    "Stay",
    "Catch",
    "The Runner LV",
    "The Runner",
    "Free Range",
  ],
  [BRANDS.TENAYA]: [
    "Indalo",
    "Mastia",
    "Mundaka",
    "Lati",
    "Tarifa",
    "Oasi",
    "Oasi LV",
    "Ra",
    "Masai",
    "Inti",
    "Tatanka",
    "Aqua+",
    "Arai",
    "Tanta",
    "Tanta Laces",
    "Tanta LX",
  ],
  [BRANDS.TRIOP]: [
    "RAP",
    "PHET MAAK VCR",
    "PHET MAAK",
    "GENUS VCR",
    "GENUS",
    "CONGA GREEN",
    "TIGER TOP",
    "TANGO LADY",
    "TANGO",
    "START",
    "ORCA",
    "RENTAL VCR",
    "JUNIOR",
    "TANTRUM",
  ],
  [BRANDS.TULSON_TOLF]: [
    "OUT",
    "IN",
    "UTAH",
    "Qubit Invernal",
    "Qubit",
    "Trad Xhard",
    "Trad Velcro",
    "Trad Laces",
    "Trad Invernal",
    "Step 2",
    "Step 1",
    "Grade Velcro",
    "Grade Laces",
    "California",
    "Grade Indoor",
  ],
  [BRANDS.UNPARALLEL]: [
    "UP Pivot",
    "Souped UP",
    "Engage Lace UP",
    "TN Pro LV",
    "TN Pro",
    "Flagship LV",
    "Flagship",
    "UP Rise Pro",
    "Leopard 2",
    "UP Duel",
    "Lyra",
    "Regulus",
    "Regulus LV",
    "Vim",
    "Sirius Lace",
    "Sirius Lace LV",
    "Newtro VCS",
    "UP Rise VCS",
    "UP Rise VCS LV",
    "UP Rise Zero VCS LV",
    "UP Lace",
    "UP Lace LV",
    "Engage VCS",
    "Engage VCS LV",
    "Newtro Lace",
    "Vega",
    "UP Mocc",
    "Grade Mocc",
    "Grade Engage",
    "Hold Up Slipper",
    "Hold Up VCS",
    "Leopard II",
  ],
  [BRANDS.WILD_CLIMB]: [
    "Mangusta",
    "Pantera Laser",
    "Pantera V",
    "Pegaso",
    "Dagara",
    "Bat",
    "Pantera 2.0",
    "Pantera",
    "Sky Laces",
    "Gladiator",
    "Pantera Soft",
    "First Step",
    "Sky V",
  ],
};

export = { BRANDS, SHOES };
