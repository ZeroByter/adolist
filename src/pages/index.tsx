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
import TaskType from "@/types/client/board/task";
import UserType from "@/types/client/board/user";

const inter = Inter({ subsets: ["latin"] });

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getLoginSession(context.req);

  let id: string | null = null;
  let username: string | null = null;

  let boards: { [id: string]: BoardType } | undefined = undefined;
  let tasks: { [id: string]: TaskType } | undefined = undefined;
  let boardShares: { [id: string]: UserType } | undefined = undefined;

  if (session?.id != null) {
    const account = await UsersSQL.getById(session.id);

    id = account.id;
    username = account.username;

    const [rawBoards, rawTasks, rawShares] = await getBoardsForClient(
      session.id
    );

    boards = {};
    for (const board of rawBoards) {
      boards[board.id] = board as BoardType;
    }
    tasks = {};
    for (const task of rawTasks) {
      tasks[task.id] = task as TaskType;
    }
    boardShares = {};
    for (const share of rawShares) {
      boardShares[share.id] = share as UserType;
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
  } as { props: IndexProps };
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
