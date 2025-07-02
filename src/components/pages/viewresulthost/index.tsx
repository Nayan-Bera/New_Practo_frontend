import React from "react";
import ResultBar from "./ResultBar";
import ResultHead from "./ResultHead";
import { useGetExamQuery } from "../../../redux/services/api";
import history from "../../../utils/createHistory";

interface AnswerData {
  _id: string;
  candidateid: {
    _id: string;
    name: string;
    email: string;
  };
  totalmark: number;
  exited: string;
  submitTime: string;
  status: string;
}

const Index: React.FC = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const exam_id = queryParams.get("exam_id");
  
  const { data: currentExam, isError: examError } = useGetExamQuery(exam_id!, { 
    skip: !exam_id 
  });
  
  // For now, we'll use an empty array since the host answers endpoint doesn't exist
  // TODO: Implement the proper backend endpoint for host answers
  const answerList: AnswerData[] = [];
  
  React.useEffect(() => {
    if (!exam_id || examError) {
      history.push("/host");
    }
  }, [exam_id, examError]);
  
  const totalExamMark = (): number => {
    if (!currentExam?.questions) return 0;
    let totalMark = 0;
    currentExam.questions.forEach((question: any) => {
      totalMark += question.marks || 1;
    });
    return totalMark;
  };
  
  if (!currentExam) return null;
  
  return (
    <div className="flex flex-col items-center">
      <ResultHead />
      <div className="overflow-y-auto h-[60vh] flex items-center flex-col">
        {answerList.map((answer, idx) => (
          <ResultBar
            answer={answer}
            totalExamMark={totalExamMark()}
            examid={currentExam._id || ""}
            key={idx}
          />
        ))}
      </div>
    </div>
  );
};

export default Index; 