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
  signInWithEmailAndPassword,
  validatePassword,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import css from "./login.module.scss";

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();
  const [error, setError] = useState("");

  const onSubmit = handleSubmit(async (data) => {
    await signInWithEmailAndPassword(firebaseAuth, data.email, data.password);
    router.push("/");
  });

  return (
    <>
      <LayoutContainer className={css.root}>
        <Typography>Login</Typography>
        <form onSubmit={onSubmit}>
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
          {(error || errors.email?.message) && (
            <FormControl fullWidth margin="normal">
              <Alert severity="error">{error || errors.email?.message}</Alert>
            </FormControl>
          )}
          <FormControl fullWidth margin="normal">
            <div className={css.buttons}>
              <Button type="submit" variant="contained" color="success">
                Login
              </Button>
              <Link href="/register">
                <Button type="button" variant="contained">
                  Register
                </Button>
              </Link>
            </div>
          </FormControl>
        </form>
      </LayoutContainer>
    </>
  );
};

export default LoginPage;
