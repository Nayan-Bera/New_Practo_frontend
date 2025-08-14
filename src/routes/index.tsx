import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../components/headerfooter";
import EditExam from "../page/EditExam";
import Exam from "../page/Exam";
import Feedback from "../page/Feedback";
import AdminExamJoin from "../page/AdminExamJoin";
import Landing from "../page/Landing";
import PageNotFound from "../page/PageNotFound";
import SignIn from "../page/SignIn";
import SignUp from "../page/SignUp";
import ViewResultAdmin from "../page/ViewResultAdmin";
import { getUser } from "../utils/localStorage";
import Preloader from "../utils/Preloader";
import { initializeSocket } from "../utils/socket";
import { PrivateRoute, PublicRoute } from "./PrivateRoute";
import { Toaster } from "sonner";
import ProfilePage from "../components/pages/profile";
import CandidateResult from "../page/CandidateResult";
import CandidateDashboard from "@/components/dashboard/candidate/CandidateDashboard";
import SuperAdminDashboard from "@/components/dashboard/superadmin/SuperAdminDashboard";
import CandidateLayout from "@/layouts/candidateLayout";
import Settings from "@/page/users/settings/settings";
import CandidateExam from "@/page/user/CandidateExam";
import AdminExam from "@/page/admin/AdminExam";

const AppRoutes: React.FC = () => {
  useEffect(() => {
    // Initialize socket connection if user is logged in
    const userObj = getUser();
    const currentUser = userObj ? userObj.user : undefined;
    if (
      currentUser &&
      typeof currentUser === "object" &&
      "token" in currentUser &&
      currentUser.token
    ) {
      initializeSocket();
    }
  }, []);

  return (
    <BrowserRouter>
      <Toaster />
      <Preloader />
      <Layout>
        <Routes>
          {/* Landing page - public */}
          <Route path="/" element={<Landing />} />
          {/* Public routes */}
          <Route element={<PublicRoute />}>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
          </Route>
          {/* Private routes */}
          <Route element={<PrivateRoute allowedRoles={["candidate", "admin"]} />}>
            <Route path="/admin" element={<SuperAdminDashboard />} />
            <Route path="/admin/joinexam" element={<AdminExamJoin />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/exam/edit" element={<EditExam />} />
            <Route path="/exam/result" element={<ViewResultAdmin />} />
          </Route>
          <Route element={<PrivateRoute allowedRoles={["candidate"]} />}>
            <Route path="/dashboard" element={<CandidateDashboard />} />
            <Route path="/result" element={<CandidateResult />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          {/* Feedback is public */}
          <Route path="/feedback" element={<Feedback />} />
          {/* Profile route */}
          <Route
            element={<PrivateRoute allowedRoles={["admin", "candidate"]} />}
          >
            <Route
              path="/profile"
              element={
                <CandidateLayout>
                  <ProfilePage />
                </CandidateLayout>
              }
            />
          </Route>
          <Route element={<PrivateRoute allowedRoles={["candidate"]} />}>
            <Route path="/exam" element={<CandidateExam />} />
          </Route>
          // Admin exam route
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/exam" element={<AdminExam />} />
          </Route>
          {/* Catch-all for 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default AppRoutes;
