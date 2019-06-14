import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { HomeComponent, HeaderComponent as Header } from './components';
import { QuestionContainer } from './containers';

const Routes = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={HomeComponent} />
        <Route path="/spørsmål" component={QuestionContainer} />
      </Switch>
    </Router>
  );
};

export default Routes;
