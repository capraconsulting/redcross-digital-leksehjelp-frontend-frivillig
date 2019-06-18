import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter, RouteComponentProps } from 'react-router';

const HeaderComponent = (props: RouteComponentProps) => {
  const { pathname } = props.location;
  const path = pathname.split('/')[1];
  return (
    <div className="header--component">
      <ul className="header--list">
        <li className={`header--list-item ${pathname === '/que' && 'active'}`}>
          <Link to="/">Elever i kø</Link>
        </li>
        <li className={`header--list-item ${pathname === '/chat' && 'active'}`}>
          <Link to="/">Chat</Link>
        </li>
        <li className={`header--list-item ${path === 'questions' && 'active'}`}>
          <Link to="/questions">Spørsmål</Link>
        </li>
      </ul>
    </div>
  );
};

export default withRouter(HeaderComponent);
