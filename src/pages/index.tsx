import Head from "next/head";
import { Inter } from "next/font/google";
import { GetServerSideProps, NextPage } from "next";
import { getLoginSession } from "@/serverlib/auth";
import UsersSQL from "@/serverlib/sql-classes/users";
import BoardsSQL from "@/serverlib/sql-classes/boards";
import { Container, Grid, Typography } from "@mui/material";
import Board from "@/components/shared/board";
import BoardType from "@/types/client/board/board";
import TasksSQL from "@/serverlib/sql-classes/tasks";
import { useSSRFetcher } from "@/components/contexts/ssrFetcher";
import IndexProps, { IndexPropsType } from "@/types/indexProps";
import { useSocket } from "@/components/contexts/socket";
import { useCallback, useEffect, useMemo } from "react";
import BoardSharesSQL from "@/serverlib/sql-classes/boardshares";
import { getBoardsForClient } from "@/serverlib/essentials";
import createListeners from "@/clientlib/pages/index/socketListeners";
import Link from "next/link";
import UserType from "@/types/client/board/user";
import TaskType from "@/types/client/board/task";

const inter = Inter({ subsets: ["latin"] });

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getLoginSession(context.req);

  let id: string | null = null;
  let username: string | null = null;

  let boards: { [id: string]: BoardType } = {};
  let tasks: { [id: string]: TaskType } = {};
  let boardShares: { [id: string]: UserType } = {};

  if (session?.id != null) {
    const account = await UsersSQL.getById(session.id);

    id = account.id;
    username = account.username;
    const { boardsResult, tasksResult, sharesResult } =
      await getBoardsForClient(session.id);

    for (const board of boardsResult) {
      boards[board.id] = board;
    }
    for (const task of tasksResult) {
      tasks[task.id] = task;
    }
    for (const share of sharesResult) {
      boardShares[share.id] = share;
    }
  }

  return {
    props: {
      id,
      username,

      boards,
      tasks,
      boardShares,
    },
  };
};

const Page: NextPage<IndexProps> = () => {
  const { socket } = useSocket();
  const { props, setProps }: IndexPropsType = useSSRFetcher();
  const { boards } = props;

  const memoizedCreateListeners = useMemo(
    () => createListeners(socket, props, setProps),
    [socket, props, setProps]
  );

  useEffect(memoizedCreateListeners, [memoizedCreateListeners]);

  const welcomeNewUser = () => {
    if (props.id) return;

    return (
      <Grid container justifyContent="center">
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
    if (!props.id) return;

    return (
      <Grid container justifyContent="center">
        <Grid item xs={10} lg={6}>
          <Board createBoard />
        </Grid>
      </Grid>
    );
  };

  const renderBoards = Object.values(boards ?? {}).map((board) => {
    return (
      <Grid key={board.id} item xs={12} lg={4}>
        <Board data={board} />
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
