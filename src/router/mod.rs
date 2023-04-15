mod login;
mod status;

use rocket::fairing::AdHoc;
use xnas_orm::{establish_connection, run_migrations, schema::accounts::dsl::*, diesel::RunQueryDsl, models::Accounts};

use crate::data::{Config, Db, WebStatus};

pub fn stage() -> AdHoc {
    AdHoc::on_ignite("load router stage", |rocket| async {
        let mut pg_connect = establish_connection(&rocket.state::<Config>().unwrap().db_url);
        run_migrations(&mut pg_connect);
        let first = accounts.load::<Accounts>(&mut pg_connect).unwrap().is_empty();
        let web_status = WebStatus { first };

        rocket.manage(web_status).manage(Db::new(pg_connect)).attach(login::stage()).attach(status::stage())
    })
}
