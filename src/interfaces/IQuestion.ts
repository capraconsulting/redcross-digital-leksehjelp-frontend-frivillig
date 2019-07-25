export interface IQuestion extends IQuestionMeta {
  title: string;
  questionText: string;
  answerText: string;
  isPublic: boolean;
}

export interface IQuestionMeta {
  id: string;
  subject: string;
  questionDate: string;
  studentGrade: string;
}
