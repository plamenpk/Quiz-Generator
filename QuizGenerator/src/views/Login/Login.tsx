/* eslint-disable @typescript-eslint/semi */
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/auth.services';

const LogIn: React.FC = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const { setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const updateForm = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [field]: e.target.value
    });
  };

  const onLogIn = (): void => {
    if (form.email.length === 0) {
      alert('Email is required');
      return;
    }
    if ((form.password.length === 0) && form.password.length < 6) {
      alert('Password is required and must be at least 6 characters long');
      return;
    }

    loginUser(form.email, form.password)
      .then(credential => {
        setUser({
          user: credential.user
        });
      })
      .then(() => {
        navigate('/home');
      })
      .catch(console.error);
  };

  return (
    <div className="mt-10 p-8 bg-gray-100 flex items-center justify-center opacity-90">
      <div className="container max-w-screen-lg mx-auto mt-16 mb-60">
        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 ">
          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
            <div className="text-gray-600">
              <p className="font-medium text-lg">Enter your personal details</p>
              <p>Please fill out all the fields.</p>
            </div>
            <div className="lg:col-span-2">
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                <div className="md:col-span-5">
                  <label>email</label>
                  <input className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    type="text"
                    value={form.email}
                    onChange={updateForm('email')}
                  />
                </div>
                <div className="md:col-span-5">
                  <label>Password</label>
                  <input className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    type="password"
                    value={form.password}
                    onChange={updateForm('password')}
                  />
                </div>
                <div className="md:col-span-5 text-right">
                  <div className="inline-flex items-end">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={onLogIn}
                      type="button"
                    >
                      Log In
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
