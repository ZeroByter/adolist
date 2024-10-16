import TaskType from "@/types/task";
import { FC } from "react";
import css from "./list.module.scss";
import ListItem from "./listItem";

type ListType = "ONLY_INCOMPLETE" | "ONLY_COMPLETE";

type Props = {
  boardId: string;
  tasks: TaskType[];
  type: ListType;
};

const List: FC<Props> = ({ boardId, tasks, type }) => {
  const renderItems = tasks.map((task) => {
    if (
      (type == "ONLY_COMPLETE" && !task.checked) ||
      (type == "ONLY_INCOMPLETE" && task.checked)
    )
      return null;
    return (
      <ListItem key={task.id} id={task.id} data={task} boardId={boardId} />
    );
  });

  return (
    <div className={css.root}>
      {renderItems}
      {type == "ONLY_INCOMPLETE" && <ListItem boardId={boardId} />}
    </div>
  );
};

export default List;
