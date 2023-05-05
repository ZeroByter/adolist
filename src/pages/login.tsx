import Router from "next/router";
import { useState } from "react";
import LayoutContainer from "@/components/layout/container";
import {
  Alert,
  Button,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import css from "./login.module.scss";
import { Controller, useForm } from "react-hook-form";
import { useSocket } from "@/components/contexts/socket";

type FormData = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const { socket } = useSocket();
  const { control, handleSubmit } = useForm<FormData>();

  const [error, setError] = useState("");

  const onSubmit = handleSubmit(async (data) => {
    if (!socket) {
      return;
    }

    socket.once("apiResponse", async (response) => {
      if (!response.error) {
        await fetch("/api/setCookie", {
          headers: {},
          body: JSON.stringify(data),
          method: "POST",
        });

        Router.push("/");
      } else {
        setError(response.error);
      }
    });

    socket.emit("login", data);
  });

  return (
    <>
      <LayoutContainer className={css.root}>
        <Typography>Login</Typography>
        <form onSubmit={onSubmit}>
          <FormControl required fullWidth margin="normal">
            <Controller
              name="username"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField required type="text" label="Username" {...field} />
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
          {error && (
            <FormControl fullWidth margin="normal">
              <Alert severity="error">{error}</Alert>
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
