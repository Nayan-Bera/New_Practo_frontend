import React from "react";
import { useGetHostUpcomingExamsQuery } from "../../../redux/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

const HostUpcomigAccordian: React.FC = () => {
  const { data: hostUpcoming = [] } = useGetHostUpcomingExamsQuery();
  
  return (
    <div className="w-full space-y-4">
      {hostUpcoming.map((exam, index) => (
        <Card key={exam._id || index}>
          <CardHeader>
            <CardTitle>{exam.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Description:</strong> {exam.description}</p>
            <p><strong>Start Time:</strong> {new Date(exam.startingtime).toLocaleString()}</p>
            <p><strong>Duration:</strong> {exam.duration} minutes</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HostUpcomigAccordian; 