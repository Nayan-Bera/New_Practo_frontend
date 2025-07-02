import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import history from "@/utils/createHistory";
import { Card, CardContent } from "@/components/ui/card";
import ResultBody from "@/components/pages/candidateresult";

const CandidateResult: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-4">
        <Button
          variant="ghost"
          size="icon"
          className="mb-4"
          onClick={() => history.back()}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <Card>
          <CardContent className="p-6">
            <ResultBody />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CandidateResult; 