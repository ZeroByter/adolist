"use client";

import { useAuth } from "@/components/contexts/auth";
import { PERSONAL_SETTINGS_KEY } from "@/constants";
import getCollection from "@/utils/firestore";
import {
  Alert,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { ChangeEvent, FC, useEffect, useState } from "react";

const PersonalSettings: FC = () => {
  const { user, userSettings } = useAuth();

  const [taskCheckSfxChecked, setTaskCheckSfxChecked] =
    useState<boolean>(false);

  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    if (success != "") {
      const timeoutId = setTimeout(() => {
        setSuccess("");
      }, 6000);

      return () => clearTimeout(timeoutId);
    }
  }, [success]);

  useEffect(() => {
    if (userSettings) {
      setTaskCheckSfxChecked(userSettings.soundOnTaskCheck);
    }
  }, [userSettings]);

  const handleTaskCheckSfxChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      return;
    }

    setTaskCheckSfxChecked(e.target.checked);

    await setDoc(
      doc(getCollection("userSettings", user.uid), PERSONAL_SETTINGS_KEY),
      {
        soundOnTaskCheck: e.target.checked,
      },
      {
        merge: true,
      }
    );
  };

  return (
    <Box sx={{ p: 1 }}>
      <Stack spacing={1} alignItems="flex-start">
        <Typography sx={{ fontSize: 17 }}>Personal settings</Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={taskCheckSfxChecked}
                onChange={handleTaskCheckSfxChange}
              />
            }
            label="'Task check' sound effect?"
          />
        </FormGroup>
        {success && (
          <FormControl fullWidth margin="dense">
            <Alert severity="success">{success}</Alert>
          </FormControl>
        )}
      </Stack>
    </Box>
  );
};

export default PersonalSettings;
