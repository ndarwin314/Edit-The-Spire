mod save;

use std::fs;
use std::path::{Path};
use std::sync::Mutex;

use tauri::{Builder, Manager, State};
use serde_json::{Result, Value};
use crate::save::{AppState, Relic, SaveFile, Potion, Card};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn load_save(file_name: String, state: State<'_, Mutex<AppState>>){
    let path = Path::new(&file_name);
    let contents = fs::read_to_string(path)
        .expect("Should have been able to read the file");
    let save: SaveFile = serde_json::from_str(&contents).expect("Should have been able to deserialize");
    let index = 0;
    let mut state = state.lock().unwrap();
    state.save = save;
    state.index = index;
}

#[tauri::command]
fn get_health(state: State<'_, Mutex<AppState>>) -> (i32, i32){
    let state = state.lock().unwrap();
    let player = &state.save.players[state.index];
    (player.current_hp, player.max_hp)
}

#[tauri::command]
fn get_gold(state: State<'_, Mutex<AppState>>) -> i32 {
    let state = state.lock().unwrap();
    let player = &state.save.players[state.index];
    player.gold
}

#[tauri::command]
fn get_artifacts(state: State<'_, Mutex<AppState>>) -> Vec<Relic> {
    let state = state.lock().unwrap();
    let player = &state.save.players[state.index];
    player.relics.clone()
}

#[tauri::command]
fn get_potions(state: State<'_, Mutex<AppState>>) -> (i32, Vec<Potion>) {
    let state = state.lock().unwrap();
    let player = &state.save.players[state.index];
    (player.max_potion_slot_count, player.potions.clone())
}

#[tauri::command]
fn get_deck(state: State<'_, Mutex<AppState>>) -> Vec<Card> {
    let state = state.lock().unwrap();
    let player = &state.save.players[state.index];
    player.deck.clone()
}



#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    Builder::default()
        .setup(|app| {
        app.manage(Mutex::new(AppState::default()));
        Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![greet, load_save, get_health, get_gold, get_artifacts, get_potions, get_deck])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
