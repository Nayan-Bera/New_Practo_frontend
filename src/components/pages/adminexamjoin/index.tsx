import React, { useEffect, useRef, useState } from "react";
import { useGetExamQuery } from "../../../redux/services/api";
import Peer from "simple-peer";
import io from "socket.io-client";
import { toast } from "sonner";
import history from "../../../utils/createHistory";
import { getUser } from "../../../utils/localStorage";
import CandidateVideo from "./CandidateVideo";
import type { Socket } from "socket.io-client";

interface PeerConnection {
  user: {
    user: {
      socketid: string;
      _id: string;
      type: string;
      name: string;
      email: string;
    };
  };
  peer: any;
  warn?: any;
}

const HostExamJoin: React.FC = () => {
  const socketRef = useRef<Socket>();
  const peersRef = useRef<PeerConnection[]>([]);
  const [peers, setPeers] = useState<PeerConnection[]>([]);
  
  const queryParams = new URLSearchParams(window.location.search);
  const exam_id = queryParams.get("exam_id");
  
  useGetExamQuery(exam_id!, { 
    skip: !exam_id 
  });
  
  useEffect(() => {
    toast.success(
      "Allow webcam permission to start hosting exam. No one can see your video and audio feed during this exam.",
      { duration: 10000 }
    );
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error(
        "Your browser doesn't support video streaming. Try another browser"
      );
    }
    
    socketRef.current = io(String(process.env.REACT_APP_SOCKET_URL));
    
    async function getValue() {
      const user = getUser();
      if (!user || !user.user) return;
      
      const userData = user.user;
      userData.type = "admin";

      navigator.mediaDevices
        .getUserMedia({
          video: {
            width: { max: 352 },
            height: { max: 240 },
            frameRate: { ideal: 2, max: 3 },
          },
          audio: true,
        })
        .then((stream) => {
          socketRef.current?.emit("join_room", {
            user: userData,
            examid: exam_id,
          });
          
          socketRef.current?.on("user_list", (userList: any[]) => {
            const tempPeers = userList.map((user) => {
              return {
                user: { user: user },
                peer: initiateCall(user.socketid, socketRef.current?.id, stream),
              };
            });
            peersRef.current = [...tempPeers];
            setPeers([...tempPeers]);
          });

          socketRef.current?.on("user_joined", (payload: any) => {
            const peer = initiateCall(
              payload.socketid,
              socketRef.current?.id,
              stream
            );
            peersRef.current.push({ user: { user: payload }, peer });
            setPeers([...peers, { user: { user: payload }, peer }]);
          });

          socketRef.current?.on("receiving_returned_signal", (payload: any) => {
            const item = peersRef.current.find(
              (p) => String(p.user.user.socketid) === String(payload.from)
            );
            setPeers(() =>
              peersRef.current.map((p) => {
                if (String(p.user.user.socketid) === String(payload.from)) {
                  return { ...p, warn: payload.warn };
                } else {
                  return { ...p };
                }
              })
            );
            item?.peer.signal(JSON.parse(payload.signal));
          });
          
          socketRef.current?.on("user_left", (socketid: string) => {
            const arr = peersRef.current.filter(
              (peer) => String(peer.user.user.socketid) !== String(socketid)
            );
            peersRef.current = arr;
            setPeers([...arr]);
          });
        })
        .catch((err: Error) => {
          toast.error(err.message);
          history.back();
        });
    }
    
    getValue();
    
    return () => {
      socketRef.current?.disconnect();
    };
  }, [exam_id]);

  const initiateCall = (to: string, from: string | undefined, stream: MediaStream): Peer => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal: any) => {
      socketRef.current?.emit("sending_signal", {
        to,
        from,
        signal: JSON.stringify(signal),
      });
    });

    return peer;
  };
  
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {peers.map((peer, idx) => (
        <CandidateVideo peer={peer} key={idx} />
      ))}
    </div>
  );
};

export default HostExamJoin; 