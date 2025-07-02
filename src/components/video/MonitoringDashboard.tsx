import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import VideoStream from './VideoStream';
import { socket } from '@/utils/socket';
import { toast } from 'sonner';

interface User {
  _id: string;
  type: string;
}

interface Candidate {
  socketid: string;
  user: User;
}

interface SuspiciousActivity {
  userId: string;
  reasons: string[];
  confidence: number;
  timestamp: Date;
}

interface AutomatedWarning {
  userId: string;
  timestamp: Date;
}

interface MonitoringDashboardProps {
  examId: string;
  userId: string;
}

const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({ examId, userId }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [suspiciousActivities, setSuspiciousActivities] = useState<SuspiciousActivity[]>([]);
  const [automatedWarnings, setAutomatedWarnings] = useState<AutomatedWarning[]>([]);

  useEffect(() => {
    socket.on('user_list', (users: Candidate[]) => {
      setCandidates(users);
    });

    socket.on('user_left', (socketId: string) => {
      setCandidates(prev => prev.filter(user => user.socketid !== socketId));
    });

    // New video analysis events
    socket.on('suspiciousActivityDetected', (activity: SuspiciousActivity) => {
      setSuspiciousActivities(prev => [...prev, activity]);
      toast.warning(`Suspicious activity detected for candidate: ${activity.reasons.join(', ')}`);
    });

    socket.on('automatedWarningIssued', (warning: AutomatedWarning) => {
      setAutomatedWarnings(prev => [...prev, warning]);
      toast.error(`Automated warning issued to candidate`);
    });

    socket.on('userDisconnected', (data: { userId: string; reason: string; timestamp: Date }) => {
      toast.info(`Candidate disconnected: ${data.reason}`);
    });

    return () => {
      socket.off('user_list');
      socket.off('user_left');
      socket.off('suspiciousActivityDetected');
      socket.off('automatedWarningIssued');
      socket.off('userDisconnected');
    };
  }, []);

  const handleWarning = (candidate: Candidate) => {
    socket.emit('send_warning', {
      to: candidate.socketid,
      message: 'Warning: Suspicious activity detected'
    });
    toast.success('Warning sent to candidate');
  };

  const handleViewDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDialogOpen(true);
  };

  const getCandidateSuspiciousActivities = (candidateId: string) => {
    return suspiciousActivities.filter(activity => activity.userId === candidateId);
  };

  const getCandidateWarnings = (candidateId: string) => {
    return automatedWarnings.filter(warning => warning.userId === candidateId);
  };

  return (
    <div className="flex flex-col w-full">
      <Card className="p-8 mb-8">
        <CardHeader>
          <CardTitle>Exam Monitoring Dashboard</CardTitle>
          <p className="text-muted-foreground">
            Active Candidates: {candidates.length}
          </p>
          <div className="flex gap-4 text-sm">
            <span className="text-orange-600">
              Suspicious Activities: {suspiciousActivities.length}
            </span>
            <span className="text-red-600">
              Automated Warnings: {automatedWarnings.length}
            </span>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {candidates.map((candidate, index) => {
              const candidateActivities = getCandidateSuspiciousActivities(candidate.user._id);
              const candidateWarnings = getCandidateWarnings(candidate.user._id);
              const hasSuspiciousActivity = candidateActivities.length > 0;
              const hasWarnings = candidateWarnings.length > 0;

              return (
                <Card 
                  key={candidate.socketid} 
                  className={`overflow-hidden ${
                    hasSuspiciousActivity ? 'border-orange-500' : 
                    hasWarnings ? 'border-red-500' : ''
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      Candidate {index + 1}
                      {hasSuspiciousActivity && (
                        <span className="text-orange-600 text-sm">⚠️ Suspicious</span>
                      )}
                      {hasWarnings && (
                        <span className="text-red-600 text-sm">🚨 Warnings: {candidateWarnings.length}</span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <VideoStream 
                      examId={examId}
                      userId={candidate.user._id}
                      isHost={true}
                    />
                    <div className="flex gap-4 mt-4">
                      <Button
                        variant="destructive"
                        onClick={() => handleWarning(candidate)}
                        className="flex-1"
                      >
                        Send Warning
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleViewDetails(candidate)}
                        className="flex-1"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogHeader>
          <DialogTitle>Candidate Details</DialogTitle>
        </DialogHeader>
        <DialogContent>
          {selectedCandidate && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                ID: {selectedCandidate.user._id}
              </p>
              <p className="text-sm text-muted-foreground">
                Connection Status: Active
              </p>
              <p className="text-sm text-muted-foreground">
                Time in Exam: {/* Implement time tracking */}
              </p>
              
              {/* Suspicious Activities */}
              {getCandidateSuspiciousActivities(selectedCandidate.user._id).length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-orange-600 mb-2">Suspicious Activities</h4>
                  {getCandidateSuspiciousActivities(selectedCandidate.user._id).map((activity, index) => (
                    <div key={index} className="text-sm bg-orange-50 p-2 rounded mb-2">
                      <p><strong>Reasons:</strong> {activity.reasons.join(', ')}</p>
                      <p><strong>Confidence:</strong> {(activity.confidence * 100).toFixed(1)}%</p>
                      <p><strong>Time:</strong> {new Date(activity.timestamp).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Automated Warnings */}
              {getCandidateWarnings(selectedCandidate.user._id).length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-red-600 mb-2">Automated Warnings</h4>
                  {getCandidateWarnings(selectedCandidate.user._id).map((warning, index) => (
                    <div key={index} className="text-sm bg-red-50 p-2 rounded mb-2">
                      <p><strong>Time:</strong> {new Date(warning.timestamp).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default MonitoringDashboard; 