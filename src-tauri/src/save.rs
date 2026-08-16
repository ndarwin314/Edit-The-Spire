use serde::{Deserialize, Serialize};
use serde_json::Value;

fn is_default<T: Default + PartialEq>(value: &T) -> bool {
    value == &T::default()
}

#[derive(Debug, Serialize, Deserialize, Default)]
#[serde(default)]
pub struct Player {
    pub base_orb_slot_count: i32,
    pub character_id: String,
    pub current_hp: i32,
    pub deck: Vec<Card>,
    pub gold: i32,
    pub max_energy: i32,
    pub max_hp: i32,
    pub max_potion_slot_count: i32,
    pub net_id: i32,
    pub odds: Odds,
    pub relic_grab_bag: RelicGrabBag,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub relics: Vec<Relic>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub potions: Vec<Potion>,
    pub rng: PlayerRng,
    pub unlock_state: UnlockState,

    #[serde(flatten)]
    pub other: serde_json::Map<String, Value>,
}


#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct Card {
    pub floor_added_to_deck: i32,
    pub id: String,
    #[serde(default)]
    #[serde(skip_serializing_if = "is_default")]
    pub current_upgrade_level: u8,
    #[serde(default)]
    #[serde(skip_serializing_if = "is_default")]
    pub enchantment: Enchantment,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default, PartialEq)]
pub struct Enchantment {
    pub id: String,
    pub amount: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CardModifiers {
    pub base_lib_card_modifiers: Vec<Value>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Potion {
    pub id: String,
    pub slot_index: i32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Relic {
    pub floor_added_to_deck: i32,
    pub id: String,
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct Odds {
    pub card_rarity_odds_value: f64,
    pub potion_reward_odds_value: f64,
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct RelicGrabBag {
    pub relic_id_lists: RelicIdLists,
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct RelicIdLists {
    pub uncommon: Vec<String>,
    pub common: Vec<String>,
    pub rare: Vec<String>,
    pub shop: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct PlayerRng {
    pub counters: RngCounters,
    pub seed: i64,
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct RngCounters {
    pub rewards: i32,
    pub shops: i32,
    pub transformations: i32,
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct UnlockState {
    pub encounters_seen: Vec<String>,
    pub number_of_runs: i32,
    pub unlocked_epochs: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SaveFile {
    pub players: Vec<Player>,

    #[serde(flatten)]
    pub other: serde_json::Map<String, Value>,
}

pub struct AppState {
    pub save: SaveFile,
    pub index: usize
}

impl Default for AppState {
    fn default() -> AppState {
        AppState {
            index: 0,
            save: SaveFile{ players: vec![], other: serde_json::Map::new() },
        }
    }
}


