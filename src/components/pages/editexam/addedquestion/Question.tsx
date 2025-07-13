import React from "react";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Question as QuestionType } from "@/redux/types";

interface QuestionProps {
  question: QuestionType;
  index: number;
  onRemove: () => void;
}

const Question: React.FC<QuestionProps> = ({ question, index, onRemove }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex gap-2 mb-2">
              <span className="font-semibold">Question {index + 1}:</span>
              <span>{question.question}</span>
            </div>
            <Badge variant="secondary" className="mt-1">
              Mark: {question.marks}
            </Badge>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={onRemove}
            className="ml-4"
          >
            Remove
          </Button>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Options:</h4>
          <ol className="space-y-2 list-decimal list-inside">
            {question.options.map((opt, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span>{opt}</span>
                {idx === question.answer && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default Question; 