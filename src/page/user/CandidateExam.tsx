import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { AlertTriangle, Eye, FileText, Calendar, History } from "lucide-react";
import { socket } from "@/utils/socket";

interface Warning {
  id: string;
  message: string;
  warningCount: number;
}

interface SuspiciousActivity {
  id: string;
  userId: string;
  reasons: string[];
}

interface Exam {
  id: string;
  title: string;
  date: string;
}

export default function CandidateExam() {
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [suspiciousActivities, setSuspiciousActivities] = useState<SuspiciousActivity[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
  const [pastExams, setPastExams] = useState<Exam[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const userId = "candidate123"; // Get from auth
  const examId = "exam123"; // Get from route

  /** --- Video Setup --- **/
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => {
        toast.error("Unable to access camera. Please allow permissions.");
      });
  }, []);

  /** --- Handlers --- **/
  const handleWarningReceived = useCallback((warning: Warning) => {
    setWarnings((prev) => [...prev, warning]);
    toast.error(`Warning: ${warning.message}`, {
      description: `Warning count: ${warning.warningCount}`,
      duration: 5000,
    });
  }, []);

  const handleSuspiciousActivity = useCallback((activity: SuspiciousActivity) => {
    if (activity.userId === userId) {
      setSuspiciousActivities((prev) => [...prev, activity]);
      toast.warning("Suspicious activity detected", {
        description: `Reasons: ${activity.reasons.join(", ")}`,
        duration: 4000,
      });
    }
  }, [userId]);

  const handleDisqualification = useCallback(() => {
    toast.error("You have been disqualified from the exam.");
    // TODO: redirect or disable exam UI
  }, []);

  /** --- Mock Upcoming/Past Data --- **/
  useEffect(() => {
    setUpcomingExams([
      { id: "1", title: "Math Final Exam", date: "2025-08-20" },
      { id: "2", title: "Physics Practical", date: "2025-08-25" }
    ]);
    setPastExams([
      { id: "3", title: "Chemistry Test", date: "2025-07-10" },
      { id: "4", title: "English Midterm", date: "2025-07-05" }
    ]);
  }, []);

  /** --- Socket Setup --- **/
  useEffect(() => {
    socket.on("warning_received", handleWarningReceived);
    socket.on("suspiciousActivityDetected", handleSuspiciousActivity);
    socket.on("candidateDisqualified", handleDisqualification);

    return () => {
      socket.off("warning_received", handleWarningReceived);
      socket.off("suspiciousActivityDetected", handleSuspiciousActivity);
      socket.off("candidateDisqualified", handleDisqualification);
    };
  }, [handleWarningReceived, handleSuspiciousActivity, handleDisqualification]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border p-4">
        <div>
          <h1 className="text-2xl font-semibold">Exam in Progress</h1>
          <p className="text-gray-500">Stay focused — avoid any suspicious activities.</p>
        </div>
        <Eye className="text-blue-500 w-6 h-6" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Exam Area */}
        <div className="col-span-2 space-y-6">
          {/* Video Stream */}
          <div className="bg-black rounded-xl overflow-hidden shadow-sm border">
            <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover" />
          </div>

          {/* Exam Questions */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-green-500 w-6 h-6" />
              <h2 className="text-lg font-semibold">Exam Questions</h2>
            </div>
            <div className="text-gray-500">Your exam content will appear here...</div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Warnings */}
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-red-500 w-5 h-5" />
              <h3 className="text-lg font-medium">Warnings</h3>
            </div>
            {warnings.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {warnings.map((w, i) => (
                  <li key={i} className="bg-red-50 border border-red-200 rounded-lg p-2">
                    {w.message} — Count: {w.warningCount}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm">No warnings yet</p>
            )}
          </div>

          {/* Suspicious Activities */}
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="text-yellow-500 w-5 h-5" />
              <h3 className="text-lg font-medium">Suspicious Activities</h3>
            </div>
            {suspiciousActivities.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {suspiciousActivities.map((a, i) => (
                  <li key={i} className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                    {a.reasons.join(", ")}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm">No suspicious activity detected</p>
            )}
          </div>

          {/* Upcoming Exams */}
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="text-blue-500 w-5 h-5" />
              <h3 className="text-lg font-medium">Upcoming Exams</h3>
            </div>
            <ul className="space-y-2 text-sm">
              {upcomingExams.map((exam) => (
                <li key={exam.id} className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                  {exam.title} — {exam.date}
                </li>
              ))}
            </ul>
          </div>

          {/* Past Exams */}
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center gap-2 mb-3">
              <History className="text-gray-500 w-5 h-5" />
              <h3 className="text-lg font-medium">Past Exams</h3>
            </div>
            <ul className="space-y-2 text-sm">
              {pastExams.map((exam) => (
                <li key={exam.id} className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                  {exam.title} — {exam.date}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
