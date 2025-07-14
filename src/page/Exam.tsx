import UserAttainedAccordian from "@/components/pages/admin/UserAttainedAccordian";
import UserUpcomingAccordian from "@/components/pages/admin/UserUpcomingAccordian";
import { Card, CardContent } from "@/components/ui/card";

import MonitoringDashboard from "@/components/video/MonitoringDashboard";
import VideoStream from "@/components/video/VideoStream";
import { getUser } from "@/utils/localStorage";
import { socket } from "@/utils/socket";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from 'sonner';

interface Warning {
  message: string;
  warningCount: number;
}

interface SuspiciousActivity {
  userId: string;
  reasons: string[];
  confidence: number;
  timestamp: Date;
}

const Exam: React.FC = () => {
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [suspiciousActivities, setSuspiciousActivities] = useState<SuspiciousActivity[]>([]);
  const userData = getUser();
  const userId = userData && userData.user && userData.user._id ? userData.user._id : '';
  const isAdmin = userData && userData.user && userData.user.type === 'admin';
  const examId = 'exam123'; // This should come from route params or context

  useEffect(() => {
    // Listen for warnings (for candidates)
    socket.on('warning_received', (warning: Warning) => {
      setWarnings(prev => [...prev, warning]);
      toast.error(`Warning: ${warning.message}`, {
        description: `Warning count: ${warning.warningCount}`,
        duration: 5000,
      });
    });

    // Listen for suspicious activity detection (for candidates)
    socket.on('suspiciousActivityDetected', (activity: SuspiciousActivity) => {
      if (activity.userId === userId) {
        setSuspiciousActivities(prev => [...prev, activity]);
        toast.warning('Suspicious activity detected', {
          description: `Reasons: ${activity.reasons.join(', ')}`,
          duration: 4000,
        });
      }
    });

    // Listen for automated warnings (for candidates)
    socket.on('automatedWarningIssued', (data: { userId: string; timestamp: Date }) => {
      if (data.userId === userId) {
        toast.error('Automated warning issued due to suspicious activity', {
          description: 'Please ensure you are following exam guidelines',
          duration: 6000,
        });
      }
    });

    // Listen for disqualification (for candidates)
    socket.on('candidateDisqualified', (data: { userId: string }) => {
      if (data.userId === userId) {
        toast.error('You have been disqualified from the exam', {
          description: 'Please contact your instructor',
          duration: 0, // Don't auto-dismiss
        });
      }
    });

    return () => {
      socket.off('warning_received');
      socket.off('suspiciousActivityDetected');
      socket.off('automatedWarningIssued');
      socket.off('candidateDisqualified');
    };
  }, [userId]);

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      <div className="container mx-auto py-4">
        {!isAdmin && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <VideoStream 
                examId={examId}
                userId={userId}
                isHost={false}
              />
              
              {/* Warning display for candidates */}
              {warnings.length > 0 && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="text-red-800 font-medium mb-2">Warnings Received</h3>
                  {warnings.map((warning, index) => (
                    <div key={index} className="text-red-700 text-sm mb-1">
                      {warning.message} (Count: {warning.warningCount})
                    </div>
                  ))}
                </div>
              )}

              {/* Suspicious activity display for candidates */}
              {suspiciousActivities.length > 0 && (
                <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h3 className="text-orange-800 font-medium mb-2">Suspicious Activities Detected</h3>
                  {suspiciousActivities.map((activity, index) => (
                    <div key={index} className="text-orange-700 text-sm mb-1">
                      {activity.reasons.join(', ')} (Confidence: {(activity.confidence * 100).toFixed(1)}%)
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        <div className="flex gap-4">
          <div className="w-1/2">
            <Card className="h-[84vh]">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold text-center mb-4">
                  Upcoming Examination
                </h2>
                <div className="h-[calc(84vh-8rem)] overflow-y-auto">
                  <UserUpcomingAccordian />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-1/2">
            <Card className="h-[84vh]">
              <CardContent className="p-4">
                {isAdmin ? (
                  <MonitoringDashboard 
                    examId={examId}
                    userId={userId}
                  />
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-center mb-4">
                      Past Examination
                    </h2>
                    <div className="h-[calc(84vh-8rem)] overflow-y-auto">
                      <UserAttainedAccordian />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam; 