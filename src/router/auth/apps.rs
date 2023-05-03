use std::path::PathBuf;

use rocket::{
    data::FromData,
    data::{Outcome, ToByteUnit},
    fairing::AdHoc,
    form::Form,
    http::Status,
    serde::json::{self, Value},
    Data, Request, State,
};
use xnas_lib::{
    parser::parser,
    pyo3::{IntoPy, PyObject, Python},
};

use crate::{
    data::{apps::Install, Db},
    util::struct_to_py_object::value_to_object,
};

use super::Auth;

#[derive(Clone)]
struct Args {
    value: Value,
}

#[rocket::async_trait]
impl<'r> FromData<'r> for Args {
    type Error = ();

    async fn from_data(req: &'r Request<'_>, data: Data<'r>) -> Outcome<'r, Self> {
        use rocket::outcome::Outcome::*;

        let limit = req.limits().get("args").unwrap_or(256.bytes());

        // Read the data into a string.
        let string = match data.open(limit).into_string().await {
            Ok(string) if string.is_complete() => string.into_inner(),
            Ok(_) => return Failure((Status::PayloadTooLarge, ())),
            Err(_) => return Failure((Status::InternalServerError, ())),
        };

        let value: Value = json::from_str(&string).unwrap();

        Success(Args { value })
    }
}

impl IntoPy<PyObject> for Args {
    fn into_py(self, py: Python<'_>) -> PyObject {
        value_to_object(&self.value, py)
    }
}

#[post("/install", data = "<data>")]
async fn install(auth: Auth, data: Form<Install>, db: &State<Db>) {}

#[get("/<command>", data = "<args>", format = "json")]
async fn call(_auth: Auth, command: String, args: Args) {
    let command = parser(command, (args,)).unwrap();
    let path = PathBuf::from(format!("./apps/{}", command.app));
    command.run(path).unwrap();
}

pub fn stage() -> AdHoc {
    AdHoc::on_ignite("load apps api stage", |rocket| async {
        rocket.mount("/api/apps", routes![install, call])
    })
}
