// @generated automatically by Diesel CLI.

diesel::table! {
    posts (id) {
        id -> Int4,
        name -> Text,
        email -> Text,
        password_hash -> Text,
    }
}
