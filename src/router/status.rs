use rocket::{fairing::AdHoc, State};

use crate::data::{WebStatus, Api};

#[get("/first")]
async fn first<'a>(web_status: &State<WebStatus>) -> Api<'a, bool> {
    Api::default(web_status.first)
}

pub fn stage() -> AdHoc {
    AdHoc::on_ignite("load status stage", |rocket| async {
        rocket.mount("/api", routes![first])
    })
}
