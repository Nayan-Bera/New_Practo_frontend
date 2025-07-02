import React from "react";
import { useUpdateExamMutation, useGetExamQuery } from "@/redux/services/api";
import Question from "./Question";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import type { Exam } from "@/redux/types";

interface AddedQuestionProps {
  details: Exam;
  setDetails: (exam: Exam) => void;
}

const AddedQuestion: React.FC<AddedQuestionProps> = ({ details, setDetails }) => {
  const [updateExam] = useUpdateExamMutation();
  const { data: examData, refetch } = useGetExamQuery(details._id || "");

  const handleRemoveQuestion = async (idx: number) => {
    const updatedQuestions = details.questions.filter((_, i) => i !== idx);
    
    try {
      await updateExam({ 
        examId: details._id || "", 
        body: { questions: updatedQuestions }
      }).unwrap();
      
      await refetch();
      if (examData) {
        setDetails(examData);
      }
    } catch (error) {
      console.error('Failed to update exam:', error);
    }
  };

  if (!details.questions) return null;

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <ScrollArea className="h-[50vh]">
          <div className="space-y-4">
            {details.questions.map((question, idx) => (
              <Question
                key={idx}
                question={question}
                index={idx}
                onRemove={() => handleRemoveQuestion(idx)}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AddedQuestion; 