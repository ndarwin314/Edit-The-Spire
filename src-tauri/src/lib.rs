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
}

#[tauri::command]
fn find_runs(app: tauri::AppHandle) -> Result<Vec<SaveInfo>, String> {
    let local_data = app
        .path()
        .local_data_dir().map_err(|e| e.to_string())?;
    let steam_dir = local_data.join("SlayTheSpire2").join("steam");

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
    let save: SaveFile = save_helper(file_name);
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
        .invoke_handler(tauri::generate_handler![load_save, get_health, get_gold, get_artifacts, get_potions, get_deck, find_runs])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
