import { decryptAccountToken, getToken } from "@/serverlib/auth";
import BoardSharesSQL from "@/serverlib/sql-classes/boardshares";
import UsersSQL from "@/serverlib/sql-classes/users";
import { SocketEmitEvents, SocketListenEvents } from "@/types/socketEvents";
import { Server, Socket } from "socket.io";
import { checkBoardAccess, getBoardsForClient } from "@/serverlib/essentials";
import { getUserSockets } from "../userSocketsMap";
import BoardType from "@/types/client/board/board";

const SocketUnshareBoardWithUser = async (
  io: Server<SocketEmitEvents, SocketListenEvents>,
  socket: Socket<SocketEmitEvents, SocketListenEvents>,
  auth: string,
  boardId: string,
  userId: string
) => {
  const session = decryptAccountToken(auth);
  const user = await UsersSQL.getById(session.id);
  if (!user) return;

  if (!checkBoardAccess(userId, boardId)) return;

  await BoardSharesSQL.delete(boardId, userId);

  const resUserSockets = getUserSockets(user.id);
  if (resUserSockets) {
    const userShares = await BoardSharesSQL.getUserShares(boardId);
    for (const userSocket of resUserSockets) {
      userSocket.emit("setBoardSharedUsers", boardId, userShares);
    }
  }

  const { boardsResult, tasksResult, sharesResult } = await getBoardsForClient(
    userId
  );

  const userSockets = getUserSockets(userId);
  if (userSockets) {
    for (const userSocket of userSockets) {
      userSocket.emit("setBoards", boardsResult, tasksResult, sharesResult);

      userSocket.leave(boardId);
    }
  }
};

export default SocketUnshareBoardWithUser;
