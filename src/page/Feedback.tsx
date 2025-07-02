import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import history from "@/utils/createHistory";

const Feedback: React.FC = () => {
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

        <Card className="flex justify-center items-center h-[80vh]">
          <CardContent className="w-full max-w-3xl p-6">
            <iframe
              className="w-full h-[70vh] border-none"
              src="https://forms.gle/zxjBWdHo9dQnE9sy7"
              title="Feedback Form"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Feedback; 