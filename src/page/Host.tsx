import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HostUpcomigAccordian from "@/components/pages/host/HostUpcomigAccordian";
import HostPastAccordian from "@/components/pages/host/HostPastAccordian";
import CreateExamDialog from "@/components/pages/createexamdialog";

const Host: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-4">
        <div className="flex gap-4">
          <div className="w-1/2">
            <Card className="h-[84vh]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl">
                  Upcoming Examination
                </CardTitle>
                <CreateExamDialog />
              </CardHeader>
              <CardContent className="h-[calc(84vh-5rem)] overflow-y-auto">
                <HostUpcomigAccordian />
              </CardContent>
            </Card>
          </div>

          <div className="w-1/2">
            <Card className="h-[84vh]">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">
                  Past Examination
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(84vh-5rem)] overflow-y-auto">
                <HostPastAccordian />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Host; 