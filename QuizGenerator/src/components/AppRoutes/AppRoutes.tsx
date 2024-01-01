/* eslint-disable @typescript-eslint/semi */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../../views/Login/Login';
import Register from '../../views/Register/Register';
import Home from '../../views/Home/Home';
import PublicView from '../../views/PublicView/PublicView';
import AuthenticatedRoute from '../../hoc/AuthenticatedRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/home" element={<AuthenticatedRoute><Home /></AuthenticatedRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<PublicView />} />
    </Routes>
  )
}

export default AppRoutes
