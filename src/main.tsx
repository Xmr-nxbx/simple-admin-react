import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "mobx-react";
import store from "@/store";
import { CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";

import App from "@/App.tsx";
import "./index.scss";

import { setupMock } from "@/mock";

async function bootstrap() {
  // enable mock
  if ((import.meta.env.VITE_APP_USE_MOCK || "").startsWith("true")) {
    await setupMock();
  }

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <CssBaseline />
      <Provider {...store}>
        <SnackbarProvider maxSnack={5} anchorOrigin={{ horizontal: "center", vertical: 'top'}} autoHideDuration={2000}>
          <App />
        </SnackbarProvider>
      </Provider>
    </React.StrictMode>
  );
}


bootstrap();