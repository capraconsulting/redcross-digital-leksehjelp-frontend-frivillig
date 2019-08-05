import axios from 'axios';
import { API_URL, HEADERS } from '../config';
import { IQuestion, IAnswer, IFeedback, IProfile } from '../interfaces';

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
  let state = '';
  switch (parameter) {
    case 'inbox':
      state = '?state=1';
      break;
    case 'started':
      state = '?state=2';
      break;
    case 'approval':
      state = '?state=3';
      break;
    case 'unpublished':
      state = '?state=4';
      break;
    case 'public':
      state = '?state=5';
      break;
    default:
      state = '';
      break;
  }
  return await api
    .get(parameter !== undefined ? `questions${state}` : 'questions')
    .then(res => res.data);
}

export async function getVolunteerSubjectList<T>(): Promise<T> {
  return await api.get('volunteers/subjects').then(res => res.data);
}

export async function getVolunteerProfile<T>(): Promise<T> {
  return await api.get('volunteers/self').then(res => res.data);
}

export async function getSubjectList<T>(): Promise<T> {
  return await api.get('subjects').then(res => res.data);
}

export async function getMestringSubjectList<T>(): Promise<T> {
  return await api.get('subjects?isMestring=1').then(res => res.data);
}

export async function postAnswer(
  data: IAnswer,
  type?: string,
): Promise<IQuestion> {
  const { questionId } = data;
  let body = {}
  switch (type) {
    case 'inbox':
      body = { ...data, state: 2 };
      break;
    case 'started':
      body = { ...data, state: 2 };
      break;
    case 'approval':
      body = { ...data, state: 3 };
      break;
    case 'save':
      body = { ...data, state: 2 };
      break;
    case 'publish':
      body = { ...data, state: 5 };
      break;
    case 'approve':
      body = { ...data, state: 4 };
      break;
    default:
      body = { ...data, state: 2 };
      break;
  }
  return await api
    .post(`questions/${questionId}`, body)
    .then(res => res.data);
}

export async function deleteFeedback(id: string): Promise<{}> {
  return await api.post(`feedback/${id}/delete`).then(res => res.data);
}

export async function saveSubjects(list: number[]): Promise<{}> {
  return await api
    .post('volunteers/subjects', { subjects: list })
    .then(res => res.data);
}

export async function updateProfile(profil: IProfile): Promise<{}> {
  return await api.post('volunteers', profil).then(res => res.data);
}
