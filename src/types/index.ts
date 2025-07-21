export interface User {
  id: string
  email: string
  isVerified: boolean
  anonymousName: string
  createdAt: Date
}

export interface ChatSession {
  id: string
  users: string[]
  createdAt: Date
  isActive: boolean
}

export interface SocketEvents {
  // Authentication
  'auth:login': (userData: User) => void
  'auth:logout': () => void
  
  // Matchmaking
  'queue:join': () => void
  'queue:leave': () => void
  'queue:matched': (sessionId: string, partnerAnonymousName: string) => void
  'queue:waiting': (queueSize: number) => void
  
  // WebRTC Signaling
  'webrtc:offer': (offer: RTCSessionDescriptionInit, sessionId: string) => void
  'webrtc:answer': (answer: RTCSessionDescriptionInit, sessionId: string) => void
  'webrtc:ice-candidate': (candidate: RTCIceCandidateInit, sessionId: string) => void
  
  // Chat Management
  'chat:partner-disconnected': () => void
  'chat:end-session': () => void
  'chat:report-user': (reason: string) => void
  
  // System
  'error': (message: string) => void
  'disconnect': () => void
}

export interface QueueStatus {
  position: number
  estimatedWaitTime: number
  totalInQueue: number
}

export interface ChatState {
  status: 'idle' | 'authenticating' | 'inQueue' | 'connecting' | 'connected' | 'disconnected'
  sessionId?: string
  partnerName?: string
  queueStatus?: QueueStatus
  error?: string
}

export interface WebRTCConfig {
  iceServers: RTCIceServer[]
}

export interface EmailVerificationRequest {
  email: string
  captchaToken?: string
}

export interface EmailVerificationResponse {
  success: boolean
  message: string
  token?: string
}

export interface ReportReason {
  id: string
  label: string
  description: string
}

export const REPORT_REASONS: ReportReason[] = [
  {
    id: 'inappropriate-content',
    label: 'Inappropriate Content',
    description: 'Sexual content, nudity, or adult material'
  },
  {
    id: 'harassment',
    label: 'Harassment',
    description: 'Bullying, threats, or aggressive behavior'
  },
  {
    id: 'spam',
    label: 'Spam',
    description: 'Repetitive or unwanted messages'
  },
  {
    id: 'hate-speech',
    label: 'Hate Speech',
    description: 'Discriminatory or offensive language'
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Other violation of community guidelines'
  }
]
