import LayoutContainer from "@/components/layout/container";
import { Button, FormControl, Grid, TextField } from "@mui/material";
import Link from "next/link";

const LoginPage = () => {
  return (
    <>
      <LayoutContainer>
        <div>Login</div>
        <form>
          <FormControl required fullWidth margin="normal">
            <TextField required type="text" label="Username" />
          </FormControl>
          <FormControl required fullWidth margin="normal">
            <TextField required type="password" label="Password" />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <div>
              <Button variant="contained" color="success">
                Login
              </Button>
            </div>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <Link href="/register">
              <Button variant="contained">Register</Button>
            </Link>
          </FormControl>
        </form>
      </LayoutContainer>
    </>
  );
};

export default LoginPage;