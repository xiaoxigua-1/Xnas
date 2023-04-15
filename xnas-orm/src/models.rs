use diesel::prelude::*;
use crate::schema::accounts;

#[derive(Queryable, Debug)]
pub struct Accounts {
    pub id: i32,
    pub name: String,
    pub email: Option<String>,
    pub password_hash: String,
    pub admin: bool
}

#[derive(Insertable)]
#[diesel(table_name = accounts)]
pub struct NewAccount {
    pub name: String,
    pub password_hash: String,
    pub email: Option<String>,
    pub admin: bool
}
