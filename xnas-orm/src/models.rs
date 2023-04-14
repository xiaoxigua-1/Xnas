use diesel::prelude::*;

#[derive(Queryable)]
pub struct Login {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub password_hash: String,
}
