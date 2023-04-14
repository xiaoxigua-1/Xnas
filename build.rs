use npm_rs::*;

fn main() {
    println!("cargo:rerun-if-changed=xnas-forntend/src");
    NpmEnv::default()
        .set_path("xnas-frontend")
        .with_node_env(&NodeEnv::Production)
        .init_env()
        .install(None)
        .run("build")
        .exec()
        .unwrap();
}
