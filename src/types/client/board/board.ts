import ServerBoardType from "@/types/server/board/board";

type BoardType = ServerBoardType & {
  tasks: string[];
  shares: string[];
};

export default BoardType;
