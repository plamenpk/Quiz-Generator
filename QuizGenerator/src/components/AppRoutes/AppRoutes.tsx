import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LogIn from '../../views/LogIn/LogIn';
import Register from '../../views/Register/Register';
import Home from '../../views/Home/Home';
import PublicView from '../../views/PublicView/PublicView';
import AuthenticatedRoute from '../../hoc/AuthenticatedRoute';
import Profile from '../../views/Profile/Profile';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/logIn" element={<LogIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<PublicView />} />
      <Route path="/profile" element={<AuthenticatedRoute><Profile /></AuthenticatedRoute>} />
    </Routes>
  );
};

export default AppRoutes;
