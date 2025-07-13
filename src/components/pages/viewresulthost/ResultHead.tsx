import React from "react";
import { useSelector } from "react-redux";
import { Card } from "../../ui/card";
import type { IAppState } from "../../../types";

const ResultHead: React.FC = () => {
  const currentExam = useSelector((state: IAppState) => (state.exam as any)?.currentExam);

  const timeConverter = (date: string = Date()) => {
    const D = new Date(date);
    let dateString = `${D.toLocaleDateString()} ${D.toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )}`;
    return dateString;
  };

  return (
    <Card
      className="w-[90%] flex flex-col items-center p-[10px_20px] mb-4"
    >
      <div className="text-[18px] font-bold leading-none">
        {currentExam?.examtitle}
      </div>
      <div className="text-[15px] leading-none">
        {currentExam?.examinfo}
      </div>
      <div className="flex flex-row justify-between w-full">
        <div>
          <b>Start: </b>
          {timeConverter(currentExam?.startingtime)}
        </div>
        <div>
          <b>End: </b>
          {timeConverter(currentExam?.endingtime)}
        </div>
      </div>
    </Card>
  );
};

export default ResultHead; 