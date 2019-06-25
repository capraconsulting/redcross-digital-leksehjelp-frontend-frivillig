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
        <Route exact path="/questions" component={QuestionContainer} />
        <Route
          path="/questions/:id"
          render={({ match, location }) => (
            <AnswerQuestionContainer
              id={match.params.id}
              type={location.state}
            />
          )}
        />
      </Switch>
    </Router>
  );
};

export default Routes;
