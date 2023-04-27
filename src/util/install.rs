use flate2::bufread::GzDecoder;
use reqwest::Url;
use std::fs::create_dir_all;
use tar::Archive;

pub async fn install_app(url: String) -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let response = client.get(&url).send().await?;
    let url = Url::parse(&url)?;
    let app_name = url
        .path_segments()
        .and_then(|segments| segments.last())
        .unwrap();
    let bytes = response.bytes().await?;
    let tar = GzDecoder::new(&bytes[..]);
    let mut archive = Archive::new(tar);

    create_dir_all("./apps/")?;
    archive.unpack(format!("./apps/{}", app_name))?;

    Ok(())
}
