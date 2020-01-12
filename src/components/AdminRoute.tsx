import React, { FunctionComponent, useContext } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { SocketContext } from '../providers';
import { VolunteerRole } from '../enums/VolunteerRole';

interface Props extends RouteProps {
  component: React.ComponentType<RouteProps>;
}

const AdminRoute: FunctionComponent<Props> = ({
  component: Component,
  ...rest
}) => {
  const { volunteerInfo } = useContext(SocketContext);
  return (
    <Route
      {...rest}
      render={props =>
        volunteerInfo.role === VolunteerRole.ADMIN ? (
          <Component {...props} />
        ) : (
          <Redirect to="/profile" />
        )
      }
    />
  );
};

export default AdminRoute;
