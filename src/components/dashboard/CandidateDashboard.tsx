import { AlertCircle, Camera, User as UserIcon } from "lucide-react";
import React from "react";
import { useGetUserAttendedExamsQuery, useGetUserUpcomingExamsQuery } from "../../redux/services/api/exam/get/getExamApi";
import type { IUser } from "../../types";
import { getUser } from "../../utils/localStorage";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Progress } from "../../components/ui/progress";

const CandidateDashboard: React.FC = () => {
  const { data: upcomingExams, isLoading: loadingUpcoming, error: errorUpcoming } = useGetUserUpcomingExamsQuery();
  const { data: attendedExams, isLoading: loadingAttended, error: errorAttended } = useGetUserAttendedExamsQuery();
  const userData = (getUser() && getUser() !== false) ? (getUser() as { user: IUser }).user : undefined;

  const nextExam = (upcomingExams && upcomingExams.length > 0) ? upcomingExams[0] : null;
  const recentResults = attendedExams ? attendedExams.slice(0, 3) : [];
  const totalExams = attendedExams ? attendedExams.length : 0;
  // Placeholder stats
  // const avgScore = ... // if available from answers

  // Profile completion logic
  const requiredFields: Array<keyof IUser> = [
    "name", "email", "education", "college", "university", "department", "course"
  ];
  const filledFields = requiredFields.filter(f => userData && userData[f]);
  const completion = Math.round((filledFields.length / requiredFields.length) * 100);
  const missingFields = requiredFields.filter(f => !(userData && userData[f]));
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Profile Section */}
      <Card className="p-6 flex flex-col md:flex-row items-center gap-6 mb-4 shadow-lg bg-gradient-to-br from-white to-indigo-50">
        <div className="relative flex flex-col items-center justify-center">
          {userData?.profilePicture ? (
            <img src={userData.profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-indigo-400 mb-2 shadow" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 mb-2 text-4xl shadow">
              {userData?.name ? userData.name[0].toUpperCase() : <UserIcon size={40} />}
            </div>
          )}
          {/* Edit Icon Overlay */}
          <button
            className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-1 shadow-lg border-2 border-white"
            title="Edit Profile Picture"
            onClick={() => window.location.href='/profile'}
            style={{ zIndex: 2 }}
          >
            <Camera size={18} />
          </button>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.href='/profile'}>Edit Profile</Button>
        </div>
        <div className="flex-1 w-full">
          <div className="text-lg font-semibold mb-1 text-indigo-700">{greeting()}, {userData?.name?.split(' ')[0] || 'Candidate'}!</div>
          <div className="text-2xl font-bold mb-1">{userData?.name}</div>
          <div className="text-gray-600 mb-1">{userData?.email}</div>
          <div className="flex flex-wrap gap-4 text-sm mb-2">
            <span><b>Education:</b> {userData?.education || <span className="text-red-500">Not set</span>}</span>
            <span><b>College:</b> {userData?.college || <span className="text-red-500">Not set</span>}</span>
            <span><b>University:</b> {userData?.university || <span className="text-red-500">Not set</span>}</span>
            <span><b>Department:</b> {userData?.department || <span className="text-red-500">Not set</span>}</span>
            <span><b>Course:</b> {userData?.course || <span className="text-red-500">Not set</span>}</span>
          </div>
          {/* Profile Completion Bar */}
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-xs text-gray-500">{completion}%</span>
            </div>
            <Progress value={completion} className="h-2 transition-all duration-700" />
            {completion < 100 && (
              <div className="mt-2 flex flex-col gap-1 text-yellow-700 bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded text-sm">
                <div className="flex items-center mb-1">
                  <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
                  Please complete your profile. Missing:
                </div>
                <ul className="list-disc list-inside ml-6">
                  {missingFields.map(f => (
                    <li key={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <span>Completed Exams: <b>{totalExams}</b></span>
        </div>
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