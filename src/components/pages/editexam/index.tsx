import React from "react";
import { useGetExamQuery, useUpdateExamMutation } from "@/redux/services/api";
import history from "@/utils/createHistory";
import ExamDetails from "./ExamDetails";
import AddedQuestion from "./addedquestion";
import { Card, CardContent } from "@/components/ui/card";
import { Exam } from "@/redux/types";

const EditExam: React.FC = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const examId = queryParams.get("exam_id");

  const { data: details, isError } = useGetExamQuery(examId!, { 
    skip: !examId 
  });
  const [updateExam] = useUpdateExamMutation();

  React.useEffect(() => {
    if (!examId || isError) {
      history.push("/host");
    }
  }, [examId, isError]);

  if (!details) return null;

  const handleUpdate = (exam: Exam) => {
    if (examId) {
      const { title, description, duration, startingtime, questions } = exam;
      updateExam({ 
        examId, 
        body: { 
          title, 
          description, 
          duration, 
          startingtime,
          questions 
        } 
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6 space-y-6">
        <ExamDetails details={details} setDetails={handleUpdate} />
        <AddedQuestion details={details} setDetails={handleUpdate} />
      </CardContent>
    </Card>
  );
};

export default EditExam; 