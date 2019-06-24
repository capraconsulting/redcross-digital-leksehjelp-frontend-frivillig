import axios from 'axios';
import { API_URL, HEADERS } from '../config';
import { IQuestion, IAnswer, IQuestionMeta } from '../interfaces';

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

export async function getQuestionList<T>(parameter?: string): Promise<T> {
  let url = '';
  switch (parameter) {
    case 'inbox':
      url = 'answer';
      break;
    case 'started':
      url = 'edit';
      break;
    case 'approval':
      url = 'approve';
      break;
    default:
      url = '';
      break;
  }
  return await api
    .get(parameter !== undefined ? `questions/${url}` : 'questions')
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

export async function postAnswer(body: IAnswer): Promise<IQuestion> {
  const { questionId } = body;
  return await api
    .put(`questions/${questionId}/edit`, body)
    .then(res => res)
    .catch(err => err.response);
}

export function remove(url: string): Promise<any> {
  return api
    .delete(`${url}`)
    .then(res => res)
    .catch(err => err.response);
}
