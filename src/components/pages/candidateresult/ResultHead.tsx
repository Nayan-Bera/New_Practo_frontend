import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Answer {
  exited: string;
  totalmark: number;
  candidateid: {
    name: string;
  };
}

interface Question {
  mark: number;
}

interface Exam {
  examtitle: string;
  examinfo: string;
  startingtime: string;
  endingtime: string;
  questions: Question[];
}

interface ResultHeadProps {
  answer: Answer;
  currentExam: Exam;
}

const ResultHead: React.FC<ResultHeadProps> = ({ answer, currentExam }) => {
  const timeConverter = (date = new Date().toString()) => {
    const D = new Date(date);
    return `${D.toLocaleDateString()} ${D.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const totalExamMark = () => {
    const questions = currentExam?.questions || [];
    return questions.reduce((total, question) => total + question.mark, 0);
  };

  if (!currentExam) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg">
            <span className="font-bold">Exam Name: </span>
            {currentExam.examtitle}
          </div>
          {answer.exited === "Malpractice" && (
            <div className="text-lg text-red-500">
              *Malpractice Warning
            </div>
          )}
          <div className="text-lg">
            <span className="font-bold">Candidate Name: </span>
            {answer?.candidateid?.name || ""}
          </div>
        </div>

        <div className="text-sm text-muted-foreground mb-4">
          {currentExam.examinfo}
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold">Start: </span>
            {timeConverter(currentExam.startingtime)}
          </div>
          <div>
            <span className="font-bold">End: </span>
            {timeConverter(currentExam.endingtime)}
          </div>
          <div className="text-lg text-red-500">
            <span className="font-bold">Mark: </span>
            {answer.exited === "Malpractice" ? "0" : answer.totalmark}/
            {totalExamMark()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultHead; 