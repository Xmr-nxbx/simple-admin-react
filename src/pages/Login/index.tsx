import React, { useEffect } from "react";
import { Button } from "@mui/material";
import adminAxios from "@/utils/axios";

const LoginPage = () => {

  const request = () => {
    adminAxios.post('/login', { params: {b: 2}, data: {a: 1} }).then(res => {
      console.log(res);
    })
  }
  useEffect(() => {
    request();
  }, []);

  return (
    <>
      <h1>Login</h1>
      <Button variant="contained" onClick={request}>request</Button>
    </>
  );
};

export default LoginPage;
