import { mocked } from 'ts-jest/utils';
import axios from 'axios';
import {
  getQuestion,
  getQuestionList,
  postAnswer,
} from '../services/api-service';

beforeAll(() => {
  mocked(axios.create().post).mockReset();
});

describe('api-service', () => {
  it('TEST: getQuestion \n Should return question with id=1', async () => {
    const question = await getQuestion('1');
    expect(question.id).toEqual(1);
  });
  it('TEST: getQuestionList \n Should create request on the form: "questions?state=2", input: inbox', async () => {
    const url = await getQuestionList('inbox');
    expect(url).toEqual('questions?includeAll=true&state=1');
  });
  it('TEST: getQuestionList \n Should create request on the form: "questions?state=2", input: started', async () => {
    const url = await getQuestionList('started');
    expect(url).toEqual('questions?includeAll=true&state=2');
  });
  it('TEST: getQuestionList \n Should create request on the form: "questions/approve", input: approval', async () => {
    const url = await getQuestionList('approval');
    expect(url).toEqual('questions?includeAll=true&state=3');
  });
  it('TEST: getQuestionList \n Should create request on the form: "questions", input: test', async () => {
    const url = await getQuestionList('test');
    expect(url).toEqual('questions?includeAll=true');
  });
  it('TEST: getQuestionList \n Should create request on the form: "questions", input: ', async () => {
    const url = await getQuestionList();
    expect(url).toEqual('questions?includeAll=true');
  });

  const mock = axios.create();

  it('TEST: saveAnswer \n Should work', async () => {
    mocked(mock.post).mockResolvedValue({});
    await postAnswer(
      {
        questionId: ':id',
        answerText: 'answer',
        title: 'title',
        questionText: 'question',
      },
      'save',
    );

    const call = mocked(mock.post).mock.calls[0];

    expect(call[0]).toEqual('questions/:id');
    expect(call[1]).toEqual({
      questionId: ':id',
      answerText: 'answer',
      title: 'title',
      questionText: 'question',
      state: 2,
    });
  });
});
