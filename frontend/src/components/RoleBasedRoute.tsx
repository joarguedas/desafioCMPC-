import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: JSX.Element;
  allowedRoles: string[];
}

const RoleBasedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || !role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleBasedRoute;
