'use client'

import { useRef, useEffect } from 'react'
import { ChatState } from '@/types'

interface VideoComponentProps {
  localStream: MediaStream | null
  remoteStream: MediaStream | null
  chatState: ChatState
}

export default function VideoComponent({ localStream, remoteStream, chatState }: VideoComponentProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Video Grid */}
      <div className="relative">
        {chatState.status === 'connected' && remoteStream ? (
          // Connected state - show both videos
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
            {/* Remote Video */}
            <div className="video-container aspect-video bg-gray-900 relative">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="video-overlay">
                <p className="text-sm font-medium">
                  {chatState.partnerName || 'Partner'}
                </p>
              </div>
            </div>

            {/* Local Video */}
            <div className="video-container aspect-video bg-gray-900 relative">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="video-overlay">
                <p className="text-sm font-medium">You</p>
              </div>
            </div>
          </div>
        ) : (
          // Waiting/connecting state
          <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
            {localStream && (
              <div className="absolute bottom-4 right-4 w-32 h-24 rounded-lg overflow-hidden shadow-lg">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="text-center text-white">
              {chatState.status === 'idle' && (
                <>
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Ready to Chat</h3>
                  <p className="text-gray-300">Click "Start Chat" to connect with a fellow UniPi student</p>
                </>
              )}

              {chatState.status === 'inQueue' && (
                <>
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                    <svg className="w-10 h-10 animate-spin" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Looking for a Partner...</h3>
                  <div className="loading-dots">
                    Searching<span>.</span><span>.</span><span>.</span>
                  </div>
                  {chatState.queueStatus && (
                    <p className="text-gray-300 mt-2">
                      {chatState.queueStatus.totalInQueue} students in queue
                    </p>
                  )}
                </>
              )}

              {chatState.status === 'connecting' && (
                <>
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Connecting...</h3>
                  <p className="text-gray-300">
                    Found {chatState.partnerName || 'a partner'}! Establishing connection...
                  </p>
                </>
              )}

              {chatState.status === 'disconnected' && (
                <>
                  <div className="w-20 h-20 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Disconnected</h3>
                  <p className="text-gray-300">The connection was lost. You can start a new chat anytime.</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Connection Status Bar */}
      <div className="px-4 py-3 bg-gray-50 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              chatState.status === 'connected' ? 'bg-green-500' :
              chatState.status === 'connecting' || chatState.status === 'inQueue' ? 'bg-yellow-500' :
              'bg-gray-400'
            }`}></div>
            <span className="text-sm text-gray-600">
              {chatState.status === 'connected' ? 'Connected' :
               chatState.status === 'connecting' ? 'Connecting...' :
               chatState.status === 'inQueue' ? 'In Queue' :
               'Ready'}
            </span>
          </div>

          {chatState.error && (
            <div className="text-sm text-red-600">
              ⚠️ {chatState.error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
