extern crate directories;
use directories::BaseDirs;
use serde::{Deserialize, Serialize};

use std::ffi::OsString;
use std::fs::File;
use std::io::{BufRead, BufReader, BufWriter};
use std::path::Path;
use std::process::{Command, Stdio};
use std::{collections::HashMap, sync::Mutex};
use std::{fs, io};
use tauri::{Manager, State};
use tauri_plugin_dialog;

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
        .or_insert(vec![]);

    state.timestamps.entry(file_name_copy).and_modify(|item| {
        item.push(Timestamp {
            name: name_copy,
            time_in_seconds,
        })
    });

    let base_dirs = match BaseDirs::new() {
        Some(v) => v,
        _ => panic!("panicked"),
    };
    let local_dir = base_dirs.cache_dir();
    let vods_dir = local_dir.join(Path::new("bettervods\\timestamps.json"));

    let file = File::create(vods_dir).unwrap();
    let writer = BufWriter::new(file);

    serde_json::to_writer_pretty(writer, &state.timestamps).unwrap();

    Some(())
}

#[tauri::command]
fn delete_timestamp(state: State<'_, Mutex<AppState>>, file_name: &str, name: &str) -> String {
    println!("Deleting");
    let mut state = state.lock().unwrap();
    let mut index = 0;

    for &timestamp in state.timestamps.get(&file_name.to_owned()).iter() {
        for ts in timestamp.iter() {
            println!("{:?}", ts.name);
            if ts.name == name {
                break;
            }
            index = index + 1;
        }

        break;
    }

    state
        .timestamps
        .entry(file_name.to_owned())
        .and_modify(|item| {
            item.remove(index);
        });

    let base_dirs = match BaseDirs::new() {
        Some(v) => v,
        _ => panic!("panicked"),
    };
    let local_dir = base_dirs.cache_dir();
    let vods_dir = local_dir.join(Path::new("bettervods\\timestamps.json"));

    let file = File::create(vods_dir).unwrap();
    let writer = BufWriter::new(file);

    serde_json::to_writer_pretty(writer, &state.timestamps).unwrap();

    name.to_owned()
}

#[tauri::command]
fn read_timestamps_from_json(state: State<'_, Mutex<AppState>>) {
    let base_dirs = match BaseDirs::new() {
        Some(v) => v,
        _ => panic!("panicked"),
    };

    let local_dir = base_dirs.cache_dir();
    let timestamps_path = local_dir.join(Path::new("bettervods\\timestamps.json"));

    if Path::exists(&timestamps_path) {
        let data = fs::read_to_string(timestamps_path).expect("unreadable");
        let json: HashMap<String, Vec<Timestamp>> =
            serde_json::from_str(&data).expect("invalid json");

        let mut state = state.lock().unwrap();

        state.timestamps = json;
    }
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

fn create_vods_dir() -> bool {
    if let Some(base_dirs) = BaseDirs::new() {
        let local_dir = base_dirs.cache_dir();

        let vods_dir = local_dir.join(Path::new("bettervods"));

        if !vods_dir.exists() {
            let _ = fs::create_dir(&vods_dir);

            let final_dir = vods_dir.join(Path::new("vods"));

            let _ = fs::create_dir(final_dir);
            println!("created dir");

            return true;
        }
    }

    return false;
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let _ = create_vods_dir();
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(|app| {
            // let handle = app.handle().clone();
            // tauri::async_runtime::spawn(async move {
            //     update(handle).await.unwrap();
            // });
            app.manage(Mutex::new(AppState::default()));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            convert_from_m3u8,
            is_name_available,
            get_all_vods,
            get_full_path,
            create_timestamp,
            get_all_timestamps_for_video,
            read_timestamps_from_json,
            delete_timestamp
        ])
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
