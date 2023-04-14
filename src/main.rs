mod data;
mod router;

#[macro_use]
extern crate rocket;
use data::Config;
use rocket::{fs::NamedFile, fairing::AdHoc, State};
use std::path::{Path, PathBuf};

#[get("/<file..>")]
async fn static_files(state: &State<Config>, file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new(&state.dist).join(file))
        .await
        .ok()
}

#[get("/")]
async fn index(state: &State<Config>) -> Option<NamedFile> {
    NamedFile::open(Path::new(&state.dist).join("index.html"))
        .await
        .ok()
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(AdHoc::config::<Config>())
        .mount("/", routes![index, static_files])
        .attach(router::stage())
}
