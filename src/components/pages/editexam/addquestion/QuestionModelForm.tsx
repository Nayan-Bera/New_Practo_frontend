import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import type { Question } from "@/redux/types";

interface QuestionModelFormProps {
  question: Question;
  setQuestion: (question: Question) => void;
}

const QuestionModelForm: React.FC<QuestionModelFormProps> = ({
  question,
  setQuestion,
}) => {
  const handleQuestionChange = (value: string) => {
    setQuestion({ ...question, question: value });
  };

  const handleOptionChange = (value: string, index: number) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    setQuestion({ ...question, options: newOptions });
  };

  const handleCorrectAnswerChange = (value: string) => {
    setQuestion({ ...question, answer: parseInt(value) });
  };

  const handleMarkChange = (value: string) => {
    setQuestion({ ...question, marks: parseInt(value) || 0 });
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="question">Question</Label>
          <Textarea
            id="question"
            placeholder="Write question here..."
            value={question.question}
            onChange={(e) => handleQuestionChange(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-[2fr_1fr] gap-6">
          <div className="space-y-4">
            <Label>
              Options
              <span className="text-xs text-red-500 ml-2">
                *select the correct option
              </span>
            </Label>

            <RadioGroup
              value={question.answer.toString()}
              onValueChange={handleCorrectAnswerChange}
              className="space-y-2"
            >
              {question.options.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                  <Input
                    placeholder={`Option ${idx + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(e.target.value, idx)}
                    className="flex-1"
                  />
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mark">Mark</Label>
            <Input
              id="mark"
              type="number"
              placeholder="Mark"
              value={question.marks || ""}
              onChange={(e) => handleMarkChange(e.target.value)}
              min={0}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionModelForm; 