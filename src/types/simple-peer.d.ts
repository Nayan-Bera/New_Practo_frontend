declare module 'simple-peer' {
  interface SimplePeerOptions {
    initiator: boolean;
    trickle: boolean;
    stream?: MediaStream;
    reconnectTimer?: number;
    iceTransportPolicy?: string;
    config?: {
      iceServers: Array<{
        urls: string;
        username?: string;
        credential?: string;
      }>;
      iceCandidatePoolSize?: number;
    };
    offerOptions?: {
      offerToReceiveAudio?: boolean;
      offerToReceiveVideo?: boolean;
    };
  }

  interface SimplePeer {
    signal(data: any): void;
    destroy(): void;
    streams: MediaStream[];
    on(event: string, callback: Function): void;
  }

  interface SimplePeerConstructor {
    new (opts?: SimplePeerOptions): SimplePeer;
  }

  const SimplePeer: SimplePeerConstructor;
  export = SimplePeer;
} 