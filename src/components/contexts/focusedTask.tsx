"use client";

import BoardType from "@/types/board";
import getCollection from "@/utils/firestore";
import {
  DocumentSnapshot,
  onSnapshot,
  or,
  query,
  where,
} from "firebase/firestore";
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./auth";

type ContextType = {
  focusedTask?: string;
  setFocusedTask: (newFocusedTask?: string) => void;
};

export const FocusedTaskContext = createContext<ContextType>({} as ContextType);

type Props = {
  children: ReactNode;
};

const FocusedTaskContextProvider: FC<Props> = ({ children }) => {
  const [focusedTask, setFocusedTask] = useState<string>();

  return (
    <FocusedTaskContext.Provider value={{ focusedTask, setFocusedTask }}>
      {children}
    </FocusedTaskContext.Provider>
  );
};

export default FocusedTaskContextProvider;

export const useFocusedTask = () => {
  return useContext(FocusedTaskContext);
};
