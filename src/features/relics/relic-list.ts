export type RelicRarity =
    | "starter"
    | "common"
    | "uncommon"
    | "rare"
    | "ancient"
    | "shop"
    | "event"
    | "special";

export type RelicCharacter =
    | "ironclad"
    | "silent"
    | "regent"
    | "necrobinder"
    | "defect";

export interface RelicDefinition {
    id: string;
    name: string;
    rarity: RelicRarity;
    character?: RelicCharacter;
}

export const relics: RelicDefinition[] = [
    {
        id: "burning_blood",
        name: "Burning Blood",
        rarity: "starter",
        character: "ironclad",
    },
    {
        id: "black_blood",
        name: "Black Blood",
        rarity: "starter",
        character: "ironclad",
    },
    {
        id: "ring_of_the_snake",
        name: "Ring of the Snake",
        rarity: "starter",
        character: "silent",
    },
    {
        id: "ring_of_the_drake",
        name: "Ring of the Drake",
        rarity: "starter",
        character: "silent",
    },
    {
        id: "divine_right",
        name: "Divine Right",
        rarity: "starter",
        character: "regent",
    },
    {
        id: "divine_destiny",
        name: "Divine Destiny",
        rarity: "starter",
        character: "regent",
    },
    {
        id: "bound_phylactery",
        name: "Bound Phylactery",
        rarity: "starter",
        character: "necrobinder",
    },
    {
        id: "phylactery_unbound",
        name: "Phylactery Unbound",
        rarity: "starter",
        character: "necrobinder",
    },
    {
        id: "cracked_core",
        name: "Cracked Core",
        rarity: "starter",
        character: "defect",
    },
    {
        id: "infused_core",
        name: "Infused Core",
        rarity: "starter",
        character: "defect",
    },
    {
        id: "amethyst_aubergine",
        name: "Amethyst Aubergine",
        rarity: "common",
    },
    {
        id: "anchor",
        name: "Anchor",
        rarity: "common",
    },
    {
        id: "bag_of_marbles",
        name: "Bag of Marbles",
        rarity: "common",
    },
    {
        id: "bag_of_preparation",
        name: "Bag of Preparation",
        rarity: "common",
    },
    {
        id: "blood_vial",
        name: "Blood Vial",
        rarity: "common",
    },
    {
        id: "book_of_five_rings",
        name: "Book of Five Rings",
        rarity: "common",
    },
    {
        id: "bronze_scales",
        name: "Bronze Scales",
        rarity: "common",
    },
    {
        id: "centennial_puzzle",
        name: "Centennial Puzzle",
        rarity: "common",
    },
    {
        id: "festive_popper",
        name: "Festive Popper",
        rarity: "common",
    },
    {
        id: "gorget",
        name: "Gorget",
        rarity: "common",
    },
    {
        id: "happy_flower",
        name: "Happy Flower",
        rarity: "common",
    },
    {
        id: "juzu_bracelet",
        name: "Juzu Bracelet",
        rarity: "common",
    },
    {
        id: "lantern",
        name: "Lantern",
        rarity: "common",
    },
    {
        id: "meal_ticket",
        name: "Meal Ticket",
        rarity: "common",
    },
    {
        id: "oddly_smooth_stone",
        name: "Oddly Smooth Stone",
        rarity: "common",
    },
    {
        id: "pendulum",
        name: "Pendulum",
        rarity: "common",
    },
    {
        id: "potion_belt",
        name: "Potion Belt",
        rarity: "common",
    },
    {
        id: "red_mask",
        name: "Red Mask",
        rarity: "common",
    },
    {
        id: "regal_pillow",
        name: "Regal Pillow",
        rarity: "common",
    },
    {
        id: "strawberry",
        name: "Strawberry",
        rarity: "common",
    },
    {
        id: "strike_dummy",
        name: "Strike Dummy",
        rarity: "common",
    },
    {
        id: "vajra",
        name: "Vajra",
        rarity: "common",
    },
    {
        id: "venerable_tea_set",
        name: "Venerable Tea Set",
        rarity: "common",
    },
    {
        id: "war_paint",
        name: "War Paint",
        rarity: "common",
    },
    {
        id: "whetstone",
        name: "Whetstone",
        rarity: "common",
    },
    {
        id: "red_skull",
        name: "Red Skull",
        rarity: "common",
        character: "ironclad",
    },
    {
        id: "snecko_skull",
        name: "Snecko Skull",
        rarity: "common",
        character: "silent",
    },
    {
        id: "fencing_manual",
        name: "Fencing Manual",
        rarity: "common",
        character: "regent",
    },
    {
        id: "bone_flute",
        name: "Bone Flute",
        rarity: "common",
        character: "necrobinder",
    },
    {
        id: "data_disk",
        name: "Data Disk",
        rarity: "common",
        character: "defect",
    },
    {
        id: "akabeko",
        name: "Akabeko",
        rarity: "uncommon",
    },
    {
        id: "bowler_hat",
        name: "Bowler Hat",
        rarity: "uncommon",
    },
    {
        id: "candelabra",
        name: "Candelabra",
        rarity: "uncommon",
    },
    {
        id: "eternal_feather",
        name: "Eternal Feather",
        rarity: "uncommon",
    },
    {
        id: "gremlin_horn",
        name: "Gremlin Horn",
        rarity: "uncommon",
    },
    {
        id: "horn_cleat",
        name: "Horn Cleat",
        rarity: "uncommon",
    },
    {
        id: "joss_paper",
        name: "Joss Paper",
        rarity: "uncommon",
    },
    {
        id: "kusarigama",
        name: "Kusarigama",
        rarity: "uncommon",
    },
    {
        id: "lasting_candy",
        name: "Lasting Candy",
        rarity: "uncommon",
    },
    {
        id: "letter_opener",
        name: "Letter Opener",
        rarity: "uncommon",
    },
    {
        id: "lucky_fysh",
        name: "Lucky Fysh",
        rarity: "uncommon",
    },
    {
        id: "mercury_hourglass",
        name: "Mercury Hourglass",
        rarity: "uncommon",
    },
    {
        id: "miniature_cannon",
        name: "Miniature Cannon",
        rarity: "uncommon",
    },
    {
        id: "nunchaku",
        name: "Nunchaku",
        rarity: "uncommon",
    },
    {
        id: "orichalcum",
        name: "Orichalcum",
        rarity: "uncommon",
    },
    {
        id: "ornamental_fan",
        name: "Ornamental Fan",
        rarity: "uncommon",
    },
    {
        id: "pantograph",
        name: "Pantograph",
        rarity: "uncommon",
    },
    {
        id: "parrying_shield",
        name: "Parrying Shield",
        rarity: "uncommon",
    },
    {
        id: "pear",
        name: "Pear",
        rarity: "uncommon",
    },
    {
        id: "pen_nib",
        name: "Pen Nib",
        rarity: "uncommon",
    },
    {
        id: "permafrost",
        name: "Permafrost",
        rarity: "uncommon",
    },
    {
        id: "petrified_toad",
        name: "Petrified Toad",
        rarity: "uncommon",
    },
    {
        id: "planisphere",
        name: "Planisphere",
        rarity: "uncommon",
    },
    {
        id: "reptile_trinket",
        name: "Reptile Trinket",
        rarity: "uncommon",
    },
    {
        id: "ripple_basin",
        name: "Ripple Basin",
        rarity: "uncommon",
    },
    {
        id: "sparkling_rouge",
        name: "Sparkling Rouge",
        rarity: "uncommon",
    },
    {
        id: "stone_cracker",
        name: "Stone Cracker",
        rarity: "uncommon",
    },
    {
        id: "tiny_mailbox",
        name: "Tiny Mailbox",
        rarity: "uncommon",
    },
    {
        id: "tuning_fork",
        name: "Tuning Fork",
        rarity: "uncommon",
    },
    {
        id: "vambrace",
        name: "Vambrace",
        rarity: "uncommon",
    },
    {
        id: "paper_phrog",
        name: "Paper Phrog",
        rarity: "uncommon",
        character: "ironclad",
    },
    {
        id: "self_forming_clay",
        name: "Self-Forming Clay",
        rarity: "uncommon",
        character: "ironclad",
    },
    {
        id: "tingsha",
        name: "Tingsha",
        rarity: "uncommon",
        character: "silent",
    },
    {
        id: "twisted_funnel",
        name: "Twisted Funnel",
        rarity: "uncommon",
        character: "silent",
    },
    {
        id: "galactic_dust",
        name: "Galactic Dust",
        rarity: "uncommon",
        character: "regent",
    },
    {
        id: "regalite",
        name: "Regalite",
        rarity: "uncommon",
        character: "regent",
    },
    {
        id: "book_repair_knife",
        name: "Book Repair Knife",
        rarity: "uncommon",
        character: "necrobinder",
    },
    {
        id: "funerary_mask",
        name: "Funerary Mask",
        rarity: "uncommon",
        character: "necrobinder",
    },
    {
        id: "gold_plated_cables",
        name: "Gold-Plated Cables",
        rarity: "uncommon",
        character: "defect",
    },
    {
        id: "symbiotic_virus",
        name: "Symbiotic Virus",
        rarity: "uncommon",
        character: "defect",
    },
    {
        id: "artof_war",
        name: "Art of War",
        rarity: "rare",
    },
    {
        id: "beating_remnant",
        name: "Beating Remnant",
        rarity: "rare",
    },
    {
        id: "bellows",
        name: "Bellows",
        rarity: "rare",
    },
    {
        id: "captains_wheel",
        name: "Captain's Wheel",
        rarity: "rare",
    },
    {
        id: "chandelier",
        name: "Chandelier",
        rarity: "rare",
    },
    {
        id: "cloak_clasp",
        name: "Cloak Clasp",
        rarity: "rare",
    },
    {
        id: "frozen_egg",
        name: "Frozen Egg",
        rarity: "rare",
    },
    {
        id: "gambling_chip",
        name: "Gambling Chip",
        rarity: "rare",
    },
    {
        id: "game_piece",
        name: "Game Piece",
        rarity: "rare",
    },
    {
        id: "girya",
        name: "Girya",
        rarity: "rare",
    },
    {
        id: "ice_cream",
        name: "Ice Cream",
        rarity: "rare",
    },
    {
        id: "intimidating_helmet",
        name: "Intimidating Helmet",
        rarity: "rare",
    },
    {
        id: "kunai",
        name: "Kunai",
        rarity: "rare",
    },
    {
        id: "lizard_tail",
        name: "Lizard Tail",
        rarity: "rare",
    },
    {
        id: "mango",
        name: "Mango",
        rarity: "rare",
    },
    {
        id: "meat_on_the_bone",
        name: "Meat on the Bone",
        rarity: "rare",
    },
    {
        id: "molten_egg",
        name: "Molten Egg",
        rarity: "rare",
    },
    {
        id: "mummified_hand",
        name: "Mummified Hand",
        rarity: "rare",
    },
    {
        id: "old_coin",
        name: "Old Coin",
        rarity: "rare",
    },
    {
        id: "pocketwatch",
        name: "Pocketwatch",
        rarity: "rare",
    },
    {
        id: "prayer_wheel",
        name: "Prayer Wheel",
        rarity: "rare",
    },
    {
        id: "rainbow_ring",
        name: "Rainbow Ring",
        rarity: "rare",
    },
    {
        id: "razor_tooth",
        name: "Razor Tooth",
        rarity: "rare",
    },
    {
        id: "shovel",
        name: "Shovel",
        rarity: "rare",
    },
    {
        id: "shuriken",
        name: "Shuriken",
        rarity: "rare",
    },
    {
        id: "stone_calendar",
        name: "Stone Calendar",
        rarity: "rare",
    },
    {
        id: "sturdy_clamp",
        name: "Sturdy Clamp",
        rarity: "rare",
    },
    {
        id: "the_courier",
        name: "The Courier",
        rarity: "rare",
    },
    {
        id: "toxic_egg",
        name: "Toxic Egg",
        rarity: "rare",
    },
    {
        id: "tungsten_rod",
        name: "Tungsten Rod",
        rarity: "rare",
    },
    {
        id: "unceasing_top",
        name: "Unceasing Top",
        rarity: "rare",
    },
    {
        id: "unsettling_lamp",
        name: "Unsettling Lamp",
        rarity: "rare",
    },
    {
        id: "vexing_puzzlebox",
        name: "Vexing Puzzlebox",
        rarity: "rare",
    },
    {
        id: "white_beast_statue",
        name: "White Beast Statue",
        rarity: "rare",
    },
    {
        id: "white_star",
        name: "White Star",
        rarity: "rare",
    },
    {
        id: "charons_ashes",
        name: "Charon's Ashes",
        rarity: "rare",
        character: "ironclad",
    },
    {
        id: "demon_tongue",
        name: "Demon Tongue",
        rarity: "rare",
        character: "ironclad",
    },
    {
        id: "ruined_helmet",
        name: "Ruined Helmet",
        rarity: "rare",
        character: "ironclad",
    },
    {
        id: "helical_dart",
        name: "Helical Dart",
        rarity: "rare",
        character: "silent",
    },
    {
        id: "paper_krane",
        name: "Paper Krane",
        rarity: "rare",
        character: "silent",
    },
    {
        id: "tough_bandages",
        name: "Tough Bandages",
        rarity: "rare",
        character: "silent",
    },
    {
        id: "lunar_pastry",
        name: "Lunar Pastry",
        rarity: "rare",
        character: "regent",
    },
    {
        id: "mini_regent",
        name: "Mini Regent",
        rarity: "rare",
        character: "regent",
    },
    {
        id: "orange_dough",
        name: "Orange Dough",
        rarity: "rare",
        character: "regent",
    },
    {
        id: "big_hat",
        name: "Big Hat",
        rarity: "rare",
        character: "necrobinder",
    },
    {
        id: "bookmark",
        name: "Bookmark",
        rarity: "rare",
        character: "necrobinder",
    },
    {
        id: "ivory_tile",
        name: "Ivory Tile",
        rarity: "rare",
        character: "necrobinder",
    },
    {
        id: "emotion_chip",
        name: "Emotion Chip",
        rarity: "rare",
        character: "defect",
    },
    {
        id: "metronome",
        name: "Metronome",
        rarity: "rare",
        character: "defect",
    },
    {
        id: "power_cell",
        name: "Power Cell",
        rarity: "rare",
        character: "defect",
    },
    {
        id: "arcane_scroll",
        name: "Arcane Scroll",
        rarity: "ancient",
    },
    {
        id: "booming_conch",
        name: "Booming Conch",
        rarity: "ancient",
    },
    {
        id: "cursed_pearl",
        name: "Cursed Pearl",
        rarity: "ancient",
    },
    {
        id: "dowsing_rod",
        name: "Dowsing Rod",
        rarity: "ancient",
    },
    {
        id: "fishing_rod",
        name: "Fishing Rod",
        rarity: "ancient",
    },
    {
        id: "golden_pearl",
        name: "Golden Pearl",
        rarity: "ancient",
    },
    {
        id: "hefty_tablet",
        name: "Hefty Tablet",
        rarity: "ancient",
    },
    {
        id: "kaleidoscope",
        name: "Kaleidoscope",
        rarity: "ancient",
    },
    {
        id: "large_capsule",
        name: "Large Capsule",
        rarity: "ancient",
    },
    {
        id: "lava_rock",
        name: "Lava Rock",
        rarity: "ancient",
    },
    {
        id: "lead_paperweight",
        name: "Lead Paperweight",
        rarity: "ancient",
    },
    {
        id: "leafy_poultice",
        name: "Leafy Poultice",
        rarity: "ancient",
    },
    {
        id: "lost_coffer",
        name: "Lost Coffer",
        rarity: "ancient",
    },
    {
        id: "massive_scroll",
        name: "Massive Scroll",
        rarity: "ancient",
    },
    {
        id: "neows_bones",
        name: "Neow's Bones",
        rarity: "ancient",
    },
    {
        id: "neows_sacrifice",
        name: "Neow's Sacrifice",
        rarity: "ancient",
    },
    {
        id: "neows_talisman",
        name: "Neow's Talisman",
        rarity: "ancient",
    },
    {
        id: "neows_torment",
        name: "Neow's Torment",
        rarity: "ancient",
    },
    {
        id: "new_leaf",
        name: "New Leaf",
        rarity: "ancient",
    },
    {
        id: "nutritious_oyster",
        name: "Nutritious Oyster",
        rarity: "ancient",
    },
    {
        id: "phial_holster",
        name: "Phial Holster",
        rarity: "ancient",
    },
    {
        id: "pomander",
        name: "Pomander",
        rarity: "ancient",
    },
    {
        id: "precarious_shears",
        name: "Precarious Shears",
        rarity: "ancient",
    },
    {
        id: "precise_scissors",
        name: "Precise Scissors",
        rarity: "ancient",
    },
    {
        id: "scroll_boxes",
        name: "Scroll Boxes",
        rarity: "ancient",
    },
    {
        id: "silken_tress",
        name: "Silken Tress",
        rarity: "ancient",
    },
    {
        id: "silver_crucible",
        name: "Silver Crucible",
        rarity: "ancient",
    },
    {
        id: "small_capsule",
        name: "Small Capsule",
        rarity: "ancient",
    },
    {
        id: "stone_humidifier",
        name: "Stone Humidifier",
        rarity: "ancient",
    },
    {
        id: "winged_boots",
        name: "Winged Boots",
        rarity: "ancient",
    },
    {
        id: "alchemical_coffer",
        name: "Alchemical Coffer",
        rarity: "ancient",
    },
    {
        id: "archaic_tooth",
        name: "Archaic Tooth",
        rarity: "ancient",
    },
    {
        id: "driftwood",
        name: "Driftwood",
        rarity: "ancient",
    },
    {
        id: "electric_shrymp",
        name: "Electric Shrymp",
        rarity: "ancient",
    },
    {
        id: "glass_eye",
        name: "Glass Eye",
        rarity: "ancient",
    },
    {
        id: "prismatic_gem",
        name: "Prismatic Gem",
        rarity: "ancient",
    },
    {
        id: "radiant_pearl",
        name: "Radiant Pearl",
        rarity: "ancient",
    },
    {
        id: "sand_castle",
        name: "Sand Castle",
        rarity: "ancient",
    },
    {
        id: "sea_glass",
        name: "Sea Glass",
        rarity: "ancient",
    },
    {
        id: "touch_of_orobas",
        name: "Touch of Orobas",
        rarity: "ancient",
    },
    {
        id: "paels_blood",
        name: "Pael's Blood",
        rarity: "ancient",
    },
    {
        id: "paels_claw",
        name: "Pael's Claw",
        rarity: "ancient",
    },
    {
        id: "paels_eye",
        name: "Pael's Eye",
        rarity: "ancient",
    },
    {
        id: "paels_flesh",
        name: "Pael's Flesh",
        rarity: "ancient",
    },
    {
        id: "paels_growth",
        name: "Pael's Growth",
        rarity: "ancient",
    },
    {
        id: "paels_horn",
        name: "Pael's Horn",
        rarity: "ancient",
    },
    {
        id: "paels_legion",
        name: "Pael's Legion",
        rarity: "ancient",
    },
    {
        id: "paels_tears",
        name: "Pael's Tears",
        rarity: "ancient",
    },
    {
        id: "paels_tooth",
        name: "Pael's Tooth",
        rarity: "ancient",
    },
    {
        id: "paels_wing",
        name: "Pael's Wing",
        rarity: "ancient",
    },
    {
        id: "biiig_hug",
        name: "Biiig Hug",
        rarity: "ancient",
    },
    {
        id: "golden_compass",
        name: "Golden Compass",
        rarity: "ancient",
    },
    {
        id: "nutritious_soup",
        name: "Nutritious Soup",
        rarity: "ancient",
    },
    {
        id: "pumpkin_candle",
        name: "Pumpkin Candle",
        rarity: "ancient",
    },
    {
        id: "seal_of_gold",
        name: "Seal of Gold",
        rarity: "ancient",
    },
    {
        id: "storybook",
        name: "Storybook",
        rarity: "ancient",
    },
    {
        id: "toasty_mittens",
        name: "Toasty Mittens",
        rarity: "ancient",
    },
    {
        id: "toy_box",
        name: "Toy Box",
        rarity: "ancient",
    },
    {
        id: "very_hot_cocoa",
        name: "Very Hot Cocoa",
        rarity: "ancient",
    },
    {
        id: "yummy_cookie",
        name: "Yummy Cookie",
        rarity: "ancient",
    },
    {
        id: "beautiful_bracelet",
        name: "Beautiful Bracelet",
        rarity: "ancient",
    },
    {
        id: "blessed_antler",
        name: "Blessed Antler",
        rarity: "ancient",
    },
    {
        id: "brilliant_scarf",
        name: "Brilliant Scarf",
        rarity: "ancient",
    },
    {
        id: "delicate_frond",
        name: "Delicate Frond",
        rarity: "ancient",
    },
    {
        id: "diamond_diadem",
        name: "Diamond Diadem",
        rarity: "ancient",
    },
    {
        id: "fur_coat",
        name: "Fur Coat",
        rarity: "ancient",
    },
    {
        id: "glitter",
        name: "Glitter",
        rarity: "ancient",
    },
    {
        id: "jewelry_box",
        name: "Jewelry Box",
        rarity: "ancient",
    },
    {
        id: "looming_fruit",
        name: "Looming Fruit",
        rarity: "ancient",
    },
    {
        id: "signet_ring",
        name: "Signet Ring",
        rarity: "ancient",
    },
    {
        id: "claws",
        name: "Claws",
        rarity: "ancient",
    },
    {
        id: "crossbow",
        name: "Crossbow",
        rarity: "ancient",
    },
    {
        id: "iron_club",
        name: "Iron Club",
        rarity: "ancient",
    },
    {
        id: "meat_cleaver",
        name: "Meat Cleaver",
        rarity: "ancient",
    },
    {
        id: "sai",
        name: "Sai",
        rarity: "ancient",
    },
    {
        id: "spiked_gauntlets",
        name: "Spiked Gauntlets",
        rarity: "ancient",
    },
    {
        id: "tanxs_whistle",
        name: "Tanx's Whistle",
        rarity: "ancient",
    },
    {
        id: "throwing_axe",
        name: "Throwing Axe",
        rarity: "ancient",
    },
    {
        id: "tri_boomerang",
        name: "Tri-Boomerang",
        rarity: "ancient",
    },
    {
        id: "war_hammer",
        name: "War Hammer",
        rarity: "ancient",
    },
    {
        id: "blood_soaked_rose",
        name: "Blood-Soaked Rose",
        rarity: "ancient",
    },
    {
        id: "choices_paradox",
        name: "Choices Paradox",
        rarity: "ancient",
    },
    {
        id: "distinguished_cape",
        name: "Distinguished Cape",
        rarity: "ancient",
    },
    {
        id: "fiddle",
        name: "Fiddle",
        rarity: "ancient",
    },
    {
        id: "jeweled_mask",
        name: "Jeweled Mask",
        rarity: "ancient",
    },
    {
        id: "lords_parasol",
        name: "Lord's Parasol",
        rarity: "ancient",
    },
    {
        id: "music_box",
        name: "Music Box",
        rarity: "ancient",
    },
    {
        id: "preserved_fog",
        name: "Preserved Fog",
        rarity: "ancient",
    },
    {
        id: "sere_talon",
        name: "Sere Talon",
        rarity: "ancient",
    },
    {
        id: "whispering_earring",
        name: "Whispering Earring",
        rarity: "ancient",
    },
    {
        id: "astrolabe",
        name: "Astrolabe",
        rarity: "ancient",
    },
    {
        id: "black_star",
        name: "Black Star",
        rarity: "ancient",
    },
    {
        id: "calling_bell",
        name: "Calling Bell",
        rarity: "ancient",
    },
    {
        id: "dusty_tome",
        name: "Dusty Tome",
        rarity: "ancient",
    },
    {
        id: "ectoplasm",
        name: "Ectoplasm",
        rarity: "ancient",
    },
    {
        id: "empty_cage",
        name: "Empty Cage",
        rarity: "ancient",
    },
    {
        id: "pandoras_box",
        name: "Pandora's Box",
        rarity: "ancient",
    },
    {
        id: "philosophers_stone",
        name: "Philosopher's Stone",
        rarity: "ancient",
    },
    {
        id: "runic_pyramid",
        name: "Runic Pyramid",
        rarity: "ancient",
    },
    {
        id: "snecko_eye",
        name: "Snecko Eye",
        rarity: "ancient",
    },
    {
        id: "sozu",
        name: "Sozu",
        rarity: "ancient",
    },
    {
        id: "velvet_choker",
        name: "Velvet Choker",
        rarity: "ancient",
    },
    {
        id: "belt_buckle",
        name: "Belt Buckle",
        rarity: "shop",
    },
    {
        id: "bread",
        name: "Bread",
        rarity: "shop",
    },
    {
        id: "burning_sticks",
        name: "Burning Sticks",
        rarity: "shop",
    },
    {
        id: "cauldron",
        name: "Cauldron",
        rarity: "shop",
    },
    {
        id: "chemical_x",
        name: "Chemical X",
        rarity: "shop",
    },
    {
        id: "dingy_rug",
        name: "Dingy Rug",
        rarity: "shop",
    },
    {
        id: "dollys_mirror",
        name: "Dolly's Mirror",
        rarity: "shop",
    },
    {
        id: "dragon_fruit",
        name: "Dragon Fruit",
        rarity: "shop",
    },
    {
        id: "ghost_seed",
        name: "Ghost Seed",
        rarity: "shop",
    },
    {
        id: "gnarled_hammer",
        name: "Gnarled Hammer",
        rarity: "shop",
    },
    {
        id: "kifuda",
        name: "Kifuda",
        rarity: "shop",
    },
    {
        id: "lava_lamp",
        name: "Lava Lamp",
        rarity: "shop",
    },
    {
        id: "lees_waffle",
        name: "Lee's Waffle",
        rarity: "shop",
    },
    {
        id: "membership_card",
        name: "Membership Card",
        rarity: "shop",
    },
    {
        id: "miniature_tent",
        name: "Miniature Tent",
        rarity: "shop",
    },
    {
        id: "mystic_lighter",
        name: "Mystic Lighter",
        rarity: "shop",
    },
    {
        id: "orrery",
        name: "Orrery",
        rarity: "shop",
    },
    {
        id: "punch_dagger",
        name: "Punch Dagger",
        rarity: "shop",
    },
    {
        id: "ringing_triangle",
        name: "Ringing Triangle",
        rarity: "shop",
    },
    {
        id: "royal_stamp",
        name: "Royal Stamp",
        rarity: "shop",
    },
    {
        id: "screaming_flagon",
        name: "Screaming Flagon",
        rarity: "shop",
    },
    {
        id: "sling_of_courage",
        name: "Sling of Courage",
        rarity: "shop",
    },
    {
        id: "the_abacus",
        name: "The Abacus",
        rarity: "shop",
    },
    {
        id: "toolbox",
        name: "Toolbox",
        rarity: "shop",
    },
    {
        id: "wing_charm",
        name: "Wing Charm",
        rarity: "shop",
    },
    {
        id: "brimstone",
        name: "Brimstone",
        rarity: "shop",
        character: "ironclad",
    },
    {
        id: "ninja_scroll",
        name: "Ninja Scroll",
        rarity: "shop",
        character: "silent",
    },
    {
        id: "vitruvian_minion",
        name: "Vitruvian Minion",
        rarity: "shop",
        character: "regent",
    },
    {
        id: "undying_sigil",
        name: "Undying Sigil",
        rarity: "shop",
        character: "necrobinder",
    },
    {
        id: "runic_capacitor",
        name: "Runic Capacitor",
        rarity: "shop",
        character: "defect",
    },
    {
        id: "fake_anchor",
        name: "Anchor???",
        rarity: "event",
    },
    {
        id: "big_mushroom",
        name: "Big Mushroom",
        rarity: "event",
    },
    {
        id: "bing_bong",
        name: "Bing Bong",
        rarity: "event",
    },
    {
        id: "fake_blood_vial",
        name: "Blood Vial???",
        rarity: "event",
    },
    {
        id: "bone_tea",
        name: "Bone Tea",
        rarity: "event",
    },
    {
        id: "byrdpip",
        name: "Byrdpip",
        rarity: "event",
    },
    {
        id: "darkstone_periapt",
        name: "Darkstone Periapt",
        rarity: "event",
    },
    {
        id: "daughter_of_the_wind",
        name: "Daughter of the Wind",
        rarity: "event",
    },
    {
        id: "dream_catcher",
        name: "Dream Catcher",
        rarity: "event",
    },
    {
        id: "ember_tea",
        name: "Ember Tea",
        rarity: "event",
    },
    {
        id: "forgotten_soul",
        name: "Forgotten Soul",
        rarity: "event",
    },
    {
        id: "fragrant_mushroom",
        name: "Fragrant Mushroom",
        rarity: "event",
    },
    {
        id: "fresnel_lens",
        name: "Fresnel Lens",
        rarity: "event",
    },
    {
        id: "hand_drill",
        name: "Hand Drill",
        rarity: "event",
    },
    {
        id: "fake_happy_flower",
        name: "Happy Flower???",
        rarity: "event",
    },
    {
        id: "history_course",
        name: "History Course",
        rarity: "event",
    },
    {
        id: "fake_lees_waffle",
        name: "Lee's Waffle???",
        rarity: "event",
    },
    {
        id: "lost_wisp",
        name: "Lost Wisp",
        rarity: "event",
    },
    {
        id: "fake_mango",
        name: "Mango???",
        rarity: "event",
    },
    {
        id: "maw_bank",
        name: "Maw Bank",
        rarity: "event",
    },
    {
        id: "mr_struggles",
        name: "Mr. Struggles",
        rarity: "event",
    },
    {
        id: "fake_orichalcum",
        name: "Orichalcum???",
        rarity: "event",
    },
    {
        id: "pollinous_core",
        name: "Pollinous Core",
        rarity: "event",
    },
    {
        id: "royal_poison",
        name: "Royal Poison",
        rarity: "event",
    },
    {
        id: "fake_snecko_eye",
        name: "Snecko Eye???",
        rarity: "event",
    },
    {
        id: "fake_strike_dummy",
        name: "Strike Dummy???",
        rarity: "event",
    },
    {
        id: "sword_of_jade",
        name: "Sword of Jade",
        rarity: "event",
    },
    {
        id: "sword_of_stone",
        name: "Sword of Stone",
        rarity: "event",
    },
    {
        id: "tea_of_discourtesy",
        name: "Tea of Discourtesy",
        rarity: "event",
    },
    {
        id: "the_boot",
        name: "The Boot",
        rarity: "event",
    },
    {
        id: "the_chosen_cheese",
        name: "The Chosen Cheese",
        rarity: "event",
    },
    {
        id: "fake_the_merchants_rug",
        name: "The Merchant's Rug???",
        rarity: "event",
    },
    {
        id: "fake_venerable_tea_set",
        name: "Venerable Tea Set???",
        rarity: "event",
    },
    {
        id: "wongo_customer_appreciation_badge",
        name: "Wongo Customer Appreciation Badge",
        rarity: "event",
    },
    {
        id: "wongos_mystery_ticket",
        name: "Wongo's Mystery Ticket",
        rarity: "event",
    },
    {
        id: "circlet",
        name: "Circlet",
        rarity: "special",
    },
];

export const relicById = new Map(
    relics.map(relic => [relic.id, relic]),
);
