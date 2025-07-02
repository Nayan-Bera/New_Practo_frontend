import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import type { IPrivateRouteProps } from "../types";
import { getUser } from "../utils/localStorage";

// For v6+, Route components are now element-based, not component-based
export const PrivateRoute: React.FC<IPrivateRouteProps> = () => {
  const auth = getUser();
  return auth ? <Outlet /> : <Navigate to="/signin" replace />;
};

export const PublicRoute: React.FC<IPrivateRouteProps> = () => {
  const auth = getUser();
  return auth ? <Navigate to="/host" replace /> : <Outlet />;
}; 