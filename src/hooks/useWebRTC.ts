'use client'

import { useState, useCallback } from 'react'
import { Socket } from 'socket.io-client'
import { ChatState, WebRTCConfig, SocketEvents } from '@/types'

const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
]

export function useWebRTC(socket: Socket<SocketEvents> | null) {
  const [chatState, setChatState] = useState<ChatState>({ status: 'idle' })
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null)

  const initializeMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: { echoCancellation: true, noiseSuppression: true }
      })
      setLocalStream(stream)
      return stream
    } catch (error) {
      console.error('Failed to get user media:', error)
      setChatState(prev => ({ ...prev, error: 'Camera/microphone access denied' }))
      throw error
    }
  }, [])

  const createPeerConnection = useCallback((stream: MediaStream) => {
    const config: RTCConfiguration = {
      iceServers: DEFAULT_ICE_SERVERS,
    }

    const pc = new RTCPeerConnection(config)

    // Add local stream tracks
    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream)
    })

    // Handle remote stream
    pc.ontrack = (event) => {
      const [remoteStream] = event.streams
      setRemoteStream(remoteStream)
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socket && chatState.sessionId) {
        socket.emit('webrtc:ice-candidate', event.candidate, chatState.sessionId)
      }
    }

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState)
      if (pc.connectionState === 'connected') {
        setChatState(prev => ({ ...prev, status: 'connected' }))
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setChatState(prev => ({ ...prev, status: 'disconnected' }))
      }
    }

    setPeerConnection(pc)
    return pc
  }, [socket, chatState.sessionId])

  const startCall = useCallback(async () => {
    if (!socket) return

    try {
      setChatState(prev => ({ ...prev, status: 'inQueue' }))
      
      const stream = await initializeMedia()
      const pc = createPeerConnection(stream)

      // Join matchmaking queue
      socket.emit('queue:join')

      // Listen for match
      socket.on('queue:matched', async (sessionId: string, partnerName: string) => {
        setChatState(prev => ({ 
          ...prev, 
          status: 'connecting', 
          sessionId, 
          partnerName 
        }))

        // Create and send offer
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        socket.emit('webrtc:offer', offer, sessionId)
      })

      // Handle queue updates
      socket.on('queue:waiting', (queueSize: number) => {
        setChatState(prev => ({ 
          ...prev, 
          queueStatus: { 
            position: queueSize, 
            estimatedWaitTime: queueSize * 30, // Rough estimate
            totalInQueue: queueSize 
          }
        }))
      })

    } catch (error) {
      console.error('Failed to start call:', error)
      setChatState(prev => ({ ...prev, status: 'idle', error: 'Failed to start call' }))
    }
  }, [socket, initializeMedia, createPeerConnection])

  const endCall = useCallback(() => {
    if (socket) {
      socket.emit('chat:end-session')
      socket.emit('queue:leave')
    }

    // Close peer connection
    if (peerConnection) {
      peerConnection.close()
      setPeerConnection(null)
    }

    // Stop media streams
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
      setLocalStream(null)
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop())
      setRemoteStream(null)
    }

    setChatState({ status: 'idle' })
  }, [socket, peerConnection, localStream, remoteStream])

  const reportUser = useCallback((reason: string) => {
    if (socket && chatState.sessionId) {
      socket.emit('chat:report-user', reason)
    }
  }, [socket, chatState.sessionId])

  // Set up WebRTC signaling listeners
  const setupSignalingListeners = useCallback(() => {
    if (!socket || !peerConnection) return

    socket.on('webrtc:offer', async (offer: RTCSessionDescriptionInit, sessionId: string) => {
      if (chatState.sessionId !== sessionId) return

      await peerConnection.setRemoteDescription(offer)
      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)
      socket.emit('webrtc:answer', answer, sessionId)
    })

    socket.on('webrtc:answer', async (answer: RTCSessionDescriptionInit, sessionId: string) => {
      if (chatState.sessionId !== sessionId) return
      await peerConnection.setRemoteDescription(answer)
    })

    socket.on('webrtc:ice-candidate', async (candidate: RTCIceCandidateInit, sessionId: string) => {
      if (chatState.sessionId !== sessionId) return
      await peerConnection.addIceCandidate(candidate)
    })

    socket.on('chat:partner-disconnected', () => {
      setChatState(prev => ({ ...prev, status: 'disconnected' }))
    })

  }, [socket, peerConnection, chatState.sessionId])

  return {
    chatState,
    localStream,
    remoteStream,
    startCall,
    endCall,
    reportUser,
    setupSignalingListeners,
  }
}
