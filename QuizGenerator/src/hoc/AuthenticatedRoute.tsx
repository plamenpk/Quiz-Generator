import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthenticatedRouteProps {
  children: React.ReactNode
}
const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({ children }) => {
  const { appState } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (appState.user === null || appState.user === undefined) {
      navigate('/logIn', { state: { from: location.pathname } });
    }
  }, [appState.user, navigate, location.pathname]);

  if (appState.user === null || appState.user === undefined) {
    return null;
  }

  return <>{children}</>;
};

export default AuthenticatedRoute;
