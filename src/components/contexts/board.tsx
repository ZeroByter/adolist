import BoardType from "@/types/client/board/board";
import TaskType from "@/types/client/board/task";
import UserType from "@/types/client/board/user";
import { createContext, useContext, FC, ReactNode, useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";

export const getDefaultData = (): BoardType => ({
  id: "",
  ownerid: "",
  name: "",
  timecreated: 0,
  timeupdated: 0,
  listorder: "0",
  tasks: [],
  shares: [],
});

type FormData = {
  name: string;
};

type ContextType = {
  createBoard: boolean;

  boardId: string;

  forcedData: BoardType;
  setForcedData: (newData: BoardType) => void;

  formData: UseFormReturn<FormData, any>;
};

export const BoardContext = createContext<ContextType>({} as ContextType);

type Props = {
  children: ReactNode;
  boardId: string;
  createBoard: boolean;
};

const BoardContextProvider: FC<Props> = ({
  children,
  boardId,
  createBoard,
}) => {
  const formData = useForm<FormData>();

  const [forcedData, setForcedData] = useState<BoardType>(getDefaultData());

  return (
    <BoardContext.Provider
      value={{ createBoard, boardId, forcedData, setForcedData, formData }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export default BoardContextProvider;

export const useBoard = () => {
  return useContext(BoardContext);
};
