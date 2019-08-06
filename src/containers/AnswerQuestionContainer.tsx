import React, { useState, useEffect } from 'react';
import { EditorState, convertToRaw } from 'draft-js';

import {
  getQuestion,
  postAnswer,
  getFeedbackList,
  deleteFeedback,
  getSubjectList,
} from '../services';
import { IQuestion, IFeedback, ITheme, ISubject, IFile } from '../interfaces';
import { RouteComponentProps, withRouter } from 'react-router';
import { Modal, QuestionHeader, QuestionForm } from '../components';

interface IProps {
  id: string;
  type: string;
}

const AnswerQuestionContainer = (props: IProps & RouteComponentProps) => {
  const [question, setQuestion] = useState<IQuestion>({
    id: '',
    title: '',
    questionText: '',
    answerText: EditorState.createEmpty(),
    studentGrade: '',
    questionDate: '',
    subject: '',
    isPublic: false,
    themes: [],
    files: [] as IFile[],
  });
  const [publicFiles, setPublicFiles] = useState<IFile[]>([]);
  const [hideModalButtons, setHideModalButtons] = useState<boolean>(false);
  const [modalText, setModalText] = useState<string>('');
  const [feedbackQuestions, setFeedbackQuestions] = useState<IFeedback[]>([]);
  const [themeList, setThemeList] = useState<ITheme[]>([]);

  const {
    title,
    isPublic,
    subject,
    studentGrade,
    questionDate,
    themes,
  } = question;
  const { type, id, history } = props;
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    getQuestion(id).then(question => {
      setQuestion(question);
      getSubjectList<ISubject[]>().then(data => {
        const list = data
          .filter(e => e.subjectTitle === question.subject)
          .flatMap(e => e.themes);
        setThemeList(list);
      });
    });
    getFeedbackList(id).then(setFeedbackQuestions);
  }, []);

  const createBody = () => {
    const data = {
      ...question,
      questionId: id,
      themes: themes.map(e => e.id),
    };
    return data;
  };

  const onDisapprove = () => {
    const data = createBody();
    postAnswer(data, 'save')
      .then(() => {
        setModalText('Du har underkjent svaret og er nå sendt til "Påbegynt"');
      })
      .catch(() => {
        setModalText('Noe gikk galt.');
      });
    setHideModalButtons(true);
    setModalOpen(true);
    setTimeout(() => {
      setModalOpen(false);
      history.goBack();
    }, 3000);
  };

  const onSend = async () => {
    if (title === '') {
      setModalText('Du må oppdatere tittel før du kan sende dette spørsmålet');
      setHideModalButtons(true);
      setModalOpen(true);
    } else {
      const data = createBody();
      const isSaved = await postAnswer(data, 'save')
        .then(() => true)
        .catch(() => false);
      isSaved &&
        postAnswer(data, type)
          .then(() => {
            if (type === 'approval' && isPublic) {
              setModalText(
                'Svaret er sendt til eleven. Ønsker du å publisere spørsmålet på nettsiden?',
              );
              setHideModalButtons(false);
            } else if (type === 'approval' && !isPublic) {
              setModalText('Svaret er nå sendt til eleven.');
              setHideModalButtons(true);
              setTimeout(() => {
                setModalOpen(false);
                history.goBack();
              }, 2000);
            } else {
              setModalText('Svaret er sendt til godkjenning.');
              setHideModalButtons(true);
              setTimeout(() => {
                setModalOpen(false);
                history.goBack();
              }, 2000);
            }
            setModalOpen(true);
          })
          .catch(() => {
            setModalText('Noe gikk galt.');
            setHideModalButtons(true);
            setModalOpen(true);
          });
    }
  };

  const onSave = event => {
    const data = createBody();
    postAnswer(data, 'save')
      .then(() => {
        setModalText('Svaret er nå lagret.');
        setHideModalButtons(true);
        setModalOpen(true);
      })
      .catch(() => {
        setModalText('Noe gikk galt. Data ble ikke lagret.');
        setHideModalButtons(true);
        setModalOpen(true);
      });
    event.preventDefault();
  };

  const onDeleteFeedback = (event, value: number) => {
    event.preventDefault();
    const id = value.toString();
    deleteFeedback(id)
      .then(() => {
        setModalText('Feedback er nå slettet.');
        setHideModalButtons(true);
        setModalOpen(true);
        const feedbackList = feedbackQuestions.filter(({ id }) => id !== value);
        setFeedbackQuestions(feedbackList);
      })
      .catch(() => {
        setModalText('Noe gikk galt. Feedback ble ikke slettet.');
        setHideModalButtons(true);
        setModalOpen(true);
      });
  };

  const onPublishQuestion = event => {
    if (!id) return;
    const data = createBody();
    postAnswer(data, 'publish')
      .then(() => {
        setModalText('Svaret er nå publisert!');
        setHideModalButtons(true);
      })
      .catch(() => {
        setHideModalButtons(true);
        setModalText('Noe gikk galt.');
      });
    setTimeout(() => {
      setModalOpen(false);
      history.goBack();
    }, 3000);
    event.preventDefault();
  };

  const onApprove = async () => {
    const data = createBody();
    const isApprove = await postAnswer(data, 'approve')
      .then(() => true)
      .catch(() => false);
    isApprove &&
      postAnswer(data, type).then(() => {
        if (type === 'approval' && isPublic) {
          setModalText(
            'Svaret er sendt til eleven. Ønsker du å publisere spørsmålet på nettsiden?',
          );
          setHideModalButtons(false);
        } else if (type === 'approval' && !isPublic) {
          setModalText('Svaret er nå sendt til eleven.');
          setHideModalButtons(true);
        }
        setModalOpen(true);
      });
  };

  const onDontPublish = event => {
    setHideModalButtons(true);
    setModalText(
      'Svaret er sendt til eleven, men ble ikke publisert på Digitalleksehjelp.no',
    );
    setTimeout(() => {
      setModalOpen(false);
      history.goBack();
    }, 3000);
    event.preventDefault();
  };

  return (
    <div className="answer-question--container">
      {modalOpen && (
        <Modal
          content={modalText}
          successButtonText={'Publiser svaret'}
          warningButtonText={'Ikke publiser'}
          successCallback={onPublishQuestion}
          warningCallback={onDontPublish}
          hideButtons={hideModalButtons}
          closingCallback={() => setModalOpen(false)}
        />
      )}
      <QuestionHeader
        subject={subject}
        questionDate={questionDate}
        studentGrade={studentGrade}
        isPublic
      />
      <QuestionForm
        question={question}
        setQuestion={setQuestion}
        publicFiles={publicFiles}
        setPublicFiles={setPublicFiles}
        onApprove={onApprove}
        onDisapprove={onDisapprove}
        onSave={onSave}
        onSend={onSend}
        type={type}
        themeList={themeList}
      />
      {feedbackQuestions.length > 0 && (
        <div className="question-answer--container">
          <h3>Tilbakemeldinger</h3>
          <div className="feedback--list">
            {feedbackQuestions.map(({ feedbackText, id }, index) => (
              <div className="feedback--list-row" key={index}>
                <div className="feedback--list-element">
                  <p>{feedbackText}</p>
                </div>
                <div className="feedback--list-footer">
                  <button
                    className="leksehjelp--link-warning"
                    onClick={e => onDeleteFeedback(e, id)}
                  >
                    Slett
                  </button>
                  <a className="leksehjelp--link">Resolve</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default withRouter(AnswerQuestionContainer);
