import React, { useEffect, useState, useCallback } from "react";
import { useTimer } from "react-timer-hook";
import { ExamContextConsumer } from "../../context";
import { AlertTriangle, Clock, Pause, Play } from "lucide-react";
import { toast } from "sonner";

interface MyTimerProps {
  expiryTimestamp: Date;
  onTimeUp: () => void;
  onWarning?: (timeLeft: number) => void;
}

interface TimerProps {
  start: string | Date;
  end: string | Date;
  duration: number; // in minutes
}

const MyTimer: React.FC<MyTimerProps> = ({ expiryTimestamp, onTimeUp, onWarning }) => {
  const { exitExam } = ExamContextConsumer();
  const [isPaused, setIsPaused] = useState(false);
  const [warningsShown, setWarningsShown] = useState<Set<number>>(new Set());

  const { seconds, minutes, hours, isRunning, pause, resume, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      toast.error("Time's up! Submitting exam automatically.");
      onTimeUp();
    },
    autoStart: true,
  });

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const totalMinutes = Math.floor(totalSeconds / 60);

  // Show warnings at specific intervals
  useEffect(() => {
    if (totalMinutes <= 30 && totalMinutes > 0 && !warningsShown.has(totalMinutes)) {
      if (totalMinutes === 30) {
        toast.warning("30 minutes remaining!");
        onWarning?.(totalMinutes);
      } else if (totalMinutes === 15) {
        toast.warning("15 minutes remaining!");
        onWarning?.(totalMinutes);
      } else if (totalMinutes === 5) {
        toast.error("5 minutes remaining! Please submit soon.");
        onWarning?.(totalMinutes);
      } else if (totalMinutes === 1) {
        toast.error("1 minute remaining! Submit now!");
        onWarning?.(totalMinutes);
      }
      setWarningsShown(prev => new Set(prev).add(totalMinutes));
    }
  }, [totalMinutes, warningsShown, onWarning]);

  const handlePauseResume = useCallback(() => {
    if (isPaused) {
      resume();
      setIsPaused(false);
      toast.info("Timer resumed");
    } else {
      pause();
      setIsPaused(true);
      toast.warning("Timer paused");
    }
  }, [isPaused, pause, resume]);

  const getTimeColor = () => {
    if (totalMinutes <= 5) return "text-red-600";
    if (totalMinutes <= 15) return "text-orange-600";
    if (totalMinutes <= 30) return "text-yellow-600";
    return "text-green-600";
  };

  const getTimeIcon = () => {
    if (totalMinutes <= 5) return <AlertTriangle className="h-4 w-4" />;
    if (totalMinutes <= 15) return <Clock className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        {getTimeIcon()}
        <h3 className="font-bold text-sm">Time Left</h3>
        <button
          onClick={handlePauseResume}
          className="ml-2 p-1 rounded hover:bg-gray-100"
          title={isPaused ? "Resume timer" : "Pause timer"}
        >
          {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
        </button>
      </div>
      
      <div className={`text-xl font-bold ${getTimeColor()}`}>
        <span>{hours < 10 ? `0${hours}` : hours}</span>:
        <span>{minutes < 10 ? `0${minutes}` : minutes}</span>:
        <span>{seconds < 10 ? `0${seconds}` : seconds}</span>
      </div>
      
      {isPaused && (
        <div className="text-xs text-orange-600 mt-1">
          Timer paused
        </div>
      )}
    </div>
  );
};

const Timer: React.FC<TimerProps> = ({ end, duration }) => {
  const { exitExam } = ExamContextConsumer();
  
  const handleTimeUp = () => {
    exitExam("Time's up", true);
  };

  const handleWarning = (timeLeft: number) => {
    // Additional warning logic can be added here
    console.log(`Warning: ${timeLeft} minutes remaining`);
  };

  return (
    <MyTimer 
      expiryTimestamp={new Date(end)} 
      onTimeUp={handleTimeUp}
      onWarning={handleWarning}
    />
  );
};

export default Timer; 