import { decryptAccountToken, getToken } from "@/serverlib/auth";
import { checkBoardAccess } from "@/serverlib/essentials";
import BoardsSQL from "@/serverlib/sql-classes/boards";
import BoardSharesSQL from "@/serverlib/sql-classes/boardshares";
import TasksSQL from "@/serverlib/sql-classes/tasks";
import UsersSQL from "@/serverlib/sql-classes/users";
import DeleteTaskData from "@/types/api/deleteTask";
import { SocketEmitEvents, SocketListenEvents } from "@/types/socketEvents";
import { Server } from "socket.io";

const SocketDeleteTask = async (
  io: Server<SocketEmitEvents, SocketListenEvents>,
  data: DeleteTaskData
) => {
  const session = decryptAccountToken(data.auth);
  const user = await UsersSQL.getById(session.id);
  if (!user) return;

  const task = await TasksSQL.getById(data.id);
  if (!task) return;

  if (!checkBoardAccess(user.id, task.ownerid)) return;

  await TasksSQL.delete(data.id);
  await TasksSQL.decreaseTaskListOrders(task.ownerid, parseInt(task.listorder))
  const newTasks = await TasksSQL.getByOwnerId(task.ownerid);

  io.to(task.ownerid).emit("setTasks", task.ownerid, newTasks);
};

export default SocketDeleteTask;
