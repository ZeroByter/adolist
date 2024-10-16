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
  boards: DocumentSnapshot<BoardType>[];
};

export const UserBoardsContext = createContext<ContextType>({} as ContextType);

type Props = {
  children: ReactNode;
};

const UserBoardsContextProvider: FC<Props> = ({ children }) => {
  const { user } = useAuth();

  const [boards, setBoards] = useState<DocumentSnapshot<BoardType>[]>([]);

  useEffect(() => {
    if (!user) return;

    const snapshotQuery = query(
      getCollection("boards"),
      or(
        where("ownerId", "==", user.uid),
        where("shares", "array-contains", user.uid)
      )
    );

    const unsub = onSnapshot(snapshotQuery, (snap) => {
      setBoards(snap.docs);
    });

    return unsub;
  }, [user, setBoards]);

  return (
    <UserBoardsContext.Provider value={{ boards }}>
      {children}
    </UserBoardsContext.Provider>
  );
};

export default UserBoardsContextProvider;

export const useUserBoards = () => {
  return useContext(UserBoardsContext);
};
