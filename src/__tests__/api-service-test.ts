import { getQuestionList } from '../services/api-service';
jest.mock('../__mocks__/request');

describe('api-service', () => {
  it('Should return a list of questions', () => {
    expect(getQuestionList().then(data => expect(data).toEqual(3)));
  });
});
