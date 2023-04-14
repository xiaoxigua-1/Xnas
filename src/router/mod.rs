mod login;

use rocket::fairing::AdHoc;
use xnas_orm::establish_connection;

use crate::{data::{Config, Db}, router};

pub fn stage() -> AdHoc {
    AdHoc::on_ignite("load router stage", |rocket| async {
        println!("{:?}", rocket.state::<Config>());
        let pg_connect = establish_connection(&rocket.state::<Config>().unwrap().db_url);

        rocket
            .manage(Db::new(pg_connect))
            .attach(login::stage())
    })
}
