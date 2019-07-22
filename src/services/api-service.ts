import axios from 'axios';
import { API_URL, HEADERS } from '../config';
import { IQuestion, IAnswer, ISubject, IFeedback } from '../interfaces';

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

export async function getFeedbackList(id?: string): Promise<IFeedback[]> {
  return await api
    .get(id ? `feedback/question/${id}` : 'feedback')
    .then(res => res.data);
}

export async function getQuestionList<T>(parameter?: string): Promise<T> {
  let url = '';
  switch (parameter) {
    case 'inbox':
      url = '/unanswered';
      break;
    case 'started':
      url = '/inprogress';
      break;
    case 'approval':
      url = '/unapproved';
      break;
    case 'public':
      url = '/public';
      break;
    default:
      url = '';
      break;
  }
  return await api
    .get(parameter !== undefined ? `questions${url}` : 'questions')
    .then(res => res.data)
    .catch(err => err);
}

export async function getSubjectList(): Promise<ISubject[]> {
  return await api.get('subjects').then(res => res.data);
}

export async function postAnswer(
  data: IAnswer,
  type?: string,
): Promise<IQuestion> {
  const { questionId, answerText, title } = data;
  let url = '';
  switch (type) {
    case 'inbox':
      url = '/submit';
      break;
    case 'started':
      url = '/submit';
      break;
    case 'approval':
      return await api
        .post(`questions/${questionId}/send`)
        .then(res => res.data);
    default:
      url = '';
      break;
  }
  return await api
    .post(`questions/${questionId}${url}`, data)
    .then(res => res.data);
}

export async function saveAnswer(data: IAnswer): Promise<IQuestion> {
  const { questionId, questionText, answerText, title } = data;
  return await api
    .post(`questions/${questionId}/edit`, data)
    .then(res => res.data)
    .catch(err => err.response);
}

export async function publishQuestion(id: string): Promise<{}> {
  return await api.post(`questions/${id}/approve`).then(res => res.data);
}

export async function deleteFeedback(id: string): Promise<{}> {
  return await api.post(`feedback/${id}/delete`).then(res => res.data);
}
