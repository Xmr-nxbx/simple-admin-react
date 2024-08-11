import { observer } from "mobx-react";
import systemStore from "@/store/system";

import { RouterProvider } from "react-router-dom";
import Router from "@/router/index";

import useAdminSnackbar from "@/hooks/useAdminSnackbar";

import "./App.scss";

const App = observer(() => {
  // snackBar
  useAdminSnackbar(systemStore);

  return (<RouterProvider router={Router}></RouterProvider>);
});

export default App;
