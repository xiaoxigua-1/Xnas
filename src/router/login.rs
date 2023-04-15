use bcrypt::{hash, verify, DEFAULT_COST};
use jsonwebtoken::{decode, DecodingKey, EncodingKey, Header, Validation};
use rocket::{
    fairing::AdHoc,
    form::Form,
    http::Status,
    request::{FromRequest, Outcome, Request},
    State,
};
use xnas_orm::{
    diesel::{insert_into, ExpressionMethods, QueryDsl, RunQueryDsl},
    models::{Accounts, NewAccount},
    schema::accounts::{self, dsl::*},
};

use crate::data::{
    login_data::{Claims, Jwt, LoginData, NewAccData},
    Api, Config, Db, Result,
};

struct CreateAccToken {}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for CreateAccToken {
    type Error = Api<'r, String>;

    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let auth_header = request.headers().get_one("Authorization");
        let config = request.guard::<&State<Config>>().await.succeeded().unwrap();
        let db = request.guard::<&State<Db>>().await.succeeded().unwrap();
        let all = accounts
            .load::<Accounts>(&mut *db.connect.write().unwrap())
            .unwrap();

        let can_create = if all.is_empty() {
            true
        } else if let Some(auth_str) = auth_header {
            let token_info = auth_str.split(" ").collect::<Vec<_>>();
            if token_info.len() == 2 {
                let token_type = token_info[0];
                let token_str = token_info[1];

                if let Ok(claims) = decode::<Claims>(
                    token_str,
                    &DecodingKey::from_secret(config.jwt_secure.as_bytes()),
                    &Validation::default(),
                ) {
                    claims.claims.admin && token_type == "Bearer"
                } else {
                    false
                }
            } else {
                false
            }
        } else {
            false
        };

        if can_create {
            Outcome::Success(CreateAccToken {})
        } else {
            Outcome::Failure((
                Status::Unauthorized,
                Api::custom(Some(String::new()), "", 401, true),
            ))
        }
    }
}

#[post("/login", data = "<login_data>")]
fn login<'a>(
    db: &State<Db>,
    config: &State<Config>,
    login_data: Form<LoginData>,
) -> Result<'a, Jwt, String> {
    let Ok(login_acc) = accounts.filter(name.eq(&login_data.name)).first::<Accounts>(&mut *db.connect.write().unwrap()) else {
        return Err(Api::custom(None, "User not found", 401, true));
    };

    if verify(login_data.password.clone(), &login_acc.password_hash).unwrap() {
        let header = Header::default();
        let secure = EncodingKey::from_secret(config.jwt_secure.as_bytes());
        let claims = Claims::new(1, "".to_string(), "login".to_string(), login_acc.admin);

        let token = jsonwebtoken::encode(&header, &claims, &secure).unwrap();

        Ok(Api::default(Jwt::new(token)))
    } else {
        Err(Api::custom(None, "password error", 401, true))
    }
}

#[post("/create_new_acc", data = "<new_acc_data>")]
fn create_new_acc(db: &State<Db>, new_acc_data: Form<NewAccData>, _create: CreateAccToken) {
    let new_acc = NewAccount {
        name: new_acc_data.name.clone(),
        password_hash: hash(new_acc_data.password.clone(), DEFAULT_COST).unwrap(),
        email: new_acc_data.email.clone(),
        admin: new_acc_data.admin,
    };

    insert_into(accounts::table)
        .values(&new_acc)
        .get_result::<Accounts>(&mut *db.connect.write().unwrap())
        .unwrap();
}

pub fn stage() -> AdHoc {
    AdHoc::on_ignite("load login stage", |rocket| async {
        rocket.mount("/api", routes![login, create_new_acc])
    })
}
