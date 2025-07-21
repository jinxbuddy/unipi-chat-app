const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const app = express();
const server = http.createServer(app);

// CORS configuration - Allow all Vercel deployments
const corsOptions = {
  origin: function (origin, callback) {
    console.log('CORS check for origin:', origin); // Debug log
    
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) {
      console.log('No origin - allowing');
      return callback(null, true);
    }
    
    // Allow localhost for development
    if (origin.includes('localhost')) {
      console.log('Localhost origin - allowing');
      return callback(null, true);
    }
    
    // Allow all Vercel deployments
    if (origin.includes('.vercel.app')) {
      console.log('Vercel deployment - allowing');
      return callback(null, true);
    }
    
    // Allow our specific domains
    const allowedOrigins = [
      "https://unipi-chat-nt1obgw00-jinxbuddys-projects.vercel.app",
      "https://unipi-chat-5hfo0x47l-jinxbuddys-projects.vercel.app",
      process.env.CLIENT_URL,
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      console.log('Specific domain match - allowing');
      return callback(null, true);
    }
    
    console.log('Origin not allowed:', origin);
    callback(null, true); // Allow all for now to debug
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: false, // Disable credentials to simplify CORS
  optionsSuccessStatus: 200
};

// Socket.IO configuration
const io = socketIo(server, {
  cors: corsOptions,
  transports: ['websocket', 'polling']
});

// Middleware
app.use(helmet());

// Add CORS debug logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

app.use(cors(corsOptions));

// Manual CORS headers as fallback
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log('Manual CORS for origin:', origin); // Debug log
  
  // Always set permissive CORS headers for debugging
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.header('Access-Control-Allow-Credentials', 'false');
  
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'UniPi Chat Backend'
  });
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// In-memory storage (replace with database in production)
const users = new Map();
const waitingQueue = [];
const activeSessions = new Map();
const verificationCodes = new Map(); // email -> { code, expiresAt, attempts }

// Email domain validation
const ALLOWED_DOMAIN = 'studenti.unipi.it';

function validateUniversityEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@studenti\.unipi\.it$/;
  return emailRegex.test(email);
}

// Generate random verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate anonymous name
function generateAnonymousName() {
  const adjectives = ['Smart', 'Curious', 'Friendly', 'Creative', 'Brilliant', 'Thoughtful'];
  const nouns = ['Student', 'Scholar', 'Learner', 'Thinker', 'Mind', 'Brain'];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 999) + 1;
  return `${adjective} ${noun} ${number}`;
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Send verification email
app.post('/api/auth/send-verification', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  const { email } = req.body;

  if (!validateUniversityEmail(email)) {
    return res.status(400).json({ 
      message: 'Only @studenti.unipi.it email addresses are allowed' 
    });
  }

  // Check rate limiting for verification codes
  const existingCode = verificationCodes.get(email);
  if (existingCode && existingCode.expiresAt > Date.now()) {
    const timeLeft = Math.ceil((existingCode.expiresAt - Date.now()) / 1000 / 60);
    return res.status(429).json({ 
      message: `Please wait ${timeLeft} minutes before requesting a new code` 
    });
  }

  const code = generateVerificationCode();
  const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes

  verificationCodes.set(email, {
    code,
    expiresAt,
    attempts: 0
  });

  // In production, send actual email here
  console.log(`Verification code for ${email}: ${code}`);

  res.json({ 
    message: 'Verification code sent to your email',
    // For demo purposes, include the code in response
    ...(process.env.NODE_ENV === 'development' && { code })
  });
});

