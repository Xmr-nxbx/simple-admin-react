import { observer, inject } from "mobx-react";
import { SystemStore } from "@/store/system";

import { RouterProvider } from "react-router-dom";
import Router from "@/router/index";

import useAdminSnackbar from "@/hooks/useAdminSnackbar";

import "./App.scss";

const App: React.FC<{ systemStore: SystemStore }> = inject("systemStore")(
  observer(({ systemStore }) => {
    // snackBar
    useAdminSnackbar(systemStore);
    
    return <RouterProvider router={Router}></RouterProvider>;
  })
);

export default App;
