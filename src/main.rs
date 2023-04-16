mod data;
mod router;

#[macro_use]
extern crate rocket;
use rocket::{fairing::AdHoc, fs::{FileServer, relative}};
use xnas_orm::{
    establish_connection, run_migrations
};

use data::{Config, Db};

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(AdHoc::config::<Config>())
        .attach(AdHoc::on_ignite("init", |rocket| async move {
            let config = rocket.state::<Config>().unwrap();
            let mut pg_connect = establish_connection(&config.db_url);
            
            run_migrations(&mut pg_connect);
            
            rocket
                .manage(Db::new(pg_connect))
                .mount("/", FileServer::from(relative!("xnas-frontend/dist")))
        }))
        .attach(router::stage())
}
