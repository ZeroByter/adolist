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
};

export const AuthContext = createContext<ContextType>({} as ContextType);

type Props = {
  children: ReactNode;
};

const AuthContextProvider: FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (user) => {
      setUser(user ?? undefined);
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthFetcher = () => {
  return useContext(AuthContext);
};
