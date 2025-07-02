import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useCreateExamMutation } from "@/redux/services/api";
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
import ModelForm from "./ModelForm";

interface ExamDetails {
  examtitle: string;
  examinfo: string;
  startingtime: string;
  endingtime: string;
}

const CreateExamDialog: React.FC = () => {
  const [createExam] = useCreateExamMutation();
  const [details, setDetails] = useState<ExamDetails>({
    examtitle: "",
    examinfo: "",
    startingtime: "",
    endingtime: "",
  });
  const [open, setOpen] = useState(false);

  const handleCreateExam = async () => {
    const { examtitle, examinfo, startingtime, endingtime } = details;
    const now = Date.now();
    const start = new Date(startingtime).getTime();
    const end = new Date(endingtime).getTime();

    if (examtitle && examinfo && now < start && start < end) {
      const examData = {
        title: examtitle,
        description: examinfo,
        startingtime,
        duration: Math.floor((end - start) / (1000 * 60)), // Convert to minutes
        questions: [],
        candidates: []
      };
      try {
        await createExam(examData).unwrap();
        setDetails({
          examtitle: "",
          examinfo: "",
          startingtime: "",
          endingtime: "",
        });
        setOpen(false);
      } catch (error) {
        toast.error("Failed to create exam. Please try again.");
      }
    } else {
      toast.error("Enter Valid Input");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="absolute top-2 right-2"
          variant="default"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Exam</DialogTitle>
        </DialogHeader>
        <ModelForm setDetails={setDetails} details={details} />
        <DialogFooter>
          <Button onClick={handleCreateExam}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateExamDialog; 