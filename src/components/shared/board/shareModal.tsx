import {
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { blue } from "@mui/material/colors";
import useDebounce from "@/clientlib/useDebounce";
import UserType from "@/types/user";

type Props = {
  open: boolean;
  onClose: () => void;
  boardId: string;
  // boardShares: UserType[];
  boardShares: any[];
};

const ShareModal: FC<Props> = ({ open, onClose, boardId, boardShares }) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce<string>(search, 250);
  // const [searchedUsers, setSearchedUsers] = useState<UserType[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<any[]>([]);

  const onSearchChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // useEffect(() => {
  //   (async () => {
  //     const rawResponse = await fetch("/api/shareBoardSearchUsers", {
  //       body: JSON.stringify({
  //         boardId: boardId,
  //         search: debouncedSearch,
  //       }),
  //       method: "POST",
  //     });
  //     const response = await rawResponse.json();

  //     if (response.error == null) {
  //       setSearchedUsers(response.data);
  //     } else {
  //       setSearchedUsers([]);
  //     }
  //   })();
  // }, [boardId, debouncedSearch]);

  const onAddUser = async (userId: string) => {
    setSearch("");
    setSearchedUsers([]);

    // socket.emit("shareBoardWithUser", getAuthCookie(), boardId, userId);
  };

  const onRemoveUser = async (userId: string) => {
    // socket.emit("unshareBoardWithUser", getAuthCookie(), boardId, userId);
  };

  const renderSearchedUsers = searchedUsers.map((user) => {
    return (
      <ListItem key={user.id} disableGutters disablePadding>
        <ListItemButton
          onClick={() => {
            onAddUser(user.id);
          }}
        >
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={user.username} />
        </ListItemButton>
      </ListItem>
    );
  });

  const renderSharedUsers = boardShares.map((user) => (
    <ListItem key={user.id} disableGutters disablePadding>
      <ListItemButton
        onClick={() => {
          onRemoveUser(user.id);
        }}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
            <PersonIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={user.username} />
      </ListItemButton>
    </ListItem>
  ));

  return (
    <Dialog
      disablePortal
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle>Share with users</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={6} padding={0.5}>
            <Typography align="center">New users</Typography>
            <TextField
              onChange={onSearchChange}
              value={search}
              label="Search users"
              fullWidth
            />
            <List sx={{ pt: 0 }}>{renderSearchedUsers}</List>
          </Grid>
          <Grid item xs={6} padding={0.5}>
            <Typography align="center">Existing users</Typography>
            <List sx={{ pt: 0 }}>{renderSharedUsers}</List>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
