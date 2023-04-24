mod apps;
mod data;

use rocket::{fairing::AdHoc,
    State,
    request::{FromRequest, Outcome, Request}, http::Status,
};
use jsonwebtoken::{decode, Validation, DecodingKey};

use crate::data::login_data::Claims;
use crate::Config;

pub struct Auth {
    claims: Claims,
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for Auth {
    type Error = ();

    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let auth_header = request.headers().get_one("Authorization");
        let config = request.guard::<&State<Config>>().await.succeeded().unwrap();

        if let Some(auth_content) = auth_header {
            let auth_strs = auth_content.split(' ').collect::<Vec<&str>>();

            if auth_strs.len() == 2 {
                let Ok(jwt) = decode::<Claims>(
                    auth_strs[1],
                    &DecodingKey::from_secret(config.jwt_secure.as_bytes()),
                    &Validation::default(),
                ) else {
                    return Outcome::Failure((Status::Unauthorized, ()))
                };

                Outcome::Success(Auth { claims: jwt.claims })
            } else if auth_strs[0] == "Bearer" {
                Outcome::Failure((Status::Unauthorized, ()))
            } else {
                Outcome::Failure((Status::Unauthorized, ()))
            }
        } else {
            Outcome::Failure((Status::Unauthorized, ()))
        }
    }
}

pub fn stage() -> AdHoc {
    AdHoc::on_ignite("load auth stage", |rocket| async {
        rocket
            .attach(apps::stage())
    })
}

