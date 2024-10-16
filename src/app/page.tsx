"use client";

import Head from "next/head";
import { NextPage } from "next";
import { Container, Grid, Typography } from "@mui/material";
// import Board from "@/components/shared/board";
import Link from "next/link";
import { useAuth } from "@/components/contexts/auth";
import Board from "@/components/shared/board";
import { useUserBoards } from "@/components/contexts/userBoards";
import { ChangeEvent, useEffect, useState } from "react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import getCollection from "@/utils/firestore";

const Page: NextPage = () => {
  const { user } = useAuth();
  const { boards } = useUserBoards();

  const welcomeNewUser = () => {
    if (user) return;

    return (
      <Grid container>
        <Grid item xs={12}>
          <Typography align="center" fontSize={26}>
            Welcome to ADoList!
          </Typography>
          <Typography align="center">
            Please <Link href="/register">register</Link> a new account
          </Typography>
          <Typography align="center">
            Or <Link href="/login">login</Link> to an existing account
          </Typography>
        </Grid>
      </Grid>
    );
  };

  const renderCreateBoard = () => {
    if (!user) return;

    return (
      <Grid container justifyContent="center">
        <Grid item xs={10} lg={6}>
          <Board createBoard />
        </Grid>
      </Grid>
    );
  };

  const renderBoards = boards.map((board) => {
    return (
      <Grid key={board.id} item xs={12} lg={4}>
        <Board id={board.id} data={board.data()} />
      </Grid>
    );
  });

  return (
    <Container style={{ marginTop: "20px" }}>
      <Grid container>
        {welcomeNewUser()}
        {renderCreateBoard()}
        <Grid container>{renderBoards}</Grid>
      </Grid>
    </Container>
  );
};

export default Page;
