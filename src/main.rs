mod router;
mod data;

#[macro_use] extern crate rocket;
use std::path::{Path, PathBuf};
use rocket::fs::NamedFile;

#[get("/<file..>")]
async fn index(file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new("xnas-frontend/dist").join(file)).await.ok()
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![index])
}
