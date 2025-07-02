import React, { useState } from "react";
import { useUpdateExamMutation, useGetExamQuery } from "@/redux/services/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import QuestionModelForm from "./QuestionModelForm";
import type { Question, Exam } from "@/redux/types";

interface AddQuestionProps {
  details: Exam;
  setDetails: (exam: Exam) => void;
}

const AddQuestion: React.FC<AddQuestionProps> = ({ details, setDetails }) => {
  const [updateExam] = useUpdateExamMutation();
  const { refetch } = useGetExamQuery(details._id || "");
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState<Question>({
    question: "",
    options: ["", "", "", ""],
    answer: 0,
    marks: 0
  });

  const handleAddQuestion = async () => {
    const { question: title, options, marks } = question;
    const allOptionsProvided = options.every(opt => opt.trim() !== "");

    if (title && allOptionsProvided && marks > 0) {
      const updatedQuestions = [...details.questions, question];
      
      try {
        await updateExam({ 
          examId: details._id || "", 
          body: { questions: updatedQuestions }
        }).unwrap();
        
        setOpen(false);
        const { data: updatedExam } = await refetch();
        if (updatedExam) {
          setDetails(updatedExam);
        }
        
        setQuestion({
          question: "",
          options: ["", "", "", ""],
          answer: 0,
          marks: 0
        });
      } catch (error) {
        console.error('Failed to update exam:', error);
        toast.error('Failed to update exam');
      }
    } else {
      toast.error("Fill Question details properly");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full">
          Add Question
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Question</DialogTitle>
        </DialogHeader>
        <QuestionModelForm 
        question={question} 
        setQuestion={setQuestion} />
        <DialogFooter>
          <Button onClick={handleAddQuestion}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddQuestion; 