export interface IQuestion extends IQuestionMeta {
  title: string;
  questionText: string;
  answer: string;
}

export interface IQuestionMeta {
  id: string;
  subject: string;
  questionDate: string;
  studentGrade: string;
}
