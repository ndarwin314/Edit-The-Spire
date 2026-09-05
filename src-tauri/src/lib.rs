mod save;

use std::fs;
use std::path::{Path, PathBuf};
use std::sync::Mutex;
use serde::Serialize;
use tauri::{Builder, Manager, State};
use serde_json::{Number, Value};
use tauri::process::restart;
use crate::save::{AppState, Relic, SaveFile, Potion, Card};

#[derive(Serialize)]
struct SaveInfo {
    steam_id: String,
    profile: String,
    path: String,
    character: String,
    floor: i32,
    ascension: i32,
    deck_size: i32,
}

fn deck_size(save_file: SaveFile) -> usize {
    let deck = &save_file.players[0].deck;
    let deck_size = deck.len();
    // at some point add logic to handle my save format as well
    deck_size
}


#[tauri::command]
fn find_runs(app: tauri::AppHandle) -> Result<Vec<SaveInfo>, String> {
    let temp = app.path();
    let base_dir;
    if cfg!(target_os = "windows") {
        base_dir = temp.config_dir().map_err(|e| e.to_string())?;
    } else {
        base_dir = temp.local_data_dir().map_err(|e| e.to_string())?;
    }

    let steam_dir =base_dir.join("SlayTheSpire2").join("steam");

    let mut saves = Vec::<SaveInfo>::new();

    let entries = match fs::read_dir(&steam_dir) {
        Ok(entries) => entries,
        Err(_) => return Ok(saves),
    };
    for entry in entries.flatten() {
        let steam_id_dir = entry.path();

        // Make sure this is a directory
        if !steam_id_dir.is_dir() {
            continue;
        }

        let steam_id = match steam_id_dir.file_name() {
            Some(name) => name.to_string_lossy().into_owned(),
            None => continue,
        };

        let profiles = match fs::read_dir(&steam_id_dir) {
            Ok(profiles) => profiles,
            Err(_) => continue,
        };

        for profile in profiles.flatten() {
            let profile_dir = profile.path();

            if !profile_dir.is_dir() { continue; }

            let profile = match profile_dir.file_name() {
                Some(name) => name.to_string_lossy().into_owned(),
                None => continue,
            };

            if !profile.starts_with("profile") { continue; }

            let save_path = profile_dir.join("saves").join("current_run.save");

            if save_path.exists() && save_path.is_file() {
                let path = save_path.to_string_lossy().into_owned();
                let save_file = save_helper(path);
                let player = &save_file.players[0];
                saves.push(SaveInfo{
                    steam_id: steam_id.clone(),
                    profile: profile.clone(),
                    path: save_path.to_string_lossy().into_owned(),
                    character: player.character_id.clone(),
                    floor: save_file.map_point_history.len() as i32,
                    ascension: save_file.ascension,
                    deck_size: deck_size(save_file) as i32
                });
            }
        }
    }
    Ok(saves)
}

fn save_helper(file_name: String) -> SaveFile {
    let path = Path::new(&file_name);
    let contents = fs::read_to_string(path)
        .expect("Should have been able to read the file");
    let save: SaveFile = serde_json::from_str(&contents).expect("Should have been able to deserialize");
    save
}

#[tauri::command]
fn load_save(file_name: String, state: State<'_, Mutex<AppState>>){
    let save: SaveFile = save_helper(file_name.clone());
    let index = 0;
    let mut state = state.lock().unwrap();
    state.save = save;
    state.index = index;
    state.directory = file_name;
}

#[tauri::command]
fn get_health(state: State<'_, Mutex<AppState>>) -> (i32, i32){
    let state = state.lock().unwrap();
    let player = &state.save.players[state.index];
    (player.current_hp, player.max_hp)
}


#[tauri::command]
fn set_health(health: (i32, i32), state: State<'_, Mutex<AppState>>) {
    let mut state = state.lock().unwrap();
    let index = state.index;
    state.save.players[index].current_hp = health.0;
    state.save.players[index].max_hp = health.1;
}

#[tauri::command]
fn get_energy(state: State<'_, Mutex<AppState>>) -> i32 {
    let state = state.lock().unwrap();
    let player = &state.save.players[state.index];
    player.max_energy
}

#[tauri::command]
fn set_energy(energy: i32, state: State<'_, Mutex<AppState>>) {
    let mut state = state.lock().unwrap();
    let index = state.index;
    state.save.players[index].max_energy = energy;
}


#[tauri::command]
fn get_gold(state: State<'_, Mutex<AppState>>) -> i32 {
    let state = state.lock().unwrap();
    let player = &state.save.players[state.index];
    player.gold
}

#[tauri::command]
fn set_gold(gold: i32, state: State<'_, Mutex<AppState>>) {
    let mut state = state.lock().unwrap();
    let index = state.index;
    state.save.players[index].gold = gold;
}

#[tauri::command]
fn get_relics(state: State<'_, Mutex<AppState>>) -> Vec<Relic> {
    let state = state.lock().unwrap();
    let player = &state.save.players[state.index];
    player.relics.clone()
}

#[tauri::command]
fn set_relics(relics: Vec<Relic>, state: State<'_, Mutex<AppState>>) {
    let mut state = state.lock().unwrap();
    let index = state.index;
    state.save.players[index].relics = relics;
}

#[tauri::command]
fn get_potions(state: State<'_, Mutex<AppState>>) -> (i32, Vec<Potion>) {
    let state = state.lock().unwrap();
    let player = &state.save.players[state.index];
    (player.max_potion_slot_count, player.potions.clone())
}

#[tauri::command(rename_all = "snake_case")]
fn set_potions(potions: Vec<Potion>, max_potions: i32, state: State<'_, Mutex<AppState>>) {
    let mut state = state.lock().unwrap();
    let index = state.index;
    state.save.players[index].potions = potions;
    state.save.players[index].max_potion_slot_count = max_potions;
}

#[tauri::command]
fn get_deck(state: State<'_, Mutex<AppState>>) -> Vec<Card> {
    let state = state.lock().unwrap();
    let player = &state.save.players[state.index];
    player.deck.clone()
}

#[tauri::command]
fn save(state: State<'_, Mutex<AppState>>) -> Result<(), String> {
    let state = state.lock().unwrap();
    let path = Path::new(&state.directory);
    let contents = serde_json::to_string_pretty(&state.save).expect("Should have been able to serialize");
    fs::write(path, contents).expect("Should have written successfully");
    Ok(())
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
        .invoke_handler(tauri::generate_handler![
            load_save,
            get_health,
            set_health,
            get_gold,
            set_gold,
            get_relics,
            set_relics,
            get_potions,
            set_potions,
            get_deck,
            find_runs,
            get_energy,
            set_energy,
            save
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
