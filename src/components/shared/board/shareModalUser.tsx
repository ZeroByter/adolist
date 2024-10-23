import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { blue } from "@mui/material/colors";
import { FC, useEffect, useState } from "react";
import { useBoard } from "@/components/contexts/board";
import getCollection from "@/utils/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";

type Props = {
  userId: string;
};

const ShareModalUser: FC<Props> = ({ userId }) => {
  const { boardData, boardId, forcedData, setForcedData, createBoard } =
    useBoard();

  const [displayName, setDisplayName] = useState<string>();

  useEffect(() => {
    (async () => {
      const result = await getDoc(doc(getCollection("users"), userId));
      setDisplayName(result.data()?.displayName);
    })();
  }, [userId]);

  const onRemoveUser = async (userId: string) => {
    if (createBoard) {
      setForcedData({
        ...forcedData,
        shares: forcedData.shares.filter(
          (shareUserId) => shareUserId !== userId
        ),
      });
    } else {
      await setDoc(
        doc(getCollection("boards"), boardId),
        {
          shares: boardData?.shares.filter(
            (shareUserId) => shareUserId !== userId
          ),
        },
        {
          merge: true,
        }
      );
    }
  };

  return (
    <ListItem key={userId} disableGutters disablePadding>
      <ListItemButton
        onClick={() => {
          onRemoveUser(userId);
        }}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
            <PersonIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={displayName ?? "Loading..."} />
      </ListItemButton>
    </ListItem>
  );
};

export default ShareModalUser;
