pub mod login_data;

use std::sync::{Arc, RwLock};
use std::io::Cursor;

use rocket::request::Request;
use rocket::response::{self, Response, Responder};
use rocket::http::{ContentType, Status};
use rocket::serde::{Deserialize, Serialize, json};
use xnas_orm::diesel::pg::PgConnection;

pub type Result<'a, T, E> = std::result::Result<Api<'a, T>, Api<'a, E>>;

#[derive(Deserialize, Debug)]
#[serde(crate = "rocket::serde")]
pub struct Config {
    pub db_url: String,
    pub dist: String,
    pub jwt_secure: String
}

#[derive(Serialize, Debug)]
#[serde(crate = "rocket::serde")]
pub struct Api<'a, T> {
    pub message: &'a str,
    pub error: bool,
    pub data: Option<T>,
    pub status: u16
}

pub struct Db {
    pub connect: Arc<RwLock<PgConnection>>,
}

unsafe impl Sync for Db {}

unsafe impl Send for Db {}

impl Db {
    pub fn new(connect: PgConnection) -> Self {
        Self {
            connect: Arc::new(RwLock::new(connect)),
        }
    }
}

impl<'a, T> Api<'a, T> {
    pub fn default(data: T) -> Self {
        Self {
            data: Some(data),
            message: "",
            status: 200,
            error: false
        }
    }

    pub fn custom(data: Option<T>, message: &'a str, status: u16, error: bool) -> Self {
        Self {
            data,
            message, 
            status,
            error
        }
    }
}

#[rocket::async_trait]
impl<'r, T: Serialize> Responder<'r, 'static> for Api<'r, T> {
    fn respond_to(self, _: &'r Request<'_>) -> response::Result<'static> {
        let json = json::to_string(&self).unwrap();

        Response::build()
            .header(ContentType::Plain)
            .status(Status::new(self.status))
            .sized_body(json.len(), Cursor::new(json))
            .ok()
    }
}
