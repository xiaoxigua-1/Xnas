pub mod models;
pub mod schema;

use diesel::pg::{PgConnection, Pg};
use diesel::prelude::*;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
pub use diesel;

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("./migrations");

pub fn establish_connection(database_url: &str) -> PgConnection {
    PgConnection::establish(database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

pub fn run_migrations(connection: &mut impl MigrationHarness<Pg>) {
    connection.run_pending_migrations(MIGRATIONS).unwrap();
}
