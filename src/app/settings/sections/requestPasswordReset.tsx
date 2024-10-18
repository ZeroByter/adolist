"use client";

import { useAuth } from "@/components/contexts/auth";
import firebaseAuth from "@/utils/auth";
import { generateSubstrings } from "@/utils/essentials";
import getCollection from "@/utils/firestore";
import { Box, Button, Typography } from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { FC } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  newDisplayName: string;
};

const RequestPasswordReset: FC = () => {
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

  const handleRequestPassswordRequestLink = () => {
    if (!user || !user.email) {
      return;
    }

    sendPasswordResetEmail(firebaseAuth, user.email);
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography sx={{ fontSize: 17 }}>
        Press the button below to send a password-reset link to your email.
      </Typography>
      <Button variant="contained" onClick={handleRequestPassswordRequestLink}>
        Request password reset
      </Button>
    </Box>
  );
};

export default RequestPasswordReset;
