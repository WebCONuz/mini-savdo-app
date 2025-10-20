import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Login from "../pages/auth/login";
import MainLayout from "../layout";
import Home from "../pages/home";

function PrivateOutlet() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

const routes = createBrowserRouter([
  {
    element: <PrivateOutlet />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { path: "/", element: <Navigate to="/dashboard" replace /> },
          { path: "/dashboard", element: <Home /> },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default routes;
