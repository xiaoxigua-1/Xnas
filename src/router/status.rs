use rocket::{fairing::AdHoc, State};
use xnas_orm::{diesel::RunQueryDsl, models::Accounts, schema::accounts::dsl::*};

use crate::data::{Api, Db};

#[get("/first")]
async fn first<'a>(db: &State<Db>) -> Api<'a, bool> {
    Api::default(
        accounts
            .load::<Accounts>(&mut *db.connect.write().unwrap())
            .unwrap()
            .is_empty(),
    )
}

pub fn stage() -> AdHoc {
    AdHoc::on_ignite("load status stage", |rocket| async {
        rocket.mount("/api", routes![first])
    })
}
