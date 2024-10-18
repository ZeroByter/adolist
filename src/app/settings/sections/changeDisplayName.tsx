"use client";

import { useAuth } from "@/components/contexts/auth";
import { generateSubstrings } from "@/utils/essentials";
import getCollection from "@/utils/firestore";
import {
  Box,
  Button,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";

type FormData = {
  newDisplayName: string;
};

const ChangeDisplayName: FC = () => {
  const { user, userLoaded } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      newDisplayName: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!user) {
      return;
    }

    await setDoc(
      doc(getCollection("users"), user.uid),
      {
        displayName: data.newDisplayName,
        searchableName: [
          ...new Set(generateSubstrings(data.newDisplayName.toLowerCase())),
        ],
      },
      {
        merge: true,
      }
    );
  });

  return (
    <Box sx={{ p: 1 }}>
      <Stack spacing={1} alignItems="flex-start">
        <Typography sx={{ fontSize: 17 }}>Change display name</Typography>
        <form onSubmit={onSubmit}>
          <FormControl required fullWidth>
            <Controller
              name="newDisplayName"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  placeholder="New display name"
                  inputProps={{ maxLength: 32 }}
                  {...field}
                />
              )}
            />
          </FormControl>
          <FormControl margin="dense">
            <Button type="submit" variant="contained">
              Register
            </Button>
          </FormControl>
        </form>
      </Stack>
    </Box>
  );
};

export default ChangeDisplayName;
