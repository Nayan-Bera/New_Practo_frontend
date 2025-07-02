import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute, PublicRoute } from "./PrivateRoute";
import SignUp from "../page/SignUp";
import SignIn from "../page/SignIn";
import Host from "../page/Host";
import Preloader from "../utils/Preloader";
import Exam from "../page/Exam";
import EditExam from "../page/EditExam";
import ExamJoin from "../page/ExamJoin";
import ViewResultHost from "../page/ViewResultHost";
import CandidateResult from "../page/CandidateResult";
import HostExamJoin from "../page/HostExamJoin";
import PageNotFound from "../page/PageNotFound";
import Feedback from "../page/Feedback";
import { initializeSocket } from "../utils/socket";
import { getUser } from "../utils/localStorage";

const AppRoutes: React.FC = () => {
  useEffect(() => {
    // Initialize socket connection if user is logged in
    const userData = getUser();
    if (userData && typeof userData === 'object' && 'token' in userData && userData.token) {
      initializeSocket();
    }
  }, []);

  return (
    <BrowserRouter>
      <Preloader />
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/host" replace />} />

        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Route>

        {/* Private routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/host" element={<Host />} />
          <Route path="/joinexam" element={<ExamJoin />} />
          <Route path="/host/joinexam" element={<HostExamJoin />} />
          <Route path="/exam" element={<Exam />} />
          <Route path="/exam/edit" element={<EditExam />} />
          <Route path="/exam/result" element={<ViewResultHost />} />
          <Route path="/candidate/result" element={<CandidateResult />} />
        </Route>

        {/* Feedback is public */}
        <Route path="/feedback" element={<Feedback />} />

        {/* Catch-all for 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes; 