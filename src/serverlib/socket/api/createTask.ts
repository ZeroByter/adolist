import { decryptAccountToken, getToken } from "@/serverlib/auth";
import { checkBoardAccess } from "@/serverlib/essentials";
import BoardsSQL from "@/serverlib/sql-classes/boards";
import BoardSharesSQL from "@/serverlib/sql-classes/boardshares";
import TasksSQL from "@/serverlib/sql-classes/tasks";
import UsersSQL from "@/serverlib/sql-classes/users";
import CreateTaskData from "@/types/api/createTask";
import BoardType from "@/types/client/board/board";
import { SocketEmitEvents, SocketListenEvents } from "@/types/socketEvents";
import { Server, Socket } from "socket.io";

const SocketCreateTask = async (
  io: Server<SocketEmitEvents, SocketListenEvents>,
  socket: Socket<SocketEmitEvents, SocketListenEvents>,
  data: CreateTaskData
) => {
  const session = decryptAccountToken(data.auth);
  const user = await UsersSQL.getById(session.id);
  if (!user) return;

  if (!checkBoardAccess(user.id, data.boardId)) return;

  const lastTaskListOrder = (await TasksSQL.getLast(data.boardId)) ?? "-1";

  const newId = await TasksSQL.create(
    data.boardId,
    user.id,
    parseInt(lastTaskListOrder) + 1
  );

  const result = await TasksSQL.getByOwnerId(data.boardId);
  io.to(data.boardId).emit("setTasks", data.boardId, result);
  socket.emit("setFocusedTask", newId);
};

export default SocketCreateTask;
