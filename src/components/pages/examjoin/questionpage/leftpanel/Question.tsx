import React, { useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ExamContextConsumer } from "../../context";
import { useUpdateAnswerMutation } from "@/redux/services/api/answer/update/updateAnswerApi";

interface Option {
  _id: string;
  option: string;
}

interface Question {
  _id: string;
  title: string;
  mark: number;
  options: Option[];
}

interface QuestionProps {
  question: Question;
  examid: string;
}

interface Answer {
  _id?: string;
  exam?: string;
  candidate?: string;
  answers: number[];
  exited?: string;
}

const Question: React.FC<QuestionProps> = ({ question, examid }) => {
  const [editAnswer] = useUpdateAnswerMutation();
  const { count, answer, setAnswer } = ExamContextConsumer();
  const { answers = [] } = answer || {};

  useEffect(() => {
    const updateAnswer = async () => {
      if (!answer?._id) return;
      try {
        await editAnswer({
          examId: examid,
          answerId: answer._id,
          answers: answers
        }).unwrap();
      } catch (error) {
        console.error("Failed to update answer:", error);
      }
    };
    updateAnswer();
  }, [answers, examid, answer?._id, editAnswer]);

  const onAnswerSelect = (optionid: string) => {
    if (!answer) return;

    const questionIndex = parseInt(question._id);
    const newAnswers = [...answers];
    newAnswers[questionIndex] = parseInt(optionid);

    setAnswer({
      ...answer,
      answers: newAnswers
    });
  };

  const getSelectedValue = () => {
    const questionIndex = parseInt(question._id);
    const selectedAnswer = answers[questionIndex];
    return selectedAnswer !== undefined ? String(selectedAnswer) : undefined;
  };

  return (
    <div className="flex flex-col space-y-4 p-6">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold">Question {count + 1}</span>
          <Badge variant="secondary">Mark: {question.mark}</Badge>
        </div>
      </div>

      <p className="text-lg">{question.title}</p>

      <RadioGroup
        value={getSelectedValue()}
        onValueChange={onAnswerSelect}
        className="space-y-2"
      >
        {question.options.map((option) => (
          <div key={option._id} className="flex items-center space-x-2">
            <RadioGroupItem value={option._id} id={option._id} />
            <Label htmlFor={option._id} className="text-base">
              {option.option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default Question; 