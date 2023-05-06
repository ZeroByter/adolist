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

    socket.on("setBoards", (boards) => {
      const newProps = { ...props };

      newProps.boards = boards;

      setProps(newProps);
    });

    socket.on("setBoardName", (id, name) => {
      const newProps = { ...props };

      const foundBoard = newProps.boards?.find((board) => board.id === id);
      if (!foundBoard) return;

      foundBoard.name = name;

      setProps(newProps);
    });

    socket.on("setBoardSharedUsers", (id, users) => {
      const newProps = { ...props };

      const foundBoard = newProps.boards?.find((board) => board.id === id);
      if (!foundBoard) return;

      foundBoard.shares = users;

      setProps(newProps);
    });

    socket.on("deleteBoard", (id) => {
      const newProps = { ...props };

      newProps.boards = newProps.boards!.filter((board) => board.id != id);

      setProps(newProps);
    });

    socket.on("setTasks", (boardId, tasks) => {
      const newProps = { ...props };

      const foundBoard = newProps.boards?.find((board) => board.id === boardId);
      if (!foundBoard) return;

      foundBoard.tasks = tasks;

      setProps(newProps);
    });

    socket.on("setTaskText", (boardId, id, text) => {
      const newProps = { ...props };

      const foundBoard = newProps.boards?.find((board) => board.id === boardId);
      if (!foundBoard) return;

      const foundTask = foundBoard.tasks.find((task) => task.id == id);
      if (!foundTask) return;

      foundTask.text = text;

      setProps(newProps);
    });

    socket.on("setTaskChecked", (boardId, id, checked) => {
      const newProps = { ...props };

      const foundBoard = newProps.boards?.find((board) => board.id === boardId);
      if (!foundBoard) return;

      const foundTask = foundBoard.tasks.find((task) => task.id == id);
      if (!foundTask) return;

      foundTask.checked = checked;

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
