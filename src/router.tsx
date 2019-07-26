import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
  HomeComponent,
  HeaderComponent as Header,
  ChatQueueComponent,
} from './components';
import {
  QuestionContainer,
  AnswerQuestionContainer,
  ChatContainer,
  AdminQuestionsContainer,
} from './containers';

const Routes = () => {
  const tf = (str: string) => {
    console.log(str);
  };

  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={HomeComponent} />
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
      </Switch>
    </Router>
  );
};

export default Routes;
