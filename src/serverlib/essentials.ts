import BoardType from "@/types/client/board/board";
import TaskType from "@/types/client/board/task";
import UserType from "@/types/client/board/user";
import BoardsSQL from "./sql-classes/boards";
import BoardSharesSQL from "./sql-classes/boardshares";
import TasksSQL from "./sql-classes/tasks";

export const getBoardsForClient = async (userId: string) => {
  const boardsResult: BoardType[] = [];
  const tasksResult: TaskType[] = [];
  const sharesResult: UserType[] = [];

  const boards = [
    ...(await BoardsSQL.getByOwnerId(userId)),
    ...(await BoardSharesSQL.getSharedWithBoards(userId)),
  ];
  for (const board of boards) {
    const tasks = await TasksSQL.getByOwnerId(board.id);
    const shares = await BoardSharesSQL.getUserShares(board.id);

    boardsResult.push({
      ...board,
      tasks: tasks.map((task) => task.id),
      shares: shares.map((share) => share.id),
    });
    tasksResult.push(...tasks);
    sharesResult.push(...shares);
  }

  return [boardsResult, tasksResult, sharesResult];
};

export const checkBoardAccess = async (userId: string, boardId: string) => {
  const board = await BoardsSQL.getById(boardId);
  if (!board) return false;

  const boardSharedWith = await BoardSharesSQL.getUserShares(board.id);

  return (
    board.ownerid == userId ||
    boardSharedWith.find((sharedUser) => sharedUser.id == userId) != null
  );
};
