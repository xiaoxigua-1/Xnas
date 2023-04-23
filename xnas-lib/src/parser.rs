use pyo3::{Py, types::PyTuple, IntoPy};

use crate::{XnasAppError, XnasResult};

#[derive(Debug)]
pub struct XnasCommand<T> {
    pub app: String,
    pub(crate) fun: String,
    pub(crate) args: T
}

/// command example `app:init(arg, arg1, arg2)`
pub fn parser<T>(command: String, args: T) -> XnasResult<XnasCommand<T>> 
    where T: IntoPy<Py<PyTuple>> + Clone
{
    let command: Vec<&str> = command.split(':').collect();

    if command.len() < 2 {
        return Err(XnasAppError::CommandError);
    }

    let app = command[0].to_string();
    let fun = command[1].to_string();

    Ok(XnasCommand { app, fun, args })
}
