use std::sync::RwLock;

use rocket::serde::Deserialize;
use xnas_orm::PgConnection;

#[derive(Deserialize, Debug)]
#[serde(crate = "rocket::serde")]
pub struct Config {
    pub db_url: String,
    pub dist: String
}

pub struct Db {
    pub connect: RwLock<PgConnection>,
}

unsafe impl Sync for Db {

}

unsafe impl Send for Db {

}

impl Db {
    pub fn new(connect: PgConnection) -> Self {
        Self { connect: RwLock::new(connect) }
    }
}
