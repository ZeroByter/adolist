import ServerBoardType from "@/types/server/board/board";
import TaskType from "./task";
import UserType from "./user";

type BoardType = ServerBoardType & {
  tasks: TaskType[];
  shares: UserType[];
};

export default BoardType;
