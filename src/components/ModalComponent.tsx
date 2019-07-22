import React, {useState, useEffect} from 'react';
import { publishQuestion } from '../services/api-service';

interface IProps {
  text: string;
  id?: string;
  isDelete?: boolean;
  isPublish?: boolean;
  isModalOpen(value: boolean);
}

const ModalComponent = (props: IProps) => {
  const { isPublish, isDelete, isModalOpen, text } = props;
  return (
    <div className={`modal`}>
      <p>{text}</p>
      <button className="leksehjelp--button-close" onClick={() => isModalOpen(false)}>x</button>
      {(isPublish || isDelete) &&
        <div className="modal--button-container">
          <button className="leksehjelp--button-warning">{isPublish ? "Ikke publiser" : "Slett"}</button>
          <button className="leksehjelp--button-success">{isPublish ? "Publiser svaret" : "Avbryt"}</button>
        </div>
      }
    </div>
  )
}

export default ModalComponent;
