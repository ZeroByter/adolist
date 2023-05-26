import { decryptAccountToken, getToken } from "@/serverlib/auth";
import BoardsSQL from "@/serverlib/sql-classes/boards";
import TasksSQL from "@/serverlib/sql-classes/tasks";
import UsersSQL from "@/serverlib/sql-classes/users";
import CreateBoardData from "@/types/api/createBoard";
import { SocketEmitEvents, SocketListenEvents } from "@/types/socketEvents";
import { getBoardsForClient } from "@/serverlib/essentials";
import { Socket } from "socket.io";
import { getUserSockets } from "../userSocketsMap";
import BoardType from "@/types/client/board/board";

const SocketCreateBoard = async (
  socket: Socket<SocketEmitEvents, SocketListenEvents>,
  data: CreateBoardData
) => {
  const session = decryptAccountToken(data.auth);
  const user = await UsersSQL.getById(session.id);
  if (!user) return;

  const lastBoardListOrder = (await BoardsSQL.getLast(user.id)) ?? "-1";

  const boardId = await BoardsSQL.create(
    user.id,
    data.data.name,
    parseInt(lastBoardListOrder) + 1
  );
  await TasksSQL.createMultiple(boardId, user.id, data.data.tasks);

  socket.join(boardId);

  const userSockets = getUserSockets(user.id);
  if (userSockets) {
    const { boardsResult, tasksResult, sharesResult } =
      await getBoardsForClient(user.id);
    for (const userSocket of userSockets) {
      userSocket.emit("setBoards", boardsResult, tasksResult, sharesResult);
    }
  }
};

export default SocketCreateBoard;
