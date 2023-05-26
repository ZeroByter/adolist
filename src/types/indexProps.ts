import BoardType from "./client/board/board";
import TaskType from "./client/board/task";
import UserType from "./client/board/user";

type IndexProps = {
  id?: string;
  username?: string;
  boards?: { [id: string]: BoardType };
  tasks?: { [id: string]: TaskType };
  boardShares?: { [id: string]: UserType };
  focusedTask?: string;
};

export default IndexProps;

export type IndexPropsType = {
  props: IndexProps;
  setProps: (props: IndexProps) => void;
};
