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
      return "/dashboard";
    case "admin":
      return "/admin";
    default:
      return "/";
  }
};

// Helper: check if candidate profile is complete
const isCandidateProfileComplete = (user: any) => {
  if (user.type !== 'candidate') return true;
  return Boolean(
    user.name &&
    user.email &&
    user.education &&
    user.college &&
    user.university &&
    user.department &&
    user.course
  );
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
  // Candidate profile completeness check
  if (auth.user?.type === 'candidate' && !isCandidateProfileComplete(auth.user)) {
    // (Removed auto-redirect to /profile)
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