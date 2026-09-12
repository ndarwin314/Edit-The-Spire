import {Definition} from "../../utils/filter.ts";

export type PotionRarity =
    | "starter"
    | "common"
    | "uncommon"
    | "rare"
    | "special";

export type PotionCharacter =
    | "any"
    | "ironclad"
    | "silent"
    | "regent"
    | "necrobinder"
    | "defect";

export interface PotionDefinition extends Definition {
    id: string;
    name: string;
    rarity: PotionRarity;
    character?: PotionCharacter;
}

export const potions: PotionDefinition[] = [

    { id: "attack_potion", name: "Attack Potion", rarity: "common" },
    { id: "block_potion", name: "Block Potion", rarity: "common" },
    { id: "colorless_potion", name: "Colorless Potion", rarity: "common" },
    { id: "dexterity_potion", name: "Dexterity Potion", rarity: "common" },
    { id: "energy_potion", name: "Energy Potion", rarity: "common" },
    { id: "explosive_ampoule", name: "Explosive Ampoule", rarity: "common" },
    { id: "fire_potion", name: "Fire Potion", rarity: "common" },
    { id: "flex_potion", name: "Flex Potion", rarity: "common" },
    { id: "power_potion", name: "Power Potion", rarity: "common" },
    { id: "skill_potion", name: "Skill Potion", rarity: "common" },
    { id: "speed_potion", name: "Speed Potion", rarity: "common" },
    { id: "strength_potion", name: "Strength Potion", rarity: "common" },
    { id: "swift_potion", name: "Swift Potion", rarity: "common" },
    { id: "vulnerable_potion", name: "Vulnerable Potion", rarity: "common" },
    { id: "weak_potion", name: "Weak Potion", rarity: "common" },
    { id: "blood_potion", name: "Blood Potion", rarity: "common", character: "ironclad" },
    { id: "poison_potion", name: "Poison Potion", rarity: "common", character: "silent" },
    { id: "star_potion", name: "Star Potion", rarity: "common", character: "regent" },
    { id: "potion_of_doom", name: "Potion of Doom", rarity: "common", character: "necrobinder" },
    { id: "focus_potion", name: "Focus Potion", rarity: "common", character: "defect" },
    { id: "blessing_of_the_forge", name: "Blessing of the Forge", rarity: "uncommon" },
    { id: "clarity_extract", name: "Clarity Extract", rarity: "uncommon" },
    { id: "cure_all", name: "Cure All", rarity: "uncommon" },
    { id: "duplicator", name: "Duplicator", rarity: "uncommon" },
    { id: "fortifier", name: "Fortifier", rarity: "uncommon" },
    { id: "fysh_oil", name: "Fysh Oil", rarity: "uncommon" },
    { id: "gamblers_brew", name: "Gambler's Brew", rarity: "uncommon" },
    { id: "heart_of_iron", name: "Heart of Iron", rarity: "uncommon" },
    { id: "liquid_bronze", name: "Liquid Bronze", rarity: "uncommon" },
    { id: "potion_of_binding", name: "Potion of Binding", rarity: "uncommon" },
    { id: "powdered_demise", name: "Powdered Demise", rarity: "uncommon" },
    { id: "radiant_tincture", name: "Radiant Tincture", rarity: "uncommon" },
    { id: "regen_potion", name: "Regen Potion", rarity: "uncommon" },
    { id: "stable_serum", name: "Stable Serum", rarity: "uncommon" },
    { id: "touch_of_insanity", name: "Touch of Insanity", rarity: "uncommon" },
    { id: "ashwater", name: "Ashwater", rarity: "uncommon", character: "ironclad" },
    { id: "cunning_potion", name: "Cunning Potion", rarity: "uncommon", character: "silent" },
    { id: "kings_courage", name: "King's Courage", rarity: "uncommon", character: "regent" },
    { id: "bone_brew", name: "Bone Brew", rarity: "uncommon", character: "necrobinder" },
    { id: "potion_of_capacity", name: "Potion of Capacity", rarity: "uncommon", character: "defect" },
    { id: "beetle_juice", name: "Beetle Juice", rarity: "rare" },
    { id: "bottled_potential", name: "Bottled Potential", rarity: "rare" },
    { id: "distilled_chaos", name: "Distilled Chaos", rarity: "rare" },
    { id: "droplet_of_precognition", name: "Droplet of Precognition", rarity: "rare" },
    { id: "entropic_brew", name: "Entropic Brew", rarity: "rare" },
    { id: "fairy_in_a_bottle", name: "Fairy in a Bottle", rarity: "rare" },
    { id: "fruit_juice", name: "Fruit Juice", rarity: "rare" },
    { id: "gigantification_potion", name: "Gigantification Potion", rarity: "rare" },
    { id: "liquid_memories", name: "Liquid Memories", rarity: "rare" },
    { id: "lucky_tonic", name: "Lucky Tonic", rarity: "rare" },
    { id: "mazaleths_gift", name: "Mazaleth's Gift", rarity: "rare" },
    { id: "orobic_acid", name: "Orobic Acid", rarity: "rare" },
    { id: "shackling_potion", name: "Shackling Potion", rarity: "rare" },
    { id: "ship_in_a_bottle", name: "Ship in a Bottle", rarity: "rare" },
    { id: "snecko_oil", name: "Snecko Oil", rarity: "rare" },
    { id: "soldiers_stew", name: "Soldier's Stew", rarity: "rare", character: "ironclad" },
    { id: "ghost_in_a_jar", name: "Ghost in a Jar", rarity: "rare", character: "silent" },
    { id: "cosmic_concoction", name: "Cosmic Concoction", rarity: "rare", character: "regent" },
    { id: "pot_of_ghouls", name: "Pot of Ghouls", rarity: "rare", character: "necrobinder" },
    { id: "essence_of_darkness", name: "Essence of Darkness", rarity: "rare", character: "defect" },
    { id: "ambergris", name: "Ambergris", rarity: "special" },
    { id: "foul_potion", name: "Foul Potion", rarity: "special" },
    { id: "glowwater_potion", name: "Glowwater Potion", rarity: "special" },
    { id: "potion_shaped_rock", name: "Potion-Shaped Rock", rarity: "special" },
];