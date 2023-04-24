use rocket::{fairing::AdHoc, form::Form, State};

use crate::data::{apps::Install, Db};

use super::Auth;

#[post("/install", data = "<data>")]
async fn install(auth: Auth, data: Form<Install>, db: &State<Db>) {
    
}

pub fn stage() -> AdHoc {
    AdHoc::on_ignite("load apps api stage", |rocket| async {
        rocket
            .mount("/api/apps", routes![install])
    })
}
