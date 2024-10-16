"use client";

import BoardType from "@/types/board";
import { Timestamp } from "firebase/firestore";
import { FC, ReactNode, createContext, useContext, useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";

export const getDefaultData = (): BoardType => ({
  ownerId: "",
  name: "",
  timeCreated: Timestamp.now(),
  timeUpdated: Timestamp.now(),
  listOrder: 0,
  tasks: [],
  shares: [],
});

type FormData = {
  name: string;
};

type ContextType = {
  createBoard: boolean;

  forcedData: BoardType;
  setForcedData: (newData: BoardType) => void;

  formData: UseFormReturn<FormData, any>;

  boardData?: BoardType;
};

export const BoardContext = createContext<ContextType>({} as ContextType);

type Props = {
  children: ReactNode;
  boardData?: BoardType;
  createBoard: boolean;
};

const BoardContextProvider: FC<Props> = ({
  children,
  createBoard,
  boardData,
}) => {
  const formData = useForm<FormData>();

  const [forcedData, setForcedData] = useState<BoardType>(getDefaultData());

  return (
    <BoardContext.Provider
      value={{ createBoard, forcedData, setForcedData, formData, boardData }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export default BoardContextProvider;

export const useBoard = () => {
  return useContext(BoardContext);
};
