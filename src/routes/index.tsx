import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CandidateDashboard from "../components/dashboard/CandidateDashboard";
import AdminDashboard from "../components/dashboard/AdminDashboard";
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

const AppRoutes: React.FC = () => {
  useEffect(() => {
    // Initialize socket connection if user is logged in
    const userObj = getUser();
    const currentUser = userObj ? userObj.user : undefined;
    if (currentUser && typeof currentUser === 'object' && 'token' in currentUser && currentUser.token) {
      initializeSocket();
    }
  }, []);

  return (
    <BrowserRouter>
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
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/joinexam" element={<AdminExamJoin />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/exam/edit" element={<EditExam />} />
            <Route path="/exam/result" element={<ViewResultAdmin />} />
          </Route>
          <Route element={<PrivateRoute allowedRoles={["candidate"]} />}>
            <Route path="/joinexam" element={<CandidateDashboard />} />
          </Route>

          {/* Feedback is public */}
          <Route path="/feedback" element={<Feedback />} />

          {/* Catch-all for 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default AppRoutes; 