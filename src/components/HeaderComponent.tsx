import React, { useState, useEffect, Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';
import { withRouter, RouteComponentProps } from 'react-router';
import { SocketContext, StateContext } from '../providers/';
import { Modal } from './';
import { getIsLeksehjelpOpen, toggleIsLeksehjelpOpen } from '../services';
import { toast } from 'react-toastify';
import { VolunteerRole } from '../enums/VolunteerRole';

interface IProps {
  onLogout(): void;
}

const HeaderComponent = (props: RouteComponentProps & IProps) => {
  const [path, setPath] = useState('');
  const [subPath, setSubPath] = useState('');
  const [onDropDown, setOnDropDown] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { queue, chats, volunteerInfo } = useContext(SocketContext);
  const {
    activeState,
    setActiveState,
    isLeksehjelpOpen,
    setIsLeksehjelpOpen,
  } = useContext(StateContext);

  const setLocationPath = (): void => {
    const { pathname } = props.location;
    const pathList = pathname.split('/');
    setPath(pathList[1]);
    setSubPath(pathList[2]);
    if (pathList[1] === 'admin') {
      setOnDropDown(true);
    }
  };

  const onSlide = (): void => {
    setActiveState(!activeState);
  };

  const onLogout = (): void => {
    props.onLogout();
  };

  const handleOpenModal = () => {
    getIsLeksehjelpOpen().then(data => {
      if (data.isopen === isLeksehjelpOpen) {
        setModalOpen(true);
      } else {
        toast.info(
          `En annen har allerede ${
            data.isopen ? 'åpnet' : 'lukket'
          } leksehjelpen.`,
        );
        setIsLeksehjelpOpen(data.isopen);
      }
    });
  };

  useEffect(() => {
    setLocationPath();
  }, []);

  const handleToggleLeksehjelp = () => {
    toggleIsLeksehjelpOpen().then(data => {
      if (data.isopen) {
        toast.success('Leksehjelpen er nå åpnet');
      } else {
        toast.success('Leksehjelpen er nå stengt');
      }
      setModalOpen(false);
      setIsLeksehjelpOpen(data.isopen);
    });
  };

  return (
    <Fragment>
      <div className="header--component">
        <ul className="header--list">
          <li
            className={`header--list-item ${path === 'queue' && 'active'}`}
            onClick={() => {
              setPath('queue');
              setOnDropDown(false);
            }}
          >
            <Link to="/queue">
              Elever i kø
              <span className="dot">{queue.length}</span>
            </Link>
          </li>
          <li
            className={`header--list-item ${path === 'messages' && 'active'}`}
            onClick={() => {
              setPath('messages');
              setOnDropDown(false);
            }}
          >
            <Link to="/messages">
              Chat
              <span className="dot" onClick={() => setPath('messages')}>
                {chats.reduce((sum, chat) => sum + chat.unread, 0)}
              </span>
            </Link>
          </li>
          <li
            className={`header--list-item ${path === 'questions' && 'active'}`}
            onClick={() => {
              setPath('questions');
              setOnDropDown(false);
            }}
          >
            <Link to="/questions">Spørsmål</Link>
          </li>
        </ul>
        <div className="header--list-split" />
        <ul className="header--list">
          <li
            className={`header--list-item ${path === 'profile' && 'active'}`}
            onClick={() => {
              setPath('profile');
              setOnDropDown(false);
            }}
          >
            <Link to="/profile">Min profil</Link>
          </li>
          {volunteerInfo.role === VolunteerRole.ADMIN && (
            <li
              className={`header--list-item ${path === 'admin' && 'active'}`}
              onMouseOver={() => setOnDropDown(true)}
              onClick={() => setPath('admin')}
            >
              Admin
            </li>
          )}
          <li
            className={`header--list-item ${path === 'logout' && 'active'}`}
            onClick={onLogout}
          >
            Logg ut
          </li>
        </ul>
        <div className="header--list-split" />
        <ul className="header--list header--list-right">
          <li className="header--list-item">
            <button
              onClick={handleOpenModal}
              className={
                isLeksehjelpOpen
                  ? 'leksehjelp--button--outline-warning'
                  : 'leksehjelp--button--outline-success'
              }
            >
              {isLeksehjelpOpen ? 'Steng leksehjelpen' : 'Åpne leksehjelpen'}
            </button>
            {modalOpen && (
              <Modal
                content={
                  isLeksehjelpOpen
                    ? 'Er du sikker på at du vil stenge leksehjelpen?'
                    : 'Er du sikker på at du vil åpne leksehjelpen?'
                }
                successButtonText={
                  isLeksehjelpOpen ? 'Steng leksehjelp' : 'Åpne leksehjelp'
                }
                warningButtonText="Avbryt"
                successCallback={() => handleToggleLeksehjelp()}
                warningCallback={() => setModalOpen(false)}
                closingCallback={() => setModalOpen(false)}
              />
            )}
          </li>
        </ul>
      </div>
      {onDropDown && volunteerInfo.role === VolunteerRole.ADMIN && (
        <div
          className="header--dropdown"
          onMouseOver={() => setOnDropDown(true)}
        >
          <ul className="header--list">
            <li
              className={`header--list-item ${subPath === 'information' &&
                'active'}`}
            >
              Informasjon
            </li>
            <li
              className={`header--list-item ${subPath === 'users' && 'active'}`}
              onClick={() => {
                setPath('admin');
                setSubPath('users');
              }}
            >
              <Link to="/admin/users">Administrer brukere</Link>
            </li>
            <li
              className={`header--list-item ${subPath === 'topics' &&
                'active'}`}
            >
              Administrer fag
            </li>
            <li
              className={`header--list-item ${subPath === 'questions' &&
                'active'}`}
              onClick={() => {
                setPath('admin');
                setSubPath('questions');
              }}
            >
              <Link to="/admin/questions">Administrer spøsmål</Link>
            </li>
          </ul>
        </div>
      )}
    </Fragment>
  );
};

export default withRouter(HeaderComponent);
