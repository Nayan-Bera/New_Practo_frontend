import { Calendar, CheckCircle, Edit2, User as UserIcon } from "lucide-react";
import React from "react";
import { useGetUserAttendedExamsQuery, useGetUserUpcomingExamsQuery } from "../../redux/services/api/exam/get/getExamApi";
import type { IUser } from "../../types";
import { getUser } from "../../utils/localStorage";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

const CandidateDashboard: React.FC = () => {
  const { data: upcomingExams, isLoading: loadingUpcoming, error: errorUpcoming } = useGetUserUpcomingExamsQuery();
  const { data: attendedExams, isLoading: loadingAttended, error: errorAttended } = useGetUserAttendedExamsQuery();
  const userData = (getUser() && getUser() !== false) ? (getUser() as { user: IUser }).user : undefined;

  const nextExam = (upcomingExams && upcomingExams.length > 0) ? upcomingExams[0] : null;
  const recentResults = attendedExams ? attendedExams.slice(0, 3) : [];
  const totalExams = attendedExams ? attendedExams.length : 0;
  // Placeholder stats
  const completedExams = totalExams; // No status field, so just use total
  // const avgScore = ... // if available from answers

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Candidate Details */}
      <Card className="p-6 flex items-center gap-6 mb-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 text-2xl font-bold">
          {userData?.name ? userData.name[0].toUpperCase() : <UserIcon size={32} />}
        </div>
        <div className="flex-1">
          <div className="text-xl font-semibold">{userData?.name}</div>
          <div className="text-gray-500">{userData?.email}</div>
          <div className="flex gap-4 mt-2 text-sm">
            <span className="flex items-center gap-1"><Calendar size={16} /> Exams Taken: <b>{totalExams}</b></span>
            <span className="flex items-center gap-1 text-green-600"><CheckCircle size={16} /> Completed: <b>{completedExams}</b></span>
          </div>
        </div>
        <Button variant="outline" size="icon" onClick={() => window.location.href='/profile'} title="Edit Profile">
          <Edit2 size={18} />
        </Button>
      </Card>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Next Exam */}
        <Card className="p-6 flex flex-col items-center">
          <span className="text-lg font-semibold mb-2">Next Exam</span>
          <span className="text-2xl font-bold">
            {loadingUpcoming ? '...' : (nextExam ? nextExam.title : 'No upcoming exam')}
          </span>
          <span className="text-gray-500">
            {loadingUpcoming ? '' : (nextExam ? new Date(nextExam.startingtime).toLocaleString() : '')}
          </span>
          {nextExam && <Button className="mt-4" variant="default" onClick={() => window.location.href='/joinexam'}>Join Exam</Button>}
        </Card>
        {/* Recent Results */}
        <Card className="p-6 w-full">
          <span className="text-lg font-semibold mb-2 block">Recent Results</span>
          <ul className="divide-y divide-gray-200">
            {loadingAttended ? (
              <li className="py-2 text-gray-400">Loading...</li>
            ) : recentResults.length === 0 ? (
              <li className="py-2 text-gray-400">No recent results</li>
            ) : recentResults.map((exam, idx) => (
              <li key={idx} className="flex items-center justify-between py-2">
                <div>
                  <span className="font-medium">{exam.title}</span>
                  <span className="ml-2 text-xs text-gray-400">{new Date(exam.startingtime).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-semibold">Completed</span>
                  <Button size="sm" variant="outline" onClick={() => window.location.href='/candidate/result'}>View</Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Chart placeholder */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Performance Over Time</h2>
        <div className="h-32 flex items-center justify-center text-gray-400">[Chart Coming Soon]</div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default" onClick={() => window.location.href='/exam'}>View All Exams</Button>
            <Button variant="outline" onClick={() => window.location.href='/candidate/result'}>View Results</Button>
            <Button variant="outline" onClick={() => window.location.href='/profile'}>Edit Profile</Button>
          </div>
        </Card>
      </div>

      {/* Error Handling */}
      {((typeof errorUpcoming === 'string' || errorUpcoming instanceof Error) ||
        (typeof errorAttended === 'string' || errorAttended instanceof Error)) && (
        <div className="text-red-500 mt-4">Error loading dashboard data.</div>
      )}
    </div>
  );
};

export default CandidateDashboard; 