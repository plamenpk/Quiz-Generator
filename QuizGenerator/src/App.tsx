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

const App: React.FC = () => {
  const [user] = useAuthState(auth);

  const [appState, setAppState] = useState<{
    user: User | null | undefined
    userData?: UserData // Make userData an optional property
  }>({
    user: null
  });

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
  console.log(appState.user);
  return (
    <>
      <AuthContext.Provider value={{ appState, setUser: setAppState }}>
        <Navbar />
        <div className="flex" style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        >
          <Sidebar />
          <div className="flex-grow">
            <AppRoutes />
          </div>
        </div >
        <Footer />
      </AuthContext.Provider>
    </>
  );
};

export default App;
