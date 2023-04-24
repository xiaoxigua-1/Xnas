// @generated automatically by Diesel CLI.

diesel::table! {
    accounts (id) {
        id -> Int4,
        name -> Text,
        email -> Nullable<Text>,
        password_hash -> Text,
        admin -> Bool,
    }
}

diesel::table! {
    app (id) {
        id -> Int4,
        name -> Text,
        enable -> Bool,
        path -> Text,
    }
}

diesel::allow_tables_to_appear_in_same_query!(accounts, app,);
