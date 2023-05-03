use std::collections::HashMap;

use rocket::serde::json::Value;
use xnas_lib::pyo3::{IntoPy, PyObject, Python, ToPyObject};

pub fn value_to_object(val: &Value, py: Python<'_>) -> PyObject {
    match val {
        Value::String(s) => s.into_py(py),
        Value::Bool(b) => b.into_py(py),
        Value::Number(n) if n.is_i64() => n.as_i64().into_py(py),
        Value::Number(n) if n.is_u64() => n.as_u64().into_py(py),
        Value::Number(n) => n.as_f64().into_py(py),
        Value::Array(v) => {
            let inner: Vec<_> = v.iter().map(|x| value_to_object(x, py)).collect();
            inner.to_object(py)
        }
        Value::Object(m) => {
            let inner: HashMap<_, _> = m.iter().map(|(k, v)| (k, value_to_object(v, py))).collect();
            inner.to_object(py)
        }
        Value::Null => py.None(),
    }
}
