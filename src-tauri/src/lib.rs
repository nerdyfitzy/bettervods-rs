use std::fs::File;
use std::io::{self, BufRead, BufReader, Error};
use std::process::{Command, Stdio};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn convert_from_m3u8(url: &str, start_time: &str, end_time: &str) -> Option<i32> {
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
            "../examplefile.mkv",
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
        // let mut output_file = File::create("%LOCALAPPDATA%\\output.mkv").unwrap();
        // let mut reader = BufReader::new(ffmpeg_stdout);
        // io::copy(&mut reader, &mut output_file).unwrap();
    }

    println!("running");
    cmd.wait().unwrap();
    println!("ran");
    Some(200)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![convert_from_m3u8])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
