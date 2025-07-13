import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { IPrivateRouteProps } from "../types";
import { getUser } from "../utils/localStorage";

// Utility: map roles to their default dashboard route
const getDashboardRoute = (role?: string) => {
  switch (role) {
    case "host":
      return "/host";
    case "candidate":
      return "/joinexam";
    default:
      return "/";
  }
};

// PrivateRoute: accepts allowedRoles prop (array of roles)
export const PrivateRoute: React.FC<IPrivateRouteProps & { allowedRoles?: string[] }> = ({ allowedRoles }) => {
  const auth = getUser();
  const location = useLocation();
  if (!auth) return <Navigate to="/signin" replace state={{ from: location }} />;
  if (allowedRoles && !allowedRoles.includes(auth.user?.type)) {
    // User is logged in but not allowed for this route
    return <Navigate to={getDashboardRoute(auth.user?.type)} replace />;
  }
  return <Outlet />;
};

// PublicRoute: redirect to correct dashboard for logged-in user
export const PublicRoute: React.FC<IPrivateRouteProps> = () => {
  const auth = getUser();
  if (auth) {
    return <Navigate to={getDashboardRoute(auth.user?.type)} replace />;
  }
  return <Outlet />;
}; 