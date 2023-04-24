use std::{ffi::OsStr, fs, path::PathBuf};

use pyo3::{
    types::{PyModule, PyTuple},
    IntoPy, Py, PyResult, Python,
};
use walkdir::WalkDir;

use crate::{parser::XnasCommand, XnasAppError, XnasResult};

fn get_all_py_file(path: PathBuf, files: &mut Vec<PathBuf>) {
    for path in WalkDir::new(path) {
        let path = path.unwrap().into_path();
        if let Some(extension) = path.extension() {
            if extension == "py" {
                files.push(path);
            }
        }
    }
}

impl<T: IntoPy<Py<PyTuple>> + Clone> XnasCommand<T> {
    pub fn run(&self, path: PathBuf) -> XnasResult<Option<String>> {
        let mut py_files = vec![];

        get_all_py_file(path.clone(), &mut py_files);

        if let Some(main_file) = py_files
            .clone()
            .iter()
            .find(|file| file.file_stem() == Some(OsStr::new("main")))
        {
            pyo3::prepare_freethreaded_python();

            let from_py = Python::with_gil(|py| -> PyResult<Option<String>> {
                for py_file in py_files {
                    if !py_file.eq(main_file) {
                        let module_name = py_file
                            .strip_prefix(path.clone())
                            .unwrap()
                            .to_str()
                            .unwrap()
                            .split("/")
                            .collect::<Vec<&str>>()
                            .join(".");
                        let module_name = &module_name[..module_name.len() - 3];
                        let path = format!("{}", py_file.display());
                        let code = fs::read_to_string(path.clone()).unwrap();

                        PyModule::from_code(py, &code, module_name, module_name)?;
                    }
                }

                let code = fs::read_to_string(main_file.to_str().unwrap()).unwrap();
                let app = PyModule::from_code(py, &code, "", "")?.getattr(self.fun.as_str())?;

                app.call1(self.args.clone())?.extract()
            });

            match from_py {
                Ok(py_ret_str) => Ok(py_ret_str),
                Err(e) => Err(XnasAppError::PyError(e)),
            }
        } else {
            Err(XnasAppError::NotFoundMain)
        }
    }
}

#[cfg(test)]
mod test {
    use std::path::PathBuf;

    use crate::parser::parser;

    #[test]
    fn test() {
        let ret_str = parser("app:init".to_string(), (10,))
            .unwrap()
            .run(PathBuf::from("./test"))
            .unwrap();
        println!("{:?}", ret_str);
    }
}
