import { Card, CardContent } from "@/components/ui/card";
import MonitoringDashboard from "@/components/video/MonitoringDashboard";
import UserUpcomingAccordian from "@/components/pages/admin/UserUpcomingAccordian";
import { getUser } from "@/utils/localStorage";

export default function AdminExam() {
  const userData = getUser();
  const userId = userData?.user?._id || "";
  const examId = "exam123"; // TODO: Replace with actual route param or state

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Upcoming Exams */}
          <Card className="h-[84vh]">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold text-center mb-4">
                Manage Upcoming Examinations
              </h2>
              <div className="h-[calc(84vh-6rem)] overflow-y-auto">
                <UserUpcomingAccordian />
              </div>
            </CardContent>
          </Card>

          {/* Live Monitoring */}
          <Card className="h-[84vh]">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold text-center mb-4">
                Live Monitoring Dashboard
              </h2>
              <MonitoringDashboard examId={examId} userId={userId} />
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
