import axios from "axios";

const baseurl = "http://localhost:8080/api/v1";

const authHeaders = {};

export async function signUpHandler(apiBody) {
  return axios.post(baseurl + "/signup", apiBody, {
    headers: authHeaders,
  });
}

export async function loginHandler(apiBody) {
  return axios.post(baseurl + "/login", apiBody, { headers: authHeaders });
}

export async function verifyTokenHandler(headers) {
  axios.get(baseurl + "/verify", headers);
}

export async function getTodos(headers, page = 1, limit = 10, search = "") {
  return axios.get(
    baseurl + `/todos?page=${page}&limit=${limit}&search=${search}`,
    headers
  );
}
export async function getTodo(id, headers) {
  return axios.get(baseurl + `/todo?id=${id}`, headers);
}
export async function createUpdateTodo(apiBody, headers) {
  if (apiBody._id) {
    return axios.put(baseurl + `/todos/${apiBody._id}`, apiBody, headers);
  }
  return axios.post(baseurl + `/todos`, apiBody, headers);
}
export async function deleteTodo(id, limit, headers) {
  return axios.delete(baseurl + `/todos/${id}?limit=${limit}`, headers);
}
