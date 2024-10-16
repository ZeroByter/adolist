import { useBoard } from "@/components/contexts/board";
import TaskType from "@/types/task";
import getCollection from "@/utils/firestore";
import { Box, Checkbox, TextareaAutosize } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import {
  ChangeEvent,
  FC,
  FocusEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import css from "./listItem.module.scss";

type Props = {
  data?: TaskType;
  id?: string;
  boardId: string;
};

const ListItem: FC<Props> = ({ data, id, boardId }) => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const { createBoard, forcedData, setForcedData, boardData } = useBoard();

  const [localTaskText, setLocalTaskText] = useState<string>("");

  useEffect(() => {
    setLocalTaskText(data?.text ?? "");
  }, [data]);

  // useEffect(() => {
  //   if (data && props.focusedTask == data?.id) {
  //     inputRef.current?.focus();
  //   }
  // }, [data, data?.id, props.focusedTask]);

  const createNewTask = () => {
    // if (createBoard) {
    //   const newForcedData = { ...forcedData };
    //   const newId = randomId();
    //   newForcedData.tasks.push({
    //     id: newId,
    //     ownerid: "",
    //     checked: false,
    //     text: "",
    //     timecreated: 0,
    //     timeupdated: 0,
    //     updatedby: "",
    //     listorder: "0",
    //     lastchecked: undefined,
    //     lastcheckedby: undefined,
    //   });
    //   setForcedData(newForcedData);
    //   const newProps = { ...props };
    //   newProps.focusedTask = newId;
    //   setProps(newProps);
    // } else {
    //   if (!props.boards) return;
    //   socket?.emit("createTask", {
    //     auth: getAuthCookie(),
    //     boardId,
    //   });
    // }
  };

  const onClick = () => {
    if (data != null) return;

    createNewTask();
  };

  const onCheckedChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (createBoard) {
      const newForcedData = { ...forcedData };
      const foundTask = newForcedData.tasks.find(
        (task: any) => task.id === data?.id
      );
      foundTask && (foundTask.checked = e.target.checked);
      setForcedData(newForcedData);
    } else {
      setDoc(
        doc(getCollection("boards"), boardId),
        {
          tasks: boardData?.tasks.map((task) => {
            if (task.id === id) {
              return {
                ...task,
                checked: e.target.checked,
              };
            } else {
              return task;
            }
          }),
        },
        {
          merge: true,
        }
      );
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

      //auto focus previous task
      // const newProps = { ...props };
      // if (createBoard) {
      //   if (forcedData.tasks.length > 1) {
      //     newProps.focusedTask =
      //       forcedData.tasks[forcedData.tasks.length - 2].id;
      //     setProps(newProps);
      //   }
      // } else {
      //   if (!newProps.boards) return;

      //   const foundBoard = newProps.boards[boardId];
      //   if (!foundBoard) return;

      //   if (foundBoard.tasks.length > 0) {
      //     newProps.focusedTask = foundBoard.tasks[foundBoard.tasks.length - 1];
      //     setProps(newProps);
      //   }
      // }

      e.preventDefault();
    }
  };

  const onTextChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (createBoard) {
      const newForcedData = { ...forcedData };
      const foundTask = newForcedData.tasks.find(
        (task) => task.id === data?.id
      );
      foundTask && (foundTask.text = e.target.value);
      setForcedData(newForcedData);
    } else {
      setLocalTaskText(e.target.value);
      await setDoc(
        doc(getCollection("boards"), boardId),
        {
          tasks: boardData?.tasks.map((task) => {
            if (task.id === id) {
              return {
                ...task,
                text: e.target.value,
              };
            } else {
              return task;
            }
          }),
        },
        {
          merge: true,
        }
      );
    }
  };

  const deleteTask = () => {
    // if (createBoard) {
    //   const newForcedData = { ...forcedData };
    //   newForcedData.tasks = newForcedData.tasks.filter(
    //     (task) => task.id !== data?.id
    //   );
    //   setForcedData(newForcedData);
    // } else {
    //   const newProps = { ...props };
    //   if (!newProps.boards || !newProps.tasks || !data?.id) return;
    //   const foundBoard = newProps.boards[boardId];
    //   if (!foundBoard) return;
    //   foundBoard.tasks = foundBoard.tasks.filter((task) => task !== data?.id);
    //   delete newProps.tasks[data.id];
    //   setProps(newProps);
    //   socket?.emit("deleteTask", {
    //     auth: getAuthCookie(),
    //     id: data!.id,
    //   });
    // }
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
          // autoFocus={
          //   data != null && (data.ownerRef == null || data.updatedBy.id === props.id)
          // }
          key="plsdontupdate"
          ref={inputRef}
          required={data != null}
          placeholder="An awesome task"
          value={localTaskText}
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
