import { decryptAccountToken, getToken } from "@/serverlib/auth";
import BoardSharesSQL from "@/serverlib/sql-classes/boardshares";
import UsersSQL from "@/serverlib/sql-classes/users";
import { SocketEmitEvents, SocketListenEvents } from "@/types/socketEvents";
import { Server, Socket } from "socket.io";
import { getUserSockets } from "./setAccount";
import { checkBoardAccess, getBoardsForClient } from "@/serverlib/essentials";

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

  socket.emit(
    "setBoardSharedUsers",
    boardId,
    await BoardSharesSQL.getUserShares(boardId)
  );

  const userBoards = await getBoardsForClient(userId);

  const userSockets = getUserSockets(userId);
  if (userSockets) {
    for (const userSocket of userSockets) {
      userSocket.emit("setBoards", userBoards);

      userSocket.leave(boardId);
    }
  }
};

export default SocketUnshareBoardWithUser;