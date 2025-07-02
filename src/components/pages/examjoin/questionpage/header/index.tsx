import React from "react";
import Timer from "./Timer";
import { ExamContextConsumer } from "../../context";
import { useGetCurrentExamQuery } from "@/redux/services/api/exam/get/getExamApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Header: React.FC = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const examId = queryParams.get("exam_id") || "";
  const { data: currentExam } = useGetCurrentExamQuery(examId);
  const { exitExam } = ExamContextConsumer();

  if (!currentExam) return null;

  return (
    <Card className="flex h-[70px] w-full items-center justify-between px-4">
      <div className="flex-[0.1] text-center">
        <h2 className="font-bold">{currentExam.title}</h2>
      </div>
      
      <div className="flex-[0.6] text-center">
        <p className="leading-tight">{currentExam.description}</p>
      </div>
      
      <div className="flex-[0.1] text-center">
        <Timer 
          start={currentExam.startingtime} 
          end={currentExam.startingtime} 
          duration={currentExam.duration}
        />
      </div>
      
      <div className="flex-[0.2] text-center">
        <Button
          variant="destructive"
          className="h-10 font-bold"
          onClick={() => exitExam("Submitted")}
        >
          Submit & Exit
        </Button>
      </div>
    </Card>
  );
};

export default Header; 