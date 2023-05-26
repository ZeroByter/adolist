import { ApiResponse } from "@/types/apiResponse";
import BoardType from "./client/board/board";
import RegisterData from "@/types/api/register";
import SetAccountData from "@/types/api/setAccount";
import CreateBoardData from "@/types/api/createBoard";
import SetBoardNameData from "./api/setBoardName";
import SetTaskTextData from "./api/setTaskText";
import SetTaskCheckedData from "./api/setTaskChecked";
import CreateTaskData from "./api/createTask";
import TaskType from "./client/board/task";
import LoginData from "./api/login";
import DeleteTaskData from "./api/deleteTask";
import UserType from "./client/board/user";

export interface SocketEmitEvents {
  login: (data: LoginData) => void;
  register: (data: RegisterData) => void;

  setAccount: (data: SetAccountData) => void;
  createBoard: (data: CreateBoardData) => void;
  createTask: (data: CreateTaskData) => void;

  shareBoardWithUser: (auth: string, boardId: string, userId: string) => void;
  unshareBoardWithUser: (auth: string, boardId: string, userId: string) => void;

  setBoardName: (data: SetBoardNameData) => void;
  setTaskText: (data: SetTaskTextData) => void;
  setTaskChecked: (data: SetTaskCheckedData) => void;

  deleteTask: (data: DeleteTaskData) => void;
  deleteBoard: (auth: string, boardId: string) => void;
}

export interface SocketListenEvents {
  apiResponse: (data: ApiResponse) => void;

  setBoards: (
    boards: BoardType[],
    tasks: TaskType[],
    shares: UserType[]
  ) => void;
  deleteBoard: (id: string) => void;
  setBoardName: (id: string, name: string) => void;
  setBoardSharedUsers: (id: string, users: UserType[]) => void;

  setTasks: (boardId: string, tasks: TaskType[]) => void;
  setTaskText: (boardId: string, id: string, text: string) => void;
  setTaskChecked: (boardId: string, id: string, checked: boolean) => void;
  setFocusedTask: (taskId: string) => void;
}
