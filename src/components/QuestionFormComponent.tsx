import React, { useState, MouseEvent, useEffect } from 'react';
import Dropdown, { Option } from 'react-dropdown';
import { IQuestion, ITheme, IFile } from '../interfaces';
import { IconButton } from '../components';
import Cross from '../assets/Cross';

//Editor imports
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import DeleteIcon from '@material-ui/icons/Delete';
import CopyIcon from '@material-ui/icons/FileCopy';

//Services
import {
  uploadFileToAzureBlobStorage,
  deleteFileFromBlob,
  copyStringToClipboard,
} from '../services';

interface IProps {
  question: IQuestion;
  setQuestion(question: IQuestion): void;
  publicFiles: IFile[];
  setPublicFiles(files: IFile[]): void;
  onApprove(): void;
  onDisapprove(): void;
  onSend(event): void;
  onSave(event): void;
  type: string;
  themeList: ITheme[];
}

const QuestionFormComponent = ({
  question,
  setQuestion,
  publicFiles,
  setPublicFiles,
  onApprove,
  onDisapprove,
  onSave,
  onSend,
  type,
  themeList,
}: IProps) => {
  const { title, questionText, answerText, themes, id, files } = question;
  const options = themeList.map(e => ({ value: e.id, label: e.theme }));
  const [chosenThemes, setChosenThemes] = useState<Option[]>([]);

  useEffect(() => {
    setChosenThemes(
      themes.map(({ id, theme }) => ({ value: id, label: theme })),
    );
  }, [question.themes]);

  const onAdd = ({ value, label }: Option) => {
    if (!(chosenThemes.filter(e => e.value === value).length > 0)) {
      setChosenThemes([...[{ value, label }], ...chosenThemes]);

      const theme = { theme: label as string, id: value.toString() };
      setQuestion({
        ...question,
        themes: [...themes.filter(e => e.id !== value.toString()), theme],
      });
    }
  };

  const onRemove = (item: string, e: MouseEvent): void => {
    setChosenThemes(chosenThemes.filter(e => e.value !== item));
    setQuestion({
      ...question,
      themes: themes.filter(e => e.id.toString() !== item.toString()),
    });
    e.preventDefault();
  };

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
        {files &&
          files.length > 0 &&
          files.map((file, index) => {
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

  return (
    <div className="question-answer--container">
      <h3>Spørsmål og svar</h3>
      <form className="question-form">
        <label className="question-form--item">
          Tittel
          <input
            readOnly={type === 'approval'}
            className="question-form--input"
            value={title}
            type="text"
            name="title"
            onChange={e => setQuestion({ ...question, title: e.target.value })}
          />
        </label>
        <label className="question-form--item">
          Spørsmål
          <textarea
            readOnly={type === 'approval'}
            className="question-form--question"
            value={questionText}
            name="question"
            onChange={e =>
              setQuestion({ ...question, questionText: e.target.value })
            }
          />
        </label>
        {type !== 'approval' && (
          <label className="question-form--item">
            <Dropdown
              className="leksehjelp--dropdown"
              options={options}
              onChange={option => onAdd(option)}
              placeholder={'Velg tema'}
            />
          </label>
        )}
        <label className="question-form--item question-form--tagg">
          {chosenThemes.map(({ value, label }, index) => (
            <div key={index} className="subject--list-element">
              <p>{label}</p>
              <button
                className="leksehjelp--button-close"
                onClick={e => type !== 'approval' && onRemove(value, e)}
              >
                <Cross color="#8b51c6" />
              </button>
            </div>
          ))}
        </label>
        <FileList />

        <label className="question-form--item">
          Svar
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
            readOnly={type === 'approval'}
          />
        </label>
      </form>
      {type === 'approval' ? (
        <div className="question-form--button-container">
          <button className="leksehjelp--button-success" onClick={onApprove}>
            Godkjenn
          </button>
          <button className="leksehjelp--button-warning" onClick={onDisapprove}>
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
          return Promise.all<IFile>(uploadPromises(newFiles)).then(results => {
            setPublicFiles([...publicFiles, ...results]);
          });
        }}
      />
    </div>
  );
};

export default QuestionFormComponent;
