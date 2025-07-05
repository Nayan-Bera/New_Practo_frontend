import io from 'socket.io-client';
import { getUser } from './localStorage';

// Create socket instance with authentication
const createSocket = () => {
  const userData = getUser();
  const token = userData && typeof userData === 'object' && 'token' in userData ? userData.token : undefined;

  if (!token) {
    console.error('No authentication token found');
    return null;
  }

  return io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
    transports: ['websocket'],
    autoConnect: false,
    auth: {
      token: token
    }
  });
};

// Export a function that returns the socket instance
export const getSocket = () => {
  return createSocket();
};

// Export a singleton socket instance for backward compatibility
let socketInstance: any = null;

export const socket = {
  get instance() {
    if (!socketInstance) {
      socketInstance = createSocket();
    }
    return socketInstance;
  },
  
  // Proxy all socket methods
  connect: (...args: any[]) => socketInstance?.connect(...args),
  disconnect: (...args: any[]) => socketInstance?.disconnect(...args),
  emit: (...args: any[]) => socketInstance?.emit(...args),
  on: (...args: any[]) => socketInstance?.on(...args),
  off: (...args: any[]) => socketInstance?.off(...args),
  
  // Add connection status
  connected: false,
  id: null as string | null
};

// Initialize socket connection
export const initializeSocket = () => {
  const newSocket = createSocket();
  if (newSocket) {
    socketInstance = newSocket;
    
    newSocket.on('connect', () => {
      socket.connected = true;
      socket.id = newSocket.id ?? null;
      console.log('Socket connected:', newSocket.id);
    });
    
    newSocket.on('disconnect', () => {
      socket.connected = false;
      socket.id = null;
      console.log('Socket disconnected');
    });
    
    newSocket.on('connect_error', (error: any) => {
      console.error('Socket connection error:', error);
      if (error.message === 'Unauthorized access') {
        console.error('Authentication failed - please log in again');
        // Could trigger a re-login here
      }
    });
    
    newSocket.connect();
  }
  return newSocket;
}; 