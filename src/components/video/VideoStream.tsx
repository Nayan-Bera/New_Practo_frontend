import React, { useCallback, useEffect, useRef, useState } from 'react';
import SimplePeer from 'simple-peer';
import { Card } from "../ui/card";
import { socket, initializeSocket } from '@/utils/socket';
import { getUser } from '@/utils/localStorage';

interface VideoStreamProps {
  examId: string;
  userId: string;
  isHost: boolean;
}

interface PeerConnection {
  peerID: string;
  peer: SimplePeer;
}

interface SignalData {
  type: string;
  sdp?: string;
  candidate?: RTCIceCandidate;
}

interface SocketPayload {
  socketid: string;
  signal?: SignalData;
  from?: string;
  userId?: string;
}

interface VideoAnalysisResult {
  hasMultipleFaces: boolean;
  hasNoFace: boolean;
  hasUnusualMovement: boolean;
  confidence: number;
  timestamp: Date;
}

interface SuspiciousActivity {
  isSuspicious: boolean;
  reasons: string[];
  confidence: number;
}

const VideoStream: React.FC<VideoStreamProps> = ({ examId, userId, isHost }) => {
  const [_stream, setStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<PeerConnection[]>([]);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [automatedMonitoring, setAutomatedMonitoring] = useState(false);
  const [_analysisResults, setAnalysisResults] = useState<VideoAnalysisResult[]>([]);
  const [suspiciousActivity, setSuspiciousActivity] = useState<SuspiciousActivity | null>(null);
  
  const userVideo = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<PeerConnection[]>([]);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analysisInterval = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Ensure socket is connected
  useEffect(() => {
    const userData = getUser();
    if (userData && userData.token && !socketConnected) {
      const socketInstance = initializeSocket();
      if (socketInstance) {
        socketInstance.on('connect', () => {
          setSocketConnected(true);
        });
        socketInstance.on('disconnect', () => {
          setSocketConnected(false);
        });
      }
    }
  }, [socketConnected]);

  // Capture video frame for analysis
  const captureFrame = useCallback((): string | null => {
    if (!userVideo.current || !canvasRef.current) return null;

    const video = userVideo.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return null;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64
    return canvas.toDataURL('image/jpeg', 0.8).split(',')[1]; // Remove data:image/jpeg;base64, prefix
  }, []);

  // Start automated video analysis
  const startAutomatedAnalysis = useCallback(() => {
    if (!socketConnected || isHost) return;

    setAutomatedMonitoring(true);
    
    // Start periodic frame analysis
    analysisInterval.current = setInterval(() => {
      const frameData = captureFrame();
      if (frameData && frameData.length > 0) {
        socket.emit('analyzeFrame', {
          frameData: frameData as string,
          timestamp: new Date(),
          userId,
          examId
        });
      }
    }, 5000); // Analyze every 5 seconds

    // Start automated monitoring on server
    socket.emit('startAutomatedMonitoring', { examId });
  }, [socketConnected, isHost, captureFrame, userId, examId]);

  // Stop automated video analysis
  const stopAutomatedAnalysis = useCallback(() => {
    if (analysisInterval.current) {
      clearInterval(analysisInterval.current);
      analysisInterval.current = null;
    }
    
    setAutomatedMonitoring(false);
    socket.emit('stopAutomatedMonitoring');
  }, []);

  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const cleanupPeers = useCallback(() => {
    peersRef.current.forEach(({ peer }) => {
      if (peer) {
        peer.destroy();
      }
    });
    peersRef.current = [];
    setPeers([]);
  }, []);

  const initializeStream = useCallback(async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser');
      }

      const newStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
          frameRate: { ideal: 30, max: 60 }
        }, 
        audio: false 
      });
      
      setStream(newStream);
      streamRef.current = newStream;
      
      if (userVideo.current) {
        userVideo.current.srcObject = newStream;
      }

      // Only emit socket events if socket is connected
      if (socketConnected) {
        socket.emit('join_room', {
          examid: examId,
          user: { _id: userId, type: isHost ? 'host' : 'candidate' }
        });

        socket.emit('new_join');

        // Start automated analysis for candidates
        if (!isHost) {
          startAutomatedAnalysis();
        }
      }
      
      return newStream;
    } catch (err) {
      console.error('Error accessing webcam:', err);
      
      let errorMessage = 'Failed to access camera';
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = 'Camera access denied. Please allow camera permissions to take the exam.';
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'No camera found. Please connect a camera and try again.';
        } else if (err.name === 'NotReadableError') {
          errorMessage = 'Camera is already in use by another application.';
        } else if (err.name === 'OverconstrainedError') {
          errorMessage = 'Camera does not meet the required specifications.';
        } else {
          errorMessage = err.message;
        }
      }
      
      // Show user-friendly error
      alert(errorMessage);
      throw err;
    }
  }, [examId, userId, isHost, socketConnected, startAutomatedAnalysis]);

  const handleDisconnection = useCallback(async () => {
    if (isReconnecting) return;
    
    setIsReconnecting(true);
    cleanupPeers();
    cleanupStream();
    stopAutomatedAnalysis();

    if (socketConnected) {
      socket.emit('stopStream', { 
        examId, 
        reason: 'Connection lost - attempting reconnection' 
      });
    }

    // Add reconnection attempt limit
    const maxReconnectAttempts = 3;
    let reconnectAttempts = 0;

    const attemptReconnection = async () => {
      if (reconnectAttempts >= maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        setIsReconnecting(false);
        // Could show a user-friendly error message here
        return;
      }

      reconnectAttempts++;
      console.log(`Reconnection attempt ${reconnectAttempts}/${maxReconnectAttempts}`);

      try {
        await initializeStream();
        setIsReconnecting(false);
        console.log('Reconnection successful');
      } catch (err) {
        console.error(`Reconnection attempt ${reconnectAttempts} failed:`, err);
        
        // Exponential backoff: 2s, 4s, 8s
        const delay = Math.min(2000 * Math.pow(2, reconnectAttempts - 1), 10000);
        
        reconnectTimeout.current = setTimeout(attemptReconnection, delay);
      }
    };

    reconnectTimeout.current = setTimeout(attemptReconnection, 2000);
  }, [examId, isReconnecting, cleanupPeers, cleanupStream, initializeStream, socketConnected, stopAutomatedAnalysis]);

  const createPeer = useCallback((userToSignal: string, callerID: string, stream: MediaStream): SimplePeer => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream,
      reconnectTimer: 1000,
      iceTransportPolicy: 'relay', // Force TURN servers for security
      // Enhanced security configuration
      config: {
        iceServers: [
          {
            urls: 'stun:stun.l.google.com:19302'
          },
          {
            urls: 'turn:your-turn-server.com:3478',
            username: 'username',
            credential: 'password'
          }
        ],
        iceCandidatePoolSize: 10
      },
      // Security constraints
      offerOptions: {
        offerToReceiveAudio: false,
        offerToReceiveVideo: true
      }
    });

    peer.on('signal', (signal: SignalData) => {
      if (socketConnected) {
        socket.emit('sending_signal', { signal, to: userToSignal, from: callerID });
      }
    });

    peer.on('error', (error: Error) => {
      console.error('Peer connection error:', error);
      peer.destroy();
      const peerIndex = peersRef.current.findIndex(p => p.peer === peer);
      if (peerIndex !== -1) {
        peersRef.current.splice(peerIndex, 1);
        setPeers(peers => peers.filter((_, i) => i !== peerIndex));
      }
    });

    return peer;
  }, [socketConnected]);

  useEffect(() => {
    if (socketConnected) {
      initializeStream().catch(console.error);
    }

    if (socketConnected) {
      socket.on('user_joined', (payload: SocketPayload) => {
        if (isHost && streamRef.current && socket.id) {
          const peer = createPeer(payload.socketid, socket.id, streamRef.current);
          peersRef.current.push({
            peerID: payload.socketid,
            peer,
          });
          setPeers(peers => [...peers, { peerID: payload.socketid, peer }]);
        }
      });

      socket.on('user_left', ({ userId: disconnectedUserId }: { userId: string }) => {
        peersRef.current = peersRef.current.filter(p => {
          if (p.peerID === disconnectedUserId) {
            p.peer.destroy();
            return false;
          }
          return true;
        });
        setPeers(peers => peers.filter(p => p.peerID !== disconnectedUserId));
      });

      socket.on('disconnect', handleDisconnection);
      socket.on('connect', () => {
        if (isReconnecting) {
          initializeStream().catch(console.error);
        }
      });

      socket.on('receive_signal', (payload: SocketPayload) => {
        const item = peersRef.current.find(p => p.peerID === payload.from);
        if (item) {
          item.peer.signal(payload.signal);
        }
      });

      socket.on('receiving_returned_signal', (payload: SocketPayload) => {
        const item = peersRef.current.find(p => p.peerID === payload.from);
        if (item) {
          item.peer.signal(payload.signal);
        }
      });

      // Video analysis events
      socket.on('frameAnalysisResult', (data: { result: VideoAnalysisResult; suspiciousActivity: SuspiciousActivity }) => {
        setAnalysisResults(prev => [...prev.slice(-9), data.result]); // Keep last 10 results
        setSuspiciousActivity(data.suspiciousActivity);
      });

      socket.on('suspiciousActivityDetected', (data: { userId: string; reasons: string[]; confidence: number }) => {
        console.warn('Suspicious activity detected:', data);
        // You could show a notification here
      });

      socket.on('automatedWarningIssued', (data: { userId: string; timestamp: Date }) => {
        console.warn('Automated warning issued:', data);
        // You could show a notification here
      });
    }

    return () => {
      cleanupStream();
      cleanupPeers();
      stopAutomatedAnalysis();
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (socketConnected) {
        socket.off('user_joined');
        socket.off('user_left');
        socket.off('receive_signal');
        socket.off('receiving_returned_signal');
        socket.off('disconnect');
        socket.off('connect');
        socket.off('frameAnalysisResult');
        socket.off('suspiciousActivityDetected');
        socket.off('automatedWarningIssued');
        
        socket.emit('leaveExam', { examId });
      }
    };
  }, [examId, userId, isHost, handleDisconnection, cleanupStream, cleanupPeers, initializeStream, isReconnecting, createPeer, socketConnected, stopAutomatedAnalysis]);

  return (
    <div className="flex flex-col items-center">
      <Card className="p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">
          {isHost ? 'Candidate Video Feed' : 'Your Video Feed'}
        </h2>
        {isReconnecting && (
          <p className="text-destructive mb-2">
            Connection lost. Attempting to reconnect...
          </p>
        )}
        {suspiciousActivity?.isSuspicious && (
          <p className="text-destructive mb-2">
            ⚠️ Suspicious activity detected: {suspiciousActivity.reasons.join(', ')}
          </p>
        )}
        <video
          playsInline
          muted
          ref={userVideo}
          autoPlay
          className="w-full max-w-[300px] rounded-lg"
        />
        {/* Hidden canvas for frame capture */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {/* Analysis status for candidates */}
        {!isHost && (
          <div className="mt-2 text-sm text-muted-foreground">
            {automatedMonitoring ? (
              <span className="text-green-600">✓ Automated monitoring active</span>
            ) : (
              <span className="text-yellow-600">⚠ Monitoring inactive</span>
            )}
          </div>
        )}
      </Card>
      {isHost && peers.map((peer, index) => (
        <Card key={peer.peerID} className="p-4 mb-4">
          <h3 className="text-lg font-medium mb-2">Candidate {index + 1}</h3>
          <video
            playsInline
            autoPlay
            ref={video => {
              if (video && peer.peer.streams[0]) {
                video.srcObject = peer.peer.streams[0];
              }
            }}
            className="w-full max-w-[300px] rounded-lg"
          />
        </Card>
      ))}
    </div>
  );
};

export default VideoStream; 