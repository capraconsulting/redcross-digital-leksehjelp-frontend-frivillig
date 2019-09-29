import React, { useContext, useState } from 'react';
import { IChat } from '../../interfaces';
import { SocketContext } from '../../providers';
import { leaveChatAction } from '../../reducers';
import { Modal } from '../../components';
import { CHAT_TYPES, MESSAGE_TYPES } from '../../config';
import { MixpanelService } from '../../services/mixpanel-service';
import { MixpanelEvents } from '../../mixpanel-events';
import FeedbackModalComponent from '../FeedbackModalComponent';

type ModalState = 'closed' | 'regular' | 'feedback';

interface IProps {
  activeChat: IChat;
}

const ChatHeaderComponent = (props: IProps) => {
  const { roomID } = props.activeChat;
  const { nickname, subject, chatType } = props.activeChat.student;
  const { socketSend, dispatchChats, uniqueID, talky } = useContext(
    SocketContext,
  );

  const [modalState, setModalState] = useState<ModalState>('closed');
  const { LEKSEHJELP_VIDEO, MESTRING_VIDEO } = CHAT_TYPES;

  const closeModals = () => {
    setModalState('closed');
  };

  const openFeedbackModal = () => {
    setModalState('feedback');
  };

  const openRegularModal = () => {
    setModalState('regular');
  };

  const leaveChat = (helpResult: MixpanelEvents, eventProps: object) => {
    dispatchChats(leaveChatAction(roomID));
    socketSend({
      msgType: MESSAGE_TYPES.LEAVE_CHAT,
      payload: {
        studentInfo: props.activeChat.student,
        uniqueID,
        roomID,
      },
    });
    MixpanelService.track(helpResult, eventProps);
    closeModals();
  };

  const openTalky = () => {
    if (talky) {
      const windowObjectReference = window.open(
        `https://talky.io/${talky.talkyID}`,
        '_blank',
      );
      if (windowObjectReference) {
        windowObjectReference.focus();
      }
    }
  };

  const renderChatType = () => {
    if (chatType === LEKSEHJELP_VIDEO || chatType === MESTRING_VIDEO) {
      return (
        <img
          src={require('../../assets/images/video-icon.svg')}
          onClick={openTalky}
          alt="Video Chat"
        />
      );
    }
    return (
      <img src={require('../../assets/images/chat-icon.svg')} alt="Text Chat" />
    );
  };

  return (
    <div className="chat-header">
      <div className="chat-header--text">
        <span className="chat-header--text--left">
          <p>{nickname}</p>
        </span>
        <span className="queue-type btn">{renderChatType()}</span>
        <span className="chat-header--text--right">
          <p>{subject}</p>
          <button
            onClick={openRegularModal}
            className="leksehjelp--button-success"
          >
            Forlat Chatten
          </button>
        </span>
      </div>
      {modalState === 'regular' && (
        <Modal
          content="Er du sikker på at du vil forlate chatten?"
          warningButtonText="Forlat Chatten"
          warningCallback={openFeedbackModal}
          successButtonText="Bli i Chatten"
          successCallback={closeModals}
          closingCallback={closeModals}
        />
      )}
      {modalState === 'feedback' && (
        <FeedbackModalComponent
          content="Tilbakemeldingsskjema"
          successButtonText="Send inn skjema"
          warningButtonText="Avbryt"
          successCallback={leaveChat}
          warningCallback={closeModals}
          closingCallback={closeModals}
        />
      )}
    </div>
  );
};

export default ChatHeaderComponent;
