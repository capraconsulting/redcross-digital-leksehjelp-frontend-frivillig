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

export async function getFeedbackList(): Promise<IFeedback[]> {
  return await api.get('feedback').then(res => res.data);
}

export async function getQuestionList<T>(parameter?: string): Promise<T> {
  let url = '';
  switch (parameter) {
    case 'inbox':
      url = '/unanswered';
      break;
    case 'started':
      url = '/edit';
      break;
    case 'approval':
      url = '/approve';
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
      url = '/answer';
      break;
    case 'started':
      url = '/answer';
      break;
    case 'approval':
      return await api
        .post(`questions/${questionId}/approve`, { title })
        .then(res => res.data);
    default:
      url = '';
      break;
  }
  return await api
    .post(`questions/${questionId}${url}`, { answerText })
    .then(res => res.data);
}

export async function saveAnswer(data: IAnswer): Promise<IQuestion> {
  const { questionId, answerText } = data;
  return await api
    .post(`questions/${questionId}/edit`, { answerText: answerText })
    .then(res => res.data)
    .catch(err => err.response);
}

export async function deleteFeedback(id: string): Promise<{}> {
  return await api.post(`feedback/${id}/delete`).then(res => res.data)
}
