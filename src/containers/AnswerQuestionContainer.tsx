import React, { useState, useEffect } from 'react';
import {
  getQuestion,
  postAnswer,
  getFeedbackList,
  deleteFeedback,
  getSubjectList,
} from '../services';
import { IQuestion, IFeedback, ITheme, ISubject, IFile } from '../interfaces';
import { withRouter, RouteComponentProps } from 'react-router';
import { Modal, QuestionHeader, QuestionForm, IconButton } from '../components';

interface IProps {
  id: string;
  type: string;
}

const AnswerQuestionContainer = (props: IProps & RouteComponentProps) => {
  const [question, setQuestion] = useState<IQuestion>({
    id: '',
    title: '',
    questionText: '',
    answerText: '',
    studentGrade: '',
    questionDate: '',
    subject: '',
    isPublic: false,
    themes: [],
    files: [] as IFile[],
  });
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

  const FileList = () => {
    return (
      <ul className="filelist">
        {question.files.map((file, index) => {
          const { fileName, fileUrl } = file;
          return (
            <li key={index}>
              <span>
                <a
                  className="filelist-ankertag"
                  href={fileUrl}
                  title={fileName}
                  download={fileName}
                >
                  {fileName}{' '}
                </a>
                <IconButton
                  onClick={() => {
                    setQuestion({
                      ...question,
                      files: question.files.filter((_, i) => i !== index),
                    });
                  }}
                ></IconButton>{' '}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

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
      <div className="question-answer">
<<<<<<< HEAD
        <QuestionForm
          question={question}
          setQuestion={setQuestion}
          onApprove={onApprove}
          onDisapprove={onDisapprove}
          onSave={onSave}
          onSend={onSend}
          type={type}
          themeList={themeList}
        />
=======
        <div className="question-answer--container">
          <h3>Spørsmål og svar</h3>
          <form className="question-form">
            <label className="question-form--item">
              Tittel
              <input
                className="question-form--input"
                value={title}
                type="text"
                name="title"
                onChange={e =>
                  setQuestion({ ...question, title: e.target.value })
                }
              />
            </label>
            <label className="question-form--item">
              Spørsmål
              <textarea
                className="question-form--question"
                value={questionText}
                name="question"
                onChange={e =>
                  setQuestion({ ...question, questionText: e.target.value })
                }
              />
            </label>
            <FileList />
            <label className="question-form--item">
              Svar
              <textarea
                className="question-form--answer"
                value={answerText}
                name="answer"
                onChange={e =>
                  setQuestion({ ...question, answerText: e.target.value })
                }
              />
            </label>
          </form>
          {type === 'approval' ? (
            <div className="question-form--button-container">
              <button
                className="leksehjelp--button-success"
                onClick={onApprove}
              >
                Godkjenn
              </button>
              <button
                className="leksehjelp--button-warning"
                onClick={onDisapprove}
              >
                Ikke godkjenn
              </button>
            </div>
          ) : (
            <div className="question-form--button-container">
              <button className="leksehjelp--button-success" onClick={onSend}>
                Send til godkjenning
              </button>
              <button className="leksehjelp--button-success" onClick={onSave}>
                Lagre
              </button>
            </div>
          )}
        </div>
>>>>>>> master
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
    </div>
  );
};

export default withRouter(AnswerQuestionContainer);
