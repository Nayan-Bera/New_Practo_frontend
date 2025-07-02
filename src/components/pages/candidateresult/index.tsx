import React from "react";
import QuesAns from "./QuesAns";
import ResultHead from "./ResultHead";
import { useGetCandidateAnswerQuery, useGetExamQuery } from "@/redux/services/api";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const CandidateResult: React.FC = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const examId = queryParams.get("exam_id") || "";
  const candidateId = queryParams.get("candidate_id") || "";

  const {
    data: answer,
    error: answerError,
    isLoading: answerLoading,
  } = useGetCandidateAnswerQuery({ examId, candidateId });

  const {
    data: currentExam,
    error: examError,
    isLoading: examLoading,
  } = useGetExamQuery(examId, { skip: !examId });

  React.useEffect(() => {
    if (answerError) toast.error("Failed to fetch candidate answer");
    if (examError) toast.error("Failed to fetch exam details");
  }, [answerError, examError]);

  if (answerLoading || examLoading) return <div>Loading...</div>;
  if (!answer || !currentExam) return null;

  console.log(answer);

  // Map exam fields for ResultHead
  const mappedExam = {
    examtitle: currentExam.title ?? '',
    examinfo: currentExam.description ?? '',
    startingtime: currentExam.startingtime ?? '',
    endingtime: currentExam.startingtime
      ? new Date(new Date(currentExam.startingtime).getTime() + (currentExam.duration ?? 0) * 60000).toISOString()
      : '',
    questions: (currentExam.questions ?? []).map((q: any) => ({
      _id: q._id ?? '',
      title: q.question ?? q.title ?? '',
      mark: q.marks ?? q.mark ?? 0,
      options: q.options ?? [],
    })),
  };

  // Map answer fields for QuesAns and ResultHead
  const mappedAnswer = {
    exited: answer.exited ?? '',
    totalmark: Array.isArray(answer.answers) ? answer.answers.length : 0,
    candidateid: typeof answer.candidate === 'object' && answer.candidate !== null
      ? answer.candidate
      : { name: String(answer.candidate ?? '') },
    answers: Array.isArray(answer.answers)
      ? answer.answers.map((a: any) => ({
          questionid: a.questionid ?? '',
          optionid: a.optionid ?? '',
          mark: a.mark ?? 0,
        }))
      : [],
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <ResultHead answer={mappedAnswer} currentExam={mappedExam} />
        <ScrollArea className="h-[60vh] mt-4">
          <div className="space-y-4">
            {mappedExam.questions.map((question, idx) => (
              <QuesAns 
                question={question} 
                answer={mappedAnswer} 
                idx={idx} 
                key={question._id} 
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CandidateResult; 