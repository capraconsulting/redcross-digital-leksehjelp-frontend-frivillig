export interface IFeedback {
  feedbackText: string;
  questionID: number;
  id: number;
}

export interface IFeedbackQuestion extends IFeedback {
  studentGrade: string;
  subject: string;
  questionDate: string;
}
