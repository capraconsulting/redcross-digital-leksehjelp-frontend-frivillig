import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
  QuestionContainer,
  AnswerQuestionContainer,
  AdminQuestionsContainer,
  ChatContainer,
} from './containers';
import { HomeComponent, HeaderComponent as Header } from './components';

const Routes = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={HomeComponent} />
        <Route exact path="/questions" component={QuestionContainer} />
        <Route exact path="/messages" component={ChatContainer} />
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
      </Switch>
    </Router>
  );
};

export default Routes;