// Verify code
app.post('/api/auth/verify-code', [
  body('email').isEmail().normalizeEmail(),
  body('code').isLength({ min: 6, max: 6 }).isNumeric()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const { email, code } = req.body;

  if (!validateUniversityEmail(email)) {
    return res.status(400).json({ 
      message: 'Only @studenti.unipi.it email addresses are allowed' 
    });
  }

  const storedCode = verificationCodes.get(email);
  
  if (!storedCode) {
    return res.status(400).json({ message: 'No verification code found' });
  }

  if (storedCode.expiresAt < Date.now()) {
    verificationCodes.delete(email);
    return res.status(400).json({ message: 'Verification code expired' });
  }

  if (storedCode.attempts >= 3) {
    verificationCodes.delete(email);
    return res.status(400).json({ message: 'Too many failed attempts' });
  }

  if (storedCode.code !== code) {
    storedCode.attempts++;
    return res.status(400).json({ message: 'Invalid verification code' });
  }

  // Code is valid
  verificationCodes.delete(email);
  
  const userId = 'user_' + Math.random().toString(36).substr(2, 9);
  const anonymousName = generateAnonymousName();

  const userData = {
    userId,
    email,
    anonymousName,
    isVerified: true,
    createdAt: new Date().toISOString()
  };

  users.set(userId, userData);

  res.json({
    message: 'Email verified successfully',
    userId,
    anonymousName
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User authentication
  socket.on('auth:login', (userData) => {
    if (!userData || !userData.email || !validateUniversityEmail(userData.email)) {
      socket.emit('error', 'Invalid user data');
      return;
    }

    socket.userId = userData.id;
    socket.email = userData.email;
    socket.anonymousName = userData.anonymousName;
    
    console.log(`User authenticated: ${userData.anonymousName} (${userData.email})`);
  });

  // Join matchmaking queue
  socket.on('queue:join', () => {
    if (!socket.userId) {
      socket.emit('error', 'Not authenticated');
      return;
    }

    // Remove from queue if already present
    const existingIndex = waitingQueue.findIndex(user => user.socketId === socket.id);
    if (existingIndex !== -1) {
      waitingQueue.splice(existingIndex, 1);
    }

    waitingQueue.push({
      socketId: socket.id,
      userId: socket.userId,
      anonymousName: socket.anonymousName,
      joinedAt: Date.now()
    });

    console.log(`User ${socket.anonymousName} joined queue. Queue size: ${waitingQueue.length}`);

    // Emit queue status
    socket.emit('queue:waiting', waitingQueue.length);

    // Try to match immediately
    if (waitingQueue.length >= 2) {
      matchUsers();
    }
  });

  // Leave matchmaking queue
  socket.on('queue:leave', () => {
    const index = waitingQueue.findIndex(user => user.socketId === socket.id);
    if (index !== -1) {
      waitingQueue.splice(index, 1);
      console.log(`User ${socket.anonymousName} left queue. Queue size: ${waitingQueue.length}`);
    }
  });

  // WebRTC signaling
  socket.on('webrtc:offer', (offer, sessionId) => {
    const session = activeSessions.get(sessionId);
    if (session && session.users.includes(socket.id)) {
      const partnerId = session.users.find(id => id !== socket.id);
      if (partnerId) {
        io.to(partnerId).emit('webrtc:offer', offer, sessionId);
      }
    }
  });

  socket.on('webrtc:answer', (answer, sessionId) => {
    const session = activeSessions.get(sessionId);
    if (session && session.users.includes(socket.id)) {
      const partnerId = session.users.find(id => id !== socket.id);
      if (partnerId) {
        io.to(partnerId).emit('webrtc:answer', answer, sessionId);
      }
    }
  });

  socket.on('webrtc:ice-candidate', (candidate, sessionId) => {
    const session = activeSessions.get(sessionId);
    if (session && session.users.includes(socket.id)) {
      const partnerId = session.users.find(id => id !== socket.id);
      if (partnerId) {
        io.to(partnerId).emit('webrtc:ice-candidate', candidate, sessionId);
      }
    }
  });

  // End chat session
  socket.on('chat:end-session', () => {
    endUserSession(socket.id);
  });

  // Report user
  socket.on('chat:report-user', (reason) => {
    const sessionId = getUserSession(socket.id);
    if (sessionId) {
      const session = activeSessions.get(sessionId);
      if (session) {
        const partnerId = session.users.find(id => id !== socket.id);
        console.log(`User ${socket.anonymousName} reported partner. Reason: ${reason}`);
        
        // In production, store report in database
        // For now, just log it and end the session
        endSession(sessionId);
      }
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove from queue
    const queueIndex = waitingQueue.findIndex(user => user.socketId === socket.id);
    if (queueIndex !== -1) {
      waitingQueue.splice(queueIndex, 1);
    }

    // End any active session
    endUserSession(socket.id);
  });
});

// Matchmaking function
function matchUsers() {
  if (waitingQueue.length < 2) return;

  // Get two oldest users from queue
  const user1 = waitingQueue.shift();
  const user2 = waitingQueue.shift();

  const sessionId = 'session_' + Math.random().toString(36).substr(2, 9);

  // Create session
  activeSessions.set(sessionId, {
    id: sessionId,
    users: [user1.socketId, user2.socketId],
    userNames: [user1.anonymousName, user2.anonymousName],
    createdAt: Date.now(),
    isActive: true
  });

  // Notify both users
  io.to(user1.socketId).emit('queue:matched', sessionId, user2.anonymousName);
  io.to(user2.socketId).emit('queue:matched', sessionId, user1.anonymousName);

  console.log(`Matched ${user1.anonymousName} with ${user2.anonymousName} (Session: ${sessionId})`);
}

// Helper functions
function getUserSession(socketId) {
  for (const [sessionId, session] of activeSessions.entries()) {
    if (session.users.includes(socketId)) {
      return sessionId;
    }
  }
  return null;
}

function endUserSession(socketId) {
  const sessionId = getUserSession(socketId);
  if (sessionId) {
    endSession(sessionId);
  }
}

function endSession(sessionId) {
  const session = activeSessions.get(sessionId);
  if (session) {
    // Notify both users
    session.users.forEach(userId => {
      io.to(userId).emit('chat:partner-disconnected');
    });

    activeSessions.delete(sessionId);
    console.log(`Session ended: ${sessionId}`);
  }
}

// Cleanup expired verification codes (run every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [email, codeData] of verificationCodes.entries()) {
    if (codeData.expiresAt < now) {
      verificationCodes.delete(email);
    }
  }
}, 5 * 60 * 1000);

// Cleanup old sessions (run every 30 minutes)
setInterval(() => {
  const now = Date.now();
  const MAX_SESSION_AGE = 2 * 60 * 60 * 1000; // 2 hours

  for (const [sessionId, session] of activeSessions.entries()) {
    if (now - session.createdAt > MAX_SESSION_AGE) {
      endSession(sessionId);
    }
  }
}, 30 * 60 * 1000);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 UniPi Chat Server running on port ${PORT}`);
  console.log(`📧 Email domain: ${ALLOWED_DOMAIN}`);
  console.log(`🌍 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
});
