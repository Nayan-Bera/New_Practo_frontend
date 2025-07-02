import React, { useEffect, useRef, useState } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../ui/dialog";
import { XCircle, MessageCircle } from "lucide-react";

interface PeerUser {
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

interface PeerConnection {
  user: PeerUser;
  peer: any;
  warn?: string;
}

interface CandidateVideoProps {
  peer: PeerConnection;
}

const CandidateVideo: React.FC<CandidateVideoProps> = ({ peer }) => {
  const userVideo = useRef<HTMLVideoElement>(null);
  const warn = useRef<number>(0);
  const [warningLevel, setWarningLevel] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);

  useEffect(() => {
    peer.peer.on("stream", (stream: MediaStream) => {
      if (userVideo.current) userVideo.current.srcObject = stream;
    });

    peer.peer.on("data", (data: string) => {
      warn.current = parseInt(data);
      setWarningLevel(warn.current);
    });
  }, [peer.peer]);

  useEffect(() => {
    if (peer.warn) {
      warn.current = parseInt(peer.warn);
      setWarningLevel(warn.current);
    }
  }, [peer]);

  return (
    <Card
      className="relative w-[22%] min-w-[150px] flex flex-col items-center p-[10px] m-[10px]"
      style={{
        backgroundColor:
          warningLevel > 0
            ? `rgb(245, ${221 - warningLevel * 20}, 66)`
            : "white",
      }}
    >
      <div>
        <p
          style={{
            position: "absolute",
            top: "0px",
            right: "10px",
            color: "white",
            padding: "10px",
            lineHeight: "0px",
            backgroundColor: "rgb(15, 15, 15,0.7)",
            fontSize: "12px",
          }}
        >
          {peer.user.user.name}
        </p>
        <video
          id={peer.user.user._id}
          ref={userVideo}
          style={{ minWidth: "100px", width: "100%" }}
          muted
          autoPlay
          playsInline
          controls
        />
      </div>
      <div className="flex flex-row items-center justify-between w-full">
        <div className="p-[2px] bg-white">
          Malpractice Time: {warningLevel * 10 + " "}sec
        </div>
        <WarningMsgDialog
          open={msgOpen}
          setOpen={setMsgOpen}
          send={(props) => {
            try {
              if (props.msg) peer.peer.send(props.msg);
            } catch (error) {
              console.warn("ERROR:", error);
            }
          }}
        />
        <TerminateDialog
          open={open}
          setOpen={setOpen}
          name={peer.user.user.name}
          termiante={() => {
            try {
              peer.peer.send("TERMINATE");
            } catch (error) {
              console.warn("ERROR:", error);
            }
          }}
        />
      </div>
    </Card>
  );
};

export default CandidateVideo;

interface TerminateDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  name: string;
  termiante: () => void;
}

const TerminateDialog: React.FC<TerminateDialogProps> = ({ open, setOpen, name, termiante }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <XCircle />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alert</DialogTitle>
        </DialogHeader>
        <div>
          Do you want to <b>TERMINATE</b> {name}'s Exam
        </div>
        <DialogFooter>
          <Button onClick={() => termiante()}>Yes</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>No</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface WarningMsgDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  send: (props: { msg: string }) => void;
}

const WarningMsgDialog: React.FC<WarningMsgDialogProps> = ({ open, setOpen, send }) => {
  const [input, setInput] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <MessageCircle />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alert Message</DialogTitle>
        </DialogHeader>
        <textarea
          className="bg-[#EDF8DF] border border-black box-border rounded-[2px] p-[5px] w-[30vw] h-[70px] resize-none"
          placeholder="Write Message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <DialogFooter>
          <Button onClick={() => {
            send({ msg: input });
            setInput("");
          }}>
            Send
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 