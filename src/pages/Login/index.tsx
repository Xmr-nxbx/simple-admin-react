import { useEffect, useState } from "react";
import {
  Button,
  Container,
  FormControl,
  Input,
  InputLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import adminAxios from "@/utils/axios";

import Footer from "@/components/Footer";

const LoginPage = () => {
  const titleInfo = {
    title: import.meta.env.VITE_APP_TITLE,
    logo: import.meta.env.VITE_APP_LOGO,
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const request = () => {
    adminAxios
      .post("/login", { params: { b: 2 }, data: { a: 1 } })
      .then((res) => {
        console.log(res);
      });
  };
  useEffect(() => {
    request();
  }, []);

  return (
    <>
      <Container maxWidth="lg">
        <div className="login min-h-[100vh] h-full flex flex-col justify-between items-center">
          <div className="login-view flex-1 flex flex-col justify-center items-center">
            {/* login header */}
            <div className="login-header">
              <div className="login-title text-2xl sm:text-6xl
               flex justify-center items-center gap-4 text-gray-800 dark:text-gray-200">
                <img
                  className="w-[75px] h-[75px]"
                  src={titleInfo.logo}
                  alt={titleInfo.title}
                />
                <h1>{titleInfo.title}</h1>
              </div>
              <div className="login-desc mt-1 text-gray-500 dark:text-gray-400 text-center">
                {titleInfo.title} has a little influence of the web management
                system in Shijingshan District of Beijing.
              </div>
            </div>
            {/* login form */}
            <form className="login-form mt-10 flex flex-col gap-4">
              <FormControl variant="standard" sx={{ width: "300px" }}>
                <InputLabel htmlFor="login-username">Username</InputLabel>
                <Input
                  id="login-username"
                  startAdornment={
                    <InputAdornment position="start">
                      <AccountCircleIcon />
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl variant="standard" sx={{ width: "300px" }}>
                <InputLabel htmlFor="login-password">Password</InputLabel>
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  startAdornment={
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={(event) => event.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <Button variant="contained">
                <span className="text-white">Login</span>
              </Button>
            </form>
          </div>

          <div className="footer-container mt-10 mb-3">
            <Footer />
          </div>
        </div>
      </Container>
    </>
  );
};

export default LoginPage;
