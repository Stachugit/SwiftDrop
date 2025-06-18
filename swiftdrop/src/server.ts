import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session storage
interface Session {
  id: string;
  code: string;
  createdAt: Date;
  expiresAt: Date;
  devices: Set<string>;
  files: FileData[];
}

interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedBy: string;
  timestamp: Date;
  path?: string;
}

interface Device {
  id: string;
  sessionId: string;
  socketId: string;
  joinedAt: Date;
}

const sessions = new Map<string, Session>();
const devices = new Map<string, Device>();

// Generate session code
function generateSessionCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Clean up expired sessions
setInterval(() => {
  const now = new Date();
  for (const [sessionId, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      // Notify all devices in session
      session.devices.forEach(deviceId => {
        const device = devices.get(deviceId);
        if (device) {
          io.to(device.socketId).emit('session-expired');
          devices.delete(deviceId);
        }
      });
      sessions.delete(sessionId);
      console.log(`Session ${session.code} expired and cleaned up`);
    }
  }
}, 30000); // Check every 30 seconds

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Device connected: ${socket.id}`);

  // Create new session
  socket.on('create-session', (callback) => {
    const sessionCode = generateSessionCode();
    const sessionId = uuidv4();
    const deviceId = uuidv4();
    
    const session: Session = {
      id: sessionId,
      code: sessionCode,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      devices: new Set([deviceId]),
      files: []
    };

    const device: Device = {
      id: deviceId,
      sessionId: sessionId,
      socketId: socket.id,
      joinedAt: new Date()
    };

    sessions.set(sessionId, session);
    devices.set(deviceId, device);
    
    socket.join(sessionId);
    
    callback({
      success: true,
      session: {
        id: sessionId,
        code: sessionCode,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt
      },
      deviceId: deviceId
    });

    console.log(`Session created: ${sessionCode} by device ${deviceId}`);
  });

  // Join existing session
  socket.on('join-session', (data, callback) => {
    const { sessionCode } = data;
    
    // Find session by code
    let targetSession: Session | null = null;
    let targetSessionId: string | null = null;
    
    for (const [sessionId, session] of sessions.entries()) {
      if (session.code === sessionCode) {
        targetSession = session;
        targetSessionId = sessionId;
        break;
      }
    }

    if (!targetSession || !targetSessionId) {
      callback({
        success: false,
        error: 'Session not found'
      });
      return;
    }

    // Check if session is expired
    if (targetSession.expiresAt < new Date()) {
      callback({
        success: false,
        error: 'Session expired'
      });
      return;
    }

    const deviceId = uuidv4();
    const device: Device = {
      id: deviceId,
      sessionId: targetSessionId,
      socketId: socket.id,
      joinedAt: new Date()
    };

    targetSession.devices.add(deviceId);
    devices.set(deviceId, device);
    
    socket.join(targetSessionId);

    // Notify other devices in session
    socket.to(targetSessionId).emit('device-joined', {
      deviceId: deviceId,
      deviceCount: targetSession.devices.size
    });

    callback({
      success: true,
      session: {
        id: targetSessionId,
        code: targetSession.code,
        createdAt: targetSession.createdAt,
        expiresAt: targetSession.expiresAt
      },
      deviceId: deviceId,
      files: targetSession.files
    });

    console.log(`Device ${deviceId} joined session ${sessionCode}`);
  });

  // Handle file metadata sharing
  socket.on('file-upload-start', (data) => {
    const { deviceId, fileData } = data;
    const device = devices.get(deviceId);
    
    if (!device) return;
    
    const session = sessions.get(device.sessionId);
    if (!session) return;

    const fileWithId = {
      ...fileData,
      id: uuidv4(),
      uploadedBy: deviceId,
      timestamp: new Date()
    };

    session.files.push(fileWithId);

    // Notify all other devices in session
    socket.to(device.sessionId).emit('file-received', fileWithId);
    
    console.log(`File ${fileWithId.name} shared in session ${session.code}`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`Device disconnected: ${socket.id}`);
    
    // Find and remove device
    for (const [deviceId, device] of devices.entries()) {
      if (device.socketId === socket.id) {
        const session = sessions.get(device.sessionId);
        if (session) {
          session.devices.delete(deviceId);
          
          // Notify other devices
          socket.to(device.sessionId).emit('device-left', {
            deviceId: deviceId,
            deviceCount: session.devices.size
          });

          // Clean up empty sessions
          if (session.devices.size === 0) {
            sessions.delete(device.sessionId);
            console.log(`Empty session ${session.code} cleaned up`);
          }
        }
        devices.delete(deviceId);
        break;
      }
    }
  });
});

// REST API endpoints
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    sessions: sessions.size,
    devices: devices.size 
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 SwiftDrop server running on port ${PORT}`);
});