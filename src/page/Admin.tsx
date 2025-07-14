import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminUpcomigAccordian from "@/components/pages/admin/AdminUpcomigAccordian";
import AdminPastAccordian from "@/components/pages/admin/AdminPastAccordian";
import CreateExamDialog from "@/components/pages/createexamdialog";

const Admin: React.FC = () => {
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
                <AdminUpcomigAccordian />
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
                <AdminPastAccordian />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin; 