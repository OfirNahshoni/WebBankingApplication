import React from "react";
import { createBrowserRouter, Navigate, RouterProviderProps, useLocation } from "react-router-dom";

import LoginPage from "../pages/Login";
import SignupPage from "../pages/Signup";
import DashboardPage from "../pages/Dashboard";
import TransferPage from "../pages/Transfer";
import WithdrawPage from "../pages/Withdraw";
import DepositPage from "../pages/Deposit";
import { getToken } from "../lib/storage";

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const location = useLocation();
  const token = getToken();

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <DashboardPage />
      </RequireAuth>
    ),
  },
  {
    path: "/transfer",
    element: (
      <RequireAuth>
        <TransferPage />
      </RequireAuth>
    ),
  },
  {
    path: "/withdraw",
    element: (
      <RequireAuth>
        <WithdrawPage />
      </RequireAuth>
    ),
  },
  {
    path: "/deposit",
    element: (
      <RequireAuth>
        <DepositPage />
      </RequireAuth>
    ),
  },
]);

export type AppRouter = typeof router;
export type RouterProviderOptions = RouterProviderProps;

export default router;
