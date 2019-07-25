import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
  HomeComponent,
  HeaderComponent as Header,
  ChatQueueComponent,
  Modal,
} from './components';
import {
  QuestionContainer,
  AnswerQuestionContainer,
  ChatContainer,
  AdminQuestionsContainer,
} from './containers';

const Routes = () => {
  return (
    <Router>
      <Header />
      <Modal
        content="TestContent"
        successButtonText="success"
        successCallback={e => console.log('success')}
        warningButtonText="warning"
        warningCallback={e => console.log('warning')}
        handleClose={() => console.log('hei')}
        inputFields={[
          { buttonText: 'oneB', inputText: 'oneT' },
          { buttonText: 'twoB', inputText: 'twoT' },
          { buttonText: 'oneB', inputText: 'oneT' },
          { buttonText: 'twoB', inputText: 'twoT' },
          { buttonText: 'oneB', inputText: 'oneT' },
          { buttonText: 'twoB', inputText: 'twoT' },
          { buttonText: 'oneB', inputText: 'oneT' },
          { buttonText: 'twoB', inputText: 'twoT' },
        ]}
      />
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
