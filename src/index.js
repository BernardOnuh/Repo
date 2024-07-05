import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Ref from "./pages/Ref";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import ErrorCom from "./Components/ErrorCom";
import Stats from "./pages/Stats";
import TapHome from "./pages/TapHome";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorCom />,
    children:[
      {
        path:"/",
        element: <TapHome />,
      },
      {
        path:"/ref",
        element: <Ref />,
      },
      {
        path:"/stats",
        element: <Stats />,
      },
    ]

  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
