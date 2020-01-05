import { IFile, ITheme } from '.';

export interface IQuestion {
  id: string;
  subject: string;
  questionDate: string;
  studentGrade: string;
  themes: ITheme[];
  title: string;
  questionText: string;
  answerText;
  isPublic: boolean;
  files: IFile[];
}
