use bcrypt::{hash, DEFAULT_COST, verify};
use jsonwebtoken::{Header, EncodingKey};
use rocket::{fairing::AdHoc, form::Form, State};
use xnas_orm::{schema::accounts::{dsl::*, self}, diesel::{QueryDsl, ExpressionMethods, RunQueryDsl, insert_into}, models::{Accounts, NewAccount}};

use crate::data::{login_data::{LoginData, NewAccData, Claims, Jwt}, Db, Result, Api, Config};

#[post("/login", data = "<login_data>")]
fn login<'a>(db: &State<Db>, config: &State<Config>, login_data: Form<LoginData>) -> Result<'a, Jwt, String> {
    let db_clone = db.clone();

    let Ok(login_acc) = accounts.filter(name.eq(&login_data.name)).first::<Accounts>(&mut *db_clone.connect.write().unwrap()) else {
        return Err(Api::custom(None, "User not found", 401, true));
    };

    if verify(login_data.password.clone(), &login_acc.password_hash).unwrap() {
        let header = Header::default();
        let secure = EncodingKey::from_secret(config.jwt_secure.as_bytes());
        let claims = Claims::new(1, "".to_string(), "login".to_string());
        
        let token = jsonwebtoken::encode(&header, &claims, &secure).unwrap();

        Ok(Api::default(Jwt::new(token)))
    } else {
        Err(Api::custom(None, "password error", 401, true))
    }
}

#[post("/create_new_acc", data = "<new_acc_data>")]
fn create_new_acc(db: &State<Db>, new_acc_data: Form<NewAccData>) {
    let db_clone = db.clone();

    let new_acc = NewAccount {
        name: new_acc_data.name.clone(),
        password_hash: hash(new_acc_data.password.clone(), DEFAULT_COST).unwrap(),
        email: new_acc_data.email.clone()
    };

    insert_into(accounts::table)
        .values(&new_acc)
        .get_result::<Accounts>(&mut *db_clone.connect.write().unwrap())
        .unwrap();
}

pub fn stage() -> AdHoc {
    AdHoc::on_ignite("load login stage", |rocket| async {
        rocket.mount("/api", routes![login, create_new_acc])
    })
}
