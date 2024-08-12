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

  const rootEl: HTMLElement = document.querySelector("#root")!;
  const rootLoadingEl: HTMLElement = document.querySelector(".root-loading")!;
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <CssBaseline />
      <Provider {...store}>
        <SnackbarProvider
          maxSnack={5}
          anchorOrigin={{ horizontal: "center", vertical: "top" }}
          autoHideDuration={2000}
        >
          <App />
        </SnackbarProvider>
      </Provider>
    </React.StrictMode>
  );

  // hide root loading
  rootLoadingEl.classList.add("root-hide");
  rootLoadingEl.onanimationend = () => {
    // remove root loading
    rootLoadingEl.classList.contains("root-hide") && rootLoadingEl.remove();
  };

  // show root
  rootEl.classList.add("root-show");
  rootEl.style.display = "";
  (window as unknown as Record<string, ()=>void>).stopCreateIntervalCircle();
}

bootstrap();
