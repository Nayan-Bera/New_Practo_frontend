import React from "react";
import ExamPage from "@/components/pages/examjoin";
import { ExamContextProvider } from "@/components/pages/examjoin/context";

const ExamJoin: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <ExamContextProvider>
        <div className="container mx-auto py-4">
          <ExamPage />
        </div>
      </ExamContextProvider>
    </div>
  );
};

export default ExamJoin; 