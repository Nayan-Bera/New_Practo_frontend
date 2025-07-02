import React from "react";
import { useGetHostPastExamsQuery } from "../../../redux/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

const HostPastAccordian: React.FC = () => {
  const { data: hostPast = [] } = useGetHostPastExamsQuery();
  
  return (
    <div className="w-full space-y-4">
      {hostPast.map((exam, index) => (
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

export default HostPastAccordian; 