import { useCreateAnswerMutation } from "@/redux/services/api/answer/add/addAnswerApi";
import { useExitAnswerMutation } from "@/redux/services/api/answer/update/updateAnswerApi";
import { useGetExamQuery } from "@/redux/services/api/exam/get/getExamApi";
import type { ReactNode } from "react";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Answer } from "../../../../redux/types";
import history from "../../../../utils/createHistory";

interface ExamContextType {
  answer: Answer | null;
  setAnswer: React.Dispatch<React.SetStateAction<Answer | null>>;
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  exitExam: (msg: string, exit?: boolean) => Promise<void>;
  videoPermission: boolean;
  setVideoPermission: React.Dispatch<React.SetStateAction<boolean>>;
  agree: boolean;
  setAgree: React.Dispatch<React.SetStateAction<boolean>>;
  activateEvents: () => void;
  toogleFullscreen: () => Promise<void>;
  isFullscreen: boolean;
  UpdatePeer: (peer: any) => void;
  getWarn: () => number;
}

export const ExamContext = createContext<ExamContextType | undefined>(undefined);

export function ExamContextConsumer() {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error("ExamContextConsumer must be used within an ExamContextProvider");
  }
  return context;
}

interface ExamContextProviderProps {
  children: ReactNode;
}

export function ExamContextProvider({ children }: ExamContextProviderProps) {
  const queryParams = new URLSearchParams(window.location.search);
  const exam_id = queryParams.get("exam_id") || "";
  
  const { data: currentExam } = useGetExamQuery(exam_id);
  const [createAnswer] = useCreateAnswerMutation();
  const [exitAnswerMutation] = useExitAnswerMutation();

  //**************** States******************************
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [count, setCount] = useState(0);
  const [videoPermission, setVideoPermission] = useState(false);
  const [agree, setAgree] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const Peer = useRef<any>(null);

  //************************* Functions *************************************
  let timer: NodeJS.Timeout | null = null;

  const element = document.documentElement;

  const UpdatePeer = (peer: any) => {
    Peer.current = peer;
  };

  const getWarn = () => {
    const warn = sessionStorage.getItem("Warn");
    if (warn) {
      return parseInt(warn);
    } else {
      sessionStorage.setItem("Warn", "0");
      return 0;
    }
  };

  const incrWarn = () => {
    const warn = sessionStorage.getItem("Warn");
    if (warn) {
      sessionStorage.setItem("Warn", (parseInt(warn) + 1).toString());
      return parseInt(warn) + 1;
    } else {
      sessionStorage.setItem("Warn", "1");
      return 1;
    }
  };

  const toogleFullscreen = async () => {
    if (window.document.fullscreenElement) {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        setIsFullscreen(true);
      }
    } else {
      try {
        await element.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        setIsFullscreen(false);
      }
    }
  };

  function pause(e: Event | null = null) {
    if (e) e.stopPropagation();

    timer = setInterval(() => {
      incrWarn();
      try {
        Peer.current?.send(getWarn().toString());
      } catch (error) {
        console.warn("Error:", error);
      }
    }, 10000);
  }

  function play(e: Event | null = null) {
    if (e) e.stopPropagation();
    if (timer) clearInterval(timer);
  }

  function checkFullScreen(e: Event | null = null) {
    if (e) e.stopPropagation();

    if (window.document.fullscreenElement) {
      setIsFullscreen(true);
      play();
    } else {
      setIsFullscreen(false);
      pause();
    }
  }

  const exitExam = async (msg: string, exit: boolean = false) => {
    if (exit) {
      window.removeEventListener("blur", pause);
      window.removeEventListener("focus", play);
      element.removeEventListener("fullscreenchange", checkFullScreen);
      if (timer) clearTimeout(timer);
      if (window.document.fullscreenElement) await toogleFullscreen();
      history.push("/exam");
    } else if (currentExam?._id && answer) {
      try {
        await exitAnswerMutation({
          examId: currentExam._id as string,
          answerId: answer._id,
          message: msg
        }).unwrap();
        window.removeEventListener("blur", pause);
        window.removeEventListener("focus", play);
        element.removeEventListener("fullscreenchange", checkFullScreen);
        if (timer) clearTimeout(timer);
        if (window.document.fullscreenElement) await toogleFullscreen();
        history.push("/exam");
      } catch (error) {
        console.error("Error exiting exam:", error);
      }
    }
  };

  const activateEvents = () => {
    window.addEventListener("blur", pause);
    window.addEventListener("focus", play);
    element.addEventListener("fullscreenchange", checkFullScreen);
  };

  useEffect(() => {
    async function initializeAnswer() {
      if (currentExam?._id) {
        try {
          const newAnswer = await createAnswer(currentExam._id as string).unwrap();
          setAnswer(newAnswer);
        } catch (error) {
          console.error("Error creating answer:", error);
        }
      }
    }
    initializeAnswer();
  }, [currentExam, createAnswer]);

  return (
    <ExamContext.Provider
      value={{
        answer,
        setAnswer,
        count,
        setCount,
        exitExam,
        videoPermission,
        setVideoPermission,
        agree,
        setAgree,
        activateEvents,
        toogleFullscreen,
        isFullscreen,
        UpdatePeer,
        getWarn,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
} 