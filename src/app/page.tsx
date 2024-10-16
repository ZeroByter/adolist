"use client";

import Head from "next/head";
import { NextPage } from "next";
import { Container, Grid, Typography } from "@mui/material";
// import Board from "@/components/shared/board";
import Link from "next/link";
import { useAuthFetcher } from "@/components/contexts/auth";
import Board from "@/components/shared/board";

const Page: NextPage = () => {
  const { user } = useAuthFetcher();

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

  const boards = {};

  const renderBoards = Object.values(boards ?? {}).map((board: any) => {
    return (
      <Grid key={board.id} item xs={12} lg={4}>
        {/* <Board data={board} /> */}
      </Grid>
    );
  });

  return (
    <>
      <Head>
        <title>ADoList</title>
        <meta name="description" content="Live, shareable to-do lists!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container style={{ marginTop: "20px" }}>
        <Grid container>
          {welcomeNewUser()}
          {renderCreateBoard()}
          <Grid container>{renderBoards}</Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Page;
