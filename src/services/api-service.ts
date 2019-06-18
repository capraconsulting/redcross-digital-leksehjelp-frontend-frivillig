import axios from 'axios';
import { API_URL, HEADERS } from '../config';
import { IQuestion, IAnswer } from '../interfaces';

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

export function getQuestion(id: string): Promise<IQuestion> {
  return api
    .get(`questions/${id}`)
    .then(res => res.data)
    .catch(err => err);
}

export function getQuestionList(answered?: boolean): Promise<IQuestion[]> {
  return api
    .get(
      answered !== undefined ? `questions?answered=${answered}` : 'questions',
    )
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

export function postAnswer(body: IAnswer): Promise<IQuestion> {
  return api
    .post(`answers`, body)
    .then(res => res)
    .catch(err => err.response);
}

export function remove(url: string): Promise<any> {
  return api
    .delete(`${url}`)
    .then(res => res)
    .catch(err => err.response);
}
