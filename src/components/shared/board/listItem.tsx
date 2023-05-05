import { ChangeEvent, KeyboardEvent, FC, FocusEvent } from "react";
import css from "./listItem.module.scss";
import { Box, Checkbox, TextareaAutosize } from "@mui/material";
import TaskType from "@/types/client/board/task";
import { useBoard } from "@/components/contexts/board";
import { useSSRFetcher } from "@/components/contexts/ssrFetcher";
import { IndexPropsType } from "@/types/indexProps";
import { useSocket } from "@/components/contexts/socket";
import getAuthCookie from "@/clientlib/getAuthCookie";
import { randomId } from "@/sharedlib/essentials";

type Props = {
  data?: TaskType;
  boardId: string;
};

const ListItem: FC<Props> = ({ data, boardId }) => {
  const { props, setProps }: IndexPropsType = useSSRFetcher();
  const { socket } = useSocket();
  const { createBoard, forcedData, setForcedData } = useBoard();

  const createNewTask = () => {
    if (createBoard) {
      const newForcedData = { ...forcedData };
      newForcedData.tasks.push({
        id: randomId(),
        ownerid: "",
        checked: false,
        text: "",
        timecreated: 0,
        timeupdated: 0,
        updatedby: "",
        listorder: "0",
        lastchecked: undefined,
        lastcheckedby: undefined,
      });
      setForcedData(newForcedData);
    } else {
      if (!props.boards) return;

      const foundBoard = props.boards.find((board) => board.id === boardId);
      if (!foundBoard) return;

      socket?.emit("createTask", {
        auth: getAuthCookie(),
        boardId: foundBoard.id,
      });
    }
  };

  const onClick = () => {
    if (data != null) return;

    createNewTask();
  };

  const onCheckedChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (createBoard) {
      const newForcedData = { ...forcedData };
      const foundTask = newForcedData.tasks.find(
        (task) => task.id === data?.id
      );
      foundTask && (foundTask.checked = e.target.checked);
      setForcedData(newForcedData);
    } else {
      const newProps = { ...props };

      if (!newProps.boards) return;

      const foundBoard = newProps.boards.find((board) => board.id === boardId);
      if (!foundBoard) return;

      const foundTask = foundBoard.tasks.find((task) => task.id === data?.id);
      if (!foundTask) return;

      foundTask.checked = e.target.checked;

      setProps(newProps);

      socket?.emit("setTaskChecked", {
        auth: getAuthCookie(),
        id: data!.id,
        checked: e.target.checked,
      });
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Disable enter=new task behavior in mobile phones
    if (
      !/Android|iPhone/i.test(navigator.userAgent) &&
      e.key == "Enter" &&
      !e.shiftKey
    ) {
      createNewTask();
      e.preventDefault();
    }

    if (e.key == "Backspace" && data?.text == "") {
      deleteTask();
      e.preventDefault();
    }
  };

  const onTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (createBoard) {
      const newForcedData = { ...forcedData };
      const foundTask = newForcedData.tasks.find(
        (task) => task.id === data?.id
      );
      foundTask && (foundTask.text = e.target.value);
      setForcedData(newForcedData);
    } else {
      const newProps = { ...props };

      if (!newProps.boards) return;

      const foundBoard = newProps.boards.find((board) => board.id === boardId);
      if (!foundBoard) return;

      const foundTask = foundBoard.tasks.find((task) => task.id === data?.id);
      if (!foundTask) return;

      foundTask.text = e.target.value;

      setProps(newProps);

      socket?.emit("setTaskText", {
        auth: getAuthCookie(),
        id: data!.id,
        text: e.target.value,
      });
    }
  };

  const deleteTask = () => {
    if (createBoard) {
      const newForcedData = { ...forcedData };
      newForcedData.tasks = newForcedData.tasks.filter(
        (task) => task.id !== data?.id
      );
      setForcedData(newForcedData);
    } else {
      const newProps = { ...props };

      if (!newProps.boards) return;

      const foundBoard = newProps.boards.find((board) => board.id === boardId);
      if (!foundBoard) return;

      foundBoard.tasks = foundBoard.tasks.filter(
        (task) => task.id !== data?.id
      );

      setProps(newProps);

      socket?.emit("deleteTask", {
        auth: getAuthCookie(),
        id: data!.id,
      });
    }
  };

  const onBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    if (data != null && e.target.value == "") {
      deleteTask();
    }
  };

  const renderSideItem = () => {
    if (data) {
      return (
        <Box height={18} width={18}>
          <Checkbox
            className={css.checkbox}
            checked={data.checked}
            size="small"
            onChange={onCheckedChange}
          />
        </Box>
      );
    } else {
      return <div className={css.plusSign}>+</div>;
    }
  };

  return (
    <div className={css.root} onClick={onClick}>
      <div className={css.sideItem}>{renderSideItem()}</div>
      <div className={css.text}>
        <TextareaAutosize
          autoFocus={
            data != null && (data.ownerid == "" || data.updatedby == props.id)
          }
          required={data != null}
          placeholder="An awesome task"
          value={data?.text}
          onKeyDown={onKeyDown}
          onChange={onTextChange}
          onBlur={onBlur}
          tabIndex={data == null ? -1 : undefined}
        />
      </div>
    </div>
  );
};

export default ListItem;
