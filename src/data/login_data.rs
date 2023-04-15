use rocket::serde::{Serialize, Deserialize};

#[derive(FromForm)]
pub struct LoginData {
    pub name: String,
    pub password: String,
}

#[derive(FromForm)]
pub struct NewAccData {
    pub name: String,
    pub password: String,
    pub email: Option<String>,
    pub admin: bool
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Jwt {
    token: String
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Claims {
    pub sub: String,
    pub company: String,
    pub exp: usize,
    pub admin: bool
}

impl Claims {
    pub fn new(exp: usize, company: String, sub: String, admin: bool) -> Self {
        Self {
            exp,
            company,
            sub,
            admin
        }
    }
}

impl Jwt {
    pub fn new(token: String) -> Self {
        Self {
            token
        }
    }
}
