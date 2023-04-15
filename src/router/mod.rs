mod login;
mod status;

use rocket::fairing::AdHoc;

pub fn stage() -> AdHoc {
    AdHoc::on_ignite("load router stage", |rocket| async {
        rocket
            .attach(login::stage())
            .attach(status::stage())
    })
}
