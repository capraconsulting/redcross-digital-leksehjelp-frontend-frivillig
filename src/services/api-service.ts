import axios from 'axios';
import { API_URL, HEADERS } from '../config';
import { IQuestion, IAnswer } from '../interfaces';

const api = axios.create({
  baseURL: API_URL,
  headers: HEADERS,
});

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
      url = 'unanswered';
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

export async function postAnswer(
  data: IAnswer,
  type?: string,
): Promise<IQuestion> {
  const { questionId, answerText } = data;
  let url = '';
  switch (type) {
    case 'inbox':
      url = '/edit';
      break;
    case 'started':
      url = '/answer';
      break;
    case 'approval':
      url = '/approve';
      break;
    default:
      url = '';
      break;
  }
  return await api
    .post(`questions/${questionId}${url}`, { answerText: answerText })
    .then(res => res.data)
    .catch(err => err.response);
}
