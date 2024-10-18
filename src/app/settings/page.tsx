"use client";

import { useAuth } from "@/components/contexts/auth";
import firebaseAuth from "@/utils/auth";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ChangeDisplayName from "./sections/changeDisplayName";
import RequestPasswordReset from "./sections/requestPasswordReset";

const MainContainer = styled(Paper)(({ theme }) => ({
  width: "100%",
}));

const SettingsPage: NextPage = () => {
  const router = useRouter();
  const { user, userLoaded } = useAuth();

  useEffect(() => {
    if (userLoaded && !user) {
      router.push("/");
    }
  }, [router, user, userLoaded]);

  return (
    <Container style={{ marginTop: "20px" }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} lg={6}>
          <MainContainer variant="outlined">
            <Box sx={{ p: 1 }}>
              <Typography sx={{ fontSize: 20 }}>User Settings</Typography>
            </Box>
            <Divider />
            <ChangeDisplayName />
            <Divider />
            <RequestPasswordReset />
          </MainContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SettingsPage;
