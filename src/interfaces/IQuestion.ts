import { IFile, ITheme } from '.';

export interface IQuestion extends IQuestionMeta {
  title: string;
  questionText: string;
  answerText: string;
  isPublic: boolean;
  files: IFile[];
}

export interface IQuestionMeta {
  id: string;
  subject: string;
  questionDate: string;
  studentGrade: string;
  themes: ITheme[];
}
