import React, { useEffect, useState } from "react";
import { useGetUserListQuery, useUpdateExamMutation, useDeleteExamMutation } from "@/redux/services/api";
import type { User as ReduxUser, Exam } from "@/redux/types";
import history from "@/utils/createHistory";
import ModelForm from "../createexamdialog/ModelForm";
import AddQuestionModel from "./addquestion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface User extends ReduxUser {
  _id: string;
  name: string;
  email: string;
}

interface ExamDetailsProps {
  details: Exam;
  setDetails: (exam: Exam) => void;
}

const ExamDetails: React.FC<ExamDetailsProps> = ({ details, setDetails }) => {
  const [selectedCandidates, setSelectedCandidates] = useState<User[]>([]);
  const [nameInfo, setNameInfo] = useState({
    examtitle: "",
    examinfo: "",
    startingtime: "",
    endingtime: ""
  });
  const [availableCandidates, setAvailableCandidates] = useState<User[]>([]);
  const { data: users = [] } = useGetUserListQuery();
  const [updateExam] = useUpdateExamMutation();
  const [deleteExam] = useDeleteExamMutation();

  useEffect(() => {
    if (users) {
      const validUsers = users.filter((user): user is User => 
        typeof user._id === 'string' && 
        typeof user.name === 'string' && 
        typeof user.email === 'string'
      );
      setAvailableCandidates(validUsers);
      
      if (details?.candidates) {
        const selectedUsers = validUsers.filter((user) =>
          details.candidates?.some(c => String(c._id) === String(user._id))
        );
        setSelectedCandidates(selectedUsers);
      }
    }

    setNameInfo({
      examtitle: details.title || "",
      examinfo: details.description || "",
      startingtime: details.startingtime || "",
      endingtime: details.startingtime || ""  // Using startingtime as endingtime is not in the API
    });
  }, [users, details]);

  const handleSave = async () => {
    if (details._id) {
      await updateExam({
        examId: details._id,
        body: {
          title: nameInfo.examtitle,
          description: nameInfo.examinfo,
          startingtime: nameInfo.startingtime,
          duration: details.duration,
          candidates: selectedCandidates.map((user) => user._id)
        }
      });
    }
  };

  const handleDelete = async () => {
    if (details._id) {
      const result = await deleteExam(details._id);
      if ('data' in result) {
        history.push("/host");
      }
    }
  };

  const handleCandidateSelect = (userId: string) => {
    const user = availableCandidates.find((c) => c._id === userId);
    if (user && !selectedCandidates.find((c) => c._id === userId)) {
      setSelectedCandidates([...selectedCandidates, user]);
    }
  };

  const handleCandidateRemove = (userId: string) => {
    setSelectedCandidates(selectedCandidates.filter((c) => c._id !== userId));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-[3fr_1fr] gap-6">
          <div className="space-y-6">
            <ModelForm details={nameInfo} setDetails={setNameInfo} />
            
            <div className="space-y-4">
              <Select onValueChange={handleCandidateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Candidates" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    {availableCandidates.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2">
                {selectedCandidates.map((user) => (
                  <Badge
                    key={user._id}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleCandidateRemove(user._id)}
                  >
                    {user.name} ✕
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDelete}
            >
              Delete Exam
            </Button>
            <Button
              variant="default"
              className="w-full"
              onClick={handleSave}
            >
              Save Exam
            </Button>
            <AddQuestionModel details={details} 
            setDetails={setDetails} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamDetails; 
