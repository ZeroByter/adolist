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
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { blue } from "@mui/material/colors";
import useDebounce from "@/clientlib/useDebounce";
import UserType from "@/types/user";
import {
  doc,
  documentId,
  DocumentSnapshot,
  endAt,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAt,
  where,
} from "firebase/firestore";
import getCollection from "@/utils/firestore";
import { useAuth } from "@/components/contexts/auth";
import { useBoard } from "@/components/contexts/board";
import ShareModalUser from "./shareModalUser";

type Props = {
  open: boolean;
  onClose: () => void;
  boardId: string;
};

const ShareModal: FC<Props> = ({ open, onClose, boardId }) => {
  const { user } = useAuth();
  const { boardData, forcedData, setForcedData, createBoard } = useBoard();

  const initialLoadsRef = useRef<number>(0);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce<string>(search, 250);
  const [searchedUsers, setSearchedUsers] = useState<
    DocumentSnapshot<UserType>[]
  >([]);

  const onSearchChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    (async () => {
      if (initialLoadsRef.current < 2) {
        initialLoadsRef.current += 1;
        return;
      }

      if (search == "" || debouncedSearch == "") {
        setSearchedUsers([]);
        return;
      }

      const lowerDebouncedSearch = debouncedSearch.toLowerCase();
      let notInArray = [user!.uid];

      if (createBoard) {
        if (forcedData.shares.length > 0) {
          notInArray = [...notInArray, ...forcedData.shares];
        }
      } else {
        if (boardData!.shares.length > 0) {
          notInArray = [...notInArray, ...boardData!.shares];
        }
      }

      const searchQuery = query(
        getCollection("users"),
        where(documentId(), "not-in", notInArray),
        where("searchableName", "array-contains", lowerDebouncedSearch),
        limit(20)
      );

      const results = await getDocs(searchQuery);
      setSearchedUsers(results.docs);
    })();
  }, [
    boardData,
    boardId,
    createBoard,
    debouncedSearch,
    forcedData.shares,
    search,
    user,
  ]);

  const onAddUser = async (userId: string) => {
    setSearch("");
    setSearchedUsers([]);

    if (createBoard) {
      setForcedData({
        ...forcedData,
        shares: [...forcedData.shares, userId],
      });
    } else {
      await setDoc(
        doc(getCollection("boards"), boardId),
        {
          shares: [...boardData!.shares, userId],
        },
        {
          merge: true,
        }
      );
    }
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
          <ListItemText primary={user.data()?.displayName} />
        </ListItemButton>
      </ListItem>
    );
  });

  const useRenderUsers = createBoard ? forcedData.shares : boardData!.shares;

  const renderSharedUsers = useRenderUsers.map((userId) => (
    <ShareModalUser key={userId} userId={userId} />
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
