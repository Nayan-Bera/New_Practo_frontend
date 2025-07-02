import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import HeaderFooter from "../../headerfooter";
import { ExamContextConsumer } from "./context";
import { toast } from "sonner";

const InstructionScreen: React.FC = () => {
  const {
    answer,
    agree,
    setAgree,
    setVideoPermission,
    videoPermission,
    toogleFullscreen,
  } = ExamContextConsumer();
  

  const instructions = [
    "On clicking the \"Start\" button, you will enter the FullScreen mode of the exam.",
    "You can exit the exam by clicking on the \"Submit & Exit\" button at the top-right.",
    "If you leave the exam tab or exit full-screen you will be terminated from the exam.",
    "Once Exited from the exam, you cannot enter the exam again.",
    "The answer once responded will be registered as attempted, further it can be changed only.",
    "When exam time is over, your answers will get be automatically submitted.",
    "You can track your progress from the progress tracker on the right section of the exam page."
  ];

  const handleVideoPermission = () => {
    if (!agree) {
      toast.error("Agree to the conditions first");
      return;
    }
    setVideoPermission(!videoPermission);
  };

  return (
    <HeaderFooter>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Instructions:</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4 text-lg">
              {instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
            
            <div className="mt-6 flex items-center space-x-2">
              <Checkbox
                id="instruction"
                checked={agree}
                onCheckedChange={() => setAgree(!agree)}
              />
              <label
                htmlFor="instruction"
                className="text-lg font-medium text-destructive"
              >
                I have read the instruction and permit to track my computer activity
                during the exam.
              </label>
            </div>

            <div className="mt-6 flex justify-center space-x-4">
              <Button
                variant="destructive"
                disabled={!(videoPermission && agree && answer)}
                onClick={() => toogleFullscreen()}
              >
                Start
              </Button>
              
              <Button
                variant="outline"
                onClick={handleVideoPermission}
              >
                Test and Allow Audio and Video
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </HeaderFooter>
  );
};

export default InstructionScreen; 