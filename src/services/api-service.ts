import axios from 'axios';
import { API_URL, HEADERS } from '../config';
import {
  IQuestion,
  IAnswer,
  IFeedbackQuestion,
  IOpen,
  ISubject,
  IVolunteer,
  IVolunteerSubject,
} from '../interfaces';
import { INewUser } from '../interfaces/INewUser';

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production' ? process.env.API_URL : API_URL,
  headers: HEADERS,
});

export function getQuestion(id: string): Promise<IQuestion> {
  return api
    .get(`questions/${id}`)
    .then(res => res.data)
    .catch(err => err);
}

export function getFeedbackList(id?: string): Promise<IFeedbackQuestion[]> {
  return api
    .get(id ? `feedback/question/${id}` : 'feedback')
    .then(res => res.data);
}

export function getIsLeksehjelpOpen(): Promise<IOpen> {
  return api
    .get('isopen')
    .then(res => res.data)
    .catch(e => console.error(e.getMessage));
}

export function toggleIsLeksehjelpOpen(): Promise<IOpen> {
  return api
    .post('isopen')
    .then(res => res.data)
    .catch(e => console.error(e.getMessage));
}

export function getQuestionList(parameter?: string): Promise<IQuestion[]> {
  let state = '';
  switch (parameter) {
    case 'inbox':
      state = '&state=1';
      break;
    case 'started':
      state = '&state=2';
      break;
    case 'approval':
      state = '&state=3';
      break;
    case 'unpublished':
      state = '&state=4';
      break;
    case 'public':
      state = '&state=5';
      break;
    default:
      state = '';
      break;
  }

  return api
    .get(
      parameter !== undefined
        ? `questions?includeAll=true${state}`
        : 'questions?includeAll=true',
    )
    .then(res => res.data);
}

export function getVolunteerSubjectList(): Promise<IVolunteerSubject[]> {
  return api.get('volunteers/subjects').then(res => res.data);
}

export function getSubjectList(): Promise<ISubject[]> {
  return api.get<ISubject[]>('subjects').then(res => res.data);
}

export function getMestringSubjectList(): Promise<ISubject[]> {
  return api.get('subjects?isMestring=1').then(res => res.data);
}

export function getVolunteer(): Promise<IVolunteer> {
  return api.get('volunteers/self').then(res => res.data);
}
export function postAnswer(data: IAnswer, type?: string): Promise<IQuestion> {
  const { questionId } = data;
  let body = {};
  switch (type) {
    case 'inbox':
      body = { ...data, state: 3 };
      break;
    case 'started':
      body = { ...data, state: 3 };
      break;
    case 'approval':
      body = { ...data, state: 4 };
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
  return api.post(`questions/${questionId}`, body).then(res => res.data);
}

export function deleteFeedback(id: string): Promise<void> {
  return api.post(`feedback/${id}/delete`);
}

export function saveSubjects(list: number[]): Promise<void> {
  return api.post('volunteers/subjects', { subjects: list });
}

export function updateProfile(profile?: IVolunteer): Promise<void> {
  return api.post('volunteers', profile);
}

export function getUserList(): Promise<IVolunteer[]> {
  return api.get('volunteers').then(res => res.data);
}

export function updateUserRole(
  userId: string,
  role: string,
): Promise<[{ role: string }]> {
  return api
    .post(`admin/volunteerrole/${userId}`, { role })
    .then(res => res.data);
}

export function addUser(user: INewUser): Promise<void> {
  return api.post('admin/volunteer', user);
}

export function deleteUser(id: string): Promise<void> {
  return api.delete(`admin/volunteer/${id}`);
}
