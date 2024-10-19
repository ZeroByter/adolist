"use client";

import { useAuth } from "@/components/contexts/auth";
import { generateSubstrings } from "@/utils/essentials";
import getCollection from "@/utils/firestore";
import {
  Alert,
  Box,
  Button,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type FormData = {
  newDisplayName: string;
};

const ChangeDisplayName: FC = () => {
  const { user } = useAuth();

  const [success, setSuccess] = useState<string>("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      newDisplayName: "",
    },
  });

  useEffect(() => {
    if (success != "") {
      const timeoutId = setTimeout(() => {
        setSuccess("");
      }, 6000);

      return () => clearTimeout(timeoutId);
    }
  }, [success]);

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

    setSuccess("Successfully updated display name");
  });

  return (
    <Box sx={{ p: 1 }}>
      <form onSubmit={onSubmit}>
        <Stack spacing={1} alignItems="flex-start">
          <Typography sx={{ fontSize: 17 }}>Change display name</Typography>
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
              Change
            </Button>
          </FormControl>
          {success && (
            <FormControl fullWidth margin="dense">
              <Alert severity="success">{success}</Alert>
            </FormControl>
          )}
        </Stack>
      </form>
    </Box>
  );
};

export default ChangeDisplayName;
