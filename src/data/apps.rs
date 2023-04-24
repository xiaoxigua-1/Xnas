use rocket::serde::{Deserialize, Serialize};

pub struct Apps {
    apps: Vec<AppInfo>,
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct AppInfo {
    name: String,
    description: String,
}

#[derive(FromForm)]
pub struct Install {
    url: String,
}
