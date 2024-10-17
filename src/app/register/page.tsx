"use client";

import LayoutContainer from "@/components/layout/container";
import firebaseAuth from "@/utils/auth";
import getCollection from "@/utils/firestore";
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
import { doc, setDoc, Timestamp } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import css from "./register.module.scss";

const generateSubstrings = (str: string, minLength = 1) => {
  const substrings = [];
  for (let len = minLength; len <= str.length; len++) {
    for (let i = 0; i <= str.length - len; i++) {
      substrings.push(str.substring(i, i + len));
    }
  }
  return substrings;
};

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

    await setDoc(doc(getCollection("users"), newUser.user.uid), {
      displayName: data.displayName,
      searchableName: [
        ...new Set(generateSubstrings(data.displayName.toLowerCase())),
      ],
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
              rules={{ required: true, maxLength: 32 }}
              render={({ field }) => (
                <TextField
                  required
                  type="text"
                  label="Display name"
                  inputProps={{
                    maxLength: 32,
                  }}
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
