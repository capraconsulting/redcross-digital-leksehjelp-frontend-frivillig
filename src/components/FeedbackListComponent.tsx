import React from 'react';
import { IFeedbackQuestion } from '../interfaces';
import { withRouter, RouteComponentProps } from 'react-router';
import { dateStringFormat, studentGradeFormat } from '../services';

interface IProps {
  feedbackList: IFeedbackQuestion[];
}
const FeedbackListComponent = (props: IProps & RouteComponentProps) => {
  const { feedbackList } = props;

  if (feedbackList.length < 1) {
    return <p>Denne listen er tom for øyeblikket</p>;
  }

  return (
    <div className="question--list">
      {feedbackList.map(
        ({ feedbackText, studentGrade, subject, questionDate }, index) => (
          <div key={index} className="question--list-item">
            <h4>{subject}</h4>
            <p>Klasse: {studentGradeFormat(studentGrade)}</p>
            <p>Spurt: {dateStringFormat(questionDate)}</p>
            <div className="question--list-feedback">{feedbackText}</div>
          </div>
        ),
      )}
    </div>
  );
};

export default withRouter(FeedbackListComponent);
