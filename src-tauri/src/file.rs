use std::fs;
use std::path::Path;
use std::sync::Mutex;
use serde::Serialize;
use tauri::{Manager, State};
use crate::save::{AppState, SaveFile};

#[derive(Serialize)]
pub struct SaveInfo {
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
pub fn find_runs(app: tauri::AppHandle) -> Result<Vec<SaveInfo>, String> {
    let base_dir = {
        let temp = app.path();
        if cfg!(target_os = "windows") {
            temp.config_dir()
        }
        else {
            temp.local_data_dir()
        }.map_err(|e| e.to_string())?
    };


    let steam_dir = base_dir.join("SlayTheSpire2").join("steam");

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
                let save_file = save_helper(&path).map_err(|e| e.to_string())?;
                let player = &save_file.players[0];
                saves.push(SaveInfo{
                    steam_id: steam_id.clone(),
                    profile: profile.clone(),
                    path,
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

fn save_helper(file_name: &str) -> Result<SaveFile, std::io::Error> {
    let path = Path::new(file_name);
    let contents = fs::read_to_string(path)?;
    let save: SaveFile = serde_json::from_str(&contents)?;

    Ok(save)
}

#[tauri::command]
pub fn load_save(file_name: String, state: State<'_, Mutex<AppState>>) -> Result<String, String> {
    let save = save_helper(&file_name).map_err(|e| e.to_string())?;

    let index = 0;
    let mut state = state.lock().unwrap();
    state.save = save;
    state.index = index;
    state.directory = file_name;
    Ok(state.directory.clone())
}

#[tauri::command]
pub fn save(state: State<'_, Mutex<AppState>>) -> Result<(), String> {
    let state = state.lock().unwrap();
    let path = Path::new(&state.directory);
    let contents = serde_json::to_string_pretty(&state.save).expect("Should have been able to serialize");
    fs::write(path, contents).expect("Should have written successfully");
    Ok(())
}