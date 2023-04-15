mod data;
mod router;

#[macro_use]
extern crate rocket;
use rocket::{fairing::AdHoc, fs::NamedFile, State};
use xnas_orm::{
    diesel::RunQueryDsl, establish_connection, models::Accounts, run_migrations,
    schema::accounts::dsl::*,
};
use std::path::{Path, PathBuf};

use data::{Config, Db, WebStatus};

#[get("/<file..>")]
async fn static_files(state: &State<Config>, file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new(&state.dist).join(file))
        .await
        .ok()
}

#[get("/")]
async fn index(state: &State<Config>, web_status: &State<WebStatus>) -> Option<NamedFile> {
    NamedFile::open(Path::new(&state.dist).join(if web_status.first { "first.html" } else { "index.html" }))
        .await
        .ok()
}

#[launch]
fn rocket() -> _ {
    let rocket = rocket::build()
        .attach(AdHoc::config::<Config>());
    let mut pg_connect = establish_connection(&rocket.state::<Config>().unwrap().db_url);
    
    run_migrations(&mut pg_connect);
    
    let first = accounts
        .load::<Accounts>(&mut pg_connect)
        .unwrap()
        .is_empty();
    let web_status = WebStatus { first };
    
    rocket
        .manage(web_status)
        .manage(Db::new(pg_connect))
        .mount("/", routes![index, static_files])
        .attach(router::stage())
}
