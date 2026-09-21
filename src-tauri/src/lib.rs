mod save;
mod file;
mod state;


use std::sync::Mutex;
use tauri::{Builder, Manager};
use crate::save::{AppState};

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
            file::load_save,
            state::get_health,
            state::set_health,
            state::get_gold,
            state::set_gold,
            state::get_relics,
            state::set_relics,
            state::get_potions,
            state::set_potions,
            state::get_deck,
            state::set_deck,
            file::find_runs,
            state::get_energy,
            state::set_energy,
            file::save
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
