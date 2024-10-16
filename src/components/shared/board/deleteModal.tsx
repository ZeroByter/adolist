import getCollection from "@/utils/firestore";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { deleteDoc, doc } from "firebase/firestore";
import { FC } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  boardId: string;
  boardName: string;
};

const DeleteModal: FC<Props> = ({ open, onClose, boardId, boardName }) => {
  const onDelete = async () => {
    onClose();

    deleteDoc(doc(getCollection("boards"), boardId));
  };

  const onCancel = async () => {
    onClose();
  };

  return (
    <Dialog
      disablePortal
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle>Delete board {`'${boardName}'`}?</DialogTitle>
      <DialogActions>
        <Button onClick={onCancel} autoFocus>
          No
        </Button>
        <Button onClick={onDelete} color="warning">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModal;
