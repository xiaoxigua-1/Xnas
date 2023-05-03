mod data;
mod router;
mod util;

#[macro_use]
extern crate rocket;
use rocket::{
    fairing::AdHoc,
    fs::{relative, FileServer},
};
use xnas_orm::{
    diesel::RunQueryDsl, establish_connection, models::App, run_migrations, schema::apps::dsl::*,
};

use data::{apps::{AppInfo, Apps}, Config, Db};

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(AdHoc::config::<Config>())
        .attach(AdHoc::on_ignite("init", |rocket| async move {
            let config = rocket.state::<Config>().unwrap();
            let mut pg_connect = establish_connection(&config.db_url);

            run_migrations(&mut pg_connect);

            let apps_info = apps
                .load::<App>(&mut pg_connect)
                .unwrap()
                .iter()
                .map(|app| AppInfo {
                    id: app.id,
                    name: app.name.clone(),
                    path: app.path.clone(),
                    enable: app.enable,
                    description: app.description.clone(),
                }).collect::<Vec<_>>();

            rocket
                .manage(Db::new(pg_connect))
                .manage(Apps { apps: apps_info })
                .mount("/", FileServer::from(relative!("xnas-frontend/dist")))
        }))
        .attach(router::stage())
}
