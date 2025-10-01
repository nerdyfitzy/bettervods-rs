extern crate directories;
use directories::BaseDirs;
use serde::{Deserialize, Serialize};

use std::ffi::OsString;
use std::io::{BufRead, BufReader};
use std::path::Path;
use std::process::{Command, Stdio};
use std::{collections::HashMap, sync::Mutex};
use std::{fs, io};
use tauri::{Builder, Manager, State};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[derive(Deserialize, Serialize, Clone)]
struct Timestamp {
    name: String,
    time_in_seconds: i32,
}

#[derive(Default)]
struct AppState {
    timestamps: HashMap<String, Vec<Timestamp>>,
}

#[tauri::command]
fn create_timestamp(
    state: State<'_, Mutex<AppState>>,
    file_name: &str,
    name: &str,
    time_in_seconds: i32,
) -> Option<()> {
    println!("Creating");
    let file_name_copy = file_name.to_owned();
    let name_copy = name.to_owned();
    let mut state = state.lock().unwrap();
    state
        .timestamps
        .entry(file_name.to_owned())
        .or_insert(vec![Timestamp {
            name: name.to_owned(),
            time_in_seconds,
        }]);

    state.timestamps.entry(file_name_copy).and_modify(|item| {
        item.push(Timestamp {
            name: name_copy,
            time_in_seconds,
        })
    });

    Some(())
}

#[tauri::command]
fn get_all_timestamps_for_video(state: State<'_, Mutex<AppState>>, name: String) -> Vec<Timestamp> {
    let state = state.lock().unwrap();

    let Some(timestamp) = state.timestamps.get(&name) else {
        return vec![];
    };

    timestamp.clone()
}

#[tauri::command]
fn get_all_vods() -> Vec<OsString> {
    if let Some(base_dirs) = BaseDirs::new() {
        let home = base_dirs.cache_dir();
        let vods_folder = home.join(Path::new("bettervods\\vods"));

        let files = fs::read_dir(vods_folder)
            .unwrap()
            .map(|res| res.map(|e| e.file_name().to_owned()))
            .collect::<Result<Vec<_>, io::Error>>()
            .unwrap();
        files
    } else {
        panic!();
    }
}

#[tauri::command]
fn get_full_path(name: &str) -> String {
    if let Some(base_dirs) = BaseDirs::new() {
        let home = base_dirs.cache_dir();
        let final_str = format!("bettervods\\vods\\{}", name);
        let file_path = home.join(Path::new(&final_str));

        if let Some(path_str) = &file_path.to_str() {
            let owned = path_str.to_string();
            owned
        } else {
            panic!();
        }
    } else {
        panic!();
    }
}

#[tauri::command]
fn is_name_available(name: &str) -> bool {
    if let Some(base_dirs) = BaseDirs::new() {
        let home = base_dirs.cache_dir();
        let final_str = format!("bettervods\\vods\\{}.mkv", name);
        let file_path = home.join(Path::new(&final_str));

        if file_path.exists() {
            false
        } else {
            true
        }
    } else {
        panic!();
    }
}

#[tauri::command]
fn convert_from_m3u8(url: &str, name: &str, start_time: &str, end_time: &str) -> Option<i32> {
    if let Some(base_dirs) = BaseDirs::new() {
        let home = base_dirs.cache_dir();
        let final_str = format!("bettervods\\vods\\{}.mkv", name);
        let file_path = home.join(Path::new(&final_str));
        println!("{:?}", file_path);
        let mut cmd = Command::new("ffmpeg")
            .args([
                "-i",
                url,
                "-ss",
                start_time,
                "-to",
                end_time,
                "-c",
                "copy",
                file_path.to_str()?,
            ])
            .stdout(Stdio::piped())
            .spawn()
            .unwrap();

        println!("cmd created");
        {
            let stdout = cmd.stdout.as_mut().unwrap();
            let stdout_reader = BufReader::new(stdout);
            let stdout_lines = stdout_reader.lines();

            for line in stdout_lines {
                println!("Read: {:?}", line);
            }

            // let ffmpeg_stdout = cmd.stdout.take().expect("Stdout err");
            // let mut output_file =
            //     File::create("C:\\Users\\kaylee\\AppData\\Local\\examplefile.mkv").unwrap();
            // let mut reader = BufReader::new(ffmpeg_stdout);
            // io::copy(&mut reader, &mut output_file).unwrap();
        }

        println!("running");
        cmd.wait().unwrap();
        println!("ran");
        Some(200)
    } else {
        panic!();
    }
}

fn create_vods_dir() {
    if let Some(base_dirs) = BaseDirs::new() {
        let local_dir = base_dirs.cache_dir();

        let vods_dir = local_dir.join(Path::new("bettervods\\vods"));

        if !vods_dir.exists() {
            let _ = fs::create_dir(vods_dir);
            println!("created dir");
        }
    }
}

// async fn update(app: tauri::AppHandle) -> tauri_plugin_updater::Result<()> {
//     if let Some(update) = app.updater()?.check().await? {
//         let mut downloaded = 0;
//
//         // alternatively we could also call update.download() and update.install() separately
//         update
//             .download_and_install(
//                 |chunk_length, content_length| {
//                     downloaded += chunk_length;
//                     println!("downloaded {downloaded} from {content_length:?}");
//                 },
//                 || {
//                     println!("download finished");
//                 },
//             )
//             .await?;
//
//         println!("update installed");
//         app.restart();
//     }
//
//     Ok(())
// }

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    create_vods_dir();

    Builder::default()
        .setup(|app| {
            app.manage(Mutex::new(AppState::default()));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            convert_from_m3u8,
            is_name_available,
            get_all_vods,
            get_full_path,
            create_timestamp,
            get_all_timestamps_for_video
        ])
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
