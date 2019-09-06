import React, { useContext, useState } from 'react';
import { IChat } from '../../interfaces';
import { SocketContext } from '../../providers';
import { leaveChatAction } from '../../reducers';
import { Modal } from '../../components';
import { LeaveChatMessageBuilder } from '../../services';
import { CHAT_TYPES } from '../../config';
import { MixpanelService } from '../../services/mixpanel-service';
import { MixpanelEvents } from '../../mixpanel-events';
import FeedbackModalComponent from '../FeedbackModalComponent';

interface IProps {
  activeChat: IChat;
}

const ChatHeaderComponent = (props: IProps) => {
  const { roomID } = props.activeChat;
  const { nickname, subject, chatType } = props.activeChat.student;
  const { socketSend, dispatchChats, uniqueID, talky } = useContext(
    SocketContext,
  );
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false);
  const [shouldGiveFeedback, setShouldGiveFeedback] = useState<boolean>(false);
  const { LEKSEHJELP_VIDEO, MESTRING_VIDEO } = CHAT_TYPES;

  const leaveChat = () => {
    dispatchChats(leaveChatAction(roomID));
    const msg = new LeaveChatMessageBuilder(uniqueID).toRoom(roomID).build();
    socketSend(msg.createMessage);
    //TODO: Må ha vært i leksehjelp i over 4 minutter for å kalle mixpanel
    MixpanelService.track(MixpanelEvents.VOLUNTEER_HELPED_STUDENT, {
      type: 'missing',
    });
    setModalOpen(false);
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

  const onFeedbackSubmitted = () => {
    leaveChat();
    console.log('worked!');
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
            onClick={() => {
              setModalOpen(true);
            }}
            className="leksehjelp--button-success"
          >
            Forlat Chatten
          </button>
        </span>
      </div>
      {modalOpen && (
        <Modal
          content="Er du sikker på at du vil forlate chatten?"
          warningButtonText="Forlat Chatten"
          warningCallback={() => {
            setFeedbackModalOpen(true);
            setShouldGiveFeedback(true);
          }}
          successButtonText="Bli i Chatten"
          closingCallback={() => {
            setModalOpen(false);
          }}
        />
      )}
      {shouldGiveFeedback && (
        <FeedbackModalComponent
          content="Tilbakemeldingsskjema"
          successButtonText="Send inn skjema"
          warningButtonText="Avbryt"
          successCallback={() => onFeedbackSubmitted()}
          warningCallback={() => {
            setFeedbackModalOpen(false);
          }}
          closingCallback={() => setFeedbackModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatHeaderComponent;
