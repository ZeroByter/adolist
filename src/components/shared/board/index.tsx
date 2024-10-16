import BoardContextProvider from "@/components/contexts/board";
import BoardWithoutCtx, {
  Props,
} from "@/components/shared/board/boardWithoutCtx";
import { FC } from "react";

type WithCtxProps = {
  createBoard?: boolean;
};

const Board: FC<Props & WithCtxProps> = (props) => {
  return (
    <BoardContextProvider
      createBoard={props.createBoard ?? false}
      boardData={props.data}
      boardId={props.id}
    >
      <BoardWithoutCtx {...props}></BoardWithoutCtx>
    </BoardContextProvider>
  );
};

export default Board;
