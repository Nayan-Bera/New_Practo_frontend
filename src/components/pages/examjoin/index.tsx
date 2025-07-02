import React from "react";
import AudioVideo from "./AudioVideo";
import { ExamContextConsumer } from "./context";
import InstructionScreen from "./InstructionScreen";
import QuestionPage from "./questionpage";

const ExamJoin: React.FC = () => {
  const { isFullscreen, videoPermission } = ExamContextConsumer();

  return (
    <>
      {!isFullscreen && <InstructionScreen />}

      {isFullscreen && (
        <div className="h-screen w-full" id="fullscreen_id">
          <QuestionPage />
        </div>
      )}
      
      {videoPermission && <AudioVideo active={isFullscreen} />}
    </>
  );
};

export default ExamJoin; 