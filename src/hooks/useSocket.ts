'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { SocketEvents } from '@/types'

export function useSocket(): Socket<SocketEvents> | null {
  const [socket, setSocket] = useState<Socket<SocketEvents> | null>(null)
  const socketRef = useRef<Socket<SocketEvents> | null>(null)

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'https://unipi-chat-app-production.up.railway.app', {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
    })

    socketRef.current = socketInstance
    setSocket(socketInstance)

    // Connection event handlers
    socketInstance.on('connect', () => {
      console.log('Connected to server:', socketInstance.id)
    })

    socketInstance.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason)
    })

    socketInstance.on('error', (error) => {
      console.error('Socket error:', error)
    })

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return socket
}
