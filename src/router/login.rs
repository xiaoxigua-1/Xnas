use rocket::fairing::AdHoc;

#[post("/login")]
fn login() {

}

pub fn stage() -> AdHoc {
    AdHoc::on_ignite("load login stage", |rocket| async { 
        rocket.mount("/api", routes![login])
    })
}
