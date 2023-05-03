use rocket::serde::{Deserialize, Serialize};

pub struct Apps {
    pub apps: Vec<AppInfo>,
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct AppInfo {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub enable: bool,
    pub path: String,
}

#[derive(FromForm)]
pub struct Install {
    url: String,
}
