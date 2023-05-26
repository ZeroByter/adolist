import BoardType from "@/types/client/board/board";
import IndexProps from "@/types/indexProps";
import { SocketEmitEvents, SocketListenEvents } from "@/types/socketEvents";
import { Socket } from "socket.io-client";

const createListeners = (
  socket: Socket<SocketListenEvents, SocketEmitEvents> | undefined,
  props: IndexProps,
  setProps: (props: IndexProps) => void
) => {
  return () => {
    if (!socket) return;

    socket.on("setBoards", (boards, tasks, shares) => {
      const newProps = { ...props };

      if (!newProps.boards || !newProps.tasks || !newProps.boardShares) return;

      for (const task of tasks) {
        newProps.tasks[task.id] = task;
      }

      for (const user of shares) {
        newProps.boardShares[user.id] = user;
      }

      newProps.boards = {};
      for (const board of boards) {
        newProps.boards[board.id] = board;
      }

      setProps(newProps);
    });

    socket.on("setBoardName", (id, name) => {
      const newProps = { ...props };

      if (!newProps.boards) return;

      newProps.boards[id].name = name;

      setProps(newProps);
    });

    socket.on("setBoardSharedUsers", (id, users) => {
      const newProps = { ...props };

      if (!newProps.boards || !newProps.boardShares) return;

      const ids = [];
      for (const user of users) {
        ids.push(user.id);
        newProps.boardShares[user.id] = user;
      }

      newProps.boards[id].shares = ids;

      setProps(newProps);
    });

    socket.on("deleteBoard", (id) => {
      const newProps = { ...props };

      if (!newProps.boards) return;

      delete newProps.boards[id];

      setProps(newProps);
    });

    socket.on("setTasks", (boardId, tasks) => {
      const newProps = { ...props };

      if (!newProps.boards || !newProps.tasks) return;

      const ids = [];
      for (const task of tasks) {
        ids.push(task.id);
        newProps.tasks[task.id] = task;
      }

      newProps.boards[boardId].tasks = ids;

      setProps(newProps);
    });

    socket.on("setTaskText", (boardId, id, text) => {
      const newProps = { ...props };

      if (!newProps.tasks) return;

      newProps.tasks[id].text = text;

      setProps(newProps);
    });

    socket.on("setTaskChecked", (boardId, id, checked) => {
      const newProps = { ...props };

      if (!newProps.tasks) return;

      newProps.tasks[id].checked = checked;

      setProps(newProps);
    });

    socket.on("setFocusedTask", (taskId) => {
      const newProps = { ...props };

      newProps.focusedTask = taskId;

      setProps(newProps);
    });

    return () => {
      socket.off("setBoards");
      socket.off("setBoardName");
      socket.off("setBoardSharedUsers");
      socket.off("deleteBoard");

      socket.off("setTasks");
      socket.off("setTaskText");
      socket.off("setTaskChecked");
      socket.off("setFocusedTask");
    };
  };
};

export default createListeners;
