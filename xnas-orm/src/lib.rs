pub mod models;
pub mod schema;

pub use diesel::pg::PgConnection;
pub use diesel::prelude::*;

pub fn establish_connection(database_url: &str) -> PgConnection {
    PgConnection::establish(database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}
