import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthenticatedRouteProps {
  children: React.ReactNode
}
const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({ children }) => {
  const { appState } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  if (appState.user === null || appState.user === undefined) {
    navigate('/login', { state: { from: location.pathname } });
    return null;
  }

  return <>{children}</>;
};

export default AuthenticatedRoute;
