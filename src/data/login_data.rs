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
    pub email: Option<String>
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Jwt {
    token: String
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Claims {
    sub: String,
    company: String,
    exp: usize,
}

impl Claims {
    pub fn new(exp: usize, company: String, sub: String) -> Self {
        Self {
            exp,
            company,
            sub
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
