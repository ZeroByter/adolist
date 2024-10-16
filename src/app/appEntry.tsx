"use client";

import AuthContextProvider from "@/components/contexts/auth";
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
        <NavBar />
        {children}
      </AuthContextProvider>
    </ThemeProvider>
  );
};

export default AppEntry;
