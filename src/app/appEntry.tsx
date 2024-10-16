"use client";

import AuthContextProvider from "@/components/contexts/auth";
import UserBoardsContextProvider from "@/components/contexts/userBoards";
import NavBar from "@/components/shared/navbar";
import { createTheme, ThemeProvider } from "@mui/material";
import { FC, ReactNode } from "react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

type Props = {
  children: ReactNode;
};

const AppEntry: FC<Props> = ({ children }) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <AuthContextProvider>
        <UserBoardsContextProvider>
          <NavBar />
          {children}
        </UserBoardsContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  );
};

export default AppEntry;
