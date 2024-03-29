import React, { useState, useEffect } from 'react';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import AppRoutes from './components/AppRoutes/AppRoutes';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase-config';
import { AuthContext } from './context/AuthContext';
import { getUserData } from './services/users.services';
import { type UserData } from './common/interfaces';
import { type User } from 'firebase/auth';
import { type DataSnapshot } from 'firebase/database';
import backgroundImage from './assets/Home.jpg';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  const [user] = useAuthState(auth);

  const [appState, setAppState] = useState<{
    user: User | null | undefined
    userData?: UserData // Make userData an optional property
  }>({
    user: null
  });

  if (appState.user !== user) {
    setAppState((prevState) => ({ ...prevState, user }));
  }

  useEffect(() => {
    if (user == null) {
      return;
    }

    getUserData(user.uid).then((snapshot: DataSnapshot) => {
      if (!snapshot.exists()) {
        throw new Error('User data not found');
      }

      const username = Object.keys(snapshot.val())[0];
      setAppState({
        ...appState,
        userData: snapshot.val()[username] as UserData
      });
    })
      .catch(e => { console.error(e); });
  }, [user]);

  return (
    <>
      <AuthContext.Provider value={{ appState, setUser: setAppState }}>
        <Toaster></Toaster>
        <Navbar />
        <div className="flex">
          <Sidebar />
          <div className="flex-grow mt-6"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <AppRoutes />
          </div>
        </div >
        <Footer />
      </AuthContext.Provider>
    </>
  );
};

export default App;
