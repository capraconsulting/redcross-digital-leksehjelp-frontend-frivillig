import React, { useState, useEffect } from 'react';

//Editor imports
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import DeleteIcon from '@material-ui/icons/Delete';
import CopyIcon from '@material-ui/icons/FileCopy';

import {
  getQuestion,
  postAnswer,
  saveAnswer,
  getFeedbackList,
  deleteFeedback,
  publishQuestion,
  approveQuestion,
  uploadFileToAzureBlobStorage,
  deleteFileFromBlob,
  copyStringToClipboard,
} from '../services';
import { IQuestion, IFeedback, IFile } from '../interfaces';
import { withRouter, RouteComponentProps } from 'react-router';
import { Modal, IconButton } from '../components';

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
    files: [] as IFile[],
  });
  const [publicFiles, setPublicFiles] = useState<IFile[]>([]);
  const [hideModalButtons, setHideModalButtons] = useState<boolean>(false);
  const [modalText, setModalText] = useState<string>('');
  const [feedbackQuestions, setFeedbackQuestions] = useState<IFeedback[]>([]);
  const { questionText, title, answerText, isPublic } = question;
  const { type, id, history } = props;
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    getQuestion(id).then(setQuestion);
    getFeedbackList(id).then(setFeedbackQuestions);
  }, []);

  const uploadPromises = files => {
    return files.map(async file => {
      return uploadFileToAzureBlobStorage('public', id, file);
    });
  };

  const openFileDialog = () => {
    const ref = document.getElementById('public-file-dialog');
    ref && ref.click();
  };

  const FileList = () => {
    return (
      <ul className="filelist">
        {question &&
          question.files &&
          question.files.length > 0 &&
          question.files.map((file, index) => {
            const { directory, share, fileName, fileUrl } = file;
            return (
              <li key={index} className="element">
                <span>
                  <a
                    className="filelist-ankertag"
                    href={fileUrl}
                    title={fileName}
                    download={fileName}
                  >
                    {fileName}{' '}
                  </a>
                  {fileName && (
                    <IconButton
                      onClick={() => {
                        copyStringToClipboard(fileUrl);
                      }}
                      icon={<CopyIcon />}
                    ></IconButton>
                  )}
                  {fileName && (
                    <IconButton
                      onClick={() => {
                        share &&
                          directory &&
                          deleteFileFromBlob(share, directory, fileName);
                        setQuestion({
                          ...question,
                          files: question.files.filter((_, i) => i !== index),
                        });
                      }}
                      icon={<DeleteIcon />}
                    ></IconButton>
                  )}{' '}
                </span>
              </li>
            );
          })}
        {publicFiles.length > 0 &&
          publicFiles.map((file, index) => {
            const { fileName, fileUrl, share, directory } = file;
            return (
              <li key={index}>
                <span>
                  <a
                    className="filelist-ankertag"
                    href={fileUrl}
                    title={fileName}
                    download={fileName}
                    id="filetag"
                  >
                    {fileName}{' '}
                  </a>
                  {fileName && (
                    <IconButton
                      onClick={() => {
                        copyStringToClipboard(fileUrl);
                      }}
                      icon={<CopyIcon />}
                    ></IconButton>
                  )}
                  {fileName && (
                    <IconButton
                      onClick={() => {
                        directory &&
                          share &&
                          deleteFileFromBlob(share, directory, fileName);
                        setPublicFiles({
                          ...publicFiles.filter((_, i) => i !== index),
                        });
                      }}
                      icon={<DeleteIcon />}
                    ></IconButton>
                  )}{' '}
                </span>
              </li>
            );
          })}
      </ul>
    );
  };

  const createBody = () => {
    const data = {
      questionId: id,
      answerText,
      title,
      questionText,
    };
    return data;
  };

  const onDisapprove = () => {
    const data = createBody();
    saveAnswer(data)
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
      const isSaved = await saveAnswer(data)
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
    saveAnswer(data)
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
    publishQuestion(id)
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
    const isApprove = await approveQuestion(data.questionId)
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
    <div>
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
      <div className="question-answer">
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
              <span>Svar </span>
              <Editor
                editorState={answerText}
                onEditorStateChange={event =>
                  setQuestion({ ...question, answerText: event })
                }
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                editorStyle={{
                  backgroundColor: 'white',
                  maxHeight: '40vh',
                  padding: '1rem',
                }}
                toolbarCustomButtons={[]}
              />
              <textarea
                disabled
                value={
                  answerText &&
                  draftToHtml(convertToRaw(answerText.getCurrentContent()))
                }
              />
              <input
                type="file"
                id="public-file-dialog"
                className="input-file"
                accept="image/*|.pdf|.doc|.docx|.csv"
                onChange={event => {
                  let { files } = event.target;
                  let newFiles = [] as any;
                  let steps = (files && files.length) || 0;
                  for (let i = 0; i < steps; i++) {
                    let item = (files && files.item(i)) || 'null';
                    newFiles.push(item);
                  }
                  return Promise.all<IFile>(uploadPromises(newFiles)).then(
                    results => {
                      setPublicFiles([...publicFiles, ...results]);
                    },
                  );
                }}
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
              <button
                className="leksehjelp--button-success"
                onClick={() => openFileDialog()}
              >
                Last opp fil
              </button>
            </div>
          )}
        </div>
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
