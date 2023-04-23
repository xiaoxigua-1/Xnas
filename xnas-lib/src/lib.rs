pub mod call;
pub mod parser;

use pyo3::prelude::*;

type XnasResult<T> = Result<T, XnasAppError>;

#[derive(Debug)]
pub enum XnasAppError {
    CommandError,
    NotFoundMain,
    PyError(PyErr),
}

#[pymodule]
fn xnas_py_lib(_py: Python<'_>, foo_module: &PyModule) -> PyResult<()> {

    Ok(())
}
