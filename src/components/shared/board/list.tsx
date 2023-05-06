import { FC } from "react";
import ListItem from "./listItem";
import css from "./list.module.scss";
import BoardType from "@/types/client/board/board";

type ListType = "ONLY_INCOMPLETE" | "ONLY_COMPLETE";

type Props = {
  data: BoardType;
  boardId: string;
  type: ListType;
};

const List: FC<Props> = ({ data, boardId, type }) => {
  const renderItems = data.tasks.map((task) => {
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
