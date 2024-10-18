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
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import css from "./register.module.scss";
import { FirebaseError } from "firebase/app";
import { useAuth } from "@/components/contexts/auth";
import { generateSubstrings } from "@/utils/essentials";

type FormData = {
  email: string;
  password: string;
  displayName: string;
};

const RegisterPage = () => {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      displayName: "",
    },
  });
  const [error, setError] = useState("");

  const router = useRouter();
  const { userLoaded, user } = useAuth();

  useEffect(() => {
    if (userLoaded && user) {
      router.push("/");
    }
  }, [router, user, userLoaded]);

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

    if (data.displayName.length > 32) {
      setError("Display name must be under 32 characters");
      return;
    }

    try {
      setError("");

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
    } catch (e) {
      if (e instanceof FirebaseError) {
        if (e.code == "auth/email-already-in-use") {
          setError("Email already taken, please choose another");
        } else {
          setError("");
        }
      }
    }
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
