import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";

interface Option {
  _id: string;
  option: string;
  isanswer: boolean;
}

interface Question {
  _id: string;
  title: string;
  mark: number;
  options: Option[];
}

interface Answer {
  questionid: string;
  optionid: string;
  mark: number;
}

interface AnswerData {
  answers: Answer[];
}

interface QuesAnsProps {
  question: Question;
  answer: AnswerData;
  idx: number;
}

const QuesAns: React.FC<QuesAnsProps> = ({ question, answer, idx }) => {
  const [currAns, setcurrAns] = useState<Answer | null>(null);

  useEffect(() => {
    if (answer?.answers) {
      const ans = answer.answers.find(
        (ans) => String(ans.questionid) === String(question._id)
      );
      if (ans) {
        setcurrAns(ans);
      }
    }
  }, [answer, question]);

  const checkSymbol = (opt: Option) => {
    if (opt.isanswer) {
      return <Check className="h-4 w-4 text-green-500" />;
    } else if (String(currAns?.optionid) === String(opt._id) && !opt.isanswer) {
      return <X className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2 flex-1">
            <span className="font-bold whitespace-nowrap">
              Question {idx + 1}:
            </span>
            <span className="flex-1">{question.title}</span>
          </div>
          <div className="text-right whitespace-nowrap">
            <span className="font-bold">Mark: </span>
            {currAns?.mark || "0"}/{question.mark}
          </div>
        </div>

        <ol className="list-decimal list-inside space-y-2">
          {question.options.map((opt, _optIdx) => (
            <li key={opt._id} className="flex items-center gap-2">
              <span>{opt.option}</span>
              {checkSymbol(opt)}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
};

export default QuesAns; 