import React from "react";
import { CalendarDays, Users, Activity, PlusCircle, ListOrdered, BarChart2, Clock } from "lucide-react";
import { useGetAdminPastExamsQuery, useGetAdminUpcomingExamsQuery, useGetUserListQuery } from "@/redux/services/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const adminDashboard: React.FC = () => {
  const { data: upcomingExams, isLoading: loadingUpcoming, error: errorUpcoming } = useGetAdminUpcomingExamsQuery();
  const { data: pastExams, isLoading: loadingPast, error: errorPast } = useGetAdminPastExamsQuery();
  const { data: userList, isLoading: loadingUsers, error: errorUsers } = useGetUserListQuery();

  const activeExams = (upcomingExams || []).filter(e => new Date(e.startingtime) <= new Date());

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-primary flex items-center gap-3">
        <BarChart2 className="w-8 h-8 text-blue-600" /> Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 flex flex-col items-center bg-blue-50 shadow-md rounded-xl">
          <CalendarDays className="w-8 h-8 text-blue-500 mb-2" />
          <span className="text-2xl font-semibold text-blue-700">
            {loadingUpcoming ? '...' : (upcomingExams ? upcomingExams.length : 0)}
          </span>
          <span className="text-gray-600 font-medium">Upcoming Exams</span>
        </Card>
        <Card className="p-6 flex flex-col items-center bg-green-50 shadow-md rounded-xl">
          <Users className="w-8 h-8 text-green-500 mb-2" />
          <span className="text-2xl font-semibold text-green-700">
            {loadingUsers ? '...' : (userList ? userList.length : 0)}
          </span>
          <span className="text-gray-600 font-medium">Total Candidates</span>
        </Card>
        <Card className="p-6 flex flex-col items-center bg-yellow-50 shadow-md rounded-xl">
          <Activity className="w-8 h-8 text-yellow-500 mb-2" />
          <span className="text-2xl font-semibold text-yellow-700">
            {loadingUpcoming ? '...' : activeExams.length}
          </span>
          <span className="text-gray-600 font-medium">Active Exams</span>
        </Card>
      </div>
      {/* Chart placeholder */}
      <Card className="p-6 mb-8 bg-white shadow rounded-xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
          <BarChart2 className="w-5 h-5 text-blue-500" /> Exam Participation Over Time
        </h2>
        <div className="h-32 flex items-center justify-center text-gray-400 animate-pulse">
          <BarChart2 className="w-10 h-10 mr-2 text-blue-200" />
          <span>Chart Coming Soon</span>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <PlusCircle className="w-5 h-5 text-green-500" /> Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow" onClick={() => window.location.href='/exam/edit'}>
              <PlusCircle className="w-5 h-5" /> Create New Exam
            </Button>
            <Button variant="outline" className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg" onClick={() => window.location.href='/exam'}>
              <ListOrdered className="w-5 h-5" /> View All Exams
            </Button>
            <Button variant="outline" className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg" onClick={() => window.location.href='/exam/result'}>
              <BarChart2 className="w-5 h-5" /> Review Results
            </Button>
          </div>
        </Card>
        <Card className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <Clock className="w-5 h-5 text-yellow-500" /> Recent Activity
          </h2>
          <ul className="space-y-3">
            {loadingUpcoming || loadingPast ? (
              <li>Loading...</li>
            ) : (
              [...(upcomingExams || []), ...(pastExams || [])]
                .sort((a, b) => Date.parse(b.startingtime) - Date.parse(a.startingtime))
                .slice(0, 5)
                .map((exam, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-700">
                    <span className={`w-3 h-3 rounded-full ${new Date(exam.startingtime) > new Date() ? 'bg-blue-400' : 'bg-gray-400'}`}></span>
                    <span className="font-medium">{exam.title}</span>
                    <span className="text-xs text-gray-500 ml-auto">{new Date(exam.startingtime).toLocaleString()}</span>
                  </li>
                ))
            )}
          </ul>
        </Card>
      </div>
      {((typeof errorUpcoming === 'string' || errorUpcoming instanceof Error) || (typeof errorPast === 'string' || errorPast instanceof Error) || (typeof errorUsers === 'string' || errorUsers instanceof Error)) && (
        <div className="text-red-500 mt-4">Error loading dashboard data.</div>
      )}
    </div>
  );
};

export default adminDashboard; 