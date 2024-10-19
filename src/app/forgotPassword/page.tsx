"use client";

import LayoutContainer from "@/components/layout/container";
import firebaseAuth from "@/utils/auth";
import {
  Alert,
  Button,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  validatePassword,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import css from "./forgotPassword.module.scss";
import { FirebaseError } from "firebase/app";
import { useAuth } from "@/components/contexts/auth";

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();
  const { userLoaded, user } = useAuth();

  useEffect(() => {
    if (userLoaded && user) {
      router.push("/");
    }
  }, [router, user, userLoaded]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setError("");
      await sendPasswordResetEmail(firebaseAuth, data.email);
      setSuccess("Successfully sent password request link");
    } catch (e) {
      setSuccess("");

      if (e instanceof FirebaseError) {
        if (e.code == "auth/invalid-credential") {
          setError("Invalid login credentials");
        } else {
          setError("");
        }
      }
    }
  });

  return (
    <>
      <LayoutContainer className={css.root}>
        <Typography>Forgot password</Typography>
        <form onSubmit={onSubmit}>
          <Stack>
            <FormControl required fullWidth margin="normal">
              <Controller
                name="email"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <TextField required type="email" label="Email" {...field} />
                )}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Stack gap={1} direction={"row"}>
                <Button type="submit" variant="contained" color="success">
                  Request reset link
                </Button>
              </Stack>
            </FormControl>
            {success && (
              <FormControl fullWidth margin="normal">
                <Alert severity="success">{success}</Alert>
              </FormControl>
            )}
            {(error || errors.email?.message) && (
              <FormControl fullWidth margin="normal">
                <Alert severity="error">{error || errors.email?.message}</Alert>
              </FormControl>
            )}
          </Stack>
        </form>
      </LayoutContainer>
    </>
  );
};

export default LoginPage;
