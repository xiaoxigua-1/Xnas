mod data;
mod router;

#[macro_use]
extern crate rocket;
use rocket::{fairing::AdHoc, fs::{FileServer, relative}};
use xnas_orm::{
    diesel::RunQueryDsl, establish_connection, models::Accounts, run_migrations,
    schema::accounts::dsl::*,
};

use data::{Config, Db, WebStatus};

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(AdHoc::config::<Config>())
        .attach(AdHoc::on_ignite("init", |rocket| async move {
            let config = rocket.state::<Config>().unwrap();
            let mut pg_connect = establish_connection(&config.db_url);
            
            run_migrations(&mut pg_connect);
            
            let first = accounts
                .load::<Accounts>(&mut pg_connect)
                .unwrap()
                .is_empty();
            let web_status = WebStatus { first };
            rocket
                .manage(web_status)
                .manage(Db::new(pg_connect))
                .mount("/", FileServer::from(relative!("xnas-frontend/dist")))
        }))
        .attach(router::stage())
}
