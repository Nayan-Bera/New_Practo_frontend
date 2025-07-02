import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useGetRandomizedQuestionsQuery } from "@/redux/services/api/exam/get/getExamApi";
import React from "react";
import { ExamContextConsumer } from "../../context";


const RightPanel: React.FC = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const examId = queryParams.get("exam_id") || "";
  const { data: randomizedQuestions } = useGetRandomizedQuestionsQuery(examId);
  const { setCount, count, answer } = ExamContextConsumer();

  if (!randomizedQuestions?.questions) return null;

  const { questions } = randomizedQuestions;

  const getButtonVariant = (idx: number) => {
    if (idx === count) return "destructive";
    if (
      answer?.answers.find(
        (ans, ansIdx) => ansIdx === idx && ans !== undefined
      )
    )
      return "default";
    return "outline";
  };

  return (
    <Card className="m-2.5 h-[80vh] w-[30vw]">
      <div className="border-b p-4 text-center">
        <h3 className="text-lg font-bold">Progress Tracker</h3>
      </div>

      <div className="grid max-h-[200px] grid-cols-9 gap-2 overflow-auto border-b p-4">
        {questions.map((_, idx) => (
          <Button
            key={idx}
            variant={getButtonVariant(idx)}
            size="sm"
            className={cn(
              "h-8 w-8 p-0",
              idx === count && "hover:bg-destructive/90",
              answer?.answers.find(
                (ans, ansIdx) => ansIdx === idx && ans !== undefined
              ) && "hover:bg-primary/90"
            )}
            onClick={() => setCount(idx)}
          >
            {idx + 1}
          </Button>
        ))}
      </div>

      <div className="p-4">
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Question Summary</h4>
          <div className="text-sm text-muted-foreground">
            <p>Total Questions: {questions.length}</p>
            <p>Current Question: {count + 1}</p>
            <p>Answered: {answer?.answers.filter(ans => ans !== undefined).length || 0}</p>
            <p>Remaining: {questions.length - (answer?.answers.filter(ans => ans !== undefined).length || 0)}</p>
          </div>
        </div>

        {randomizedQuestions.randomizationInfo && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2 text-blue-800">Randomization Info</h4>
            <div className="text-xs text-blue-700">
              <p>Questions Randomized: {randomizedQuestions.randomizationInfo.questionsRandomized ? 'Yes' : 'No'}</p>
              <p>Options Randomized: {randomizedQuestions.randomizationInfo.optionsRandomized ? 'Yes' : 'No'}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

      <div className="space-y-4 border-b p-4">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="destructive"
            size="sm"
            className="h-8 w-8 cursor-default"
            tabIndex={-1}
          />
          <span>Current Question</span>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            className="h-8 w-8 cursor-default"
            tabIndex={-1}
          />
          <span>Attempted Question</span>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 cursor-default"
            tabIndex={-1}
          />
          <span>Unattempted Question</span>
        </div>
      </div>
 
export default RightPanel; 
