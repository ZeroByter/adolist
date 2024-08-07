import { IndexPropsType } from "@/types/indexProps";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { useSSRFetcher } from "../contexts/ssrFetcher";
import Link from "next/link";
import css from "./navbar.module.scss";
import MenuIcon from "@mui/icons-material/Menu";

const DRAWER_WIDTH = 240;

const NavBar: FC = () => {
  const { props }: IndexPropsType = useSSRFetcher();

  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => {
    setMobileOpen((oldState) => !oldState);
  };

  const renderButtons = () => {
    return (
      <>
        {props.id &&
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Link href="/api/logout">
              <Button color="inherit">Logout</Button>
            </Link>
          </Box>
        }
        {!props.id &&
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Link href="/register">
              <Button color="inherit">Register</Button>
            </Link>
            <Link href="/login">
              <Button color="inherit">Login</Button>
            </Link>
          </Box>
        }
      </>
    )
  };

  const drawer = (
    <Box onClick={toggleMobile} sx={{ textAlign: "center" }}>
      <Link href="/">
        <Typography variant="h6" sx={{ my: 2 }}>
          ADoList
        </Typography>
      </Link>
      <Divider />
      {props.id && (
        <>
          <List>
            <Link href="/api/logout">
              <ListItem disablePadding>
                <ListItemButton sx={{ textAlign: "center" }}>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </Link>
          </List>
          <Divider />
        </>
      )}
      {!props.id && (
        <>
          <List>
            <Link href="/register">
              <ListItem disablePadding>
                <ListItemButton sx={{ textAlign: "center" }}>
                  <ListItemText primary="Register" />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link href="/login">
              <ListItem disablePadding>
                <ListItemButton sx={{ textAlign: "center" }}>
                  <ListItemText primary="Login" />
                </ListItemButton>
              </ListItem>
            </Link>
          </List>
          <Divider />
        </>
      )}
      <List>
        <Link href="https://trello.com/b/uAM4F8fI/adolist" target="_blank">
          <ListItem disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary="Trello" />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link href="https://github.com/ZeroByter/adolist" target="_blank">
          <ListItem disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary="GitHub" />
            </ListItemButton>
          </ListItem>
        </Link>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" className={css.root}>
        <Container>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleMobile}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              <Link href="/">ADoList</Link>
            </Typography>
            {renderButtons()}
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Link
                href="https://trello.com/b/uAM4F8fI/adolist"
                target="_blank"
              >
                <Button color="inherit">Trello</Button>
              </Link>
              <Link href="https://github.com/ZeroByter/adolist" target="_blank">
                <Button color="inherit">GitHub</Button>
              </Link>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="nav">
        <Drawer
          className={css.root}
          variant="temporary"
          open={mobileOpen}
          onClose={toggleMobile}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default NavBar;
