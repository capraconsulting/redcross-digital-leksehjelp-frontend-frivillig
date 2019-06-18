import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { HomeComponent, HeaderComponent as Header } from './components';
import { QuestionContainer, AnswerQuestionContainer } from './containers';

const Routes = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={HomeComponent} />
        <Route exact path="/spørsmål" component={QuestionContainer} />
        <Route
          path="/spørsmål/:id"
          render={({ match }) => (
            <AnswerQuestionContainer id={match.params.id} />
          )}
        />
      </Switch>
    </Router>
  );
};

export default Routes;
