import { useBoard } from "@/components/contexts/board";
import TaskType from "@/types/task";
import getCollection from "@/utils/firestore";
import { Box, Checkbox, TextareaAutosize } from "@mui/material";
import { doc, setDoc, Timestamp } from "firebase/firestore";
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
import { randomId } from "@/utils/essentials";
import { useFocusedTask } from "@/components/contexts/focusedTask";
import { useAuth } from "@/components/contexts/auth";

type Props = {
  data?: TaskType;
  id?: string;
  boardId: string;
};

const ListItem: FC<Props> = ({ data, id, boardId }) => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const { user } = useAuth();
  const { createBoard, forcedData, setForcedData, boardData } = useBoard();
  const { focusedTask, setFocusedTask } = useFocusedTask();

  const [localTaskText, setLocalTaskText] = useState<string>("");

  useEffect(() => {
    setLocalTaskText(data?.text ?? "");
  }, [data]);

  useEffect(() => {
    if (data && focusedTask == data?.id) {
      inputRef.current?.focus();
      setFocusedTask("");
    }
  }, [data, data?.id, focusedTask, setFocusedTask]);

  const createNewTask = async () => {
    if (createBoard) {
      const newForcedData = { ...forcedData };

      const newId = randomId();

      newForcedData.tasks.push({
        id: newId,
        ownerId: user?.uid ?? "",
        checked: false,
        text: "",
        timeCreated: Timestamp.now(),
        timeUpdated: Timestamp.now(),
        updatedBy: user?.uid ?? "",
        listOrder: 0,
      });

      setForcedData(newForcedData);

      setFocusedTask(newId);
    } else {
      const newTaskId = randomId();

      await setDoc(
        doc(getCollection("boards"), boardId),
        {
          tasks: [
            ...boardData!.tasks,
            {
              id: newTaskId,
              ownerId: user?.uid,
              text: "",
              checked: false,
              timeCreated: Timestamp.now(),
              timeUpdated: Timestamp.now(),
              updatedBy: user?.uid,
              listOrder: boardData!.tasks.length,
            },
          ],
        },
        {
          merge: true,
        }
      );

      setFocusedTask(newTaskId);
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
                updatedBy: user?.uid,
                timeUpdated: Timestamp.now(),
                lastChecked: Timestamp.now(),
                lastCheckedBy: user?.uid,
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

  const onKeyDown = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
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
      const tasks = createBoard ? forcedData.tasks : boardData!.tasks;

      const currentIndex = tasks.findIndex((task) => task.id === id);
      const currentTask = tasks[currentIndex];

      let focusNextTaskId = undefined;

      if (tasks.length > 1) {
        if (currentTask.checked) {
          const checkedTasks = tasks.filter((task) => task.checked);
          const currentIndexInCheckedTasks = checkedTasks.findIndex(
            (task) => task.id === id
          );

          const nextIndex =
            currentIndexInCheckedTasks == 0
              ? 1
              : currentIndexInCheckedTasks - 1;

          const focusNextTask = checkedTasks[nextIndex];
          focusNextTaskId = tasks.find(
            (task) => task.id === focusNextTask.id
          )?.id;
        } else {
          const uncheckedTasks = tasks.filter((task) => !task.checked);
          const currentIndexInUncheckedTasks = uncheckedTasks.findIndex(
            (task) => task.id === id
          );

          const nextIndex =
            currentIndexInUncheckedTasks == 0
              ? 1
              : currentIndexInUncheckedTasks - 1;

          const focusNextTask = uncheckedTasks[nextIndex];
          focusNextTaskId = tasks.find(
            (task) => task.id === focusNextTask.id
          )?.id;
        }
      }

      await deleteTask();

      setFocusedTask(focusNextTaskId);

      e.preventDefault();
    }
  };

  const onTextChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (createBoard) {
      setForcedData({
        ...forcedData,
        tasks: forcedData.tasks.map((task) => {
          if (task.id === data?.id) {
            return {
              ...task,
              text: e.target.value,
            };
          } else {
            return task;
          }
        }),
      });
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
                updatedBy: user?.uid,
                timeUpdated: Timestamp.now(),
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

  const deleteTask = async () => {
    if (createBoard) {
      const newForcedData = { ...forcedData };
      newForcedData.tasks = newForcedData.tasks.filter(
        (task) => task.id !== data?.id
      );
      setForcedData(newForcedData);
    } else {
      await setDoc(
        doc(getCollection("boards"), boardId),
        {
          tasks: boardData?.tasks.filter((task) => task.id !== id),
        },
        {
          merge: true,
        }
      );
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
