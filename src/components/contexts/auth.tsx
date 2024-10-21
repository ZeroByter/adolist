"use client";

import { PERSONAL_SETTINGS_KEY } from "@/constants";
import UserSettingsType from "@/types/userSettings";
import firebaseAuth from "@/utils/auth";
import firebaseApp from "@/utils/firebase";
import getCollection from "@/utils/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import {
  createContext,
  useContext,
  FC,
  ReactNode,
  useEffect,
  useState,
} from "react";

type ContextType = {
  userLoaded: boolean;
  user?: User;
  userSettings?: UserSettingsType;
};

export const AuthContext = createContext<ContextType>({} as ContextType);

type Props = {
  children: ReactNode;
};

const AuthContextProvider: FC<Props> = ({ children }) => {
  const [userLoaded, setUserLoaded] = useState<boolean>(false);

  const [user, setUser] = useState<User>();
  const [userSettings, setUserSettings] = useState<UserSettingsType>();

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (user) => {
      setUserLoaded(true);
      setUser(user ?? undefined);
    });

    return unsub;
  }, []);

  useEffect(() => {
    (async () => {
      if (user) {
        const unsub = onSnapshot(
          doc(getCollection("userSettings", user.uid), PERSONAL_SETTINGS_KEY),
          (snapshot) => {
            const data = snapshot.data();

            if (data) {
              setUserSettings(data);
            }
          }
        );

        return unsub;
      }
    })();
  }, [user]);

  return (
    <AuthContext.Provider value={{ userLoaded, user, userSettings }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
