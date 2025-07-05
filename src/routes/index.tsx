import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../components/headerfooter";
import CandidateResult from "../page/CandidateResult";
import EditExam from "../page/EditExam";
import Exam from "../page/Exam";
import ExamJoin from "../page/ExamJoin";
import Feedback from "../page/Feedback";
import Host from "../page/Host";
import HostExamJoin from "../page/HostExamJoin";
import Landing from "../page/Landing";
import PageNotFound from "../page/PageNotFound";
import SignIn from "../page/SignIn";
import SignUp from "../page/SignUp";
import ViewResultHost from "../page/ViewResultHost";
import { getUser } from "../utils/localStorage";
import Preloader from "../utils/Preloader";
import { initializeSocket } from "../utils/socket";
import { PrivateRoute, PublicRoute } from "./PrivateRoute";

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
      </Layout>
    </BrowserRouter>
  );
};

export default AppRoutes; 