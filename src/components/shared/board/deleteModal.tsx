import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
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

    // socket.emit("deleteBoard", getAuthCookie(), boardId);
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
