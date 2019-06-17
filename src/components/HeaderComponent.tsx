import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter, RouteComponentProps } from 'react-router';

const HeaderComponent = (props: RouteComponentProps) => {
  const { pathname } = props.location;
  return (
    <div className="header--component">
      <ul className="header--list">
        <li className={`header--list-item ${pathname === '/kø' && 'active'}`}>
          <Link to="/">Elever i kø</Link>
        </li>
        <li className={`header--list-item ${pathname === '/chat' && 'active'}`}>
          <Link to="/">Chat</Link>
        </li>
        <li
          className={`header--list-item ${pathname === '/spørsmål' &&
            'active'}`}
        >
          <Link to="/spørsmål">Spørsmål</Link>
        </li>
      </ul>
    </div>
  );
};

export default withRouter(HeaderComponent);
