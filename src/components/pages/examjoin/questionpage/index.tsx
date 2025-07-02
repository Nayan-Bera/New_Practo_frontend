import React, { useEffect } from "react";
import Header from "./header";
import LeftPanel from "./leftpanel";
import RightPanel from "./rightpanel";
import { ExamContextConsumer } from "../context";
import { useAppSelector } from "../../../../redux/hooks";
import { Loader2 } from "lucide-react";
import type { RootState } from "../../../../redux/store";

const QuestionPage: React.FC = () => {
  const loader = useAppSelector((state: RootState) => (state as any).loader);
  const { activateEvents } = ExamContextConsumer();

  useEffect(() => {
    activateEvents();
  }, [activateEvents]);

  return (
    <div className="flex h-full w-full flex-col bg-green-50">
      {loader > 0 && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
          <Loader2 className="h-16 w-16 animate-spin text-green-500" />
        </div>
      )}
      
      <Header />
      
      <div className="flex flex-1">
        <LeftPanel />
        <RightPanel />
      </div>
    </div>
  );
};

export default QuestionPage; 