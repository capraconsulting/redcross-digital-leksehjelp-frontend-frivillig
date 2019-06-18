import axios from 'axios';
import { API_URL, HEADERS } from '../config';
import { IQuestion } from '../interfaces/IQuestion';

const api = axios.create({
  baseURL: API_URL,
  headers: HEADERS,
});

export function get(url: string): Promise<IQuestion[]> {
  return api
    .get(`${url}`)
    .then(res => res.data)
    .catch(err => err);
}

export function put(url: string, data: any): Promise<any> {
  return api
    .put(`${url}`, data)
    .then(res => res.data)
    .catch(err => err.response);
}

export function post(url: string, body: any): Promise<any> {
  return api
    .post(`${url}`, body)
    .then(res => res)
    .catch(err => err.response);
}

export function remove(url: string): Promise<any> {
  return api
    .delete(`${url}`)
    .then(res => res)
    .catch(err => err.response);
}
