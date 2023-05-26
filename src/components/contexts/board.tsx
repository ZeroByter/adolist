import BoardType from "@/types/client/board/board";
import CreateBoardType from "@/types/client/board/createBoard";
import { createContext, useContext, FC, ReactNode, useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";

export const getDefaultData = (): CreateBoardType => ({
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

  forcedData: CreateBoardType;
  setForcedData: (newData: CreateBoardType) => void;

  formData: UseFormReturn<FormData, any>;
};

export const BoardContext = createContext<ContextType>({} as ContextType);

type Props = {
  children: ReactNode;
  createBoard: boolean;
};

const BoardContextProvider: FC<Props> = ({
  children,
  createBoard,
}) => {
  const formData = useForm<FormData>();

  const [forcedData, setForcedData] = useState<CreateBoardType>(
    getDefaultData()
  );

  return (
    <BoardContext.Provider
      value={{ createBoard, forcedData, setForcedData, formData }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export default BoardContextProvider;

export const useBoard = () => {
  return useContext(BoardContext);
};
