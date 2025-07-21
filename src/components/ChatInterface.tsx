'use client'

import { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import { User, REPORT_REASONS } from '@/types'
import { useWebRTC } from '@/hooks/useWebRTC'
import VideoComponent from './VideoComponent'
import ControlsComponent from './ControlsComponent'
import QueueComponent from './QueueComponent'
import ReportModal from './ReportModal'

interface ChatInterfaceProps {
  user: User | null
  socket: Socket | null
  onLogout: () => void
}

export default function ChatInterface({ user, socket, onLogout }: ChatInterfaceProps) {
  const {
    chatState,
    localStream,
    remoteStream,
    startCall,
    endCall,
    reportUser,
    setupSignalingListeners
  } = useWebRTC(socket)

  const [showReportModal, setShowReportModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    if (socket && user) {
      // Authenticate with server
      socket.emit('auth:login', user)
      
      // Setup WebRTC signaling
      setupSignalingListeners()

      return () => {
        socket.emit('auth:logout')
      }
    }
  }, [socket, user, setupSignalingListeners])

  const handleStartChat = () => {
    startCall()
  }

  const handleEndChat = () => {
    endCall()
  }

  const handleReport = (reason: string) => {
    reportUser(reason)
    setShowReportModal(false)
    handleEndChat()
  }

  const handleSkipUser = () => {
    handleEndChat()
    // Small delay before starting new chat
    setTimeout(() => {
      startCall()
    }, 1000)
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {user?.anonymousName?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              Welcome, {user?.anonymousName}
            </h3>
            <p className="text-sm text-gray-500">
              Status: {chatState.status === 'idle' ? 'Ready to chat' : 
                      chatState.status === 'inQueue' ? 'Looking for partner...' :
                      chatState.status === 'connecting' ? 'Connecting...' :
                      chatState.status === 'connected' ? `Chatting with ${chatState.partnerName}` :
                      'Disconnected'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            title="Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Section */}
        <div className="lg:col-span-2">
          <VideoComponent
            localStream={localStream}
            remoteStream={remoteStream}
            chatState={chatState}
          />
        </div>

        {/* Controls and Queue Section */}
        <div className="space-y-6">
          {chatState.status === 'inQueue' ? (
            <QueueComponent 
              queueStatus={chatState.queueStatus}
              onCancel={handleEndChat}
            />
          ) : (
            <ControlsComponent
              chatState={chatState}
              onStartChat={handleStartChat}
              onEndChat={handleEndChat}
              onSkipUser={handleSkipUser}
              onReport={() => setShowReportModal(true)}
            />
          )}

          {/* Safety Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Safety Tips 🛡️</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Never share personal information</li>
              <li>• Report inappropriate behavior</li>
              <li>• Your identity remains anonymous</li>
              <li>• Chats are not recorded</li>
            </ul>
          </div>

          {/* University Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">UniPi Community 🎓</h4>
            <p className="text-sm text-blue-700">
              Connect with fellow University of Pisa students for study help, 
              language practice, or just casual conversation.
            </p>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Your Profile</h4>
                <p className="text-sm text-gray-600">Anonymous Name: {user?.anonymousName}</p>
                <p className="text-sm text-gray-600">Email: {user?.email}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Privacy</h4>
                <p className="text-sm text-gray-600">
                  Your conversations are private and ephemeral. No personal data is stored.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          onReport={handleReport}
          onCancel={() => setShowReportModal(false)}
          partnerName={chatState.partnerName}
        />
      )}
    </div>
  )
}
