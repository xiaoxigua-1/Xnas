// @generated automatically by Diesel CLI.

diesel::table! {
    accounts (id) {
        id -> Int4,
        name -> Text,
        email -> Nullable<Text>,
        password_hash -> Text,
    }
}
