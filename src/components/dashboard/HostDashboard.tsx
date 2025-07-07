import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useGetHostUpcomingExamsQuery, useGetHostPastExamsQuery } from "../../redux/services/api/exam/get/getExamApi";
import { useGetUserListQuery } from "../../redux/services/api/user/get/getUserApi";

const HostDashboard: React.FC = () => {
  const { data: upcomingExams, isLoading: loadingUpcoming, error: errorUpcoming } = useGetHostUpcomingExamsQuery();
  const { data: pastExams, isLoading: loadingPast, error: errorPast } = useGetHostPastExamsQuery();
  const { data: userList, isLoading: loadingUsers, error: errorUsers } = useGetUserListQuery();

  const activeExams = (upcomingExams || []).filter(e => new Date(e.startingtime) <= new Date());

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Host Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 flex flex-col items-center">
          <span className="text-2xl font-semibold">
            {loadingUpcoming ? '...' : (upcomingExams ? upcomingExams.length : 0)}
          </span>
          <span className="text-gray-500">Upcoming Exams</span>
        </Card>
        <Card className="p-6 flex flex-col items-center">
          <span className="text-2xl font-semibold">
            {loadingUsers ? '...' : (userList ? userList.length : 0)}
          </span>
          <span className="text-gray-500">Total Candidates</span>
        </Card>
        <Card className="p-6 flex flex-col items-center">
          <span className="text-2xl font-semibold">
            {loadingUpcoming ? '...' : activeExams.length}
          </span>
          <span className="text-gray-500">Active Exams</span>
        </Card>
      </div>
      {/* Chart placeholder */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Exam Participation Over Time</h2>
        <div className="h-32 flex items-center justify-center text-gray-400">[Chart Coming Soon]</div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default" onClick={() => window.location.href='/exam/edit'}>Create New Exam</Button>
            <Button variant="outline" onClick={() => window.location.href='/exam'}>View All Exams</Button>
            <Button variant="outline" onClick={() => window.location.href='/exam/result'}>Review Results</Button>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-2">
            {loadingUpcoming || loadingPast ? (
              <li>Loading...</li>
            ) : (
              [...(upcomingExams || []), ...(pastExams || [])]
                .sort((a, b) => Date.parse(b.startingtime) - Date.parse(a.startingtime))
                .slice(0, 5)
                .map((exam, idx) => (
                  <li key={idx}>• {exam.title} ({new Date(exam.startingtime).toLocaleString()})</li>
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

export default HostDashboard; 