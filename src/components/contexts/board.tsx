"use client";

import BoardType from "@/types/board";
import { Timestamp } from "firebase/firestore";
import { FC, ReactNode, createContext, useContext, useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { useAuth } from "./auth";

type FormData = {
  name: string;
};

type ContextType = {
  createBoard: boolean;

  forcedData: BoardType;
  setForcedData: (newData: BoardType) => void;
  getDefaultData: () => BoardType;

  formData: UseFormReturn<FormData, any>;

  boardData?: BoardType;
  boardId?: string;
};

export const BoardContext = createContext<ContextType>({} as ContextType);

type Props = {
  children: ReactNode;
  boardData?: BoardType;
  createBoard: boolean;
  boardId?: string;
};

const BoardContextProvider: FC<Props> = ({
  children,
  createBoard,
  boardData,
  boardId,
}) => {
  const formData = useForm<FormData>();

  const { user } = useAuth();

  const getDefaultData = (): BoardType => ({
    ownerId: user?.uid ?? "",
    name: "",
    timeCreated: Timestamp.now(),
    timeUpdated: Timestamp.now(),
    listOrder: 0,
    tasks: [],
    shares: [],
  });

  const [forcedData, setForcedData] = useState<BoardType>(getDefaultData());

  return (
    <BoardContext.Provider
      value={{
        createBoard,
        forcedData,
        setForcedData,
        getDefaultData,
        formData,
        boardData,
        boardId,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export default BoardContextProvider;

export const useBoard = () => {
  return useContext(BoardContext);
};
