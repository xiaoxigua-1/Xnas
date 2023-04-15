import axios from "axios";

export const baseInstance = axios.create({
  baseURL: "/api/",
});

export function authInstance(token: string) {
  return axios.create({
    baseURL: "/api/",
    headers: {
      Authorization: `Bearer ${token}`
    } 
  })
}

export interface Api<T> {
  message: string,
  data: T,
  error: boolean,
  status: number
}
