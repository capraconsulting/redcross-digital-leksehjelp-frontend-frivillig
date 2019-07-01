import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { withRouter, RouteComponentProps } from 'react-router';

const HeaderComponent = (props: RouteComponentProps) => {
  const [path, setPath] = useState('' as string);

  const [subPath, setSubPath] = useState('' as string);

  const [onDropDown, setOnDropDown] = useState(false as boolean);

  const setLocationPath = (): void => {
    const { pathname } = props.location;
    const pathList = pathname.split('/');
    setPath(pathList[1]);
    setSubPath(pathList[2]);
    if (pathList[1] === 'admin') {
      setOnDropDown(true);
    }
  };

  useEffect(() => {
    setLocationPath();
  }, []);

  return (
    <div>
      <div className="header--component">
        <ul className="header--list">
          <li
            className={`header--list-item ${path === 'que' && 'active'}`}
            onClick={() => {
              setPath('que');
              setOnDropDown(false);
            }}
          >
            <Link to="/">Elever i kø</Link>
          </li>
          <li
            className={`header--list-item ${path === 'chat' && 'active'}`}
            onClick={() => {
              setPath('chat');
              setOnDropDown(false);
            }}
          >
            <Link to="/">Chat</Link>
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
            onClick={() => setPath('profile')}
          >
            Min profil
          </li>
          <li
            className={`header--list-item ${path === 'admin' && 'active'}`}
            onMouseOver={() => setOnDropDown(true)}
            onClick={() => setPath('admin')}
          >
            Admin
          </li>
          <li className={`header--list-item ${path === 'logout' && 'active'}`}>
            Logg ut
          </li>
        </ul>
        <div className="header--list-split" />
        <ul className="header--list">
          <li className={`header--list-item ${path === 'status' && 'active'}`}>
            Min status
          </li>
          <li className="header--list-item">
            <button>Steng Leksehjelp</button>
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
    </div>
  );
};

export default withRouter(HeaderComponent);
