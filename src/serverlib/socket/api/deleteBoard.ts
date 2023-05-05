import { decryptAccountToken, getToken } from "@/serverlib/auth";
import { checkBoardAccess } from "@/serverlib/essentials";
import BoardsSQL from "@/serverlib/sql-classes/boards";
import UsersSQL from "@/serverlib/sql-classes/users";
import { SocketEmitEvents, SocketListenEvents } from "@/types/socketEvents";
import { Server } from "socket.io";

const SocketDeleteBoard = async (
  io: Server<SocketEmitEvents, SocketListenEvents>,
  auth: string,
  boardId: string
) => {
  const session = decryptAccountToken(auth);

  const user = await UsersSQL.getById(session.id);
  if (!user) return;

  const board = await BoardsSQL.getById(boardId);
  if (!board) return;

  await BoardsSQL.delete(boardId);
  await BoardsSQL.decreaseBoardListOrders(board.ownerid, parseInt(board.listorder))
  
  io.to(boardId).emit("deleteBoard", boardId);
};

export default SocketDeleteBoard;
