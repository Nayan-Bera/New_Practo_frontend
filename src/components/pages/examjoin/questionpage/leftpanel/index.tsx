import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Question from "./Question";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetRandomizedQuestionsQuery } from "@/redux/services/api/exam/get/getExamApi";
import { ExamContextConsumer } from "../../context";

const LeftPanel: React.FC = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const examId = queryParams.get("exam_id") || "";
  const { data: randomizedQuestions } = useGetRandomizedQuestionsQuery(examId);
  const { count, setCount } = ExamContextConsumer();

  if (!randomizedQuestions?.questions) return null;

  const questions = randomizedQuestions.questions;

  const onNext = () => {
    if (count + 1 < questions.length) setCount(count + 1);
  };

  const onPrev = () => {
    if (count > 0) setCount(count - 1);
  };

  return (
    <Card className="relative m-2.5 flex-1">
      <Question
        question={{
          _id: String(count),
          title: questions[count].question,
          mark: questions[count].marks,
          options: questions[count].options.map((opt: string, idx: number) => ({
            _id: String(idx),
            option: opt
          }))
        }}
        examid={examId}
      />
      
      <div className="absolute bottom-0 flex w-full justify-between border-t border-border p-2">
        <Button
          variant="ghost"
          className="flex items-center gap-1"
          onClick={onPrev}
          disabled={count === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <Button
          variant="ghost"
          className="flex items-center gap-1"
          onClick={onNext}
          disabled={count + 1 >= questions.length}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default LeftPanel; 