import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import {
  HeaderComponent as Header,
  ChatQueueComponent,
} from './components';
import {
  QuestionContainer,
  AnswerQuestionContainer,
  ChatContainer,
  AdminQuestionsContainer,
  ProfileContainer,
} from './containers';

interface IProps {
  onLogout(): void;
}

const Routes = ({ onLogout }: IProps) => {
  return (
    <Router>
      <Header onLogout={onLogout} />
      <Switch>
        <Route exaxt path="/profile" component={ProfileContainer} />
        <Route exact path="/questions" component={QuestionContainer} />
        <Route exact path="/messages" component={ChatContainer} />
        <Route exact path="/queue" component={ChatQueueComponent} />
        <Route
          path="/questions/:id/:type"
          render={({ match }) => (
            <AnswerQuestionContainer
              id={match.params.id}
              type={match.params.type}
            />
          )}
        />
        <Route
          exaxt
          path="/admin/questions"
          component={AdminQuestionsContainer}
        />
        <Redirect from="/*" to="/profile" />
      </Switch>
    </Router>
  );
};

export default Routes;
