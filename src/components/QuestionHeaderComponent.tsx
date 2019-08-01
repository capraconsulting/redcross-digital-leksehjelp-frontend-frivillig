import React from 'react';
import { dateStringFormat, studentGradeFormat } from '../services'

interface IProps {
  subject: string;
  questionDate: string;
  studentGrade: string;
  isPublic: boolean;
}

const QuestionHeaderComponent = ({ subject, questionDate, studentGrade, isPublic }: IProps) => (
  <div className="question-header--container">
    <h3 className="question-header--title">
      {subject}
    </h3>
    <div className="item-row">
      <p>Klasse:</p> {studentGradeFormat(studentGrade)}
    </div>
    <div className="item-row">
      <p>Sendt inn:</p> {dateStringFormat(questionDate)}
    </div>
    <div className="item-row">
      <p>Kan publiseres:</p> {isPublic ? 'Ja' : 'Nei'}
    </div>
  </div >
)

export default QuestionHeaderComponent;
