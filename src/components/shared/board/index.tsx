import BoardContextProvider from "@/components/contexts/board";
import { FC } from "react";
import BoardWithoutCtx, {
  Props,
} from "@/components/shared/board/boardWithoutCtx";

type WithCtxProps = {
  createBoard?: boolean;
};

const Board: FC<Props & WithCtxProps> = (props) => {
  return (
    <BoardContextProvider createBoard={props.createBoard ?? false}>
      <BoardWithoutCtx {...props}></BoardWithoutCtx>
    </BoardContextProvider>
  );
};

export default Board;
