"use client";

import { useAuth } from "@/components/contexts/auth";
import firebaseAuth from "@/utils/auth";
import {
  Alert,
  Button,
  Container,
  FormControl,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

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
      await signInWithEmailAndPassword(firebaseAuth, data.email, data.password);
      router.push("/");
    } catch (e) {
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
    <Container style={{ marginTop: "20px" }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} lg={6}>
          <Paper variant="outlined" sx={{ width: "100%", p: 1 }}>
            <form onSubmit={onSubmit}>
              <Typography sx={{ fontSize: 18 }}>Login</Typography>
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
              <FormControl fullWidth margin="dense">
                <Stack gap={1} direction={"row"}>
                  <Button type="submit" variant="contained" color="success">
                    Login
                  </Button>
                  <Link href="/register">
                    <Button type="button" variant="contained">
                      Register
                    </Button>
                  </Link>
                  <Link href="/forgotPassword">
                    <Button type="button" variant="contained">
                      Forgot Password
                    </Button>
                  </Link>
                </Stack>
              </FormControl>
              {(error || errors.email?.message) && (
                <FormControl fullWidth margin="dense">
                  <Alert severity="error">
                    {error || errors.email?.message}
                  </Alert>
                </FormControl>
              )}
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;
