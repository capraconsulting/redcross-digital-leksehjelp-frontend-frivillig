import { get } from '../services/api-service';
jest.mock('../__mocks__/request');

describe('api-service', () => {
  it('Should return a list of questions', () => {
    expect(get('questions').then(data => expect(data.length).toEqual(3)));
  });
  it('Question should contain question text', () => {
    expect(
      get('questions').then(data =>
        expect(data.map(({ question }) => question.length)).toBeGreaterThan(0),
      ),
    );
  });
});
