"use client";

import firebaseAuth from "@/utils/auth";
import firebaseApp from "@/utils/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  createContext,
  useContext,
  FC,
  ReactNode,
  useEffect,
  useState,
} from "react";

type ContextType = {
  user?: User;
  userLoaded: boolean;
};

export const AuthContext = createContext<ContextType>({} as ContextType);

type Props = {
  children: ReactNode;
};

const AuthContextProvider: FC<Props> = ({ children }) => {
  const [userLoaded, setUserLoaded] = useState<boolean>(false);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (user) => {
      setUserLoaded(true);
      setUser(user ?? undefined);
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userLoaded }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
