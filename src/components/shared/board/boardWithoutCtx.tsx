import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  TextareaAutosize,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { ChangeEvent, FC, useState } from "react";
import css from "./boardWithoutCtx.module.scss";
import List from "@/components/shared/board/list";
import BoardType from "@/types/client/board/board";
import { getDefaultData, useBoard } from "@/components/contexts/board";
import { useSocket } from "@/components/contexts/socket";
import getAuthCookie from "@/clientlib/getAuthCookie";
import { useSSRFetcher } from "@/components/contexts/ssrFetcher";
import { IndexPropsType } from "@/types/indexProps";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareModal from "./shareModal";
import DeleteModal from "./deleteModal";

export type Props = {
  data?: BoardType;
};

const BoardWithoutCtx: FC<Props> = ({ data }) => {
  const { props, setProps }: IndexPropsType = useSSRFetcher();
  const { socket } = useSocket();
  const { createBoard, forcedData, setForcedData, formData } = useBoard();
  const { control, handleSubmit } = formData;

  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    //dont use data because we are dealing with a dynamic form and i cant be bothered to figure out how to make react-form-hook work with a dynamic number of inputs

    if (!socket) return;

    socket.emit("createBoard", {
      auth: getAuthCookie(),
      data: forcedData,
    });
    setForcedData(getDefaultData());
  });

  const onCancel = () => {
    setForcedData(getDefaultData());
  };

  const isUsingForcedData = createBoard;

  const onNameChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (isUsingForcedData) {
      const newForcedData = { ...forcedData };
      newForcedData.name = e.target.value;
      setForcedData(newForcedData);
    } else {
      const newProps = { ...props };

      if (!newProps.boards) return;

      const foundBoard = newProps.boards.find((board) => board.id === data!.id);
      if (!foundBoard) return;

      foundBoard.name = e.target.value;

      setProps(newProps);

      socket?.emit("setBoardName", {
        auth: getAuthCookie(),
        id: data!.id,
        name: e.target.value,
      });
    }
  };

  const onShareClick = () => {
    setShowShareModal(true);
  };

  const onDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const useData = isUsingForcedData ? forcedData : data;

  const renderOwnerButtons = () => {
    if (useData != null && useData.ownerid != props.id) {
      return null;
    }

    return (
      <>
        <IconButton aria-label="send" size="small" onClick={onShareClick}>
          <SendIcon fontSize="small" />
        </IconButton>
        <IconButton
          color="warning"
          aria-label="delete"
          size="small"
          onClick={onDeleteClick}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </>
    );
  };

  const hasCheckedItem = useData?.tasks.find((task) => task.checked) != null;

  return (
    <>
      <form className={css.root} onSubmit={onSubmit}>
        <Card key={useData?.id} variant="outlined">
          <CardContent>
            <div className={css.header}>
              <TextareaAutosize
                className={css.input}
                required
                placeholder="Title"
                value={useData?.name}
                onChange={onNameChange}
              />
              {renderOwnerButtons()}
            </div>
            <div>
              {useData && (
                <>
                  <List
                    type="ONLY_INCOMPLETE"
                    data={useData}
                    boardId={useData?.id}
                  />
                  {hasCheckedItem && (
                    <Accordion disableGutters square>
                      <AccordionSummary>
                        <Typography>Completed tasks</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List
                          type="ONLY_COMPLETE"
                          data={useData}
                          boardId={useData?.id}
                        />
                      </AccordionDetails>
                    </Accordion>
                  )}
                </>
              )}
            </div>
          </CardContent>
          {createBoard && (
            <CardActions>
              <Grid container justifyContent={"space-between"}>
                <Button type="submit" color="success">
                  Create
                </Button>
                <Button type="reset" color="warning" onClick={onCancel}>
                  Cancel
                </Button>
              </Grid>
            </CardActions>
          )}
        </Card>
      </form>
      {useData && (
        <>
          <ShareModal
            board={useData}
            open={showShareModal}
            onClose={() => setShowShareModal(false)}
          />
          <DeleteModal
            board={useData}
            open={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
          />
        </>
      )}
    </>
  );
};

export default BoardWithoutCtx;
