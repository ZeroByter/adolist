import { decryptAccountToken, getToken } from "@/serverlib/auth";
import BoardsSQL from "@/serverlib/sql-classes/boards";
import TasksSQL from "@/serverlib/sql-classes/tasks";
import UsersSQL from "@/serverlib/sql-classes/users";
import SetBoardNameData from "@/types/api/setBoardName";
import BoardType from "@/types/client/board/board";
import { SocketEmitEvents, SocketListenEvents } from "@/types/socketEvents";
import { Server, Socket } from "socket.io";

const SocketSetBoardName = async (
  io: Server<SocketEmitEvents, SocketListenEvents>,
  socket: Socket<SocketEmitEvents, SocketListenEvents>,
  data: SetBoardNameData
) => {
  const session = decryptAccountToken(data.auth);
  const user = await UsersSQL.getById(session.id);

  if (user) {
    await BoardsSQL.setName(data.id, data.name);

    io.to(data.id).except(socket.id).emit("setBoardName", data.id, data.name);
  }
};

export default SocketSetBoardName;
