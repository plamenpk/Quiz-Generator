import { createContext, type Dispatch, type SetStateAction } from 'react';
import { type UserData } from '../common/interfaces';
import { type User } from 'firebase/auth';

interface AuthContextType {
  appState: {
    user: User | null | undefined
    userData?: UserData | null
  }
  setUser: Dispatch<SetStateAction<{
    user: User | null | undefined
    userData?: UserData
  }>>
}

export const AuthContext = createContext<AuthContextType>({
  appState: {
    user: {} as User,
    userData: {} as UserData
  },
  setUser: () => { }
});
