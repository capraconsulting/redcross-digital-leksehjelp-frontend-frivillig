import axios from 'axios';
import { API_URL, HEADERS } from '../config';

const api = axios.create({
  baseURL: API_URL,
  headers: HEADERS,
});

export function get(url: string): Promise<any> {
  return api
    .get(`${url}`)
    .then(res => res)
    .catch(err => err);
}

export function put(url: string, data: Object): Promise<Object> {
  return api
    .put(`${url}`, data)
    .then(res => res)
    .catch(err => err.response);
}

export function post(url: string, body: Object): Promise<Object> {
  return api
    .post(`${url}`, body)
    .then(res => res)
    .catch(err => err.response);
}

export function remove(url: string): Promise<Object> {
  return api
    .delete(`${url}`)
    .then(res => res)
    .catch(err => err.response);
}
