import { useEffect, useState } from "react";
import { Button, Container, Box, TextField, IconButton } from "@mui/material";
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

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    adminAxios.post("/login", { data: { username, password } }).then((res) =>{
      console.log(res);
    });
  }

  return (
    <>
      <Container maxWidth="lg">
        <div className="login min-h-[100vh] h-full flex flex-col justify-between items-center">
          <div className="login-view flex-1 flex flex-col justify-center items-center">
            {/* login header */}
            <div className="login-header">
              <div
                className="login-title text-2xl sm:text-6xl
               flex justify-center items-center gap-4 text-gray-800 dark:text-gray-200"
              >
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
              <Box
                sx={{ width: "300px", display: "flex", alignItems: "flex-end" }}
              >
                <AccountCircleIcon
                  sx={{ color: "action.active", mr: 1, my: 0.5 }}
                />
                <TextField
                  id="username"
                  label="Username"
                  variant="standard"
                  sx={{ flex: 1 }}
                  placeholder="Admin"
                  value={username}
                  onChange={e => setUserName(e.target.value)}
                />
              </Box>
              <Box
                sx={{ width: "300px", display: "flex", alignItems: "flex-end" }}
              >
                <LockIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
                <TextField
                  id="password"
                  label="Password"
                  variant="standard"
                  type={showPassword ? "text" : "password"}
                  sx={{ flex: 1 }}
                  placeholder="123456"
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </Box>
              <Button variant="contained" sx={{ width: "300px" }} onClick={handleLogin}>
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
