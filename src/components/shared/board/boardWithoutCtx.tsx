"use client";

import { useAuth } from "@/components/contexts/auth";
import { useBoard } from "@/components/contexts/board";
import List from "@/components/shared/board/list";
import BoardType from "@/types/board";
import TaskType from "@/types/task";
import UserType from "@/types/user";
import getCollection from "@/utils/firestore";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { addDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { ChangeEvent, FC, useEffect, useState } from "react";
import css from "./boardWithoutCtx.module.scss";
import DeleteModal from "./deleteModal";
import ShareModal from "./shareModal";
import { randomId } from "@/utils/essentials";

export type Props = {
  data?: BoardType;
  id?: string;
};

const BoardWithoutCtx: FC<Props> = ({ data, id }) => {
  const { user } = useAuth();

  const { createBoard, forcedData, setForcedData, formData, getDefaultData } =
    useBoard();
  const { handleSubmit } = formData;

  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [localBoardName, setLocalBoardName] = useState<string>("");

  const [ownerDisplayName, setOwnerDisplayName] = useState<string>("");

  const onSubmit = handleSubmit(async (data) => {
    //dont use data because we are dealing with a dynamic form and i cant be bothered to figure out how to make react-form-hook work with a dynamic number of inputs
    await addDoc(getCollection("boards"), forcedData);

    setForcedData(getDefaultData());
  });

  const onCancel = () => {
    setForcedData(getDefaultData());
  };

  const isUsingForcedData = createBoard;

  const onNameChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (isUsingForcedData) {
      setForcedData({
        ...forcedData,
        name: e.target.value,
      });
      setLocalBoardName(e.target.value);
    } else {
      //TODO: add debouncer, no need to update text so frequently
      setLocalBoardName(e.target.value);
      setDoc(
        doc(getCollection("boards"), id),
        {
          name: e.target.value,
        },
        {
          merge: true,
        }
      );
    }
  };

  const onShareClick = () => {
    setShowShareModal(true);
  };

  const onDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const useData = isUsingForcedData ? forcedData : data;

  useEffect(() => {
    (async () => {
      if (useData != null && !createBoard && useData.ownerId !== user?.uid) {
        const snapshot = await getDoc(
          doc(getCollection("users"), useData.ownerId)
        );

        const data = snapshot.data();

        if (data != null) {
          setOwnerDisplayName(data.displayName);
        }
      }
    })();
  }, [createBoard, useData, user?.uid]);

  useEffect(() => {
    setLocalBoardName(useData?.name ?? "");
  }, [useData]);

  const renderOwnerButtons = () => {
    if (useData != null && useData.ownerId !== user?.uid) {
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

  const renderNonOwnerInfo = () => {
    if (useData != null && !createBoard && useData.ownerId !== user?.uid) {
      const renderDisplayName = ownerDisplayName || useData?.ownerId;

      return (
        <Typography
          fontSize={12}
          color={"gray"}
          lineHeight={"normal"}
          title={renderDisplayName}
        >
          Owner: {renderDisplayName}
        </Typography>
      );
    }
  };

  let hasCheckedItem = false;
  let boardTasks: TaskType[] = [];

  if (isUsingForcedData) {
    hasCheckedItem = forcedData.tasks.find((task) => task.checked) != null;
    boardTasks = forcedData.tasks;
  } else {
    if (data) {
      boardTasks = data.tasks;
      hasCheckedItem = data.tasks.find((task) => task.checked) != null;
    }
  }

  const finalBoardId = id ?? "";

  return (
    <>
      <form className={css.root} onSubmit={onSubmit}>
        <Card key={id} variant="outlined">
          <CardContent>
            <div className={css.header}>
              <TextareaAutosize
                className={css.input}
                required
                placeholder="Title"
                value={localBoardName}
                onChange={onNameChange}
              />
              {renderNonOwnerInfo()}
              {renderOwnerButtons()}
            </div>
            <div>
              {useData && (
                <>
                  <List
                    boardId={finalBoardId}
                    type="ONLY_INCOMPLETE"
                    tasks={boardTasks}
                  />
                  {hasCheckedItem && (
                    <Accordion disableGutters square>
                      <AccordionSummary>
                        <Typography>Completed tasks</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List
                          boardId={finalBoardId}
                          type="ONLY_COMPLETE"
                          tasks={boardTasks}
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
            boardId={finalBoardId}
            open={showShareModal}
            onClose={() => setShowShareModal(false)}
          />
          <DeleteModal
            boardId={finalBoardId}
            boardName={useData.name}
            open={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
          />
        </>
      )}
    </>
  );
};

export default BoardWithoutCtx;
