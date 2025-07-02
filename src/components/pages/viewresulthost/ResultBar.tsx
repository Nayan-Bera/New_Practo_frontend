import React from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
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

interface ResultBarProps {
  answer: AnswerData;
  totalExamMark: number;
  examid: string;
}

const ResultBar: React.FC<ResultBarProps> = ({ answer, totalExamMark, examid }) => {
  return (
    <Card
      className="w-1/2 my-[2px] flex flex-row items-center justify-between p-[5px_10px]"
    >
      <div className="text-[16px]">{answer.candidateid.name}</div>
      <div className={answer.exited === "Malpractice" ? "text-red-500" : "text-black"}>
        <b>Mark:</b> {answer.exited === "Malpractice" ? "0" : answer.totalmark}/
        {totalExamMark}
      </div>
      <Button
        className="h-[30px] w-[100px] bg-[#6089F1]"
        onClick={() => {
          history.push(
            `/candidate/result?exam_id=${examid}&candidate_id=${answer.candidateid._id}`
          );
        }}
      >
        View Result
      </Button>
    </Card>
  );
};

export default ResultBar; 