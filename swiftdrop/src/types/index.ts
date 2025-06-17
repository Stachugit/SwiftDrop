export interface Session {
  id: string;
  code: string;
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
}

export interface FileTransfer {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  timestamp: Date;
}

export interface SessionState {
  session: Session | null;
  connectedDevices: string[];
  files: FileTransfer[];
  isConnected: boolean;
}

export interface WebSocketMessage {
  type: 'join' | 'file-upload' | 'file-progress' | 'device-connected' | 'device-disconnected';
  payload: any;
  sessionId?: string;
}