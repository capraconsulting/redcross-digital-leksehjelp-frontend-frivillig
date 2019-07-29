import React, { useState, useEffect, Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';
import { withRouter, RouteComponentProps } from 'react-router';
import { StateContext } from '../StateProvider';

interface IProps {
  onLogout(): void;
}

const HeaderComponent = (props: RouteComponentProps & IProps) => {
  const [path, setPath] = useState('' as string);

  const [subPath, setSubPath] = useState('' as string);

  const [onDropDown, setOnDropDown] = useState<boolean>(false);

  const { activeState, setActiveState } = useContext(StateContext);

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

  useEffect(() => {
    setLocationPath();
  }, []);

  return (
    <Fragment>
      <div className="header--component">
        <ul className="header--list">
          <li
            className={`header--list-item ${path === 'queue' && 'active'}`}
            onClick={() => {
              setPath('que');
              setOnDropDown(false);
            }}
          >
            <Link to="/queue">Elever i kø</Link>
          </li>
          <li
            className={`header--list-item ${path === 'chat' && 'active'}`}
            onClick={() => {
              setPath('chat');
              setOnDropDown(false);
            }}
          >
            <Link to="/messages">Chat</Link>
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
              setOnDropDown(false);}
            }
          >
            <Link to="/profile">Min profil</Link>
          </li>
          <li
            className={`header--list-item ${path === 'admin' && 'active'}`}
            onMouseOver={() => setOnDropDown(true)}
            onClick={() => setPath('admin')}
          >
            Admin
          </li>
          <li
            className={`header--list-item ${path === 'logout' && 'active'}`}
            onClick={onLogout}
          >
            Logg ut
          </li>
        </ul>
        <div className="header--list-split" />
        <ul className="header--list">
          <div className="header--list-button">
            Min status
            <label className="switch">
              <input type="checkbox" />
              <span className="slider" onClick={onSlide} />
            </label>
          </div>
          <li className="header--list-item">
            <button className="leksehjelp--button-abort">
              Steng Leksehjelpen
            </button>
          </li>
        </ul>
      </div>
      {onDropDown && (
        <div
          className="header--dropdown"
          onMouseOver={() => setOnDropDown(true)}
        >
          <ul className="header--list">
            <li
              className={`header--list-item ${subPath === 'information' &&
                'active'}`}
            >
              <Link to="/questions">Informsjon</Link>
            </li>
            <li
              className={`header--list-item ${subPath === 'users' && 'active'}`}
            >
              <Link to="/questions">Administrer brukere</Link>
            </li>
            <li
              className={`header--list-item ${subPath === 'topics' &&
                'active'}`}
            >
              <Link to="/">Administrer fag</Link>
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
