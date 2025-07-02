import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import history from "@/utils/createHistory";
import Editexam from "@/components/pages/editexam";

const EditExam: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-4">
        <Button
          variant="ghost"
          size="icon"
          className="mb-4"
          onClick={() => history.back()}
          title="Back"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <Card>
          <CardContent className="p-6">
            <Editexam />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditExam; 