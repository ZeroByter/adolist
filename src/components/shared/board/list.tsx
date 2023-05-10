import { FC } from "react";
import ListItem from "./listItem";
import css from "./list.module.scss";
import { useBoard } from "@/components/contexts/board";
import TaskType from "@/types/client/board/task";

type ListType = "ONLY_INCOMPLETE" | "ONLY_COMPLETE";

type Props = {
  tasks: TaskType[];
  type: ListType;
};

const List: FC<Props> = ({ tasks, type }) => {
  const { boardId } = useBoard();

  const renderItems = tasks.map((task) => {
    if (
      (type == "ONLY_COMPLETE" && !task.checked) ||
      (type == "ONLY_INCOMPLETE" && task.checked)
    )
      return null;
    return <ListItem key={task.id} data={task} boardId={boardId} />;
  });

  return (
    <div className={css.root}>
      {renderItems}
      {type == "ONLY_INCOMPLETE" && <ListItem boardId={boardId} />}
    </div>
  );
};

export default List;
