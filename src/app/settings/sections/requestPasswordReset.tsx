"use client";

import { useAuth } from "@/components/contexts/auth";
import firebaseAuth from "@/utils/auth";
import { generateSubstrings } from "@/utils/essentials";
import getCollection from "@/utils/firestore";
import { Alert, Box, Button, FormControl, Typography } from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const censorString = (input: string) => {
  const censoredLength = Math.round(input.length / 1.25);
  const uncensoredParts = input.length - censoredLength;

  return (
    input.substring(0, uncensoredParts) +
    "***" +
    input.substring(input.length - uncensoredParts)
  );
};

const RequestPasswordReset: FC = () => {
  const { user } = useAuth();

  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    if (success != "") {
      const timeoutId = setTimeout(() => {
        setSuccess("");
      }, 6000);

      return () => clearTimeout(timeoutId);
    }
  }, [success]);

  const handleRequestPassswordRequestLink = async () => {
    if (!user || !user.email) {
      return;
    }

    await sendPasswordResetEmail(firebaseAuth, user.email);

    const emailAddressMatch = user.email.match(/(.+)(@\w+\.\w+)/);
    if (emailAddressMatch != null) {
      console.log(emailAddressMatch);

      setSuccess(
        `Successfully sent password request link to ${censorString(
          emailAddressMatch[1]
        )}${emailAddressMatch[2]}`
      );
    } else {
      setSuccess(`Successfully sent password request link`);
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography sx={{ fontSize: 17 }}>
        Press the button below to send a password-reset link to your email.
      </Typography>
      <Button variant="contained" onClick={handleRequestPassswordRequestLink}>
        Request password reset
      </Button>
      {success && (
        <FormControl fullWidth margin="dense">
          <Alert severity="success">{success}</Alert>
        </FormControl>
      )}
    </Box>
  );
};

export default RequestPasswordReset;
