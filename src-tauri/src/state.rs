use std::sync::Mutex;
use tauri::State;
use crate::save::{AppState, Card, Potion, Relic};

#[tauri::command]
pub fn get_health(state: State<'_, Mutex<AppState>>) -> (i32, i32){
    let state = state.lock().unwrap();
    let player = &state.save.players[state.index];
    (player.current_hp, player.max_hp)
}


#[tauri::command]
pub fn set_health(health: (i32, i32), state: State<'_, Mutex<AppState>>) {
    let mut state = state.lock().unwrap();
    let index = state.index;
    state.save.players[index].current_hp = health.0;
    state.save.players[index].max_hp = health.1;
}

#[tauri::command]
pub fn get_energy(state: State<'_, Mutex<AppState>>) -> i32 {
    let state = state.lock().unwrap();
    let player = &state.save.players[state.index];
    player.max_energy
}

#[tauri::command]
pub fn set_energy(energy: i32, state: State<'_, Mutex<AppState>>) {
    let mut state = state.lock().unwrap();
    let index = state.index;
    state.save.players[index].max_energy = energy;
}


#[tauri::command]
pub fn get_gold(state: State<'_, Mutex<AppState>>) -> i32 {
    let state = state.lock().unwrap();
    let player = &state.save.players[state.index];
    player.gold
}

#[tauri::command]
pub fn set_gold(gold: i32, state: State<'_, Mutex<AppState>>) {
    let mut state = state.lock().unwrap();
    let index = state.index;
    state.save.players[index].gold = gold;
}

#[tauri::command]
pub fn get_relics(state: State<'_, Mutex<AppState>>) -> Vec<Relic> {
    let state = state.lock().unwrap();
    let player = &state.save.players[state.index];
    player.relics.clone()
}

#[tauri::command]
pub fn set_relics(relics: Vec<Relic>, state: State<'_, Mutex<AppState>>) {
    let mut state = state.lock().unwrap();
    let index = state.index;
    state.save.players[index].relics = relics;
}

#[tauri::command]
pub fn get_potions(state: State<'_, Mutex<AppState>>) -> (i32, Vec<Potion>) {
    let state = state.lock().unwrap();
    let player = &state.save.players[state.index];
    (player.max_potion_slot_count, player.potions.clone())
}

#[tauri::command(rename_all = "snake_case")]
pub fn set_potions(potions: Vec<Potion>, max_potions: i32, state: State<'_, Mutex<AppState>>) {
    let mut state = state.lock().unwrap();
    let index = state.index;
    state.save.players[index].potions = potions;
    state.save.players[index].max_potion_slot_count = max_potions;
}

#[tauri::command]
pub fn get_deck(state: State<'_, Mutex<AppState>>) -> Vec<Card> {
    let state = state.lock().unwrap();
    let player = &state.save.players[state.index];
    player.deck.clone()
}

#[tauri::command]
pub fn set_deck(deck: Vec<Card>,state: State<'_, Mutex<AppState>>)  {
    let mut state = state.lock().unwrap();
    let index = state.index;
    state.save.players[index].deck = deck;
}

