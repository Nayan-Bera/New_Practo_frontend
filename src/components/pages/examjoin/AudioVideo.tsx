import React, { useEffect, useRef } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { toast } from "sonner";
import { getUser } from "../../../utils/localStorage";
import { ExamContextConsumer } from "./context";
import { useGetCurrentExamQuery } from "@/redux/services/api/exam/get/getExamApi";

// Using a standard notification sound URL
const ALERT_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

interface AudioVideoProps {
  active: boolean;
}


const AudioVideo: React.FC<AudioVideoProps> = ({ active }) => {
  const queryParams = new URLSearchParams(window.location.search);
  const examId = queryParams.get("exam_id") || "";
  const { data: currentExam } = useGetCurrentExamQuery(examId);
  
  const { UpdatePeer, getWarn, exitExam, setVideoPermission } = ExamContextConsumer();
  const socketRef = useRef<any>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const currentPeer = useRef<any>(null);

  const playAudio = () => {
    const audio = new Audio(ALERT_SOUND_URL);
    audio.play();
  };

  const callReceiver = async (
    to: string,
    from: string,
    signal: Record<string, unknown>,
    stream: MediaStream
  ) => {
    const peerConfig = {
      initiator: false,
      trickle: false,
      stream,
      // Using standard WebRTC configuration
      iceServers: [
        {
          urls: "turn:numb.viagenie.ca",
          username: "webrtc@live.com",
          credential: "muazkh"
        }
      ]
    };

    const peer = new Peer(peerConfig);

    peer.on("signal", (signalData: unknown) => {
      socketRef.current?.emit("send_signal", {
        to: from,
        from: to,
        signal: JSON.stringify(signalData),
        warn: getWarn().toString(),
      });
    });

    peer.signal(signal);
    
    peer.on("data", (data: unknown) => {
      if (`${data}` === "TERMINATE") {
        exitExam("Malpractice");
        currentPeer.current?.destroy();
      } else {
        playAudio();
        toast(`Message: ${data}`);
      }
    });

    return peer;
  };

  useEffect(() => {
    // Check for WebRTC support using navigator
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error("Your browser doesn't support video streaming. Try another browser");
      setVideoPermission(false);
      return;
    }

    socketRef.current = io(String(process.env.REACT_APP_SOCKET_URL));

    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { max: 352 },
          height: { max: 240 },
          frameRate: { ideal: 10, max: 15 },
        },
        audio: true,
      })
      .then((stream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }

        const userData = getUser();
        if (!userData) {
          throw new Error("User data not found");
        }

        socketRef.current?.emit("join_room", {
          user: { ...userData, type: "candidate" },
          examid: currentExam?._id,
        });
        
        socketRef.current?.emit("new_join");

        socketRef.current?.on("receive_signal", async (payload: {
          to: string;
          from: string;
          signal: string;
        }) => {
          currentPeer.current = await callReceiver(
            payload.to,
            payload.from,
            JSON.parse(payload.signal),
            stream
          );

          UpdatePeer(currentPeer.current);
        });
      })
      .catch((err: Error) => {
        setVideoPermission(false);
        toast.error(err.message);
      });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [currentExam, setVideoPermission, UpdatePeer]);

  return (
    <video
      className={`absolute ${
        active ? "bottom-20 right-10" : "bottom-2.5 right-2.5"
      }`}
      ref={userVideo}
      height={150}
      muted
      autoPlay
      playsInline
      id="video"
    />
  );
};

export default AudioVideo; 