"use client";

import LayoutContainer from "@/components/layout/container";
import firebaseAuth from "@/utils/auth";
import {
  Alert,
  Button,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import {
  createUserWithEmailAndPassword,
  validatePassword,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import css from "./register.module.scss";
import { addDoc, doc, setDoc, Timestamp } from "firebase/firestore";
import getCollection from "@/utils/firestore";

type FormData = {
  email: string;
  password: string;
  displayName: string;
};

const RegisterPage = () => {
  const { control, handleSubmit } = useForm<FormData>();
  const router = useRouter();
  const [error, setError] = useState("");

  const onSubmit = handleSubmit(async (data) => {
    const passwordValidation = await validatePassword(
      firebaseAuth,
      data.password
    );
    if (!passwordValidation.isValid) {
      if (passwordValidation.meetsMinPasswordLength !== true) {
        setError(
          `Password is too short (must be atleast ${passwordValidation.passwordPolicy.customStrengthOptions.minPasswordLength} characters)`
        );
      }
      return;
    }

    const newUser = await createUserWithEmailAndPassword(
      firebaseAuth,
      data.email,
      data.password
    );

    setDoc(doc(getCollection("users"), newUser.user.uid), {
      displayName: data.displayName,
      searchableName: data.displayName.toLowerCase().split(""),
      timeCreated: Timestamp.now(),
    });

    router.push("/");
  });

  return (
    <>
      <LayoutContainer className={css.root}>
        <Typography>Register</Typography>
        <form onSubmit={onSubmit}>
          <FormControl required fullWidth margin="normal">
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField required type="email" label="Email" {...field} />
              )}
            />
          </FormControl>
          <FormControl required fullWidth margin="normal">
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  required
                  type="password"
                  label="Password"
                  {...field}
                />
              )}
            />
          </FormControl>
          <FormControl required fullWidth margin="normal">
            <Controller
              name="displayName"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  required
                  type="text"
                  label="Display name"
                  {...field}
                />
              )}
            />
          </FormControl>
          {error && (
            <FormControl fullWidth margin="normal">
              <Alert severity="error">{error}</Alert>
            </FormControl>
          )}
          <FormControl fullWidth margin="normal">
            <div className={css.buttons}>
              <Button type="submit" variant="contained" color="success">
                Register
              </Button>
              <Link href="/login">
                <Button type="button" variant="contained">
                  Login
                </Button>
              </Link>
            </div>
          </FormControl>
        </form>
      </LayoutContainer>
    </>
  );
};

export default RegisterPage;
