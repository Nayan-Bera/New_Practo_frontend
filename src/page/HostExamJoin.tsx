import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import HostExam from "@/components/pages/hostexamjoin";

const HostExamJoin: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-4">
        <Card>
          <CardContent className="p-6">
            <HostExam />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HostExamJoin; 